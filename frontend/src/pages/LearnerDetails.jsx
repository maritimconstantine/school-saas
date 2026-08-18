import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";

const LearnerDetails = () => {
  const { learnerId } = useParams();

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadLearner();
  }, [learnerId]);

  const loadLearner = async () => {
    try {
      const response =
        await api.get(
          `/fee-reports/learner/${learnerId}`
        );

      setData(response.data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to load learner"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading learner...</p>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
      </div>
    );
  }

  const learner = data?.learner;
  const fees = data?.fees;

  return (
    <div>

      <div className="page-header">
        <h1>
          {learner?.firstName}{" "}
          {learner?.middleName || ""}{" "}
          {learner?.lastName}
        </h1>

        <Link to="/learners">
          Back to Learners
        </Link>
      </div>

      <div className="stat-card">
        <p>
          <strong>
            Admission Number:
          </strong>{" "}
          {learner?.admissionNumber}
        </p>

        <p>
          <strong>Grade:</strong>{" "}
          {learner?.grade?.name}
        </p>

        <p>
          <strong>Class:</strong>{" "}
          {learner?.class?.name}
        </p>
      </div>

      <h2>Fee Summary</h2>

      <div className="dashboard-grid">

        <div className="stat-card">
          <h3>Total Fees</h3>
          <p>
            KES{" "}
            {Number(
              fees?.totalFees || 0
            ).toLocaleString()}
          </p>
        </div>

        <div className="stat-card">
          <h3>Total Paid</h3>
          <p>
            KES{" "}
            {Number(
              fees?.totalPaid || 0
            ).toLocaleString()}
          </p>
        </div>

        <div className="stat-card">
          <h3>Balance</h3>
          <p>
            KES{" "}
            {Number(
              fees?.balance || 0
            ).toLocaleString()}
          </p>
        </div>

      </div>

      <h2>Payment History</h2>

      <table>
        <thead>
          <tr>
            <th>Receipt</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Reference</th>
          </tr>
        </thead>

        <tbody>
          {data?.payments?.length === 0 ? (
            <tr>
              <td colSpan="5">
                No payments found.
              </td>
            </tr>
          ) : (
            data.payments.map(
              (payment) => (
                <tr key={payment.id}>

                  <td>
                    {payment.receiptNumber}
                  </td>

                  <td>
                    {new Date(
                      payment.paymentDate
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    KES{" "}
                    {Number(
                      payment.amount
                    ).toLocaleString()}
                  </td>

                  <td>
                    {payment.paymentMethod}
                  </td>

                  <td>
                    {payment.transactionReference ||
                      "-"}
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

export default LearnerDetails;