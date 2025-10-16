import axios from "axios";
import type { Appointment } from "./types";

const API_URL = "https://alhalaq.vercel.app/api/v1/time";

export const getTimeTable = async (): Promise<Appointment[]> => {
  const { data } = await axios.get(API_URL);
  return data?.data;
};

export const createTimeTable = async (appointment: Appointment) => {
  const { data } = await axios.post(API_URL, appointment);
  return data?.data;
};

export const editTimeTable = async (
  id: number | string,
  updatedFields: Partial<Appointment>
) => {
  const { data } = await axios.put(`${API_URL}/${id}`, updatedFields);
  return data?.data;
};

export const deleteTimeTable = async (id: number | string) => {
  await axios.delete(`${API_URL}/${id}`);
};
