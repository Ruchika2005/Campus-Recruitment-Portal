import { useEffect, useState } from "react";
import axios from "axios";
import { Megaphone, Bell } from "lucide-react";

export default function Announcements() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/student/announcements");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Megaphone className="text-indigo-600" /> 
          Announcements
        </h2>
        <p className="text-gray-600 mt-1">Stay updated with the latest campus news and placement drives.</p>
      </div>

      <hr className="border-gray-200" />

      {data.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Bell className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 font-medium">No active announcements at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.slice().reverse().map((item) => (
            <div 
              key={item.announcement_id} 
              className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-50 hover:shadow-md transition group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-indigo-50 p-3 rounded-xl group-hover:bg-indigo-100 transition">
                  <Bell className="text-indigo-600" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 leading-tight">{item.title}</h3>
                  {item.created_at && (
                    <p className="text-xs text-gray-400 mt-1">{formatDate(item.created_at)}</p>
                  )}
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{item.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}