import { useCallback, useEffect, useState } from "react";
import Logo from "../../components/Logo";
import SelectInput from "../../components/selectInput";
import TextInput from "../../components/textInput";
import "./index.css";
import { useFormik } from "formik";
import { object, string } from "yup";
import {
  createAppointment,
  getAppointments,
} from "../../api/AppointmentsTableService";
import { getTimeTable } from "../../api/TimeTableService";
import type { Appointment } from "../../api/TimeTableService/types";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LanguageToggle from "../../components/LanguageToggle";
import { useTranslation } from "react-i18next";
import Footer from "../../components/Footer";
import Spinner from "../../components/spinner";
import { useSearchParams } from "react-router-dom";
import BackButton from "../../components/BackButton";
import useDisableBack from "../../hooks/useDisableBack";

function Reservation() {
  const [timeData, setTimeData] = useState<Appointment[]>([]);
  const [reservedTime, setReservedTime] = useState<string[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState<"none" | "submit" | "refresh">("none");
  const [searchParams] = useSearchParams();
  const barberId = searchParams.get("barberId");
  const name = searchParams.get("name");

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // get all time
  // const getTimeDropdown = async () => {
  //   const dataTimeNew = await getTimeTable(barberId || "");
  //   setTimeData(dataTimeNew);
  // };
  const getTimeDropdown = useCallback(async () => {
    try {
      const dataTimeNew = await getTimeTable(barberId || "");
      setTimeData(dataTimeNew);
    } catch (error) {
      console.error("Error fetching time dropdown:", error);
    }
  }, [barberId]);
  // get time reserved
  // const fetchAppointments = async () => {
  //   try {
  //     const data = await getAppointments({ barber: barberId || "" });
  //     setReservedTime(
  //       data.map((item) => item?.time?.from_time).filter(Boolean),
  //     );
  //     setInitialLoading(false);
  //   } catch {
  //     console.error("Error fetching appointments:");
  //   }
  // };
  const fetchAppointments = useCallback(async () => {
    try {
      const data = await getAppointments({ barber: barberId || "" });
      setReservedTime(
        data.map((item) => item?.time?.from_time).filter(Boolean),
      );
    } catch {
      console.error("Error fetching appointments:");
    }
  }, [barberId]);

  const allTimesReserved =
    timeData.length > 0 &&
    timeData.every((time) => reservedTime.includes(time?.from_time));

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setInitialLoading(true);
        await Promise.all([getTimeDropdown(), fetchAppointments()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (isMounted) setInitialLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // clean-up
    };
  }, [getTimeDropdown, fetchAppointments]);

  // ✅ Make validation schema dynamic with language
  const validationSchema = object({
    name: string()
      .min(3, t("Min3Characters"))
      .matches(/^[A-Za-z\u0600-\u06FF\s]+$/, t("LettersOnly"))
      .required(t("NameRequired")),
    phoneNumber: string()
      .required(t("PhoneNumberRequired"))
      .matches(/^\d+$/, t("NumbersOnly"))
      .min(11, t("PhoneNumberMin"))
      .max(11, t("PhoneNumberMax")),
    time: string().required(t("TimeRequired")),
  });

  const {
    handleBlur,
    handleChange,
    values,
    touched,
    errors,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      phoneNumber: "",
      time: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading("submit");
        await createAppointment({
          name: values.name,
          mobile: values.phoneNumber,
          time: values.time,
          barber: barberId || "",
        });
        toast.success(t("ReservationsDone"));
        resetForm();
        getTimeDropdown();
        fetchAppointments();
        localStorage.setItem("reservation", JSON.stringify(values));

        navigate(`/success?barberId=${barberId}`);
      } catch {
        toast.error(t("TimeAlreadyReserved"));
      } finally {
        setLoading("none");
      }
    },
  });

  useDisableBack();
  return (
    <>
      <div className="min-h-screen w-full max-w-[400px] mx-auto px-4 flex flex-col justify-center items-center text-center pt-[60px]">
        <div className="w-full flex justify-end mb-6">
          <LanguageToggle />
          <BackButton to={"/SelectBarber?from=WelcomeScreen"} />
        </div>
        <div className="flex justify-center items-center w-full">
          <div className="mt-11">
            <Logo />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-4 mt-6">
          {name ? t(`barbers.${name}`) : ""}
        </h2>

        {initialLoading ? (
          <Spinner />
        ) : allTimesReserved ? (
          <div className="w-full text-center mt-10">
            <p className="text-xl font-bold text-black-600">
              {t("AllTimesReserved")}
            </p>
          </div>
        ) : (
          <form
            key={i18n.language}
            onSubmit={handleSubmit}
            className="w-full space-y-4"
          >
            <TextInput
              placeholder={t("AddName")}
              type={"text"}
              label={"name"}
              value={values.name}
              onBlur={handleBlur}
              onChange={handleChange}
              helperText={
                touched.name
                  ? [
                      !values.name && t("NameRequired"),
                      values.name &&
                        values.name.length < 3 &&
                        t("Min3Characters"),
                      values.name &&
                        !/^[\p{L}\s]+$/u.test(values.name) &&
                        t("LettersOnly"),
                    ]
                      .filter(Boolean)
                      .join(" - ")
                  : ""
              }
            />
            <TextInput
              placeholder={t("AddPhoneNumber")}
              type={"text"}
              label={"phoneNumber"}
              value={values.phoneNumber}
              onBlur={handleBlur}
              onChange={handleChange}
              helperText={
                touched.phoneNumber
                  ? [
                      !values.phoneNumber && t("PhoneNumberRequired"),
                      values.phoneNumber &&
                        !/^\d+$/.test(values.phoneNumber) &&
                        t("NumbersOnly"),
                      values.phoneNumber &&
                        values.phoneNumber.length < 11 &&
                        t("PhoneNumberMin"),
                      values.phoneNumber &&
                        values.phoneNumber.length > 11 &&
                        t("PhoneNumberMax"),
                    ]
                      .filter(Boolean)
                      .join(" - ")
                  : ""
              }
            />
            <SelectInput
              name="time"
              placeholder={t("ChooseTime")}
              options={timeData.filter(
                (time) => !reservedTime.includes(String(time?.from_time)),
              )}
              value={values.time}
              onChange={setFieldValue}
              error={touched.time && errors.time ? t("TimeRequired") : ""}
            />
            <button
              type="submit"
              disabled={loading === "submit"}
              className={`w-[80%] px-6 py-2 mt-6 shadow-md transition duration-300 cursor-pointer shadow-black-500/50
  ${
    loading === "submit"
      ? "bg-gray-400 text-white cursor-not-allowed"
      : "bg-[#0d0d0d] text-white hover:bg-white hover:text-black border-2 border-black"
  }`}
            >
              {loading === "submit"
                ? t("BookingInProgress")
                : t("ConfirmReservation")}
            </button>
          </form>
        )}
        <Footer />
      </div>
    </>
  );
}

export default Reservation;
