import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FileText, Save, Edit2, Upload, Trash2, RefreshCw, X } from "lucide-react";

export default function Profile() {
  const [data, setData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ cgpa: "", year: "" });
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const user_id = localStorage.getItem("user_id");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await axios.get(`http://localhost:5000/api/student/profile/${user_id}`);
    setData(res.data);
    setEditForm({ cgpa: res.data.cgpa, year: res.data.year });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    try {
      await axios.put(`http://localhost:5000/api/student/profile/${user_id}`, editForm);
      setData({ ...data, ...editForm });
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("resume", selectedFile);
    try {
      const res = await axios.put(`http://localhost:5000/api/student/profile/${user_id}/resume`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setData({ ...data, resume: res.data.resume });
      alert("Resume updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update resume");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const uploadResume = () => {
    // Legacy function, replaced by auto-upload in handleFileChange
  };

  const deleteResume = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/student/profile/${user_id}/resume`);
      setData({ ...data, resume: null });
    } catch (err) {
      alert("Failed to delete resume");
    }
  };

  if (!data) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="flex items-center text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-lg transition">
            <Edit2 size={16} className="mr-2" /> Edit Profile
          </button>
        ) : (
          <div className="flex space-x-2">
            <button onClick={() => { setIsEditing(false); setEditForm({ cgpa: data.cgpa, year: data.year }); }} className="flex items-center text-gray-600 hover:text-gray-800 bg-gray-100 px-4 py-2 rounded-lg transition">
              <X size={16} className="mr-1" /> Cancel
            </button>
            <button onClick={saveProfile} className="flex items-center text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition shadow-md">
              <Save size={16} className="mr-2" /> Save
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Full Name</label>
            <p className="text-lg text-gray-800">{data.name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Email</label>
            <p className="text-lg text-gray-800">{data.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Roll No</label>
            <p className="text-lg text-gray-800">{data.roll_no}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Branch</label>
            <p className="text-lg text-gray-800">{data.branch}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Year of Graduation</label>
            {isEditing ? (
              <select name="year" value={editForm.year} onChange={handleEditChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option value="2029">2029</option>
                <option value="2028">2028</option>
                <option value="2027">2027</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            ) : (
              <p className="text-lg text-gray-800">{data.year}</p>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-500 font-semibold uppercase tracking-wider">CGPA</label>
            {isEditing ? (
              <input type="text" name="cgpa" value={editForm.cgpa} onChange={handleEditChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            ) : (
              <p className="text-lg text-gray-800">{data.cgpa}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Additional Details</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Skills</label>
            <p className="text-gray-800 bg-gray-50 p-3 rounded-lg border">{data.skills || "No skills added."}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Projects</label>
            <p className="text-gray-800 bg-gray-50 p-3 rounded-lg border whitespace-pre-wrap">{data.projects || "No projects added."}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Resume</h3>
        
        {/* Hidden file input for updating/uploading */}
        <input 
          type="file" 
          accept=".pdf,.doc,.docx" 
          onChange={handleFileChange} 
          ref={fileInputRef}
          className="hidden" 
        />

        {data.resume ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl border">
              <span className="text-gray-600 font-medium flex-grow truncate">Current Resume</span>
              
              <button 
                onClick={() => fileInputRef.current.click()} 
                disabled={isUploading}
                className="flex items-center text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-50 rounded-full transition font-medium" 
                title="Update Resume"
              >
                {isUploading ? <RefreshCw className="animate-spin" size={20} /> : <RefreshCw size={20} />}
                <span className="ml-2 hidden sm:inline">{isUploading ? 'Updating...' : 'Update'}</span>
              </button>

              <button onClick={deleteResume} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition" title="Delete Resume">
                <Trash2 size={20} />
              </button>
            </div>
            {data.resume.toLowerCase().endsWith('.pdf') ? (
              <div className="w-full h-96 border rounded-xl overflow-hidden shadow-sm bg-gray-100">
                <iframe src={`http://localhost:5000${data.resume}`} title="Resume Preview" width="100%" height="100%" />
              </div>
            ) : (
               <a href={`http://localhost:5000${data.resume}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-medium hover:underline inline-block">
                 View / Download Resume
               </a>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-xl border flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <span className="text-gray-600 font-medium">No resume uploaded yet</span>
            <button 
              onClick={() => fileInputRef.current.click()} 
              disabled={isUploading} 
              className={`flex items-center px-6 py-2 rounded-full font-medium transition ${isUploading ? 'bg-indigo-400 text-white cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'}`}
            >
              {isUploading ? <RefreshCw className="animate-spin mr-2" size={18} /> : <Upload size={18} className="mr-2" />} 
              {isUploading ? 'Uploading...' : 'Upload Resume'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}