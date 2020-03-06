import mongoose from 'mongoose';

import { MongoCity } from '../types';

const CitySchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  name: { type: String },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  postcode: { type: String },
  map: { type: String },
  rating: {
    global: { type: Number },
    count: { type: Number },
    environment: { type: Number },
    transport: { type: Number },
    security: { type: Number },
    health: { type: Number },
    leisure: { type: Number },
    culture: { type: Number },
    education: { type: Number },
    shopping: { type: Number },
    living: { type: Number },
  },
  department: {
    id: { type: String },
    name: { type: String },
  },
  websites: { type: [String] },
  population: { type: Number },
});

export default mongoose.model<MongoCity>('City', CitySchema);
