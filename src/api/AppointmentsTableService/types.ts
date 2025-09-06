export interface reservations {
  _id: string;
  name: string;
  mobile: string;
  time: {
    from_time: string;
    to_time: string;
  };
  __v: number;
}
