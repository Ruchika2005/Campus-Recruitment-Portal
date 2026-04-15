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

  const formatDate = (dateString) => {
    if (!dateString) return "No Deadline";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const internships = jobs.filter(j => j.type === 'internship');
  const placements = jobs.filter(j => j.type === 'placement');
  const hackathons = jobs.filter(j => j.type === 'hackathon');
  const programs = jobs.filter(j => j.type === 'program');

  const renderSection = (title, items, bgColor, textColor) => (
    <section className="mb-10">
      <h3 className={`text-lg font-semibold ${textColor} mb-4 ${bgColor} inline-block px-4 py-1 rounded-full`}>
        {title}
      </h3>
      
      <div className="grid grid-cols-2 gap-6">
        {items.length > 0 ? (
          items.map((job) => (
            <div
              key={job.opportunity_id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{job.title}</h3>
                  <p className="text-gray-500 font-medium">{job.company_name}</p>
                </div>

                <span className={`px-3 py-1 text-sm ${bgColor} ${textColor} rounded-full h-max font-medium capitalize`}>
                  {job.type}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-5 break-words line-clamp-2">
                {job.description}
              </p>

              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex gap-2 items-center">
                  <MapPin size={16} className="text-gray-400" />
                  {job.location || "India"}
                </div>

                <div className="flex gap-2 items-center">
                  <Briefcase size={16} className="text-gray-400" />
                  <span className="capitalize">{job.type}</span>
                </div>

                <div className="flex gap-2 items-center text-indigo-600 font-medium">
                  <Calendar size={16} />
                  Deadline: {formatDate(job.deadline)}
                </div>
              </div>

              <button className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium">
                Apply Now
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic px-2">No {title.toLowerCase()} available right now.</p>
        )}
      </div>
    </section>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Latest Opportunities</h2>
        <p className="text-gray-600 mt-1">
          Browse and apply to the latest openings curated for you.
        </p>
      </div>

      <hr className="border-gray-200" />

      {/* RENDER CATEGORY SECTIONS */}
      {renderSection("Internships", internships, "bg-indigo-50", "text-indigo-700")}
      {renderSection("Placements", placements, "bg-blue-50", "text-blue-700")}
      {renderSection("Hackathons", hackathons, "bg-green-50", "text-green-700")}
      {renderSection("Programs", programs, "bg-purple-50", "text-purple-700")}
      
    </div>
  );
}