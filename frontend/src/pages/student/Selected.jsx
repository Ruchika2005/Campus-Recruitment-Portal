import { useEffect, useState } from "react";
import axios from "axios";
import { Briefcase } from "lucide-react";

export default function Selected() {
  const [data, setData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");

  useEffect(() => {
    fetchSelected();
  }, []);

  const fetchSelected = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/student/selected");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const uniqueCompanies = [...new Set(data.map(a => a.company_name))];

  const filteredApps = data.filter(app => selectedCompany ? app.company_name === selectedCompany : true);

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
          <h2 className="text-2xl font-bold text-gray-800">Selected Students</h2>
          <p className="text-gray-500 mt-1 text-sm">List of all students selected for various opportunities.</p>
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
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200 bg-gray-50">
                    <th className="py-3 px-6 font-semibold">Student Name</th>
                    <th className="py-3 px-6 font-semibold">Roll No</th>
                    <th className="py-3 px-6 font-semibold">Branch & CGPA</th>
                  </tr>
                </thead>

                <tbody className="text-sm bg-white">
                  {group.applicants.map((app) => (
                    <tr key={app.application_id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-4 px-6 font-semibold text-gray-800">
                        {app.name}
                      </td>
                      <td className="py-4 px-6 text-gray-500 font-medium">
                        {app.roll_no}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        <span className="font-medium text-gray-700">{app.branch}</span>
                        <br/>
                        <span className="text-xs text-gray-400 font-medium">CGPA: {app.cgpa}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 mt-auto flex justify-between items-center text-xs text-indigo-600 font-bold">
              <span>{group.applicants.length} Selected Student{group.applicants.length !== 1 ? 's' : ''} ✨</span>
            </div>
          </div>
        ))}
        
        {groupedAppsList.length === 0 && (
           <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
             <p className="text-gray-500 font-medium">No students have been selected yet.</p>
           </div>
        )}
      </div>
    </div>
  );
}