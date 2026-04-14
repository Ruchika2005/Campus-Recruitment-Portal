function OpportunityCard({ job }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm">
      <h3 className="font-semibold text-gray-800">{job.title}</h3>
      <p className="text-gray-500 text-sm">{job.company_name}</p>
      <p className="text-xs mt-2 text-indigo-500">
        Deadline: {job.deadline}
      </p>
    </div>
  );
}

export default OpportunityCard;