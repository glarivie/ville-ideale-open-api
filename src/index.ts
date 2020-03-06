import 'dotenv/config';

import './config/mongo';

import extractDepartments from './departments';
import getCitiesFromDepartments from './cities';
import extractCityData from './city';
import CityModel from './schemas/city';
import { City } from './types';

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

    const data = citiesFromDepartments
      .filter(({ department: { id } }) => [64, 40, 33, 17, 16, 47, 24, 86, 79, 85].includes(parseInt(id)));

    // const data: City[] = await CityModel.find({ "department.id": "33" }).exec();
    // console.log(data.length);
    const cities = await extractCityData(data);

    console.log({ records: cities.length });
  } catch (error) {
    console.error(error);
  } finally {
    console.info('Done !');
    process.exit(0);
  }
};

main();
