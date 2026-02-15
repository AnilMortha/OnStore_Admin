import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

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
  const [lowStockAlert, setLowStockAlert] = useState("");

  // Product Details
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("");

  // Category
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  // Images
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  /* ================= LOAD PRODUCT ================= */
  useEffect(() => {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const product = products.find(p => p.id === Number(id));

    // Dummy categories
    setCategories([
      { _id: "1", Categoryname: "Rice" },
      { _id: "2", Categoryname: "Oil" }
    ]);

    if (!product) {
      alert("Product not found ❌");
      navigate(-1);
      return;
    }

    // Prefill values
    setProductName(product.productName);
    setDescription(product.description);
    setBrand(product.brand);
    setSku(product.sku);
    setMrp(product.mrp);
    setOfferPrice(product.offerPrice);
    setGst(product.gst);
    setStock(product.stock);
    setLowStockAlert(product.lowStockAlert);
    setWeight(product.weight);
    setUnit(product.unit);
    setCategory(product.category);
    setSubCategory(product.subCategory);
    setPreviews(product.images || []);

    setSubCategories([
      { _id: "10", SubCategoryname: "Basmati Rice" }
    ]);

    setLoading(false);
  }, [id, navigate]);

  /* ================= IMAGE CHANGE ================= */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length < 3 || files.length > 5) {
      setMessage("Min 3 & Max 5 images allowed ❌");
      return;
    }

    setImages(files);
    setPreviews(files.map(file => URL.createObjectURL(file)));
    setMessage("");
  };

  /* ================= UPDATE PRODUCT ================= */
  const handleUpdate = (e) => {
    e.preventDefault();

    const products = JSON.parse(localStorage.getItem("products")) || [];

    const updatedProducts = products.map(item =>
      item.id === Number(id)
        ? {
            ...item,
            productName,
            description,
            brand,
            sku,
            mrp,
            offerPrice,
            gst,
            stock,
            lowStockAlert,
            weight,
            unit,
            category,
            subCategory,
            images: previews
          }
        : item
    );

    localStorage.setItem("products", JSON.stringify(updatedProducts));

    alert("Product Updated Successfully ✅");
    navigate("/ProductList");
  };

  if (loading) return <h4 className="text-center mt-4">Loading...</h4>;

  return (
    <div className="page-content">
      <div className="container-fluid py-4">
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between">
            <h4>Edit Product</h4>
            <Link to="/ProductList">
              <button className="btn btn-secondary btn-sm">← Back</button>
            </Link>
          </div>

          <div className="card-body">
            {message && <div className="alert alert-info">{message}</div>}

            <form onSubmit={handleUpdate}>

              {/* Category */}
              <div className="mb-3">
                <label>Select Grocery *</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="">-- Select Grocery --</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.Categoryname}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub Category */}
              <div className="mb-3">
                <label>Select Sub Grocery *</label>
                <select
                  className="form-select"
                  value={subCategory}
                  onChange={e => setSubCategory(e.target.value)}
                >
                  <option value="">-- Select Sub Grocery --</option>
                  {subCategories.map(sub => (
                    <option key={sub._id} value={sub._id}>
                      {sub.SubCategoryname}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label>Product Name *</label>
                <input className="form-control"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label>Description *</label>
                <textarea className="form-control"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Brand *</label>
                  <input className="form-control"
                    value={brand}
                    onChange={e => setBrand(e.target.value)}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>SKU *</label>
                  <input className="form-control"
                    value={sku}
                    onChange={e => setSku(e.target.value)}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label>MRP *</label>
                  <input type="number" className="form-control"
                    value={mrp}
                    onChange={e => setMrp(e.target.value)}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label>Offer Price *</label>
                  <input type="number" className="form-control"
                    value={offerPrice}
                    onChange={e => setOfferPrice(e.target.value)}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label>GST %</label>
                  <input type="number" className="form-control"
                    value={gst}
                    onChange={e => setGst(e.target.value)}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Stock *</label>
                  <input type="number" className="form-control"
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Low Stock Alert</label>
                  <input type="number" className="form-control"
                    value={lowStockAlert}
                    onChange={e => setLowStockAlert(e.target.value)}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Weight *</label>
                  <input className="form-control"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Unit *</label>
                  <select className="form-select"
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                  >
                    <option value="">Select Unit</option>
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="litre">litre</option>
                    <option value="ml">ml</option>
                    <option value="pieces">pieces</option>
                  </select>
                </div>
              </div>

              {/* Images */}
              <div className="mb-3">
                <label>Update Images (Min 3 - Max 5)</label>
                <input type="file" multiple
                  className="form-control"
                  onChange={handleImageChange}
                />
              </div>

              {previews.length > 0 && (
                <div className="d-flex gap-2 flex-wrap mb-3">
                  {previews.map((img, i) => (
                    <img key={i}
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
                Update Product
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
