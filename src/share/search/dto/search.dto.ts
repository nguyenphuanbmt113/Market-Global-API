export interface ISearch {
  name: string;
  type: string;
  take?: number;
  page?: number;
  limit?: number;
}

export interface INameSearch {
  type: string;
  name: string;
}
