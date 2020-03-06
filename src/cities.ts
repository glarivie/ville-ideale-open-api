import { stringify } from 'qs';
import { set, isNil, random } from 'lodash';

import cache from './config/leveldb';
import request from './helpers/request';
import { extractBody, sleep } from './helpers/jsdom';
import { Department, City } from './types';

const getCitiesFromDepartments = async (departments: Department[]): Promise<City[]> => {
  const cookie = await cache.get('cookie');
  const data: City[] = [];

  if (isNil(cookie))
    throw new Error('Cannot fetch cities without session cookie');

  for (const { id, name } of departments) {
    const { data: body } = await request({
      method: 'POST',
      url: '/scripts/cherche.php',
      withCredentials: true,
      headers: { cookie },
      data: stringify({ dept: id }),
      useCache: true,
    });

    const document = await extractBody(body);
    const elements = document.querySelectorAll<HTMLAnchorElement>('p > a');

    const cities = Array.from(elements).map((element: HTMLAnchorElement): City => ({
      url: 'https://www.ville-ideale.fr' + element.getAttribute('href'),
      name: element.innerHTML.replace(/&nbsp;/g, ' '),
      department: { id, name },
    }));

    data.push(...cities);

    console.log({ id, name, cities: cities.length });

    await sleep(random(1000, 2000));
  }

  return data;
};

export default getCitiesFromDepartments;
