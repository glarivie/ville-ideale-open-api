import { checkCacheFolder, cacheSessionCookie } from './helpers/cache';

import extractDepartments from './departments';
import getCitiesFromDepartments from './cities';

const main = async () => {
  try {
    checkCacheFolder();

    const { departments, cookie } = await extractDepartments();

    cacheSessionCookie(cookie);

    const citiesFromDepartments = await getCitiesFromDepartments(cookie, departments);

    console.log(citiesFromDepartments);
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
};

main();
