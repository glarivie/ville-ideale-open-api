import extractDepartments from './departments';
import getCitiesFromDepartments from './cities';

const main = async () => {
  try {
    const departments = await extractDepartments();
    const citiesFromDepartments = await getCitiesFromDepartments(departments);

    console.log(citiesFromDepartments);
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
};

main();
