import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import httpClient from "../../Utils/httpClient";

const EditSub = () => {
  const { id } = useParams();
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
  const [existingImage, setExistingImage] = useState("");
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch data on component mount
  useEffect(() => {
    fetchCategories();
    fetchSubCategoryData();
  }, [id]);

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

  const fetchSubCategoryData = async () => {
    setFetchLoading(true);
    try {
      const response = await httpClient.get(`/subcategories/get_single.php?id=${id}`);
      
      if (response.data.status) {
        const data = response.data.data;
        
        // Set form fields
        setSubName(data.subcategory_name || "");
        setParentCategory(data.category_id || "");
        setDescription(data.description || "");
        setStatus(data.status || "active");
        setDisplayOrder(data.display_order || 0);
        setIcon(data.icon || "");
        setMetaTitle(data.meta_title || "");
        setMetaDescription(data.meta_description || "");
        
        // Set image preview
        if (data.image) {
          setExistingImage(data.image);
          setPreview(getImageUrl(data.image));
        }
      } else {
        setMessage("Failed to fetch subcategory data ❌");
        setTimeout(() => navigate("/SubList"), 2000);
      }
    } catch (error) {
      console.error("Error fetching subcategory:", error);
      setMessage("Error loading subcategory data ❌");
    } finally {
      setFetchLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `https://onstores.in/onstores_apis/api/${imagePath}`; // Change this URL
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
    setExistingImage(""); // Clear existing image when new one is selected
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

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      
      // Append all fields
      formData.append("id", id);
      formData.append("subcategory_name", subName.trim());
      formData.append("category_id", parentCategory);
      formData.append("description", description.trim());
      formData.append("status", status);
      formData.append("display_order", displayOrder);
      formData.append("icon", icon.trim());
      formData.append("meta_title", metaTitle.trim());
      formData.append("meta_description", metaDescription.trim());
      
      // Append image if selected
      if (image) {
        formData.append("image", image);
      }

      const response = await httpClient.post("/subcategories/edit.php", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.status) {
        setMessage("Subcategory updated successfully ✅");
        setTimeout(() => navigate("/SubList"), 1500);
      } else {
        setMessage(response.data.message || "Failed to update subcategory ❌");
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
      if (preview && !existingImage) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, existingImage]);

  if (fetchLoading) {
    return (
      <div className="page-content">
        <div className="container-fluid py-4 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading subcategory data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="container-fluid py-4">
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center bg-light">
            <h4 className="mb-0">
              <i className="fas fa-edit me-2"></i>
              Edit Subcategory
            </h4>
            <Link to="/SubList">
              <button className="btn btn-outline-secondary btn-sm">
                <i className="fas fa-arrow-left me-1"></i>
                Back to List
              </button>
            </Link>
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
                      <h6 className="mb-0">Subcategory Image</h6>
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
                            {!existingImage && (
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
                            )}
                          </div>
                        ) : (
                          <div className="border rounded p-4 bg-light">
                            <i className="fas fa-image fa-3x text-muted mb-2"></i>
                            <p className="text-muted mb-0">No image</p>
                          </div>
                        )}
                      </div>

                      <input
                        type="file"
                        className="form-control"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                      />
                      <small className="text-muted d-block mt-2">
                        Leave empty to keep current image
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
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-1"></i>
                      Update Subcategory
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

export default EditSub;