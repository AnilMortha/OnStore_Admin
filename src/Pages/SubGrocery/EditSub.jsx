import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const EditSub = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subName, setSubName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    // Dummy Categories
    setCategories([
      { _id: "1", Categoryname: "Rice" },
      { _id: "2", Categoryname: "Oil" }
    ]);

    // Dummy Sub Grocery Data
    setSubName("Basmati Rice");
    setParentCategory("1");

    // Existing image from backend
    setPreview("https://via.placeholder.com/150");
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("SubCategoryname", subName);
    formData.append("categoryId", parentCategory);

    if (image) {
      formData.append("image", image);
    }

    // API Call here
    // await httpClient.put(`/subcategories/${id}`, formData);

    navigate("/SubList");
  };

  return (
    <div className="page-content">
      <div className="container-fluid py-4">
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4>Add Sub-Grocery</h4>
            <Link to="/SubList">
            <button
              className="btn btn-secondary btn-sm"
            >
              ← Back
            </button>
            </Link>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>

              {/* Select Grocery */}
              <div className="mb-3">
                <label className="form-label">Select Grocery</label>
                <select
                  className="form-select"
                  value={parentCategory}
                  onChange={(e) => setParentCategory(e.target.value)}
                >
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

              {/* Image Field */}
              <div className="mb-3">
                <label className="form-label">Sub Grocery Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {/* Image Preview */}
              {preview && (
                <div className="mb-3">
                  <p>Image Preview:</p>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ width: "150px", borderRadius: "8px" }}
                  />
                </div>
              )}

              <button type="submit" className="btn btn-primary">
                Update Sub Grocery
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSub;
