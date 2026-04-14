import { useEffect, useState } from "react";
import { getStats } from "../../services/api";

export default function StudentDashboard() {
  const [stats, setStats] = useState({});

  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const res = await getStats(user_id);
    setStats(res.data);
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h2 className="text-gray-800 text-xl font-semibold">
          Dashboard Overview
        </h2>
        <p className="text-gray-600 text-sm">
          Track your placement progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <Card title="Total Opportunities" value={stats.total_opportunities} />
        <Card title="Applied" value={stats.applied} />
        <Card title="Shortlisted" value={stats.shortlisted} />
        <Card title="Selected" value={stats.selected} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <h3 className="text-2xl font-semibold text-gray-800">{value || 0}</h3>
    </div>
  );
}