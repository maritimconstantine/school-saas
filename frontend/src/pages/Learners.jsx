import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

const Learners = () => {

  const [learners, setLearners] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [sortBy, setSortBy] =
    useState("name");

  const [order, setOrder] =
    useState("asc");

  const [loading, setLoading] =
    useState(false);

  const loadLearners = async () => {

    setLoading(true);

    try {

      const response =
        await api.get(
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
        response.data.learners
      );

    } catch (error) {

      console.error(error);

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

      <div className="filters">

        <input
          type="text"
          placeholder="Search learner..."
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
            Balance
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
            Ascending
          </option>

          <option value="desc">
            Descending
          </option>
        </select>

      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (

        <table>

          <thead>
            <tr>

              <th>
                Admission No.
              </th>

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

            {learners.map(
              (learner) => (

                <tr
                  key={learner.id}
                >

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

              )
            )}

          </tbody>

        </table>

      )}

    </div>
  );
};

export default Learners;