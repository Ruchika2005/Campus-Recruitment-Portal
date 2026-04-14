import { useEffect, useState } from "react";
import API from "../../services/api";

export default function ManageApplications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    const res = await API.get("/applications");
    setApps(res.data);
  };

  const updateStatus = async (id, status) => {
    await API.put(`/applications/${id}`, { status });
    fetchApps();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="mb-4">Manage Applications</h2>

      <table className="w-full">
        <thead>
          <tr>
            <th>Student</th>
            <th>Company</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {apps.map((app) => (
            <tr key={app.application_id}>
              <td>{app.roll_no}</td>
              <td>{app.company_name}</td>
              <td>{app.status}</td>
              <td className="space-x-2">
                <button onClick={() => updateStatus(app.application_id, "shortlisted")}>Shortlist</button>
                <button onClick={() => updateStatus(app.application_id, "selected")}>Select</button>
                <button onClick={() => updateStatus(app.application_id, "rejected")}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}