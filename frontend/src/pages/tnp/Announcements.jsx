import { useEffect, useState } from "react";
import API from "../../services/api";

export default function Announcements() {
  const [data, setData] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await API.get("/announcements");
    setData(res.data);
  };

  const addAnnouncement = async () => {
    await API.post("/announcements", { message: msg });
    setMsg("");
    fetchData();
  };

  return (
    <div>
      <h2>Announcements</h2>

      <input value={msg} onChange={(e) => setMsg(e.target.value)} />
      <button onClick={addAnnouncement}>Add</button>

      {data.map((a) => (
        <div key={a.announcement_id}>{a.message}</div>
      ))}
    </div>
  );
}