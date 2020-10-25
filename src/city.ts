import { isNil, isNaN, random, isUndefined, pick, isEmpty } from 'lodash';

import request, { RequestConfig } from './helpers/request';
import categories from './constants/rating';
import { extractBody, sleep } from './helpers/jsdom';
import getPopulationDensity from './insee';
import { City, HTMLString } from './types';
import { saveCity } from './database';

const toFloat = (str: string): number => parseFloat(str.replace(/,/g, '.'));

const extractCityData = async (cities: City[]): Promise<City[]> => {
  const data: City[] = [];

  for (const { name, url } of cities) {
    const options: RequestConfig = {
      method: 'GET',
      url,
      withCredentials: true,
    };

    try {
      let html: HTMLString = '';
      const initialRequest = await request<HTMLString>(options);

      html = initialRequest.data;

      if (isEmpty(html)) {
        const retriedRequest = await request<HTMLString>({ ...options, newSession: true });

        html = retriedRequest.data;
      }

      const document = await extractBody(html);

      const title = document.querySelector<HTMLHeadingElement>('#colleft > h1:first-child');
      const map = document.querySelector<HTMLAnchorElement>('#carte > a');
      const png = document.querySelector<HTMLParagraphElement>('p#ng');
      const global = (isNil(png) || isNaN(toFloat(png.textContent))) ? null : toFloat(png.textContent);
      const evaluations = document.querySelector<HTMLAnchorElement>('p#nobt > a');

      const count = (isNil(evaluations) || isNil(evaluations.textContent.match(/\d+/)))
        ? 0
        : parseInt(evaluations.textContent.match(/\d+/)[0]);

      const rating = {
        count,
        ...!isNil(global) && { global },
        ...Array
          .from(document.querySelectorAll<HTMLTableRowElement>('#tablonotes tr'))
          .reduce((acc, element) => {
            const th = element.querySelector<HTMLTableHeaderCellElement>('th');
            const td = element.querySelector<HTMLTableDataCellElement>('td');
            const key = categories[th.textContent] ?? th.textContent;

            if (isNil(td) || isNaN(toFloat(td.textContent))) return acc;

            return { ...acc, [key]: toFloat(td.textContent) };
          }, {}),
      };

      const getPopulation = async (websites: string[]): Promise<number> => {
        const insee = websites.find(url => url.includes('insee'));

        try {
          return isUndefined(insee) ? 0 : getPopulationDensity(insee);
        } catch (error) {
          return 0;
        }
      };

      const infos = Array
        .from(document.querySelectorAll<HTMLParagraphElement>('#info p'))
        .reduce<Partial<City>>((acc, element) => {
          const strong = element.querySelector<HTMLElement>('strong');
          const link = element.querySelector<HTMLAnchorElement>('a');

          if (!isNil(strong)) {
            const [id, name] = strong.textContent.split('-').map(el => el.trim());

            return { ...acc, department: { id, name } };
          }

          if (!isNil(link)) {
            const href = link.getAttribute('href');
            const { websites = [] } = acc;

            return { ...acc, websites: [...websites, href] };
          }

          return acc;
        }, {});

      // const population = has(infos, 'websites') ? await getPopulation(infos.websites) : 0;

      const city: City = {
        name,
        url,
        postcode: isNil(title) || isNil(title.textContent.match(/\d+/))
          ? null
          : title.textContent.match(/\d+/)[0],
        map: isNil(map) ? null : map.getAttribute('href'),
        rating,
        // population,
        ...infos,
      };

      // console.log(city);
      console.log(pick(city, ['name', 'postcode']));

      data.push(city);

      await saveCity(city);
      await sleep(random(1000, 2000));
    } catch (error) {
      console.error(`[ERROR] Cannot get/save city "${name}" at "${url}"`);
    }
  }

  return data;
};

export default extractCityData;
