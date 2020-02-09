import extractDepartments from './departments';
import getCitiesFromDepartments from './cities';
import extractCityData from './city';

const main = async () => {
  try {
    const departments = await extractDepartments();
    const citiesFromDepartments = await getCitiesFromDepartments(departments);

    const cities = await extractCityData(citiesFromDepartments);
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
};

main();
