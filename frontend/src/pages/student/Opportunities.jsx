import { useEffect, useState } from "react";
import { getOpportunities, applyOpportunity, getStudentApplications } from "../../services/api";
import { Briefcase, Calendar, MapPin, GraduationCap, Users, Star } from "lucide-react";
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
      const msg = err?.response?.data?.error || "Failed to apply. Please try again.";
      alert(msg);
    }
  };

  const isDeadlinePassed = (dateString) => {
    if (!dateString) return false;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const deadline = new Date(dateString);
    deadline.setHours(0, 0, 0, 0);
    return now > deadline;
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.length > 0 ? (
          items.map((job) => {
            const hasApplied = appliedJobs.has(job.opportunity_id);
            const eligible = isEligible(job);
            const deadlinePassed = isDeadlinePassed(job.deadline);

            return (
              <div
                key={job.opportunity_id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 pr-2">
                    <h3 className="font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-gray-500 font-semibold text-xs mt-1 flex items-center gap-1">
                      <Briefcase size={12} className="text-gray-400" />
                      {job.company_name}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] ${bgColor} ${textColor} rounded-lg h-max font-black uppercase tracking-wider shadow-sm`}>
                    {job.type}
                  </span>
                </div>

                <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                  {job.description}
                </p>

                {/* Eligibility - Structured Rows */}
                <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-100 flex-grow group-hover:bg-white transition-colors space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1">Eligibility</p>
                  
                  {!job.branches && !job.years && !job.min_cgpa ? (
                    <div className="flex items-center gap-2 text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-md w-fit">
                      <Users size={14} />
                      Open to All
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {job.branches && (
                        <div className="flex items-start gap-2">
                          <Users size={14} className="text-gray-400 mt-0.5 shrink-0" />
                          <div className="flex flex-wrap gap-1.5">
                            {job.branches.split(',').map(b => b.trim()).map((b, i) => (
                              <span key={i} className="text-[10px] bg-white text-indigo-600 px-2 py-0.5 rounded shadow-sm border border-indigo-50 font-bold uppercase">{b}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {job.years && (
                        <div className="flex items-center gap-2">
                          <GraduationCap size={14} className="text-blue-400 shrink-0" />
                          <div className="flex flex-wrap gap-1.5 focus:outline-none">
                            {job.years.split(',').map(y => y.trim()).map((y, i) => (
                              <span key={i} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">Batch {y}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {job.min_cgpa && parseFloat(job.min_cgpa) > 0 && (
                        <div className="flex items-center gap-2">
                          <Star size={14} className="text-amber-400 shrink-0" fill="currentColor" />
                          <span className="text-[10px] text-gray-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-100 uppercase tracking-tighter">
                            Min. CGPA: <span className="text-amber-700">{parseFloat(job.min_cgpa).toFixed(1)}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2.5 mb-6">
                  <div className="flex items-center gap-2.5 text-xs text-gray-500 font-medium bg-gray-50 p-2 rounded-lg">
                    <MapPin size={16} className="text-indigo-400" />
                    {job.location || "Remote / India"}
                  </div>
                  <div className={`flex items-center gap-2.5 text-xs font-bold p-2 rounded-lg ${deadlinePassed ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-700'}`}>
                    <Calendar size={16} />
                    <span className="flex-grow">Deadline: {formatDate(job.deadline)}</span>
                    {deadlinePassed && <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded font-black uppercase">Expired</span>}
                  </div>
                </div>

                <div className="mt-auto">
                  {hasApplied ? (
                    <div className="w-full bg-green-50 text-green-600 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-center border-2 border-green-200 flex items-center justify-center gap-2">
                      <Users size={16} />
                      Applied Successfully
                    </div>
                  ) : deadlinePassed ? (
                    <div className="w-full bg-gray-100 text-gray-400 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-center border border-gray-200">
                      Opportunity Closed
                    </div>
                  ) : eligible ? (
                    <button 
                      onClick={() => handleApply(job)} 
                      className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 active:scale-95"
                    >
                      Apply Now
                    </button>
                  ) : (
                    <div className="w-full bg-red-50 text-red-500 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-center border border-red-100">
                      Not Eligible
                    </div>
                  )}
                </div>
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