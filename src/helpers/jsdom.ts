import { JSDOM } from 'jsdom';

const extractBody = async (html: string): Promise<Document> => {
  const { window: { document } } = new JSDOM(html, { contentType: 'text/html' });

  return document;
};

const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export {
  extractBody,
  sleep,
};
