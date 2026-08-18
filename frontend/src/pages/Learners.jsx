import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

const Learners = () => {
  const [learners, setLearners] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLearners = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/fee-reports/learners",
        {
          params: {
            search,
            sortBy,
            order
          }
        }
      );

      setLearners(
        response.data.learners || []
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to load learners"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLearners();
  }, [search, sortBy, order]);

  return (
    <div>
      <div className="page-header">
        <h1>Learners</h1>

        <Link to="/learners/add">
          Add Learner
        </Link>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or admission number..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value)
          }
        >
          <option value="name">
            Name
          </option>

          <option value="paid">
            Amount Paid
          </option>

          <option value="balance">
            Outstanding Balance
          </option>

          <option value="fees">
            Total Fees
          </option>
        </select>

        <select
          value={order}
          onChange={(e) =>
            setOrder(e.target.value)
          }
        >
          <option value="asc">
            Lowest / A-Z
          </option>

          <option value="desc">
            Highest / Z-A
          </option>
        </select>
      </div>

      {loading ? (
        <p>Loading learners...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Admission No.</th>
              <th>Learner</th>
              <th>Grade</th>
              <th>Class</th>
              <th>Total Fees</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {learners.length === 0 ? (
              <tr>
                <td colSpan="8">
                  No learners found.
                </td>
              </tr>
            ) : (
              learners.map((learner) => (
                <tr key={learner.id}>
                  <td>
                    {learner.admissionNumber}
                  </td>

                  <td>
                    {learner.name}
                  </td>

                  <td>
                    {learner.grade}
                  </td>

                  <td>
                    {learner.class}
                  </td>

                  <td>
                    KES{" "}
                    {Number(
                      learner.totalFees
                    ).toLocaleString()}
                  </td>

                  <td>
                    KES{" "}
                    {Number(
                      learner.totalPaid
                    ).toLocaleString()}
                  </td>

                  <td>
                    KES{" "}
                    {Number(
                      learner.balance
                    ).toLocaleString()}
                  </td>

                  <td>
                    <Link
                      to={`/learners/${learner.id}`}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Learners;