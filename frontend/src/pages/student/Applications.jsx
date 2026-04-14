import { useEffect, useState } from "react";
import { getApplications } from "../../services/api";

export default function ApplicationsPage() {
  const [apps, setApps] = useState([]);

  const roll_no = localStorage.getItem("roll_no");

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    const res = await getApplications(roll_no);
    setApps(res.data);
  };

  const getStatusColor = (status) => {
    if (status === "selected") return "bg-green-100 text-green-700";
    if (status === "shortlisted") return "bg-blue-100 text-blue-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">My Applications</h2>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Company</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {apps.map((app) => (
              <tr key={app.application_id} className="border-t">
                <td className="p-4">{app.company_name}</td>
                <td className="p-4">{app.title}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}