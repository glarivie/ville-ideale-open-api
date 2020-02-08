import { stringify } from 'qs';
import { set } from 'lodash';

import request from './helpers/request';
import { extractBody, sleep } from './helpers/jsdom';
import { Department, City, Cities } from './types';

const getCitiesFromDepartments = async (cookie: string, departments: Department[]): Promise<Cities> => {
  const data: Cities = {};

  for (const { id, name } of departments) {
    const { data: body } = await request({
      method: 'POST',
      url: '/scripts/cherche.php',
      withCredentials: true,
      headers: { cookie },
      data: stringify({ dept: id }),
      cache: true,
    });

    const document = await extractBody(body);
    const elements = document.querySelectorAll('p > a');

    const cities = Array.from(elements).map((element: HTMLAnchorElement): City => ({
      url: element.getAttribute('href'),
      name: element.innerHTML.replace(/&nbsp;/g, ' '),
    }));

    set(data, name, cities);

    console.log({ id, name, cities: cities.length });

    // await sleep(1000);
  }

  return data;
};

export default getCitiesFromDepartments;
