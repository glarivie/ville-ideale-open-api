import request from './helpers/request';
import { extractBody } from './helpers/jsdom';
import { retrieveCookieFromCache } from './helpers/cache';
import { Department } from './types';

interface DepartmentsAndCookie {
  departments: Department[];
  cookie: string;
}

const extractDepartments = async (): Promise<DepartmentsAndCookie> => {
  const { headers, data: body } = await request({
    method: 'GET',
    url: '/villespardepts.php',
    withCredentials: true,
    cache: true,
  });

  const cookie: string = retrieveCookieFromCache() ?? headers['set-cookie'][0].split(';')[0];

  const document = await extractBody(body);
  const elements = document.querySelectorAll('#listedepts > a');

  const departments = Array.from(elements).map((element: HTMLAnchorElement): Department => {
    const href = element.getAttribute('href');
    const { groups } = href.match(/affdept\('(?<id>[\dAB]+)',\s?'(?<name>.+)'\)/);
    const { id, name } = groups;

    return { id, name };
  });

  return { departments, cookie };
};

export default extractDepartments;
