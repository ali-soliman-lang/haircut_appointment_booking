import axios from "axios";
import type { reservations, SendReservations } from "./types";

const API_URL = "https://alhalaq-production.up.railway.app/api/v1/reservations";

export const getAppointments = async (): Promise<reservations[]> => {
  const { data } = await axios.get(API_URL);
  return data.data;
};

export const createAppointment = async (appointment: SendReservations) => {
  const { data } = await axios.post(API_URL, appointment);
  return data;
};

export const cancelAppointment = async (id: string) => {
  await axios.delete(`${API_URL}/${id}`);
};
