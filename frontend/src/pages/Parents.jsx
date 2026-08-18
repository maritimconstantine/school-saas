import { useEffect, useState } from "react";
import api from "../api/api";

const Parents = () => {
  const [parents, setParents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadParents = async () => {
    try {
      setLoading(true);

      const response =
        await api.get("/parents");

      setParents(
        response.data.parents || []
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to load parents"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParents();
  }, []);

  if (loading) {
    return <p>Loading parents...</p>;
  }

  return (
    <div>

      <div className="page-header">
        <h1>Parents / Guardians</h1>
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
            <th>Phone</th>
            <th>Email</th>
            <th>Relationship</th>
            <th>Learner</th>
          </tr>
        </thead>

        <tbody>

          {parents.length === 0 ? (
            <tr>
              <td colSpan="5">
                No parents found.
              </td>
            </tr>
          ) : (

            parents.map((parent) => (
              <tr key={parent.id}>

                <td>
                  {parent.parent?.firstName}{" "}
                  {parent.parent?.lastName}
                </td>

                <td>
                  {parent.parent?.phone || "-"}
                </td>

                <td>
                  {parent.parent?.email || "-"}
                </td>

                <td>
                  {parent.relationship}
                </td>

                <td>
                  {parent.learner?.firstName}{" "}
                  {parent.learner?.lastName}
                </td>

              </tr>
            ))

          )}

        </tbody>

      </table>

    </div>
  );
};

export default Parents;