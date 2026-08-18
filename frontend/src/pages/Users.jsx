import { useEffect, useState } from "react";
import api from "../api/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/users");

      setUsers(response.data.users || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return <p>Loading users...</p>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>System Users</h1>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>
                  {user.firstName} {user.lastName}
                </td>

                <td>{user.email}</td>

                <td>{user.role}</td>

                <td>
                  {user.isActive ? "Active" : "Inactive"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;