import { resolve, join } from 'path';
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { AxiosRequestConfig } from 'axios';
import { createHash } from 'crypto';

const ROOT = resolve(__dirname, '..', '..');
const CACHE = join(ROOT, '.cache');
const COOKIE = join(CACHE, '_COOKIE');

const checkCacheFolder = (): void => {
  if (!existsSync(CACHE)) {
    mkdirSync(CACHE, { recursive: true });
  }
};

const cacheSessionCookie = (cookie: string): void => {
  writeFileSync(COOKIE, cookie, { encoding: 'utf8' });
};

const retrieveCookieFromCache = (): string | null => {
  if (!existsSync(COOKIE)) return null;

  return readFileSync(COOKIE, { encoding: 'utf8' });
};

const cacheRequestBody = (config: AxiosRequestConfig, data: string): void => {
  const filename = createHash('md5').update(JSON.stringify(config)).digest('hex');

  writeFileSync(join(CACHE, filename), data, { encoding: 'utf8' });
};

const retrieveCachedRequestBody = (config: AxiosRequestConfig): string => {
  const filename = createHash('md5').update(JSON.stringify(config)).digest('hex');
  const path = join(CACHE, filename);

  if (!existsSync(path)) return null;

  return readFileSync(path, { encoding: 'utf8' });
};

export {
  checkCacheFolder,
  cacheSessionCookie,
  retrieveCookieFromCache,
  retrieveCachedRequestBody,
  cacheRequestBody,
};
