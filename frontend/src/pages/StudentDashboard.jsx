import { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import StatCard from "../components/dashboard/StatCard";
import OpportunityCard from "../components/dashboard/OpportunityCard";
import ApplicationTable from "../components/dashboard/ApplicationTable";

import { getStats, getOpportunities, getApplications } from "../services/api";

function StudentDashboard() {
  const [stats, setStats] = useState({});
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);

  const user_id = localStorage.getItem("user_id");
  const roll_no = localStorage.getItem("roll_no");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const statsRes = await getStats(user_id);
    const jobsRes = await getOpportunities();
    const appsRes = await getApplications(roll_no);

    setStats(statsRes.data);
    setJobs(jobsRes.data);
    setApps(appsRes.data);
  };

  return (
    <div className="flex bg-[#f6f7fb] h-screen">
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6">
          Welcome back 👋
        </h1>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard title="Opportunities" value={stats.total_opportunities} />
          <StatCard title="Applied" value={stats.applied} />
          <StatCard title="Shortlisted" value={stats.shortlisted} />
          <StatCard title="Selected" value={stats.selected} />
        </div>

        {/* JOBS */}
        <h2 className="text-lg font-semibold mb-3">Latest Opportunities</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {jobs.slice(0, 6).map((job) => (
            <OpportunityCard key={job.opportunity_id} job={job} />
          ))}
        </div>

        {/* APPLICATIONS */}
        <ApplicationTable data={apps} />
      </div>
    </div>
  );
}

export default StudentDashboard;