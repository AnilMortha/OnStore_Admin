import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const AddProduct = () => {
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
  const [lowStockAlert, setLowStockAlert] = useState("");

  // Product Details
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("");
  const [productType, setProductType] = useState("");

  // grocery
  
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
  const [previews, setPreviews] = useState([]);

  const [message, setMessage] = useState("");

  useEffect(() => {
    setCategories([
      { _id: "1", groceryname: "Rice" },
      { _id: "2", groceryname: "Oil" }
    ]);
  }, []);

  const handlegroceryChange = (id) => {
    setgrocery(id);
    setSubCategories([
      { _id: "10", Subgroceryname: "Basmati Rice" }
    ]);
  };

  const handleCategoryChange = (id) => {
    setCategory(id);
    setSubCategory("");

    setSubCategories([
      { _id: "10", SubCategoryname: "Basmati Rice" }
    ]);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length < 3) {
      setMessage("Minimum 3 images required ❌");
      return;
    }

    if (files.length > 5) {
      setMessage("Maximum 5 images allowed ❌");
      return;
    }

    setImages(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !productName ||
      !description ||
      !brand ||
      !sku ||
      !mrp ||
      !offerPrice ||
      !stock ||
      !weight ||
      !unit ||
      !categories ||
      !subCategories
    ) {
      setMessage("All required fields must be filled ❌");
      return;
    }

    if (images.length < 3) {
      setMessage("Minimum 3 images required ❌");
      return;
    }

    const discount =
      mrp && offerPrice
        ? Math.round(((mrp - offerPrice) / mrp) * 100)
        : 0;

    const newProduct = {
      id: Date.now(),
      productName,
      description,
      brand,
      sku,
      mrp,
      offerPrice,
      gst,
      discount,
      stock,
      lowStockAlert,
      weight,
      unit,
      productType,
      categories,
      subCategories,
      status,
      isFeatured,
      tags: tags.split(","),
      images: previews
    };

    const existingProducts =
      JSON.parse(localStorage.getItem("products")) || [];

    localStorage.setItem(
      "products",
      JSON.stringify([...existingProducts, newProduct])
    );

    setMessage("Product Added Successfully ✅");

    setTimeout(() => navigate(-1), 1500);
    
  };
   useEffect(() => {
    setCategories([
      { _id: "1", Categoryname: "Rice" },
      { _id: "2", Categoryname: "Oil" }
    ]);
  }, []);

  return (
    <div className="page-content">
    <div className="container-fluid py-4">
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between mb-3">
          <h4>Add Product</h4>
          <Link to="/ProductList">
            <button
              className="btn btn-secondary btn-sm"
            >
              ← Back
            </button>
            </Link>
        </div>

        <div className="card-body">
          {message && <div className="alert alert-info">{message}</div>}

          <form onSubmit={handleSubmit}>

            {/* Category */}
              <div className="mb-3">
                <label className="form-label">Select Grocery *</label>
                <select
                  className={`form-select ${message.category && "is-invalid"}`}
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  <option value="">-- Select Grocery --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.Categoryname}
                    </option>
                  ))}
                </select>
                {message.category && (
                  <div className="invalid-feedback">
                    {message.category}
                  </div>
                )}
              </div>

              {/* Sub Category */}
              <div className="mb-3">
                <label className="form-label">Select Sub Grocery *</label>
                <select
                  className={`form-select ${message.subCategory && "is-invalid"}`}
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                >
                  <option value="">-- Select Sub Grocery --</option>
                  {subCategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.SubCategoryname}
                    </option>
                  ))}
                </select>
                {message.subCategory && (
                  <div className="invalid-feedback">
                    {message.subCategory}
                  </div>
                )}
              </div>

            <div className="mb-3">
              <label>Product Name *</label>
              <input className="form-control"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>Description *</label>
              <textarea className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Brand *</label>
                <input className="form-control"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>SKU *</label>
                <input className="form-control"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label>MRP *</label>
                <input type="number" className="form-control"
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label>Offer Price *</label>
                <input type="number" className="form-control"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label>GST %</label>
                <input type="number" className="form-control"
                  value={gst}
                  onChange={(e) => setGst(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Stock *</label>
                <input type="number" className="form-control"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Low Stock Alert</label>
                <input type="number" className="form-control"
                  value={lowStockAlert}
                  onChange={(e) => setLowStockAlert(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label>Weight *</label>
                <input className="form-control"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label>Unit *</label>
                <select className="form-select"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  <option value="">Select Unit</option>
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="litre">litre</option>
                  <option value="ml">ml</option>
                  <option value="pieces">pieces</option>
                  <option value="pack">pack</option>
                </select>
              </div>

              {/* <div className="col-md-4 mb-3">
                <label>Product Type</label>
                <select className="form-select"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                </select>
              </div> */}
            </div>

            <div className="mb-3">
              <label>Upload Images (Min 3 - Max 5)</label>
              <input type="file" multiple
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            {previews.length > 0 && (
              <div className="d-flex gap-2 flex-wrap mb-3">
                {previews.map((img, index) => (
                  <img key={index}
                    src={img}
                    alt="preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px"
                    }}
                  />
                ))}
              </div>
            )}

            <button type="submit" className="btn btn-primary">
              Add Product
            </button>

          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AddProduct;
