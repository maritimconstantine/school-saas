import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response =
        await api.post(
          "/auth/login",
          {
            email,
            password
          }
        );

      const data =
        response.data;

      login(
        data.user,
        data.token
      );

      navigate("/dashboard");

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>
          School Fee System
        </h1>

        <p>
          Sign in to your account
        </p>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
        >

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default Login;