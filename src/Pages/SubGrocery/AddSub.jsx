import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../../Utils/httpClient";

const AddSub = () => {
  const navigate = useNavigate();

  // Form fields
  const [subName, setSubName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [icon, setIcon] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  
  // Categories for dropdown
  const [categories, setCategories] = useState([]);
  
  // Image states
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch parent categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await httpClient.get("/grocery/categories.php");
      if (response.data.status) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (file.size > 2 * 1024 * 1024) {
      setMessage("File size should be less than 2MB ❌");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("Please upload an image file ❌");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!subName.trim()) {
      setMessage("Subcategory name is required ❌");
      return;
    }
    if (!parentCategory) {
      setMessage("Please select a parent category ❌");
      return;
    }
    if (!image) {
      setMessage("Image is required ❌");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      
      // Append all fields
      formData.append("subcategory_name", subName.trim());
      formData.append("category_id", parentCategory);
      formData.append("description", description.trim());
      formData.append("status", status);
      formData.append("display_order", displayOrder);
      formData.append("icon", icon.trim());
      formData.append("meta_title", metaTitle.trim());
      formData.append("meta_description", metaDescription.trim());
      formData.append("image", image);

      const response = await httpClient.post("/subcategories/add.php", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.status) {
        setMessage("Subcategory added successfully ✅");
        setTimeout(() => navigate("/SubGroceryList"), 1500);
      } else {
        setMessage(response.data.message || "Failed to add subcategory ❌");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage(err.response?.data?.message || "Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  // Cleanup preview on unmount
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="page-content">
      <div className="container-fluid py-4">
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center bg-light">
            <h4 className="mb-0">
              <i className="fas fa-plus-circle me-2"></i>
              Add Subcategory
            </h4>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => navigate(-1)}
            >
              <i className="fas fa-arrow-left me-1"></i>
              Back
            </button>
          </div>

          <div className="card-body">
            {message && (
              <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}>
                {message}
                <button type="button" className="btn-close" onClick={() => setMessage("")}></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Left Column */}
                <div className="col-md-8">
                  {/* Parent Category */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Parent Category <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={parentCategory}
                      onChange={(e) => setParentCategory(e.target.value)}
                      required
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subcategory Name */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Subcategory Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter subcategory name"
                      value={subName}
                      onChange={(e) => setSubName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Description</label>
                    <textarea
                      className="form-control"
                      placeholder="Enter description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="3"
                    />
                  </div>

                  {/* Icon */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Icon (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., fas fa-apple or 🍎"
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                    />
                  </div>

                  {/* SEO Section */}
                  <div className="card mb-3">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">SEO Settings</h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Meta Title</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="SEO title"
                          value={metaTitle}
                          onChange={(e) => setMetaTitle(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Meta Description</label>
                        <textarea
                          className="form-control"
                          placeholder="SEO description"
                          value={metaDescription}
                          onChange={(e) => setMetaDescription(e.target.value)}
                          rows="2"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="col-md-4">
                  {/* Image Upload */}
                  <div className="card mb-3">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">Subcategory Image <span className="text-danger">*</span></h6>
                    </div>
                    <div className="card-body text-center">
                      <div className="mb-3">
                        {preview ? (
                          <div className="position-relative d-inline-block">
                            <img
                              src={preview}
                              alt="Preview"
                              style={{
                                width: "150px",
                                height: "150px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "2px solid #ddd"
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-danger btn-sm position-absolute top-0 end-0"
                              onClick={() => {
                                setImage(null);
                                setPreview("");
                              }}
                              style={{ borderRadius: "50%" }}
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div className="border rounded p-4 bg-light">
                            <i className="fas fa-image fa-3x text-muted mb-2"></i>
                            <p className="text-muted mb-0">No image selected</p>
                          </div>
                        )}
                      </div>

                      <input
                        type="file"
                        className="form-control"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        required={!image}
                      />
                      <small className="text-muted d-block mt-2">
                        Max size: 2MB (JPG, PNG, WebP)
                      </small>
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="card mb-3">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">Settings</h6>
                    </div>
                    <div className="card-body">
                      {/* Status */}
                      <div className="mb-3">
                        <label className="form-label fw-bold">Status</label>
                        <select
                          className="form-select"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>

                      {/* Display Order */}
                      <div className="mb-3">
                        <label className="form-label fw-bold">Display Order</label>
                        <input
                          type="number"
                          className="form-control"
                          value={displayOrder}
                          onChange={(e) => setDisplayOrder(e.target.value)}
                          min="0"
                        />
                        <small className="text-muted">Lower number shows first</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-end mt-3">
                <button
                  type="submit"
                  className="btn btn-primary px-4"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1"></span>
                      Adding...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-1"></i>
                      Add Subcategory
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSub;