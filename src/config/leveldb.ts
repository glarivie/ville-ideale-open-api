import { resolve, join } from 'path';
import level from 'level';
import { LevelUp } from 'levelup';
import { LevelDown, Bytes } from 'leveldown';
import { AbstractIterator } from 'abstract-leveldown';

interface Cache extends LevelUp<LevelDown, AbstractIterator<string, string>> {
  getItem?: (key: Bytes) => Promise<Bytes | null>;
  setItem?: (key: Bytes, value: Bytes) => Promise<void>;
}

const root = resolve(__dirname, '..', '..');
const database = join(root, '.cache');

const cache: Cache = level(database);

cache.getItem = (key: Bytes): Promise<Bytes | null> =>
  new Promise(resolve => cache.get(key).then(resolve).catch(() => resolve(null)));

cache.setItem = (key: Bytes, value: Bytes): Promise<void> =>
  new Promise(resolve => cache.put(key, value).then(resolve).catch(resolve));

export default cache;
