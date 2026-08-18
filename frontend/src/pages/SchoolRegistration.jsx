import { useState } from "react";
import api from "../api/api";

const SchoolRegistration = () => {

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
    phone: "",
    email: "",
    county: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");

    try {

      const response = await api.post(
        "/schools",
        formData
      );

      setMessage(
        response.data.message
      );

      setFormData({
        name: "",
        code: "",
        address: "",
        phone: "",
        email: "",
        county: ""
      });

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Failed to register school"
      );
    }
  };

  return (
    <div>

      <h1>School Registration</h1>

      {message && (
        <p>{message}</p>
      )}

      {error && (
        <p>{error}</p>
      )}

      <form onSubmit={handleSubmit}>

        <input
          name="name"
          placeholder="School Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          name="code"
          placeholder="School Code"
          value={formData.code}
          onChange={handleChange}
          required
        />

        <input
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          name="county"
          placeholder="County"
          value={formData.county}
          onChange={handleChange}
        />

        <button type="submit">
          Register School
        </button>

      </form>

    </div>
  );
};

export default SchoolRegistration;