import { useEffect, useState } from "react";
import { getOpportunities } from "../../services/api";
import { Briefcase, MapPin, Calendar, Search, Users, GraduationCap, Star, Filter } from "lucide-react";

const TYPE_COLORS = {
  internship: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-400" },
  placement:  { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-400"   },
  hackathon:  { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-400"  },
  program:    { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400" },
};

export default function ManageOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const res = await getOpportunities();
      setOpportunities(res.data);
    } catch (err) {
      console.error("Failed to fetch opportunities:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No Deadline";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  const isDeadlinePassed = (dateString) => {
    if (!dateString) return false;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const d = new Date(dateString);
    d.setHours(0, 0, 0, 0);
    return now > d;
  };

  const filtered = opportunities.filter((o) => {
    const matchType = filterType === "all" || o.type === filterType;
    const q = search.toLowerCase();
    const matchSearch =
      o.title?.toLowerCase().includes(q) ||
      o.company_name?.toLowerCase().includes(q) ||
      o.location?.toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  const counts = {
    all: opportunities.length,
    internship: opportunities.filter(o => o.type === "internship").length,
    placement:  opportunities.filter(o => o.type === "placement").length,
    hackathon:  opportunities.filter(o => o.type === "hackathon").length,
    program:    opportunities.filter(o => o.type === "program").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">All Opportunities</h2>
          <p className="text-gray-500 mt-1 text-sm">
            {opportunities.length} opportunity{opportunities.length !== 1 ? "s" : ""} posted on the portal
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "All", key: "all", color: "bg-gray-800 text-white" },
          { label: "Internships", key: "internship", color: "bg-indigo-600 text-white" },
          { label: "Placements", key: "placement", color: "bg-blue-600 text-white" },
          { label: "Hackathons", key: "hackathon", color: "bg-green-600 text-white" },
          { label: "Programs", key: "program", color: "bg-purple-600 text-white" },
        ].map((card) => (
          <button
            key={card.key}
            onClick={() => setFilterType(card.key)}
            className={`rounded-xl px-4 py-3 text-left transition-all shadow-sm border-2 ${
              filterType === card.key
                ? `${card.color} border-transparent`
                : "bg-white text-gray-700 border-gray-100 hover:border-gray-300"
            }`}
          >
            <p className="text-xl font-bold">{counts[card.key]}</p>
            <p className="text-xs font-medium mt-0.5 opacity-80">{card.label}</p>
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex gap-3 items-center shadow-sm">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search by title, company or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Filter size={15} />
          <span>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Opportunities Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading opportunities...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No opportunities found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((opp) => {
            const colors = TYPE_COLORS[opp.type] || TYPE_COLORS.internship;
            const passed = isDeadlinePassed(opp.deadline);

            return (
              <div
                key={opp.opportunity_id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-5 flex flex-col"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 pr-2">
                    <h3 className="font-semibold text-gray-800 text-base leading-snug">{opp.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5 font-medium">{opp.company_name}</p>
                  </div>
                  <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${colors.bg} ${colors.text}`}>
                    {opp.type}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{opp.description}</p>

                {/* Eligibility */}
                <div className="bg-gray-50 rounded-lg p-2.5 mb-3 border border-gray-100 space-y-1.5">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Eligibility</p>
                  {!opp.branches && !opp.years && !opp.min_cgpa ? (
                    <p className="text-xs text-green-600 font-medium">✓ Open to all students</p>
                  ) : (
                    <>
                      {opp.branches && (
                        <div className="flex items-start gap-1.5">
                          <Users size={11} className="text-gray-400 mt-0.5 shrink-0" />
                          <div className="flex flex-wrap gap-1">
                            {opp.branches.split(",").map(b => b.trim()).map((b, i) => (
                              <span key={i} className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-full font-medium uppercase">{b}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {opp.years && (
                        <div className="flex items-start gap-1.5">
                          <GraduationCap size={11} className="text-gray-400 mt-0.5 shrink-0" />
                          <div className="flex flex-wrap gap-1">
                            {opp.years.split(",").map(y => y.trim()).map((y, i) => (
                              <span key={i} className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">Year {y}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {opp.min_cgpa && parseFloat(opp.min_cgpa) > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Star size={11} className="text-gray-400" />
                          <span className="text-[10px] text-gray-600">Min. CGPA: <strong>{parseFloat(opp.min_cgpa).toFixed(1)}</strong></span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Info Row */}
                <div className="space-y-1.5 text-xs text-gray-500 mt-auto">
                  {opp.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-gray-400" />
                      {opp.location}
                    </div>
                  )}
                  <div className={`flex items-center gap-1.5 font-medium ${passed ? "text-red-500" : "text-indigo-600"}`}>
                    <Calendar size={12} />
                    Deadline: {formatDate(opp.deadline)}
                    {passed && (
                      <span className="ml-1 text-[10px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full font-semibold">Closed</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
