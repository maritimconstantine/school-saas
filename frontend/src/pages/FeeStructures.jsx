import { useEffect, useState } from "react";
import api from "../api/api";

const FeeStructures = () => {
  const [structures, setStructures] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [grades, setGrades] =
    useState([]);

  const [formData, setFormData] = useState({
    academicYearId: "",
    gradeId: "",
    feeCategoryId: "",
    amount: ""
  });

  const [academicYears, setAcademicYears] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        structuresResponse,
        categoriesResponse,
        gradesResponse,
        yearsResponse
      ] = await Promise.all([
        api.get("/fee-structures"),
        api.get("/fee-categories"),
        api.get("/grades"),
        api.get("/academic-years")
      ]);

      setStructures(
        structuresResponse.data.feeStructures || []
      );

      setCategories(
        categoriesResponse.data.feeCategories || []
      );

      setGrades(
        gradesResponse.data.grades || []
      );

      setAcademicYears(
        yearsResponse.data.academicYears || []
      );

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to load fee structures"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        "/fee-structures",
        {
          ...formData,
          amount: Number(formData.amount)
        }
      );

      alert(
        "Fee structure created successfully"
      );

      setFormData({
        academicYearId: "",
        gradeId: "",
        feeCategoryId: "",
        amount: ""
      });

      loadData();

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to create fee structure"
      );
    }
  };

  return (
    <div>

      <h1>Fee Structures</h1>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="stat-card">

        <h2>
          Create Fee Structure
        </h2>

        <form onSubmit={handleSubmit}>

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
            name="feeCategoryId"
            value={formData.feeCategoryId}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Fee Category
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Save Fee Structure
          </button>

        </form>

      </div>

      <h2>Existing Fee Structures</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>

          <thead>
            <tr>
              <th>Academic Year</th>
              <th>Grade</th>
              <th>Fee Category</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>

            {structures.length === 0 ? (
              <tr>
                <td colSpan="4">
                  No fee structures found.
                </td>
              </tr>
            ) : (
              structures.map((structure) => (
                <tr key={structure.id}>

                  <td>
                    {structure.academicYear?.name || "-"}
                  </td>

                  <td>
                    {structure.grade?.name || "-"}
                  </td>

                  <td>
                    {structure.feeCategory?.name || "-"}
                  </td>

                  <td>
                    KES{" "}
                    {Number(
                      structure.amount
                    ).toLocaleString()}
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

export default FeeStructures;