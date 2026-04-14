import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle } from "lucide-react";

export default function CompleteProfile() {
  const location = useLocation();
  const navigate = useNavigate();

  const user_id = localStorage.getItem("temp_user_id");

  if (!user_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f7fb]">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center w-full max-w-md">

          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-red-500" />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Session Expired
          </h2>

          <p className="text-gray-500 mb-6">
            Please login again to continue
          </p>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition shadow-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const [form, setForm] = useState({
    roll_no: "",
    branch: "",
    year: "",
    cgpa: "",
    skills: "",
    projects: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/complete-profile",
      {
        user_id,
        ...form,
      }
    );

    const user = res.data.user;

    localStorage.setItem("user_id", user.user_id);
    localStorage.setItem("role", user.role);
    localStorage.setItem("name", user.name);

    localStorage.removeItem("temp_user_id");

    if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/student");
    }

  } catch (err) {
    alert("Profile creation failed");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7fb] p-6 relative overflow-hidden">

      {/* background blobs */}
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-indigo-200 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-blue-200 rounded-full blur-3xl opacity-20" />

      {/* CARD */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 p-10 relative">

        {/* top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500 rounded-t-3xl" />

        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Complete Your Profile
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Fill your academic details to continue
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              name="roll_no"
              placeholder="Roll Number"
              onChange={handleChange}
              className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200
              focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition"
              required
            />

            <input
              name="branch"
              placeholder="Branch (e.g. Computer Engineering)"
              onChange={handleChange}
              className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200
              focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition"
              required
            />

            <input
              name="year"
              placeholder="Year (e.g. 3)"
              onChange={handleChange}
              className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200
              focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition"
              required
            />

            <input
              name="cgpa"
              placeholder="CGPA (e.g. 8.5)"
              onChange={handleChange}
              className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200
              focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition"
              required
            />

          </div>

          {/* TEXTAREAS */}
          <textarea
            name="skills"
            placeholder="Skills (React, Node.js, Java...)"
            onChange={handleChange}
            className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200
            focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition h-24"
          />

          <textarea
            name="projects"
            placeholder="Projects (short description)"
            onChange={handleChange}
            className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200
            focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition h-24"
          />

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3.5 rounded-xl transition shadow-md font-medium"
          >
            Finish Setup
          </button>

        </form>

      </div>
    </div>
  );
}