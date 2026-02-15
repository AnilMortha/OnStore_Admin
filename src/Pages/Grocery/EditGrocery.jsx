import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
// import httpClient from "../../Utils/httpClient";

const EditGrocery = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [groceryName, setGroceryName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch Grocery Data
  useEffect(() => {
    const fetchGrocery = async () => {
      try {
        // const { data } = await httpClient.get(`/categories/${id}`);
        // if (data.success) {
        //   setGroceryName(data.category.Categoryname);
        //   setExistingImage(data.category.image);
        // }

        // Dummy Data (Remove when API connected)
        setGroceryName("Rice");
        setExistingImage("https://via.placeholder.com/120");

      } catch (error) {
        console.log(error);
      }
    };

    fetchGrocery();
  }, [id]);

  // Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setExistingImage(URL.createObjectURL(file));
  };

  // Submit Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groceryName) {
      setMessage("Grocery name is required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("Categoryname", groceryName);
      if (imageFile) formData.append("image", imageFile);

      // await httpClient.put(`/categories/${id}`, formData, {
      //   headers: { "Content-Type": "multipart/form-data" }
      // });

      setMessage("Grocery updated successfully ✅");

      setTimeout(() => navigate("/CategoryList"), 1500);

    } catch (error) {
      setMessage("Update failed ❌");
    }

    setLoading(false);
  };

  return (
    <div className="page-content">
    <div className="container-fluid py-4">
      <div className="card shadow-sm">

        <div className="card-header d-flex justify-content-between align-items-center">
            <h4>Edit Grocery</h4>
            <Link to="/List">
            <button
              className="btn btn-secondary btn-sm"
            >
              ← Back
            </button>
            </Link>
          </div>

        <div className="card-body">

          {message && (
            <div className="alert alert-info">{message}</div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Grocery Name */}
            <div className="mb-3">
              <label className="form-label">Grocery Name</label>
              <input
                type="text"
                className="form-control"
                value={groceryName}
                onChange={(e) => setGroceryName(e.target.value)}
              />
            </div>

            {/* Image Upload */}
            <div className="mb-3">
              <label className="form-label">Update Image</label>
              <input
                type="file"
                className="form-control"
                onChange={handleImageChange}
              />
            </div>

            {/* Preview */}
            {existingImage && (
              <div className="mb-3">
                <img
                  src={existingImage}
                  alt="Preview"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px"
                  }}
                />
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Grocery"}
            </button>

          </form>

        </div>
      </div>
    </div>
    </div>
  );
};

export default EditGrocery;
