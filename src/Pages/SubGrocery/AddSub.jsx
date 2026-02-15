import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddSub = () => {
  const navigate = useNavigate();

  const [subName, setSubName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setCategories([
      { _id: "1", Categoryname: "Rice" },
      { _id: "2", Categoryname: "Oil" }
    ]);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subName || !parentCategory || !image) {
      setMessage("All fields including image are required");
      return;
    }

    setLoading(true);

    try {
      // API call here with FormData

      /*
      const formData = new FormData();
      formData.append("SubCategoryname", subName);
      formData.append("categoryId", parentCategory);
      formData.append("image", image);

      await httpClient.post("/subcategories", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      */

      setMessage("Sub Grocery Added ✅");

      setTimeout(() => navigate("/SubGroceryList"), 1500);

    } catch (err) {
      setMessage("Error ❌");
    }

    setLoading(false);
  };

  return (
    <div className="page-content">
      <div className="container-fluid py-4">
        <div className="card shadow-sm">

          {/* Header */}
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4>Add Sub Grocery</h4>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>
          </div>

          <div className="card-body">

            {message && <div className="alert alert-info">{message}</div>}

            <form onSubmit={handleSubmit}>

              {/* Parent Category */}
              <div className="mb-3">
                <label className="form-label">Select Grocery</label>
                <select
                  className="form-select"
                  value={parentCategory}
                  onChange={(e) => setParentCategory(e.target.value)}
                >
                  <option value="">-- Select Grocery --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.Categoryname}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub Grocery Name */}
              <div className="mb-3">
                <label className="form-label">Sub Grocery Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                />
              </div>

              {/* Image Upload */}
              <div className="mb-3">
                <label className="form-label">Upload Image</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleImageChange}
                />
              </div>

              {/* Image Preview */}
              {preview && (
                <div className="mb-3">
                  <img
                    src={preview}
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

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Sub Grocery"}
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddSub;
