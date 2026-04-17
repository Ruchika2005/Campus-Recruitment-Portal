import { useEffect, useState } from "react";
import { getOpportunities, applyOpportunity, getStudentApplications } from "../../services/api";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import axios from "axios";

export default function OpportunitiesPage() {
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const jobsRes = await getOpportunities();
      setJobs(jobsRes.data);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }

    try {
      if (user_id) {
        const profRes = await axios.get(`http://localhost:5000/api/student/profile/${user_id}`);
        const prof = profRes.data;
        if (prof?.roll_no) {
          setProfile(prof);
          const appsRes = await getStudentApplications(prof.roll_no);
          setAppliedJobs(new Set(appsRes.data.map(a => a.opportunity_id)));
        }
      }
    } catch (err) {
      console.error("Failed to fetch profile/applications:", err);
    }
  };

  const handleApply = async (job) => {
    if(!profile) return;
    try {
      await applyOpportunity({
        user_id,
        opportunity_id: job.opportunity_id,
        roll_no: profile.roll_no
      });
      setAppliedJobs(new Set([...appliedJobs, job.opportunity_id]));
      alert("Applied Successfully!");
    } catch(err) {
      alert("Failed to apply");
    }
  };

  const isEligible = (job) => {
    if(!profile) return false;
    
    // Safety check: if job has no eligibility rows, assume eligible for everyone
    if (!job.branches && !job.years && !job.min_cgpa) return true;

    const branches = job.branches 
      ? job.branches.split(',').map(b => b.trim().toLowerCase()) 
      : [];
      
    const years = job.years 
      ? job.years.split(',').map(y => parseInt(y.trim())) 
      : [];
      
    const minCgpa = parseFloat(job.min_cgpa || 0);

    const userBranch = profile.branch ? profile.branch.trim().toLowerCase() : "";
    const userYear = parseInt(profile.year || 0);
    const userCgpa = parseFloat(profile.cgpa || 0);

    const matchBranch = branches.includes(userBranch) || branches.includes('all') || branches.length === 0;
    const matchYear = years.includes(userYear) || years.length === 0;
    const matchCgpa = userCgpa >= minCgpa;

    return matchBranch && matchYear && matchCgpa;
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
          items.map((job) => {
            const hasApplied = appliedJobs.has(job.opportunity_id);
            const eligible = isEligible(job);

            return (
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

                {hasApplied ? (
                  <button disabled className="w-full bg-green-500 text-white py-2.5 rounded-lg font-medium cursor-not-allowed">
                    Applied ✓
                  </button>
                ) : eligible ? (
                  <button onClick={() => handleApply(job)} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium">
                    Apply Now
                  </button>
                ) : (
                  <button disabled className="w-full bg-gray-300 text-gray-500 py-2.5 rounded-lg font-medium cursor-not-allowed">
                    You are not eligible
                  </button>
                )}
              </div>
            )
          })
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