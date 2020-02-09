import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import UserAgent from 'user-agents';
import { createHash } from 'crypto';
import { isNil, omit } from 'lodash';

import cache from '../config/leveldb';

interface RequestConfig extends AxiosRequestConfig {
  useCache?: boolean;
}

const userAgent = new UserAgent();

const instance = axios.create({
  baseURL: 'https://www.ville-ideale.fr',
  withCredentials: true,
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'user-agent': userAgent.toString(),
  },
  responseType: 'text',
});

const request = async ({ useCache, ...config }: RequestConfig): Promise<AxiosResponse> => {
  const key = createHash('md5')
    .update(JSON.stringify(omit(config, 'headers')))
    .digest('hex');

  if (useCache) {
    const data = await cache.getItem(key);

    if (!isNil(data))
      return { data } as AxiosResponse;
  }

  const response = await instance.request(config);
  const { headers, data } = response;

  if (useCache)
    await cache.setItem(key, data);

  if (headers && headers['set-cookie'])
    await cache.setItem('cookie', headers['set-cookie'][0].split(';')[0]);

  return response;
};

export default request;
