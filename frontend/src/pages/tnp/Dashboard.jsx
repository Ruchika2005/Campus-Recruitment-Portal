// import { useEffect, useState } from "react";
// import API from "../../services/api";
// import { Users, Briefcase, FileText, TrendingUp } from "lucide-react";

// export default function TNPDashboard() {
//   const [stats, setStats] = useState({
//     students: 0,
//     opportunities: 0,
//     applications: 0,
//     placementRate: 0,
//   });

//   useEffect(() => {
//   const fetchStats = async () => {
//     try {
//       const res = await API.get("/tnp/stats");

//       setStats({
//         students: res.data.total_students,
//         opportunities: res.data.total_opportunities,
//         applications: res.data.total_applications,
//         placementRate: res.data.placement_rate,
//       });

//     } catch (err) {
//       console.log(err);
//     }
//   };

//   fetchStats();
// }, []);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//       <Stat title="Students" value={stats.students} icon={Users} />
//       <Stat title="Opportunities" value={stats.opportunities} icon={Briefcase} />
//       <Stat title="Applications" value={stats.applications} icon={FileText} />
//       <Stat title="Placement Rate" value={stats.placementRate + "%"} icon={TrendingUp} />
//     </div>
//   );
// }

// function Stat({ title, value, icon: Icon }) {
//   return (
//     <div className="bg-white p-6 rounded-xl shadow">
//       <Icon />
//       <h2 className="text-2xl font-bold">{value}</h2>
//       <p>{title}</p>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import API from "../../services/api";
import { 
  Users, 
  Briefcase, 
  FileCheck, 
  TrendingUp, 
  ArrowUpRight,
  Activity,
  Calendar,
  GraduationCap
} from "lucide-react";

export default function TNPDashboard() {
  const [stats, setStats] = useState({
    total_students: 0,
    total_opportunities: 0,
    total_applications: 0,
    placement_rate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/tnp/stats");
        setStats(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Active Students",
      value: (stats.total_2026 || 0) + (stats.total_2027 || 0),
      icon: Users,
      color: "from-blue-500 to-indigo-600",
      description: "Batches 2026 & 2027"
    },
    {
      title: "Opportunities",
      value: stats.total_opportunities || 0,
      icon: Briefcase,
      color: "from-emerald-500 to-teal-600",
      description: "Active drives"
    },
    {
      title: "Applications",
      value: stats.total_applications || 0,
      icon: FileCheck,
      color: "from-orange-500 to-rose-600",
      description: "All submissions"
    },
    {
      title: "Placement Rate",
      value: `${stats.placement_rate || 0}%`,
      icon: TrendingUp,
      color: "from-purple-500 to-fuchsia-600",
      description: "Batch 2026 (FTE)"
    },
    {
      title: "Internship Rate",
      value: `${stats.internship_rate || 0}%`,
      icon: Activity,
      color: "from-pink-500 to-rose-600",
      description: "Batch 2027 (Intern)"
    }
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1 font-medium">Real-time batch statistics (Excluding 1st/2nd years)</p>
        </div>
        <div className="text-sm font-bold text-indigo-600 bg-white px-4 py-2 rounded-2xl flex items-center gap-2 border border-gray-100 shadow-sm">
          <Calendar size={16} />
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-5 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500`} />
            
            <div className="flex items-center justify-between mb-4">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg shadow-indigo-100`}>
                <stat.icon size={28} />
              </div>
              <ArrowUpRight className="text-gray-300 group-hover:text-indigo-500 transition-colors" size={24} />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-4xl font-black text-gray-800 tracking-tight">
                {stat.value}
              </h3>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {stat.title}
              </p>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-50 flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
              <Activity size={14} className="text-indigo-400" />
              {stat.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}