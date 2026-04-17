import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Users, 
  Search, 
  ExternalLink, 
  Mail, 
  GraduationCap, 
  Calendar, 
  Activity, 
  X,
  ChevronRight,
  TrendingUp
} from "lucide-react";

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activity, setActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tnp/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivity = async (roll_no) => {
    setActivityLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/tnp/students/${roll_no}/activity`);
      setActivity(res.data);
    } catch (err) {
      console.error("Failed to fetch activity", err);
    } finally {
      setActivityLoading(false);
    }
  };

  const openActivity = (student) => {
    setSelectedStudent(student);
    fetchActivity(student.roll_no);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.roll_no.toLowerCase().includes(search.toLowerCase()) ||
    s.branch.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="text-indigo-600" />
            Student Directory
          </h1>
          <p className="text-gray-500 text-sm">Manage and monitor all registered students</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, roll no, or branch..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Student Info</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Academic Details</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Applications</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.map((student) => (
                <tr key={student.roll_no} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{student.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail size={12} /> {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <GraduationCap size={14} className="text-gray-400" />
                        <span className="font-medium">{student.branch}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-500">{student.roll_no}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar size={12} /> Year: {student.year}
                        <TrendingUp size={12} className="ml-2" /> CGPA: <span className="text-indigo-600 font-semibold">{student.cgpa}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        student.app_count > 0 ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-50 text-gray-400 border border-gray-100'
                      }`}>
                        {student.app_count} Applied
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => openActivity(student)}
                      className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <Activity size={16} />
                      Activity
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredStudents.length === 0 && (
          <div className="py-20 text-center">
            <Users size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500">No students found matching your search.</p>
          </div>
        )}
      </div>

      {/* ACTIVITY MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <Activity size={24} />
                <div>
                  <h3 className="font-bold text-lg leading-tight">{selectedStudent.name}'s Activity</h3>
                  <div className="flex items-center gap-2 text-indigo-100 text-xs">
                    <span>{selectedStudent.roll_no} • {selectedStudent.branch}</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold">
                      {selectedStudent.app_count} Applications
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {activityLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
              ) : activity.length > 0 ? (
                <div className="relative space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                  {activity.map((item, idx) => (
                    <div key={idx} className="relative pl-8 group">
                      <div className="absolute left-[3px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-indigo-500 z-10 group-hover:scale-125 transition-transform"></div>
                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 group-hover:border-indigo-100 group-hover:bg-indigo-50/30 transition-all">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-gray-800">{item.company_name}</h4>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            item.status === 'selected' ? 'bg-green-100 text-green-700' :
                            item.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.title}</p>
                        <div className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(item.created_at).toLocaleDateString('en-US', { 
                            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ExternalLink size={24} className="text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">No activity found for this student.</p>
                  <p className="text-gray-400 text-sm">They haven't applied to any opportunities yet.</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t flex justify-end">
              <button 
                onClick={() => setSelectedStudent(null)}
                className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
