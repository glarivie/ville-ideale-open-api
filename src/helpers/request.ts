import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { torSetup } from 'tor-axios';
import UserAgent from 'user-agents';
import { createHash } from 'crypto';
import { isNil, omit } from 'lodash';

import cache from '../config/leveldb';

export interface RequestConfig extends AxiosRequestConfig {
  useCache?: boolean;
  newSession?: boolean;
}

export interface Response<T = string> extends AxiosResponse<T> {
  fromCache?: boolean;
}

const userAgent = new UserAgent();

const tor = torSetup({
	ip: 'localhost',
  port: 9050,
  controlPort: 9051,
  controlPassword: 'giraffe',
});

const instance = axios.create({
  baseURL: 'https://www.ville-ideale.fr',
  withCredentials: true,
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'user-agent': userAgent.toString(),
  },
  responseType: 'text',
  httpAgent: tor.httpAgent(),
	httpsAgent: tor.httpsAgent(),
});

const request = async <T = string>({ useCache, newSession, ...config }: RequestConfig): Promise<Response<T>> => {
  const key = createHash('md5')
    .update(JSON.stringify(omit(config, 'headers')))
    .digest('hex');

  if (useCache) {
    const data = await cache.getItem(key);

    if (!isNil(data))
      return { data, fromCache: true } as unknown as Response<T>;
  }

  if (newSession) {
    await tor.torNewSession(); // change tor ip
  }

  const response = await instance.request(config);
  const { headers, data } = response;

  if (useCache)
    await cache.setItem(key, data);

  if (headers && headers['set-cookie'])
    await cache.setItem('cookie', headers['set-cookie'][0].split(';')[0]);

  return response as Response<T>;
};

export default request;
