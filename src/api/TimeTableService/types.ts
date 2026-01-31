export interface Appointment {
  _id?: string;
  from_time: string;
  to_time: string;
  barber?: string;
  __v?: number;
  name?: string;
  phone?: string;
  status?: "Pending" | "Confirmed" | "Cancelled";
}
