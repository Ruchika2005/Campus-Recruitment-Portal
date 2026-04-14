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

export default function TNPDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/tnp/stats");
        setStats(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Students: {stats.total_students}</p>
      <p>Opportunities: {stats.total_opportunities}</p>
      <p>Applications: {stats.total_applications}</p>
      <p>Placement Rate: {stats.placement_rate}%</p>
    </div>
  );
}