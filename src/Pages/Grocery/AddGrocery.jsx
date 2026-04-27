import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../../Components/Shared/Breadcrumb";
import httpClient from "../../Utils/httpClient";

const AddGrocery = () => {
  const navigate = useNavigate();

  // Basic Fields
  const [groceryName, setGroceryName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  
  // Additional Fields
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [parentCategory, setParentCategory] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [icon, setIcon] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  
  // For parent categories dropdown
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch categories for parent dropdown
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

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage("File size should be less than 2MB ❌");
      return;
    }

    // Validate file type
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
    if (!groceryName.trim()) {
      setMessage("Grocery name is required ❌");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      
      // Append all fields
      formData.append("Categoryname", groceryName.trim());
      formData.append("description", description.trim());
      formData.append("status", status);
      formData.append("parentCategory", parentCategory);
      formData.append("displayOrder", displayOrder);
      formData.append("icon", icon.trim());
      formData.append("metaTitle", metaTitle.trim());
      formData.append("metaDescription", metaDescription.trim());
      formData.append("featured", featured ? "1" : "0");
      
      // Append image if selected
      if (image) {
        formData.append("image", image);
      }

      const response = await httpClient.post("/grocery/add.php", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status) {
        setMessage("Grocery category added successfully ✅");
        setTimeout(() => navigate("/List"), 1500);
      } else {
        setMessage(response.data.message || "Failed to add category ❌");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      setMessage(error.response?.data?.message || "Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  // Clear preview on component unmount
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
        <Breadcrumb />

        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center bg-light">
            <h4 className="mb-0">
              <i className="fas fa-plus-circle me-2"></i>
              Add New Grocery Category
            </h4>
            <Link to="/List">
              <button className="btn btn-outline-secondary btn-sm">
                <i className="fas fa-arrow-left me-1"></i>
                Back to List
              </button>
            </Link>
          </div>

          <div className="card-body">
            {message && (
              <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert">
                {message}
                <button type="button" className="btn-close" onClick={() => setMessage("")}></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Left Column - Basic Info */}
                <div className="col-md-8">
                  <div className="card mb-3">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">Basic Information</h6>
                    </div>
                    <div className="card-body">
                      {/* Grocery Name */}
                      <div className="mb-3">
                        <label className="form-label fw-bold">
                          Category Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter category name (e.g., Fruits, Vegetables)"
                          value={groceryName}
                          onChange={(e) => setGroceryName(e.target.value)}
                          required
                        />
                        <small className="text-muted">Maximum 100 characters</small>
                      </div>

                      {/* Description */}
                      <div className="mb-3">
                        <label className="form-label fw-bold">Description</label>
                        <textarea
                          className="form-control"
                          placeholder="Enter category description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows="4"
                        />
                        <small className="text-muted">Brief description about this category</small>
                      </div>

                      {/* Icon */}
                      <div className="mb-3">
                        <label className="form-label fw-bold">Icon Class/Emoji</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g., fas fa-apple or 🍎"
                          value={icon}
                          onChange={(e) => setIcon(e.target.value)}
                        />
                        <small className="text-muted">Font Awesome class or emoji for category</small>
                      </div>
                    </div>
                  </div>

                  {/* SEO Section */}
                  <div className="card mb-3">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">SEO Settings</h6>
                    </div>
                    <div className="card-body">
                      {/* Meta Title */}
                      <div className="mb-3">
                        <label className="form-label fw-bold">Meta Title</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="SEO title"
                          value={metaTitle}
                          onChange={(e) => setMetaTitle(e.target.value)}
                        />
                        <small className="text-muted">Recommended: 50-60 characters</small>
                      </div>

                      {/* Meta Description */}
                      <div className="mb-3">
                        <label className="form-label fw-bold">Meta Description</label>
                        <textarea
                          className="form-control"
                          placeholder="SEO description"
                          value={metaDescription}
                          onChange={(e) => setMetaDescription(e.target.value)}
                          rows="3"
                        />
                        <small className="text-muted">Recommended: 150-160 characters</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Settings & Image */}
                <div className="col-md-4">
                  {/* Image Upload */}
                  <div className="card mb-3">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">Category Image</h6>
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
                              style={{ borderRadius: "50%", padding: "2px 8px" }}
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div className="border rounded p-4 bg-light">
                            <i className="fas fa-image fa-3x text-muted mb-2"></i>
                            <p className="text-muted mb-2">No image selected</p>
                          </div>
                        )}
                      </div>

                      <input
                        type="file"
                        className="form-control"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        id="imageInput"
                      />
                      <small className="text-muted d-block mt-2">
                        Supported: JPG, PNG, WebP (Max: 2MB)
                      </small>
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="card mb-3">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">Category Settings</h6>
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
                        <small className="text-muted">Inactive categories won't show on site</small>
                      </div>

                      {/* Parent Category */}
                      <div className="mb-3">
                        <label className="form-label fw-bold">Parent Category</label>
                        <select
                          className="form-select"
                          value={parentCategory}
                          onChange={(e) => setParentCategory(e.target.value)}
                        >
                          <option value="">None (Top Level)</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                        <small className="text-muted">Select for sub-category</small>
                      </div>

                      {/* Display Order */}
                      <div className="mb-3">
                        <label className="form-label fw-bold">Display Order</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="0"
                          value={displayOrder}
                          onChange={(e) => setDisplayOrder(e.target.value)}
                          min="0"
                        />
                        <small className="text-muted">Lower number shows first</small>
                      </div>

                      {/* Featured */}
                      <div className="mb-3">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="featuredSwitch"
                            checked={featured}
                            onChange={(e) => setFeatured(e.target.checked)}
                          />
                          <label className="form-check-label fw-bold" htmlFor="featuredSwitch">
                            Featured Category
                          </label>
                        </div>
                        <small className="text-muted">Show this category in featured section</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="row mt-3">
                <div className="col-12">
                  <div className="d-flex gap-2 justify-content-end">
                    <Link to="/List">
                      <button type="button" className="btn btn-secondary">
                        <i className="fas fa-times me-1"></i>
                        Cancel
                      </button>
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                          Adding...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-1"></i>
                          Save Category
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGrocery;