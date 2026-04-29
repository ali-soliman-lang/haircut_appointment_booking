import axios from "axios";
import type { Barber } from "./types";
const API_URL = "https://alhalaq.vercel.app/api/v1/barbers";

export const getBarbers = async (): Promise<Barber[]> => {
  const { data } = await axios.get(API_URL);
  return data?.data;
};

export const createBarber = async (name: string): Promise<Barber> => {
  const { data } = await axios.post(API_URL, {
    name,
  });

  return data?.data;
};

export const deleteBarber = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
