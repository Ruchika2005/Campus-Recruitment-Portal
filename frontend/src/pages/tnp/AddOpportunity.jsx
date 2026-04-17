import { useState } from "react";
import { addOpportunity } from "../../services/api";

export default function AddOpportunity() {
  const [form, setForm] = useState({
    title: "",
    company_name: "",
    type: "internship",
    description: "",
    deadline: "",
    branch: "",
    year: "",
    min_cgpa: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMultiSelect = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value).join(", ");
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await addOpportunity(form);
      setMessage("Opportunity Added Successfully!");
      setForm({
        title: "",
        company_name: "",
        type: "internship",
        description: "",
        deadline: "",
        branch: "",
        year: "",
        min_cgpa: "",
      });
    } catch (err) {
      console.error(err);
      setMessage("Failed to add opportunity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Opportunity</h2>
        
        {message && (
          <div className={`p-4 mb-6 rounded-xl ${message.includes("Success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input required name="company_name" value={form.company_name} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="e.g. Google, Microsoft" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
              <input required name="title" value={form.title} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="e.g. Software Engineer" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Opportunity Type</label>
              <select required name="type" value={form.type} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                <option value="internship">Internship</option>
                <option value="placement">Placement</option>
                <option value="hackathon">Hackathon</option>
                <option value="program">Program</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
              <input required type="date" name="deadline" value={form.deadline} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea required name="description" value={form.description} onChange={handleChange} rows="4" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Describe the role, responsibilities, and requirements..." />
          </div>

          <hr className="border-gray-200" />
          <h3 className="text-lg font-semibold text-gray-800">Eligibility Criteria</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Eligible Branch</label>
              <select multiple name="branch" value={form.branch ? form.branch.split(', ').map(s=>s.trim()) : []} onChange={handleMultiSelect} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none h-32">
                <option value="Comp">Comp</option>
                <option value="IT">IT</option>
                <option value="EnTc">EnTc</option>
                <option value="Mech">Mech</option>
                <option value="Instru">Instru</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year of Passing</label>
              <select multiple name="year" value={form.year ? form.year.split(', ').map(s=>s.trim()) : []} onChange={handleMultiSelect} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none h-32">
                <option value="2029">2029</option>
                <option value="2028">2028</option>
                <option value="2027">2027</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum CGPA</label>
              <input name="min_cgpa" type="number" step="0.01" value={form.min_cgpa} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="e.g. 7.5" />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" disabled={loading} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 transition-all focus:ring-4 focus:ring-indigo-100 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? "Adding..." : "Add Opportunity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}