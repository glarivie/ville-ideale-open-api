import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import UserAgent from 'user-agents';
import { isNil } from 'lodash';

import { retrieveCachedRequestBody, cacheRequestBody } from '../helpers/cache';

interface RequestConfig extends AxiosRequestConfig {
  cache?: boolean;
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

const request = async ({ cache, ...config }: RequestConfig): Promise<AxiosResponse> => {
  if (cache) {
    const data = retrieveCachedRequestBody(config);

    if (!isNil(data)) {
      return { data } as AxiosResponse;
    }
  }

  const response = await instance.request(config);

  if (cache) {
    cacheRequestBody(config, response.data);
  }

  return response;
};

export default request;
