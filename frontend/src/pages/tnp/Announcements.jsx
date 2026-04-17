import { useEffect, useState } from "react";
import axios from "axios";
import { Megaphone, Trash2, Edit3, MessageSquare } from "lucide-react";

export default function AdminAnnouncements() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/student/announcements");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addAnnouncement = async () => {
    if (!title || !message) return alert("Please fill both title and message");
    try {
      await axios.post("http://localhost:5000/api/tnp/announcements", { title, message });
      setTitle("");
      setMessage("");
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tnp/announcements/${id}`);
      fetchData();
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
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-100 pb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Megaphone className="text-indigo-600" />
            Manage Announcements
          </h2>
          <p className="text-gray-500 mt-1 text-sm">Post campus news and updates directly to the student dashboard.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Announcement Form */}
        <div className="lg:col-span-1 bg-gray-50 border border-gray-200 rounded-xl p-6 h-fit sticky top-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Edit3 size={18} className="text-indigo-600" />
            New Announcement
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                placeholder="e.g. Upcoming Hackathon"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Detailed Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                placeholder="Write your announcement message here..."
              ></textarea>
            </div>

            <button 
              onClick={addAnnouncement}
              className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition"
            >
              Publish Now
            </button>
          </div>
        </div>

        {/* Existing Announcements List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MessageSquare size={18} className="text-indigo-600" />
            Recent Announcements
          </h3>
          
          {data.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
              <p className="text-gray-500 font-medium">No announcements published yet.</p>
            </div>
          ) : (
            data.slice().reverse().map((a) => (
              <div key={a.announcement_id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 break-words">{a.title}</h4>
                    {a.created_at && (
                      <p className="text-xs text-gray-400 mt-1 mb-2">{formatDate(a.created_at)}</p>
                    )}
                  </div>
                  <button 
                    onClick={() => deleteAnnouncement(a.announcement_id)}
                    className="text-red-500 p-2 hover:bg-red-50 rounded-lg transition"
                    title="Delete Announcement"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-gray-600 text-sm whitespace-pre-wrap break-words">{a.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}