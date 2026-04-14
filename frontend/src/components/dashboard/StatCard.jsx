function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-semibold text-gray-800">{value}</h2>
    </div>
  );
}

export default StatCard;