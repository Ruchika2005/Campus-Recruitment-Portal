import { useEffect, useState } from "react";
import { getStudentApplications } from "../../services/api";
import axios from "axios";
import { Briefcase, Calendar, MapPin, Building } from "lucide-react";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const profRes = await axios.get(`http://localhost:5000/api/student/profile/${user_id}`);
      const prof = profRes.data;

      const res = await getStudentApplications(prof.roll_no);
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No Deadline";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "applied": return "bg-blue-100 text-blue-700";
      case "shortlisted": return "bg-yellow-100 text-yellow-700";
      case "selected": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">My Applications</h2>
        <p className="text-gray-600 mt-1">Track the status of all opportunities you've applied for.</p>
      </div>

      <hr className="border-gray-200" />

      {loading ? (
        <p className="text-gray-500 italic">Loading your applications...</p>
      ) : applications.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <p className="text-gray-500 font-medium">You haven't applied to any opportunities yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div key={app.application_id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{app.title}</h3>
                    <div className="flex items-center text-gray-500 mt-1 font-medium">
                      <Building size={16} className="mr-1" />
                      {app.company_name}
                    </div>
                  </div>
                  <span className={`px-4 py-1 text-sm rounded-full font-semibold capitalize ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                  <div className="flex gap-2 items-center">
                    <Briefcase size={16} className="text-gray-400" />
                    <span className="capitalize">{app.type}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Calendar size={16} className="text-indigo-400" />
                    <span className="text-indigo-600 font-medium">{formatDate(app.deadline)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-auto">
                <p className="text-xs text-gray-400 text-right">Application ID: {app.application_id}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}