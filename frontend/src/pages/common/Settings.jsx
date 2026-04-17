import { useState } from "react";
import axios from "axios";
import { Lock, Save, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";

export default function Settings() {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.user_id || localStorage.getItem("user_id");

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return setStatus({ type: "error", message: "New passwords do not match" });
    }

    if (!userId) {
      return setStatus({ type: "error", message: "User session expired. Please login again." });
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      await axios.post("http://localhost:5000/api/auth/change-password", {
        user_id: userId,
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      setStatus({ type: "success", message: "Password updated successfully!" });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setStatus({ 
        type: "error", 
        message: err.response?.data?.message || "Failed to update password" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <ShieldCheck className="text-indigo-600" />
          Account Security
        </h1>
        <p className="text-gray-500 mt-1">Manage your password and security settings</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  name="currentPassword"
                  required
                  value={passwords.currentPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-800 placeholder-gray-400"
                  placeholder="Enter current password"
                />
              </div>
            </div>

            <hr className="border-gray-50" />

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  name="newPassword"
                  required
                  value={passwords.newPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-800 placeholder-gray-400"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={passwords.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-800 placeholder-gray-400"
                  placeholder="Repeat new password"
                />
              </div>
            </div>
          </div>

          {status.message && (
            <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 ${
              status.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
            }`}>
              {status.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="text-sm font-bold">{status.message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <>
                <Save size={20} />
                Update Security Settings
              </>
            )}
          </button>
        </form>
      </div>

      <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100 flex items-start gap-4">
        <div className="p-2 bg-white rounded-xl shadow-sm">
          <ShieldCheck size={20} className="text-indigo-600" />
        </div>
        <div>
          <h4 className="font-bold text-indigo-800 text-sm">Security Tip</h4>
          <p className="text-indigo-600 text-xs mt-1 leading-relaxed">
            Use a password that is at least 8 characters long and includes a mix of uppercase letters, numbers, and symbols for better account protection.
          </p>
        </div>
      </div>
    </div>
  );
}
