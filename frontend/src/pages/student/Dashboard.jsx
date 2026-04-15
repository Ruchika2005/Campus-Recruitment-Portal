import { useEffect, useState } from "react";
import { getStats, getOpportunities } from "../../services/api";
import OpportunityCard from "../../components/dashboard/OpportunityCard";

export default function StudentDashboard() {
  const [stats, setStats] = useState({});
  const [jobs, setJobs] = useState([]);

  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    fetchStats();
    fetchJobs();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getStats(user_id);
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await getOpportunities();
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
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

      <hr className="border-gray-200" />

      {/* Recent Opportunities Wrapper */}
      <div>
        <div className="flex items-center justify-between mb-6">
           <h2 className="text-gray-800 text-xl font-semibold">Fresh Opportunities</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {jobs.slice(0, 6).map((job) => (
             <OpportunityCard key={job.opportunity_id} job={job} />
          ))}
        </div>
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