export interface Department {
  readonly id: string;
  readonly name: string;
}

export interface City {
  readonly url: string;
  readonly name: string;
  readonly title?: string;
  readonly map?: string;
  readonly rating?: {
    global: string;
    [k: string]: string;
  };
  readonly evaluations?: string;
  readonly department?: string;
  readonly mairie?: string;
  readonly toursim?: string;
  readonly insee?: string;
}

export interface Cities {
  [department: string]: City[];
}
