import axios from "axios";
import type { Appointment } from "./types";

const API_URL = "https://alhalaq.vercel.app/api/v1/time";

export const getTimeTable = async (barber: string): Promise<Appointment[]> => {
  const { data } = await axios.get(`${API_URL}/`, {
    params: { barber },
  });
  return data?.data;
};

export const createTimeTable = async (appointment: Appointment) => {
  const { data } = await axios.post(API_URL, appointment);
  return data?.data;
};

export const editTimeTable = async (
  barber: string,
  updatedFields: Partial<Appointment>,
) => {
  const { data } = await axios.patch(`${API_URL}/${barber}`, updatedFields);
  return data?.data;
};

export const deleteTimeTable = async (barber: string) => {
  await axios.delete(`${API_URL}/${barber}`);
};
