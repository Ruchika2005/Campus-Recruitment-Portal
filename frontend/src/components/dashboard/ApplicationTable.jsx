function ApplicationTable({ data }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h2 className="font-semibold mb-4">Your Applications</h2>

      <table className="w-full text-sm">
        <thead className="text-gray-500">
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((app) => (
            <tr key={app.application_id} className="border-t">
              <td>{app.company_name}</td>
              <td>{app.title}</td>
              <td className="text-indigo-500">{app.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ApplicationTable;