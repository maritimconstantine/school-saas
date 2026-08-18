import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

const FeeStatement = () => {
  const { learnerId } = useParams();

  const [statement, setStatement] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadStatement();
  }, [learnerId]);

  const loadStatement = async () => {
    try {
      setLoading(true);

      const response =
        await api.get(
          `/fee-reports/learner/${learnerId}`
        );

      setStatement(response.data);

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to load fee statement"
      );
    } finally {
      setLoading(false);
    }
  };

  const printStatement = () => {
    window.print();
  };

  if (loading) {
    return (
      <p>
        Loading fee statement...
      </p>
    );
  }

  if (error) {
    return (
      <div className="error">
        {error}
      </div>
    );
  }

  const learner =
    statement?.learner;

  const fees =
    statement?.fees;

  const payments =
    statement?.payments || [];

  return (
    <div>

      <div className="page-header">
        <h1>
          Fee Statement
        </h1>

        <button
          onClick={printStatement}
        >
          Print Statement
        </button>
      </div>

      <div className="stat-card">

        <h2>
          School Fee Statement
        </h2>

        <p>
          <strong>
            Learner:
          </strong>{" "}
          {learner?.firstName}{" "}
          {learner?.middleName || ""}{" "}
          {learner?.lastName}
        </p>

        <p>
          <strong>
            Admission Number:
          </strong>{" "}
          {learner?.admissionNumber}
        </p>

        <p>
          <strong>
            Grade:
          </strong>{" "}
          {learner?.grade?.name || "-"}
        </p>

        <p>
          <strong>
            Class:
          </strong>{" "}
          {learner?.schoolClass?.name || "-"}
        </p>

      </div>

      <div className="dashboard-grid">

        <div className="stat-card">
          <h3>
            Total Fees
          </h3>

          <p>
            KES{" "}
            {Number(
              fees?.totalFees || 0
            ).toLocaleString()}
          </p>
        </div>

        <div className="stat-card">
          <h3>
            Total Paid
          </h3>

          <p>
            KES{" "}
            {Number(
              fees?.totalPaid || 0
            ).toLocaleString()}
          </p>
        </div>

        <div className="stat-card">
          <h3>
            Balance
          </h3>

          <p>
            KES{" "}
            {Number(
              fees?.balance || 0
            ).toLocaleString()}
          </p>
        </div>

      </div>

      <h2>
        Payment History
      </h2>

      <table>

        <thead>
          <tr>
            <th>
              Date
            </th>

            <th>
              Receipt No.
            </th>

            <th>
              Payment Method
            </th>

            <th>
              Reference
            </th>

            <th>
              Amount
            </th>
          </tr>
        </thead>

        <tbody>

          {payments.length === 0 ? (
            <tr>
              <td colSpan="5">
                No payments recorded.
              </td>
            </tr>
          ) : (
            payments.map(
              (payment) => (
                <tr
                  key={payment.id}
                >

                  <td>
                    {payment.paymentDate
                      ? new Date(
                          payment.paymentDate
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>
                    {payment.receiptNumber || "-"}
                  </td>

                  <td>
                    {payment.paymentMethod || "-"}
                  </td>

                  <td>
                    {payment.transactionReference || "-"}
                  </td>

                  <td>
                    KES{" "}
                    {Number(
                      payment.amount
                    ).toLocaleString()}
                  </td>

                </tr>
              )
            )
          )}

        </tbody>

      </table>

    </div>
  );
};

export default FeeStatement;