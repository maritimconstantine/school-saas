import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/payments", {
        params: {
          search
        }
      });

      setPayments(response.data.payments || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to load payments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [search]);

  const formatMoney = (amount) => {
    return Number(amount || 0).toLocaleString();
  };

  return (
    <div>
      <div className="page-header">
        <h1>Payments</h1>

        <Link to="/payments/add">
          Record Payment
        </Link>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search learner, admission number or receipt..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading payments...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Receipt No.</th>
              <th>Learner</th>
              <th>Admission No.</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Reference</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="8">
                  No payments found.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    {payment.receiptNumber || "-"}
                  </td>

                  <td>
                    {payment.learner?.firstName}{" "}
                    {payment.learner?.middleName || ""}{" "}
                    {payment.learner?.lastName}
                  </td>

                  <td>
                    {payment.learner?.admissionNumber || "-"}
                  </td>

                  <td>
                    {payment.paymentDate
                      ? new Date(
                          payment.paymentDate
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>
                    KES {formatMoney(payment.amount)}
                  </td>

                  <td>
                    {payment.paymentMethod || "-"}
                  </td>

                  <td>
                    {payment.transactionReference || "-"}
                  </td>

                  <td>
                    <Link
                      to={`/payments/${payment.id}/receipt`}
                    >
                      Print Receipt
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

export default Payments;