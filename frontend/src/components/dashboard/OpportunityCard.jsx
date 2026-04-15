function OpportunityCard({ job }) {
  const formattedDate = job.deadline 
    ? new Date(job.deadline).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })
    : "No Deadline";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <h3 className="font-semibold text-gray-800 text-lg mb-1 truncate">{job.title}</h3>
      <p className="text-gray-500 text-sm font-medium mb-4 truncate">{job.company_name}</p>
      
      <div className="flex justify-between items-center mt-2">
         <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full capitalize font-medium">
           {job.type}
         </span>
         <p className="text-xs text-red-500 font-medium whitespace-nowrap ml-2">
           Ends: {formattedDate}
         </p>
      </div>
    </div>
  );
}

export default OpportunityCard;