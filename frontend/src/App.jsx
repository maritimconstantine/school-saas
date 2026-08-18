import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Learners from "./pages/Learners";
import SchoolRegistration from "./pages/SchoolRegistration";
import ProtectedRoute
  from "./components/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";

function App() {

  return (
    <BrowserRouter>

      <AuthProvider>

        <Routes>

          <Route
            path="/login"
            element={<Login />}
          />
          <Route
  path="/school-registration"
  element={
    <ProtectedRoute>
      <SchoolRegistration />
    </ProtectedRoute>
  }
/>

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/learners"
            element={
              <ProtectedRoute>
                <Learners />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
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