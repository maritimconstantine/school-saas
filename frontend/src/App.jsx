import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SchoolRegistration from "./pages/SchoolRegistration";

import Users from "./pages/Users";

import Learners from "./pages/Learners";
import AddLearner from "./pages/AddLearner";
import LearnerDetails from "./pages/LearnerDetails";

import Parents from "./pages/Parents";

import Payments from "./pages/Payments";
import AddPayment from "./pages/AddPayment";

import FeeStructures from "./pages/FeeStructures";
import FeeStatement from "./pages/FeeStatement";

function App() {
  return (
    <BrowserRouter>

      <AuthProvider>

        <Routes>

          {/* LOGIN */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* SCHOOL */}
          <Route
            path="/school-registration"
            element={
              <ProtectedRoute>
                <SchoolRegistration />
              </ProtectedRoute>
            }
          />

          {/* USERS */}
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />

          {/* LEARNERS */}
          <Route
            path="/learners"
            element={
              <ProtectedRoute>
                <Learners />
              </ProtectedRoute>
            }
          />

          {/* ADD LEARNER */}
          <Route
            path="/learners/add"
            element={
              <ProtectedRoute>
                <AddLearner />
              </ProtectedRoute>
            }
          />

          {/* LEARNER DETAILS */}
          <Route
            path="/learners/:learnerId"
            element={
              <ProtectedRoute>
                <LearnerDetails />
              </ProtectedRoute>
            }
          />

          {/* PARENTS */}
          <Route
            path="/parents"
            element={
              <ProtectedRoute>
                <Parents />
              </ProtectedRoute>
            }
          />

          {/* PAYMENTS */}
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            }
          />

          {/* ADD PAYMENT */}
          <Route
            path="/payments/add"
            element={
              <ProtectedRoute>
                <AddPayment />
              </ProtectedRoute>
            }
          />

          {/* FEE STRUCTURES */}
          <Route
            path="/fee-structures"
            element={
              <ProtectedRoute>
                <FeeStructures />
              </ProtectedRoute>
            }
          />

          {/* FEE STATEMENT */}
          <Route
            path="/learners/:learnerId/statement"
            element={
              <ProtectedRoute>
                <FeeStatement />
              </ProtectedRoute>
            }
          />

          {/* DEFAULT */}
          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          {/* UNKNOWN PAGE */}
          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

        </Routes>

      </AuthProvider>

    </BrowserRouter>
  );
}

export default App;