export type Response<T = any> = {
  success: boolean;
  message: string;
  data: T;
  total?: number;
};

export type WithID<T> = { _id: string } & T;