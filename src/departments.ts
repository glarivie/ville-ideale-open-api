import { toNumber } from 'lodash';

import request from './helpers/request';
import { extractBody } from './helpers/jsdom';
import { Department } from './types';

const extractDepartments = async (): Promise<Department[]> => {
  const { data: body } = await request({
    method: 'GET',
    url: '/villespardepts.php',
    withCredentials: true,
  });

  const document = await extractBody(body);
  const elements = document.querySelectorAll<HTMLAnchorElement>('#listedepts > a');

  const departments = Array.from(elements).map((element: HTMLAnchorElement): Department => {
    const href = element.getAttribute('href');
    const { groups } = href.match(/affdept\('(?<id>[\dAB]+)',\s?'(?<name>.+)'\)/);
    const { id, name } = groups;

    return {
      id: toNumber(id),
      name: name.replace(/\\/g, ''),
    };
  });

  return departments;
};

export default extractDepartments;
