import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import httpClient from "../../Utils/httpClient";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Basic Info
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [sku, setSku] = useState("");

  // Pricing
  const [mrp, setMrp] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [gst, setGst] = useState("");

  // Stock
  const [stock, setStock] = useState("");
  const [lowStockAlert, setLowStockAlert] = useState("5");

  // Product Details
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("kg");
  const [productType, setProductType] = useState("Veg");

  // Category
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  // Extra
  const [expiryDate, setExpiryDate] = useState("");
  const [status, setStatus] = useState("active");
  const [isFeatured, setIsFeatured] = useState(false);
  const [tags, setTags] = useState("");

  // Images
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [imagesToKeep, setImagesToKeep] = useState([]);

  const [loading, setLoading] = useState(true);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Fetch data on mount
  useEffect(() => {
    fetchCategories();
    fetchProductData();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await httpClient.get("/categories/get_all.php");
      if (response.data.status) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await httpClient.get(`/subcategories/get_by_category.php?category_id=${categoryId}`);
      if (response.data.status) {
        setSubCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const fetchProductData = async () => {
    setFetchLoading(true);
    try {
      const response = await httpClient.get(`/products/get_single.php?id=${id}`);
      
      if (response.data.status) {
        const data = response.data.data;
        
        // Set form fields
        setProductName(data.productName || "");
        setDescription(data.description || "");
        setBrand(data.brand || "");
        setSku(data.sku || "");
        setMrp(data.mrp || "");
        setOfferPrice(data.offerPrice || "");
        setGst(data.gst || "");
        setStock(data.stock || "");
        setLowStockAlert(data.lowStockAlert || "5");
        setWeight(data.weight || "");
        setUnit(data.unit || "kg");
        setProductType(data.productType || "Veg");
        setCategory(data.category || "");
        setSubCategory(data.subCategory || "");
        setExpiryDate(data.expiryDate || "");
        setStatus(data.status || "active");
        setIsFeatured(data.isFeatured === 1);
        setTags(data.tags || "");
        
        // Set images
        if (data.images && data.images.length > 0) {
          const imageUrls = data.images.map(img => 
            img.startsWith('http') ? img : `http://localhost/your-project/${img}`
          );
          setExistingImages(data.images);
          setPreviews(imageUrls);
          setImagesToKeep(data.images);
        }
        
        // Fetch subcategories for this category
        if (data.category) {
          await fetchSubCategories(data.category);
        }
      } else {
        setMessage("Failed to fetch product data ❌");
        setTimeout(() => navigate("/ProductList"), 2000);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setMessage("Error loading product data ❌");
    } finally {
      setFetchLoading(false);
      setLoading(false);
    }
  };

  const handleCategoryChange = async (id) => {
    setCategory(id);
    setSubCategory("");
    if (id) {
      await fetchSubCategories(id);
    } else {
      setSubCategories([]);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = previews.length + files.length;

    if (totalImages < 3) {
      setMessage(`Minimum 3 images required. Currently: ${totalImages} ❌`);
      return;
    }

    if (totalImages > 5) {
      setMessage(`Maximum 5 images allowed. Currently: ${totalImages} ❌`);
      return;
    }

    setImages([...images, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
    setMessage("");
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    const newImagesToKeep = [...imagesToKeep];
    
    // Check if it's an existing image or new upload
    if (index < imagesToKeep.length) {
      // Remove from images to keep
      newImagesToKeep.splice(index, 1);
      setImagesToKeep(newImagesToKeep);
    } else {
      // Remove from new images
      const newImageIndex = index - imagesToKeep.length;
      newImages.splice(newImageIndex, 1);
      setImages(newImages);
    }
    
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
    
    if (newPreviews.length < 3) {
      setMessage("Minimum 3 images required ❌");
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!productName.trim()) errors.productName = "Product name is required";
    if (!description.trim()) errors.description = "Description is required";
    if (!brand.trim()) errors.brand = "Brand is required";
    if (!mrp || mrp <= 0) errors.mrp = "Valid MRP is required";
    if (!offerPrice || offerPrice <= 0) errors.offerPrice = "Valid offer price is required";
    if (!stock || stock < 0) errors.stock = "Valid stock is required";
    if (!weight.trim()) errors.weight = "Weight is required";
    if (!unit) errors.unit = "Unit is required";
    if (!category) errors.category = "Category is required";
    if (!subCategory) errors.subCategory = "Subcategory is required";
    if (previews.length < 3) errors.images = "Minimum 3 images required";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage("Please fill all required fields ❌");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      
      formData.append("id", id);
      formData.append("productName", productName);
      formData.append("description", description);
      formData.append("brand", brand);
      formData.append("sku", sku);
      formData.append("mrp", mrp);
      formData.append("offerPrice", offerPrice);
      formData.append("gst", gst || 0);
      formData.append("stock", stock);
      formData.append("lowStockAlert", lowStockAlert);
      formData.append("weight", weight);
      formData.append("unit", unit);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("productType", productType);
      formData.append("expiryDate", expiryDate);
      formData.append("status", status);
      formData.append("isFeatured", isFeatured ? 1 : 0);
      formData.append("tags", tags);
      formData.append("keep_images", JSON.stringify(imagesToKeep));

      // Append new images
      images.forEach((image) => {
        formData.append("images[]", image);
      });

      const response = await httpClient.post("/products/edit.php", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.status) {
        setMessage("Product Updated Successfully ✅");
        setTimeout(() => navigate("/ProductList"), 1500);
      } else {
        setMessage(response.data.message || "Failed to update product ❌");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage(err.response?.data?.message || "Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="page-content">
        <div className="container-fluid py-4 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading product data...</p>
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
              Edit Product
            </h4>
            <Link to="/ProductList">
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
                {/* Left Column - Same as AddProduct */}
                <div className="col-md-8">
                  {/* Category Selection */}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Category <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`form-select ${fieldErrors.category ? 'is-invalid' : ''}`}
                        value={category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                      >
                        <option value="">-- Select Category --</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.Categoryname}
                          </option>
                        ))}
                      </select>
                      {fieldErrors.category && (
                        <div className="invalid-feedback">{fieldErrors.category}</div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Sub Category <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`form-select ${fieldErrors.subCategory ? 'is-invalid' : ''}`}
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        disabled={!category}
                      >
                        <option value="">-- Select Sub Category --</option>
                        {subCategories.map((sub) => (
                          <option key={sub._id} value={sub._id}>
                            {sub.SubCategoryname}
                          </option>
                        ))}
                      </select>
                      {fieldErrors.subCategory && (
                        <div className="invalid-feedback">{fieldErrors.subCategory}</div>
                      )}
                    </div>
                  </div>

                  {/* Product Name */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Product Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${fieldErrors.productName ? 'is-invalid' : ''}`}
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                    />
                    {fieldErrors.productName && (
                      <div className="invalid-feedback">{fieldErrors.productName}</div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className={`form-control ${fieldErrors.description ? 'is-invalid' : ''}`}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="3"
                    />
                    {fieldErrors.description && (
                      <div className="invalid-feedback">{fieldErrors.description}</div>
                    )}
                  </div>

                  {/* Brand and SKU */}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Brand <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${fieldErrors.brand ? 'is-invalid' : ''}`}
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                      />
                      {fieldErrors.brand && (
                        <div className="invalid-feedback">{fieldErrors.brand}</div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">SKU</label>
                      <input
                        type="text"
                        className="form-control"
                        value={sku}
                        disabled
                        readOnly
                      />
                      <small className="text-muted">SKU cannot be changed</small>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-bold">
                        MRP (₹) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className={`form-control ${fieldErrors.mrp ? 'is-invalid' : ''}`}
                        value={mrp}
                        onChange={(e) => setMrp(e.target.value)}
                        min="0"
                        step="0.01"
                      />
                      {fieldErrors.mrp && (
                        <div className="invalid-feedback">{fieldErrors.mrp}</div>
                      )}
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-bold">
                        Offer Price (₹) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className={`form-control ${fieldErrors.offerPrice ? 'is-invalid' : ''}`}
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(e.target.value)}
                        min="0"
                        step="0.01"
                      />
                      {fieldErrors.offerPrice && (
                        <div className="invalid-feedback">{fieldErrors.offerPrice}</div>
                      )}
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-bold">GST (%)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={gst}
                        onChange={(e) => setGst(e.target.value)}
                        min="0"
                        max="100"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Stock */}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Stock <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className={`form-control ${fieldErrors.stock ? 'is-invalid' : ''}`}
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        min="0"
                      />
                      {fieldErrors.stock && (
                        <div className="invalid-feedback">{fieldErrors.stock}</div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Low Stock Alert</label>
                      <input
                        type="number"
                        className="form-control"
                        value={lowStockAlert}
                        onChange={(e) => setLowStockAlert(e.target.value)}
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Weight and Unit */}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Weight <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${fieldErrors.weight ? 'is-invalid' : ''}`}
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                      />
                      {fieldErrors.weight && (
                        <div className="invalid-feedback">{fieldErrors.weight}</div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Unit <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`form-select ${fieldErrors.unit ? 'is-invalid' : ''}`}
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="litre">litre</option>
                        <option value="ml">ml</option>
                        <option value="pieces">pieces</option>
                        <option value="pack">pack</option>
                      </select>
                      {fieldErrors.unit && (
                        <div className="invalid-feedback">{fieldErrors.unit}</div>
                      )}
                    </div>
                  </div>

                  {/* Product Type and Expiry */}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Product Type</label>
                      <select
                        className="form-select"
                        value={productType}
                        onChange={(e) => setProductType(e.target.value)}
                      >
                        <option value="Veg">Veg</option>
                        <option value="Non-Veg">Non-Veg</option>
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Expiry Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Tags</label>
                    <input
                      type="text"
                      className="form-control"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="Enter tags separated by commas"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="col-md-4">
                  {/* Images */}
                  <div className="card mb-3">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">
                        Product Images <span className="text-danger">*</span>
                        <small className="text-muted ms-2">(Min 3, Max 5)</small>
                      </h6>
                    </div>
                    <div className="card-body">
                      <input
                        type="file"
                        multiple
                        className={`form-control ${fieldErrors.images ? 'is-invalid' : ''}`}
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                      />
                      {fieldErrors.images && (
                        <div className="invalid-feedback">{fieldErrors.images}</div>
                      )}

                      {previews.length > 0 && (
                        <div className="d-flex flex-wrap gap-2 mt-3">
                          {previews.map((img, index) => (
                            <div key={index} className="position-relative">
                              <img
                                src={img}
                                alt={`preview ${index + 1}`}
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                  border: "1px solid #ddd"
                                }}
                              />
                              <button
                                type="button"
                                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                onClick={() => removeImage(index)}
                                style={{ borderRadius: "50%", padding: "0 6px" }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <small className="text-muted d-block mt-2">
                        Selected: {previews.length} images
                      </small>
                    </div>
                  </div>

                  {/* Status and Featured */}
                  <div className="card mb-3">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">Settings</h6>
                    </div>
                    <div className="card-body">
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

                      <div className="mb-3">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="featuredSwitch"
                            checked={isFeatured}
                            onChange={(e) => setIsFeatured(e.target.checked)}
                          />
                          <label className="form-check-label fw-bold" htmlFor="featuredSwitch">
                            Featured Product
                          </label>
                        </div>
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
                      Update Product
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

export default EditProduct;