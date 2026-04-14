import { useEffect, useState } from "react";
import axios from "axios";

export default function Selected() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchSelected();
  }, []);

  const fetchSelected = async () => {
    const res = await axios.get("http://localhost:5000/api/student/selected");
    setData(res.data);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Selected Students</h2>

      <div className="bg-white rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Company</th>
              <th className="p-4 text-left">Roll No</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.selection_id} className="border-t">
                <td className="p-4">{item.company_name}</td>
                <td className="p-4">{item.roll_no}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}