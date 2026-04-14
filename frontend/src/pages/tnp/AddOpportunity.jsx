import { useState } from "react";
import API from "../../services/api";

export default function AddOpportunity() {
  const [form, setForm] = useState({
    title: "",
    company_name: "",
    type: "internship",
    description: "",
    deadline: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/opportunities", form);
    alert("Opportunity Added");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
      <input placeholder="Company" onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
      <input placeholder="Title" onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <textarea placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input type="date" onChange={(e) => setForm({ ...form, deadline: e.target.value })} />

      <button type="submit">Add</button>
    </form>
  );
}