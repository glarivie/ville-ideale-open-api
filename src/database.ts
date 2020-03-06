import CityModel from './schemas/city';
import { MongoCity, City } from './types';

const saveCity = async (city: City): Promise<MongoCity> => {
  const { url } = city;

  return CityModel
    .findOneAndUpdate({ url }, city, { upsert: true, new: true })
    .exec();
};

const getAllCities = async (): Promise<MongoCity[]> => CityModel.find().exec();

export {
  saveCity,
  getAllCities,
};
