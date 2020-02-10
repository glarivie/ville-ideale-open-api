import { isNil } from 'lodash';

import request from './helpers/request';
import { extractBody } from './helpers/jsdom';

const getPopulationDensity = async (url: string): Promise<number> => {
  const { data: body } = await request({
    method: 'GET',
    url,
    useCache: true,
  });

  const document = await extractBody(body);
  const td = document.querySelector('.corps-publication td.total:last-of-type');
  const total = isNil(td) ? null : td.textContent.replace(/\s+/g, '');

  return parseInt(total);
};

export default getPopulationDensity;
