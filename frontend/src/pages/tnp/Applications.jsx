import { useEffect, useState } from "react";
import { getAllAdminApplications, updateApplicationStatus } from "../../services/api";
import { Download, Briefcase, FileText } from "lucide-react";

export default function ManageApplications() {
  const [apps, setApps] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const res = await getAllAdminApplications();
      setApps(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);
      fetchApps();
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = (group) => {
    const headers = ["Application ID", "Roll No", "Name", "Branch", "CGPA", "Company", "Job Title", "Status", "Resume Link"];
    
    const rows = group.applicants.map(a => [
      a.application_id, 
      a.roll_no, 
      a.name, 
      a.branch, 
      a.cgpa, 
      a.company_name, 
      a.title, 
      a.status,
      a.resume ? `http://${window.location.hostname}:5000${a.resume}` : "No Resume"
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map((cell, idx) => {
        // Don't wrap the last column (Resume URL) in quotes to help Excel/Sheets auto-link it
        if (idx === headers.length - 1 && cell.startsWith("http")) return cell;
        return `"${cell || ''}"`;
      }).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `applications_${group.company_name || 'opportunity'}_${group.opportunity_id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const uniqueCompanies = [...new Set(apps.map(a => a.company_name))];

  const filteredApps = apps.filter(app => selectedCompany ? app.company_name === selectedCompany : true);

  const groupedApps = filteredApps.reduce((acc, app) => {
    if (!acc[app.opportunity_id]) {
      acc[app.opportunity_id] = {
        opportunity_id: app.opportunity_id,
        title: app.title,
        company_name: app.company_name,
        type: app.type,
        applicants: []
      };
    }
    acc[app.opportunity_id].applicants.push(app);
    return acc;
  }, {});

  const groupedAppsList = Object.values(groupedApps);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Applications</h2>
          <p className="text-gray-500 mt-1 text-sm">Review, shortlist, and manage all student applicants.</p>
        </div>
        
        <div className="flex gap-4">
          <select 
            value={selectedCompany} 
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 font-medium text-gray-700"
          >
            <option value="">All Companies</option>
            {uniqueCompanies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-12">
        {groupedAppsList.map((group) => (
          <div key={group.opportunity_id} className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-white p-5 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{group.title} at {group.company_name}</h3>
                <p className="text-sm text-gray-500 font-medium mt-1">Opportunity ID: #{group.opportunity_id}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full font-medium capitalize text-sm">
                  <Briefcase size={16} />
                  {group.type || 'Job'}
                </div>
                <button onClick={() => exportCSV(group)} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition shadow-sm text-sm">
                  <Download size={14} />
                  Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200 bg-gray-50">
                    <th className="py-3 px-6 font-semibold">Student Details</th>
                    <th className="py-3 px-6 font-semibold">Branch & CGPA</th>
                    <th className="py-3 px-6 font-semibold">Current Status</th>
                    <th className="py-3 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="text-sm bg-white">
                  {group.applicants.map((app) => (
                    <tr key={app.application_id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-4 px-6">
                        <p className="font-semibold text-gray-800">{app.name}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{app.roll_no}</p>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        <span className="font-medium text-gray-700">{app.branch}</span>
                        <br/>
                        <span className="text-xs text-gray-400 font-medium">CGPA: {app.cgpa}</span>
                        {app.resume && (
                          <div className="mt-2">
                            <a 
                              href={`http://${window.location.hostname}:5000${app.resume}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded text-[10px] font-bold transition border border-indigo-100 shadow-sm"
                            >
                              <FileText size={12} />
                              View Resume
                            </a>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
                          ${app.status === 'selected' ? 'bg-green-100 text-green-700' : 
                            app.status === 'shortlisted' ? 'bg-yellow-100 text-yellow-700' : 
                            app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 flex justify-end gap-2">
                        <button onClick={() => handleUpdateStatus(app.application_id, "shortlisted")} className="text-xs px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 font-semibold transition" title="Shortlist">Shortlist</button>
                        <button onClick={() => handleUpdateStatus(app.application_id, "selected")} className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-semibold transition" title="Select">Select</button>
                        <button onClick={() => handleUpdateStatus(app.application_id, "rejected")} className="text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold transition" title="Reject">Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 mt-auto flex justify-between items-center text-xs text-gray-500 font-medium">
              <span>{group.applicants.length} Applicant{group.applicants.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        ))}
        
        {groupedAppsList.length === 0 && (
           <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
             <p className="text-gray-500 font-medium">No applications match your criteria.</p>
           </div>
        )}
      </div>
    </div>
  );
}