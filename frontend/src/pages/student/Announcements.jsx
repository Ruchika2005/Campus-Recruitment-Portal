import { useEffect, useState } from "react";
import axios from "axios";

export default function Announcements() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const res = await axios.get("http://localhost:5000/api/student/announcements");
    setData(res.data);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Announcements</h2>

      {data.map((item) => (
        <div key={item.announcement_id} className="bg-white p-5 rounded-xl shadow-sm">
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-gray-600">{item.message}</p>
        </div>
      ))}
    </div>
  );
}