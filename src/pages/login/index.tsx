import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { object, string } from "yup";
import TextInput from "../../components/textInput";
import Logo from "../../components/Logo";

function Login() {
  const navigate = useNavigate();

  const { handleBlur, handleChange, values, touched, errors, handleSubmit } =
    useFormik({
      initialValues: {
        userName: "",
        password: "",
      },
      validationSchema: object({
        userName: string()
          .min(3, "Min 3 characters")
          .required("User Name is required"),
        password: string()
          .min(3, "Min 3 characters")
          .required("password is required"),
      }),
      onSubmit: (values) => {
        const correctUserName = "user12345";
        const correctPassword = "12345";
        if (
          values.userName === correctUserName &&
          values.password === correctPassword
        ) {
          Cookies.set("isLoggedIn", "true", { expires: 1 });
          navigate("/dashboard");
          toast.success("You have successfully logged in");
        } else {
          toast.error("Incorrect username or password");
        }
      },
    });
  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center text-center">
        <form onSubmit={handleSubmit}>
          <Logo />
          <h2 className="mt-4 mb-8 text-2xl font-semibold tracking-tight text-slate-900 dark:text-black">
            Login
          </h2>
          <TextInput
            placeholder={"User Name"}
            type={"text"}
            label={"userName"}
            value={values.userName}
            onBlur={handleBlur}
            onChange={handleChange}
            helperText={(touched.userName && errors.userName) || ""}
          />
          <TextInput
            placeholder={"password"}
            type={"text"}
            label={"password"}
            value={values.password}
            onBlur={handleBlur}
            onChange={handleChange}
            helperText={(touched.password && errors.password) || ""}
          />
          <button
            type="submit"
            className="w-full px-6 py-2 bg-[#0d0d0d] text-white shadow-md hover:bg-white hover:text-black border-2 border-black mt-6 transition duration-300 cursor-pointer shadow-black-500/50"
          >
            login
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
