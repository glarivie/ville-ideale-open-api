import { JSDOM } from 'jsdom';

import { HTMLString } from '../types';

const extractBody = async (html: HTMLString): Promise<Document> => {
  const { window: { document } } = new JSDOM(html, { contentType: 'text/html' });

  return document;
};

const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export {
  extractBody,
  sleep,
};
