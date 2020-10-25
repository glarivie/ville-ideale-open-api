import 'dotenv/config';

import './config/mongo';

import extractDepartments from './departments';
import getCitiesFromDepartments from './cities';
import extractCityData from './city';
// import CityModel from './schemas/city';
// import { City } from './types';

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
    process.exit(1);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown')
    process.exit(1);
  });

const main = async () => {
  try {
    const departments = await extractDepartments();
    const citiesFromDepartments = await getCitiesFromDepartments(departments);

    await extractCityData(citiesFromDepartments);
  } catch (error) {
    console.error(error);
  } finally {
    console.info('Done !');
    process.exit(0);
  }
};

main();
