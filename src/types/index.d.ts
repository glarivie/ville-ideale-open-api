import { Document } from 'mongoose';

export interface Department {
  readonly id: number;
  readonly name: string;
}

export interface City {
  readonly url: string;
  readonly name?: string;
  readonly postcode?: string;
  readonly map?: string;
  readonly rating?: {
    global?: number;
    [k: string]: number;
    count: number;
  };
  readonly department?: Department;
  readonly websites?: string[];
  readonly population?: number | null;
}

export interface Cities {
  [department: string]: City[];
}

export type MongoCity = Document & City;

export type HTMLString = string;
