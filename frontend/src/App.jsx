// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";
// import CompleteProfile from "./pages/auth/CompleteProfile";

// import { DashboardLayout } from "./components/layout/DashboardLayout";

// // STUDENT
// import StudentDashboard from "./pages/student/Dashboard";
// import OpportunitiesPage from "./pages/student/Opportunities";
// import ApplicationsPage from "./pages/student/Applications";
// import Profile from "./pages/student/Profile";
// import Announcements from "./pages/student/Announcements";
// import Selected from "./pages/student/Selected";

// // TNP (ADMIN)
// import TNPDashboard from "./pages/tnp/Dashboard";
// import ManageApplications from "./pages/tnp/Applications";
// import AddOpportunity from "./pages/tnp/AddOpportunity";
// import Announcements2 from "./pages/tnp/Announcements";

// const ProtectedRoute = ({ children, role }) => {
//   const userRole = localStorage.getItem("role");

//   if (!userRole) {
//     return <Navigate to="/" />;
//   }

//   if (role && userRole !== role) {
//     return <Navigate to={userRole === "admin" ? "/admin" : "/student"} />;
//   }

//   return children;
// };

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* PUBLIC */}
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/complete-profile" element={<CompleteProfile />} />

//         {/* STUDENT */}
//         <Route
//           path="/student"
//           element={
//             <ProtectedRoute role="student">
//               <DashboardLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<StudentDashboard />} />
//           <Route path="opportunities" element={<OpportunitiesPage />} />
//           <Route path="applications" element={<ApplicationsPage />} />
//           <Route path="profile" element={<Profile />} />
//           <Route path="announcements" element={<Announcements />} />
//           <Route path="selected" element={<Selected />} />
//         </Route>

//         {/* ADMIN (TNP) */}
//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute role="admin">
//               <DashboardLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<TNPDashboard />} />
//           <Route path="applications" element={<ManageApplications />} />
//           <Route path="add-opportunity" element={<AddOpportunity />} />
//           <Route path="announcements" element={<Announcements2 />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CompleteProfile from "./pages/auth/CompleteProfile";

import { DashboardLayout } from "./components/layout/DashboardLayout";

// STUDENT
import StudentDashboard from "./pages/student/Dashboard";
import OpportunitiesPage from "./pages/student/Opportunities";
import ApplicationsPage from "./pages/student/Applications";
import Profile from "./pages/student/Profile";
import Announcements from "./pages/student/Announcements";
import Selected from "./pages/student/Selected";

// ADMIN
import TNPDashboard from "./pages/tnp/Dashboard";
import ManageApplications from "./pages/tnp/Applications";
import AddOpportunity from "./pages/tnp/AddOpportunity";
import Announcements2 from "./pages/tnp/Announcements";
import StudentsList from "./pages/tnp/StudentsList";
import Settings from "./pages/common/Settings";

// ✅ PROTECTED ROUTE
const ProtectedRoute = ({ children, role }) => {
  const userRole = localStorage.getItem("role");

  if (!userRole) return <Navigate to="/" />;

  if (role && userRole !== role) {
    return <Navigate to={userRole === "admin" ? "/admin" : "/student"} />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />

        {/* STUDENT */}
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="opportunities" element={<OpportunitiesPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="selected" element={<Selected />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TNPDashboard />} />
          <Route path="applications" element={<ManageApplications />} />
          <Route path="add-opportunity" element={<AddOpportunity />} />
          <Route path="announcements" element={<Announcements2 />} />
          <Route path="students" element={<StudentsList />} />
          <Route path="settings" element={<Settings />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;