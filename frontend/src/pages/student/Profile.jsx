import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [data, setData] = useState({});

  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await axios.get(`http://localhost:5000/api/student/profile/${user_id}`);
    setData(res.data);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">My Profile</h2>

      <div className="space-y-2 text-gray-700">
        <p><strong>Name:</strong> {data.name}</p>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Roll No:</strong> {data.roll_no}</p>
        <p><strong>Branch:</strong> {data.branch}</p>
        <p><strong>Year:</strong> {data.year}</p>
        <p><strong>CGPA:</strong> {data.cgpa}</p>
      </div>
    </div>
  );
}