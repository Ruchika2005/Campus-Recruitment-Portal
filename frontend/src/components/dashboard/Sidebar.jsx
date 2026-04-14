import { LayoutDashboard, Briefcase, FileText, User } from "lucide-react";

function Sidebar() {
  return (
    <div className="w-64 bg-white h-screen p-5 shadow-sm">
      <h1 className="text-xl font-bold text-indigo-600 mb-10">CRP</h1>

      <ul className="space-y-6 text-gray-600">
        <li className="flex items-center gap-3"><LayoutDashboard /> Dashboard</li>
        <li className="flex items-center gap-3"><Briefcase /> Opportunities</li>
        <li className="flex items-center gap-3"><FileText /> Applications</li>
        <li className="flex items-center gap-3"><User /> Profile</li>
      </ul>
    </div>
  );
}

export default Sidebar;