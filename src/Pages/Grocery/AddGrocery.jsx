import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../../Components/Shared/Breadcrumb";
import httpClient from "../../Utils/httpClient";

const AddGrocery = () => {
  const navigate = useNavigate();

  const [groceryName, setGroceryName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groceryName) {
      setMessage("Grocery name is required ❌");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("Categoryname", groceryName);
      if (image) formData.append("image", image);

      const response = await httpClient.post(
        "/grocery/add.php",
        formData
      );

      if (response.data.status) {
        setMessage("Grocery added successfully ✅");
        setTimeout(() => navigate("/CategoryList"), 1200);
      } else {
        setMessage(response.data.message || "Failed ❌");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error ❌");
    }

    setLoading(false);
  };

  return (
    <div className="page-content">
      <div className="container-fluid py-4">
        <Breadcrumb />

        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4>Add Grocery</h4>
            <Link to="/CategoryList">
              <button className="btn btn-secondary btn-sm">← Back</button>
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
                  placeholder="Enter Grocery Name"
                  value={groceryName}
                  onChange={(e) => setGroceryName(e.target.value)}
                />
              </div>

              {/* Image Upload */}
              <div className="mb-3">
                <label className="form-label">Upload Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {/* Preview */}
              {preview && (
                <div className="mb-3">
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #ddd"
                    }}
                  />
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Grocery"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGrocery;
