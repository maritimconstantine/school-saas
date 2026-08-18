import { useEffect, useState } from "react";
import api from "../api/api";

const Dashboard = () => {

  const [summary, setSummary] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const loadSummary =
      async () => {

        try {

          const response =
            await api.get(
              "/fee-reports/summary"
            );

          setSummary(
            response.data.summary
          );

        } catch (error) {

          console.error(error);

        } finally {

          setLoading(false);
        }
      };

    loadSummary();

  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>

      <h1>Dashboard</h1>

      <div className="dashboard-grid">

        <div className="stat-card">
          <h3>Learners</h3>
          <p>
            {summary?.totalLearners || 0}
          </p>
        </div>

        <div className="stat-card">
          <h3>Total Fees</h3>
          <p>
            KES{" "}
            {Number(
              summary?.totalFees || 0
            ).toLocaleString()}
          </p>
        </div>

        <div className="stat-card">
          <h3>Total Paid</h3>
          <p>
            KES{" "}
            {Number(
              summary?.totalPaid || 0
            ).toLocaleString()}
          </p>
        </div>

        <div className="stat-card">
          <h3>Outstanding</h3>
          <p>
            KES{" "}
            {Number(
              summary?.totalBalance || 0
            ).toLocaleString()}
          </p>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;