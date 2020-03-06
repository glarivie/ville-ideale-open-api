import sdk from 'scraperapi-sdk';

const { SCRAPER_API_KEY } = process.env;

interface Headers {
  [k: string]: string;
}

interface Options {
  headers?: Headers;
  keep_headers?: boolean;
  render?: boolean;
  session_number?: number;
  country_code?: string;
  premium?: boolean;
  retry?: number; // default: 3
  timeout?: number; // default: 60000
}

interface POptions extends Options {
  body: {
    [k: string]: string;
  } | string;
}

interface AccountResponse {
  concurrentRequests: number;
  requestCount: number;
  failedRequestCount: number;
  requestLimit: number;
  concurrencyLimit: number;
}

interface Scraper {
  get: <T>(url: string, options?: Options) => Promise<T>;
  post: (url: string, options?: POptions) => Promise<void>;
  put: (url: string, options?: POptions) => Promise<void>;
  account: () => Promise<AccountResponse>;
}

type SDK = (key: string) => Scraper;

const scraper: Scraper = (sdk as SDK)(SCRAPER_API_KEY);

export default scraper;
