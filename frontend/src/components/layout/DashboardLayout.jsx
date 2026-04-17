// import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   LayoutDashboard,
//   User,
//   Briefcase,
//   FileText,
//   Megaphone,
//   Users,
//   LogOut,
//   GraduationCap,
//   Bell,
//   Search,
// } from "lucide-react";

// export function DashboardLayout() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const studentMenuItems = [
//     { icon: LayoutDashboard, label: "Dashboard", path: "/student" },
//     { icon: User, label: "My Profile", path: "/student/profile" },
//     { icon: Briefcase, label: "Opportunities", path: "/student/opportunities" },
//     { icon: FileText, label: "My Applications", path: "/student/applications" },
//     { icon: Megaphone, label: "Announcements", path: "/student/announcements" },
//     { icon: Users, label: "Selected Students", path: "/student/selected" },
//   ];

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   return (
//     <div className="flex h-screen bg-[#f6f7fb] relative overflow-hidden">
//       {/* Background blobs */}
//       <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-indigo-200 rounded-full blur-3xl opacity-20" />
//       <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-blue-200 rounded-full blur-3xl opacity-20" />

//       {/* Sidebar */}
//       <aside className="w-72 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 flex flex-col shadow-sm z-10">
//         <div className="p-6 border-b border-gray-200/50">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center">
//               <GraduationCap size={22} className="text-white" />
//             </div>
//             <div>
//               <h1 className="text-gray-800 font-semibold">Campus Recruit</h1>
//               <p className="text-xs text-gray-500">Student Portal</p>
//             </div>
//           </div>
//         </div>

//         <nav className="flex-1 p-4">
//           <ul className="space-y-2">
//             {studentMenuItems.map((item) => {
//               const Icon = item.icon;
//               const isActive = location.pathname === item.path;

//               return (
//                 <li key={item.path}>
//                   <Link
//                     to={item.path}
//                     className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
//                       isActive
//                         ? "bg-indigo-500 text-white"
//                         : "text-gray-700 hover:bg-gray-100"
//                     }`}
//                   >
//                     <Icon size={20} />
//                     <span className="text-sm">{item.label}</span>
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>

//         <div className="p-4 border-t">
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 w-full"
//           >
//             <LogOut size={20} />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main */}
//       <div className="flex-1 flex flex-col">
//         {/* Topbar */}
//         <header className="bg-white/80 backdrop-blur-sm border-b px-8 py-4 flex justify-between">
//           <div>
//             <h2 className="text-gray-800 font-semibold">Welcome back!</h2>
//             <p className="text-sm text-gray-600">Student Dashboard</p>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <Search size={16} className="absolute left-3 top-3 text-gray-400" />
//               <input
//                 className="pl-10 pr-4 py-2 bg-gray-100 rounded-xl"
//                 placeholder="Search..."
//               />
//             </div>

//             <Bell className="text-gray-600" />

//             <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
//               <User className="text-white" size={18} />
//             </div>
//           </div>
//         </header>

//         {/* Page content */}
//         <main className="flex-1 p-8 overflow-y-auto">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  Megaphone,
  Users,
  LogOut,
  GraduationCap,
  Bell,
  Search,
} from "lucide-react";

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  // ✅ STUDENT MENU (same as before)
  const studentMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/student" },
    { icon: User, label: "My Profile", path: "/student/profile" },
    { icon: Briefcase, label: "Opportunities", path: "/student/opportunities" },
    { icon: FileText, label: "My Applications", path: "/student/applications" },
    { icon: Megaphone, label: "Announcements", path: "/student/announcements" },
    { icon: Users, label: "Selected Students", path: "/student/selected" },
  ];

  // ✅ ADMIN MENU (NEW but SAME UI STYLE)
  const adminMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: FileText, label: "Manage Applications", path: "/admin/applications" },
    { icon: Briefcase, label: "Add Opportunity", path: "/admin/add-opportunity" },
    { icon: Megaphone, label: "Announcements", path: "/admin/announcements" },
    { icon: Users, label: "All Students", path: "/admin/students" },
  ];

  // ✅ SWITCH MENU BASED ON ROLE
  const menuItems = role === "admin" ? adminMenuItems : studentMenuItems;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-[#f6f7fb] relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-indigo-200 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-blue-200 rounded-full blur-3xl opacity-20" />

      {/* Sidebar */}
      <aside className="w-72 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 flex flex-col shadow-sm z-10">
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-gray-800 font-semibold">Campus Recruit</h1>
              <p className="text-xs text-gray-500">
                {role === "admin" ? "TNP Portal" : "Student Portal"}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                      isActive
                        ? "bg-indigo-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 w-full"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white/80 backdrop-blur-sm border-b px-8 py-4 flex justify-between">
          <div>
            <h2 className="text-gray-800 font-semibold">Welcome back!</h2>
            <p className="text-sm text-gray-600">
              {role === "admin" ? "Admin Dashboard" : "Student Dashboard"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="group relative">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center cursor-pointer hover:bg-indigo-600 transition-colors">
                <User className="text-white" size={18} />
              </div>
              
              {/* Profile Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <button 
                  onClick={() => navigate(role === 'admin' ? '/admin/settings' : '/student/settings')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}