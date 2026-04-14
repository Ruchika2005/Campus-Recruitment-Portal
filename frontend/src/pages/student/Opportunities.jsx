import { useEffect, useState } from "react";
import { getOpportunities } from "../../services/api";
import { Briefcase, Calendar, MapPin } from "lucide-react";

export default function OpportunitiesPage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await getOpportunities();
    setJobs(res.data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Opportunities</h2>
        <p className="text-gray-600 text-sm">
          Browse available jobs
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div
            key={job.opportunity_id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div className="flex justify-between mb-3">
              <div>
                <h3 className="font-semibold">{job.company_name}</h3>
                <p className="text-gray-600 text-sm">{job.title}</p>
              </div>

              <span className="px-3 py-1 text-sm bg-indigo-100 text-indigo-600 rounded-full">
                {job.type}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              {job.description}
            </p>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex gap-2 items-center">
                <MapPin size={16} />
                {job.location || "India"}
              </div>

              <div className="flex gap-2 items-center">
                <Briefcase size={16} />
                {job.type}
              </div>

              <div className="flex gap-2 items-center">
                <Calendar size={16} />
                {job.deadline}
              </div>
            </div>

            <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}