import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const AddLearner = () => {
  const navigate = useNavigate();

  const [academicYears, setAcademicYears] =
    useState([]);

  const [grades, setGrades] =
    useState([]);

  const [classes, setClasses] =
    useState([]);

  const [formData, setFormData] = useState({
    admissionNumber: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    academicYearId: "",
    gradeId: "",
    classId: "",
    address: "",
    phone: "",
    notes: ""
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadAcademicYears();
    loadGrades();
    loadClasses();
  }, []);

  const loadAcademicYears = async () => {
    try {
      const response =
        await api.get("/academic-years");

      setAcademicYears(
        response.data.academicYears || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  const loadGrades = async () => {
    try {
      const response =
        await api.get("/grades");

      setGrades(
        response.data.grades || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  const loadClasses = async () => {
    try {
      const response =
        await api.get("/classes");

      setClasses(
        response.data.classes || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response =
        await api.post(
          "/learners",
          formData
        );

      alert(
        response.data.message ||
        "Learner registered successfully"
      );

      navigate("/learners");

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to register learner"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Register Learner</h1>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <h3>Learner Information</h3>

        <input
          name="admissionNumber"
          placeholder="Admission Number"
          value={formData.admissionNumber}
          onChange={handleChange}
          required
        />

        <input
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <input
          name="middleName"
          placeholder="Middle Name"
          value={formData.middleName}
          onChange={handleChange}
        />

        <input
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">
            Select Gender
          </option>

          <option value="MALE">
            Male
          </option>

          <option value="FEMALE">
            Female
          </option>
        </select>

        <label>
          Date of Birth
        </label>

        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />

        <h3>Academic Information</h3>

        <select
          name="academicYearId"
          value={formData.academicYearId}
          onChange={handleChange}
          required
        >
          <option value="">
            Select Academic Year
          </option>

          {academicYears.map((year) => (
            <option
              key={year.id}
              value={year.id}
            >
              {year.name}
            </option>
          ))}
        </select>

        <select
          name="gradeId"
          value={formData.gradeId}
          onChange={handleChange}
          required
        >
          <option value="">
            Select Grade
          </option>

          {grades.map((grade) => (
            <option
              key={grade.id}
              value={grade.id}
            >
              {grade.name}
            </option>
          ))}
        </select>

        <select
          name="classId"
          value={formData.classId}
          onChange={handleChange}
        >
          <option value="">
            Select Class
          </option>

          {classes.map((schoolClass) => (
            <option
              key={schoolClass.id}
              value={schoolClass.id}
            >
              {schoolClass.name}
            </option>
          ))}
        </select>

        <h3>Contact Information</h3>

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

        <textarea
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Registering..."
            : "Register Learner"}
        </button>

      </form>
    </div>
  );
};

export default AddLearner;