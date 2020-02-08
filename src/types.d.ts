export interface Department {
  readonly id: string;
  readonly name: string;
}

export interface City {
  readonly url: string;
  readonly name: string;
}

export interface Cities {
  [department: string]: City[];
}
