import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const AddPayment = () => {
  const navigate = useNavigate();

  const [learners, setLearners] = useState([]);

  const [formData, setFormData] = useState({
    learnerId: "",
    amount: "",
    paymentMethod: "MPESA",
    transactionReference: "",
    paymentDate: new Date()
      .toISOString()
      .split("T")[0],
    remarks: ""
  });

  const [selectedLearner, setSelectedLearner] =
    useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingLearners, setLoadingLearners] =
    useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadLearners();
  }, []);

  const loadLearners = async () => {
    try {
      const response = await api.get("/learners");

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
      setLoadingLearners(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    if (name === "learnerId") {
      const learner = learners.find(
        (item) => item.id === value
      );

      setSelectedLearner(learner || null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/payments",
        {
          ...formData,
          amount: Number(formData.amount)
        }
      );

      alert(
        response.data.message ||
        "Payment recorded successfully"
      );

      navigate("/payments");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to record payment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Record School Payment</h1>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <h3>Learner</h3>

        {loadingLearners ? (
          <p>Loading learners...</p>
        ) : (
          <select
            name="learnerId"
            value={formData.learnerId}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Learner
            </option>

            {learners.map((learner) => (
              <option
                key={learner.id}
                value={learner.id}
              >
                {learner.admissionNumber} -{" "}
                {learner.firstName}{" "}
                {learner.lastName}
              </option>
            ))}
          </select>
        )}

        {selectedLearner && (
          <div className="stat-card">

            <p>
              <strong>Learner:</strong>{" "}
              {selectedLearner.firstName}{" "}
              {selectedLearner.lastName}
            </p>

            <p>
              <strong>Admission Number:</strong>{" "}
              {selectedLearner.admissionNumber}
            </p>

            <p>
              <strong>Grade:</strong>{" "}
              {selectedLearner.grade?.name || "-"}
            </p>

            <p>
              <strong>Class:</strong>{" "}
              {selectedLearner.schoolClass?.name || "-"}
            </p>

          </div>
        )}

        <h3>Payment Information</h3>

        <label>
          Amount Paying
        </label>

        <input
          type="number"
          name="amount"
          placeholder="Enter amount"
          min="1"
          step="0.01"
          value={formData.amount}
          onChange={handleChange}
          required
        />

        <label>
          Payment Method
        </label>

        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          required
        >
          <option value="MPESA">
            M-Pesa
          </option>

          <option value="CASH">
            Cash
          </option>

          <option value="BANK">
            Bank
          </option>

          <option value="CHEQUE">
            Cheque
          </option>
        </select>

        <label>
          Transaction / Reference Number
        </label>

        <input
          type="text"
          name="transactionReference"
          placeholder="e.g. M-Pesa transaction code"
          value={formData.transactionReference}
          onChange={handleChange}
        />

        <label>
          Payment Date
        </label>

        <input
          type="date"
          name="paymentDate"
          value={formData.paymentDate}
          onChange={handleChange}
          required
        />

        <label>
          Remarks
        </label>

        <textarea
          name="remarks"
          placeholder="Optional remarks"
          value={formData.remarks}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Recording Payment..."
            : "Record Payment"}
        </button>

      </form>
    </div>
  );
};

export default AddPayment;