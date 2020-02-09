import { isNil } from 'lodash';

import request from './helpers/request';
import { extractBody, sleep } from './helpers/jsdom';
import { Cities, City } from './types';

const extractCityData = async (citiesFromDepartments: Cities): Promise<City[]> => {
  const data: City[] = [];

  for (const cities of Object.values(citiesFromDepartments)) {
    for (const { name, url } of cities) {
      const { data: html } = await request({
        method: 'GET',
        url,
        withCredentials: true,
        useCache: true,
      });

      const document = await extractBody(html);

      const title = document.querySelector<HTMLHeadingElement>('#colleft > h1:first-child');
      const map = document.querySelector<HTMLAnchorElement>('#carte > a');

      const rating = {
        global: document.querySelector<HTMLParagraphElement>('p#ng').textContent,
        ...Array
          .from(document.querySelectorAll<HTMLTableRowElement>('#tablonotes tr'))
          .reduce((acc, element) => {
            const key = element.querySelector<HTMLTableHeaderCellElement>('th').textContent;
            const value = element.querySelector<HTMLTableDataCellElement>('td').textContent;

            return { ...acc, [key]: value };
          }, {}),
      };

      const evaluations = document.querySelector<HTMLAnchorElement>('p#nobt > a');
      const department = document.querySelector<HTMLElement>('#info > p:nth-child(1) > strong');
      const mairie = document.querySelector<HTMLAnchorElement>('#info > p:nth-child(2) > a');
      const toursim = document.querySelector<HTMLAnchorElement>('#info > p:nth-child(3) > a');
      const insee = document.querySelector<HTMLAnchorElement>('#info > p:nth-child(5) > a');

      const city: City = {
        name,
        url,
        title: isNil(title) ? null : title.textContent,
        map: isNil(map) ? null : map.getAttribute('href'),
        rating,
        evaluations: isNil(evaluations) ? null : evaluations.textContent,
        department: isNil(department) ? null : department.textContent,
        mairie: isNil(mairie) ? null : mairie.getAttribute('href'),
        toursim: isNil(toursim) ? null : toursim.getAttribute('href'),
        insee: isNil(insee) ? null : insee.getAttribute('href'),
      };

      console.log(city)

      data.push(city);

      await sleep(2000);
    }
  }

  return data;
};

export default extractCityData;
