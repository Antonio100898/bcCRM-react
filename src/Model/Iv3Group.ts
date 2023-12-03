export interface Iv3Group {
  id: number;
  name: string;
  database: string;
}

export interface Iv3Branch {
  id: number;
  branchName: string;
  address: string;
  city: string;
  biCommEmail: string;
  kosher: boolean;
  ip: string;
  cityId: number;
  cityName: string;
}

export interface Iv3City {
  id: number;
  cityName: string;
}

export interface Iv3Response {
  d: {
    msg: string;
    success: boolean;
    v3Groups: Iv3Group[];
    v3Cities: Iv3City[];
  };
}
