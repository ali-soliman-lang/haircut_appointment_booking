import { useEffect, useState } from "react";
import TextInput from "../../components/textInput";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { object, string } from "yup";
import { createBarber, deleteBarber, getBarbers } from "../../api/Barbers";
import Dropdown from "../../components/Dropdown";
import type { Barber } from "../../api/Barbers/types";

function CreateBarber() {
  const [activeTab, setActiveTab] = useState<"create" | "delete">("create");
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(false);

  //   Fetch Barbers
  const fetchBarbers = async () => {
    try {
      const data = await getBarbers();
      setBarbers(data);
    } catch {
      toast.error("Failed to load barbers ❌");
    }
  };
  // Create Barbers
  const createFormik = useFormik({
    initialValues: {
      barberName: "",
    },
    validationSchema: object({
      barberName: string()
        .min(3, "Min 3 characters")
        .required("Barber Name is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        await createBarber(values.barberName);
        setTimeout(() => {
          toast.success("Barber created successfully ✅");
          resetForm();
        }, 500);
        await fetchBarbers();
      } catch {
        toast.error("Something went wrong ❌");
      } finally {
        setLoading(false);
      }
    },
  });

  // Delete Barbers
  const deleteFormik = useFormik({
    initialValues: {
      barberID: "",
    },
    validationSchema: object({
      barberID: string().required("Barber ID is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        await deleteBarber(values.barberID);
        setTimeout(() => {
          toast.success("Barber deleted successfully 🗑️");
          resetForm();
        }, 500);
        await fetchBarbers();
      } catch {
        toast.error("Delete failed ❌");
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    fetchBarbers();
  }, []);

  const barberOptions = barbers.map((b) => ({
    label: b.name,
    value: b._id,
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-semibold">Manage Barbers</h2>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
              activeTab === "create"
                ? "bg-white shadow text-black"
                : "text-gray-500"
            } cursor-pointer`}
          >
            Create
          </button>

          <button
            onClick={() => setActiveTab("delete")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
              activeTab === "delete"
                ? "bg-red-500 text-white shadow"
                : "text-gray-500"
            } cursor-pointer`}
          >
            Delete
          </button>
        </div>

        {/* Create */}
        {activeTab === "create" && (
          <form onSubmit={createFormik.handleSubmit} className="space-y-5">
            <TextInput
              id="createBarberName"
              name="barberName"
              label="Barber Name"
              type="text"
              placeholder="Enter barber name"
              value={createFormik.values.barberName}
              onChange={createFormik.handleChange}
              onBlur={createFormik.handleBlur}
              helperText={
                (createFormik.touched.barberName &&
                  createFormik.errors.barberName) ||
                ""
              }
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl transition font-medium ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-900"} cursor-pointer`}
            >
              {loading ? "Creating..." : "Create Barber"}
            </button>
          </form>
        )}

        {/* Delete */}
        {activeTab === "delete" && (
          <form onSubmit={deleteFormik.handleSubmit} className="space-y-5">
            <Dropdown
              name="barberID"
              placeholder="Select Barber"
              options={barberOptions}
              value={deleteFormik.values.barberID}
              onChange={deleteFormik.setFieldValue}
              error={
                deleteFormik.touched.barberID && deleteFormik.errors.barberID
                  ? deleteFormik.errors.barberID
                  : ""
              }
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl transition font-medium ${loading ? "bg-red-300 cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-600"} cursor-pointer`}
            >
              {loading ? "Deleting..." : "Delete Barber"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default CreateBarber;
