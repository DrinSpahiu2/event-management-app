import { useEffect, useState } from "react";

export default function AdminUsersList() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const availableRoles = [
    { id: 1, name: "SuperAdmin" },
    { id: 2, name: "Manager" },
    { id: 3, name: "Speaker" },
    { id: 4, name: "Sponsor" },
    { id: 5, name: "Client" },
  ];

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoadingUsers(false);
      })
      .catch((err) => console.error("Error loading users:", err));
  }, []);

  const handleRoleChange = async (userId, newRoleId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_type_id: newRoleId }),
      });

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId 
              ? { ...user, user_type_id: newRoleId, userType: { emri: availableRoles.find(r => r.id === newRoleId).name } } 
              : user
          )
        );
      } else {
        alert("❌ Ndryshimi i rolit dështoi.");
      }
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  return (
    <article className="rounded-xl border border-[#283143] bg-[#1b212c] p-5">
      <div className="mb-4">
        <h3 className="m-0 text-xl text-[#f4f7fb]">System Users Directory</h3>
        <p className="mt-1 text-sm text-[#95a2ba]">View and manage privileges for registered user accounts.</p>
      </div>

      {loadingUsers ? (
        <div className="py-10 text-center text-sm text-[#8f9ab0]">Fetching directory data...</div>
      ) : (
        <div className="overflow-x-auto rounded-[10px] border border-[#2b3446] bg-[#161d27]">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#2b3446] bg-[#11161f] text-[#97a2b6] font-medium">
                <th className="p-4">Full Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Assigned Privilege</th>
                <th className="p-4 text-right">Alter Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2b3446]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#1f2633]/40 transition duration-150">
                  <td className="p-4 font-medium text-[#f4f7fb]">{user.emri} {user.mbiemri}</td>
                  <td className="p-4 text-[#8f9ab0]">{user.email}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ff9f1a]/10 border border-[#ff9f1a]/30 text-[#ff9f1a]">
                      {user.userType?.emri || "Client"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <select
                      value={user.user_type_id}
                      onChange={(e) => handleRoleChange(user.id, Number(e.target.value))}
                      className="rounded-[6px] border border-[#283143] bg-[#11161f] text-slate-100 px-3 py-1.5 text-xs outline-none focus:border-[#ff9f1a] transition"
                    >
                      {availableRoles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}