import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../../Components/Shared/Breadcrumb";
import httpClient from "../../Utils/httpClient";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await httpClient.get("/products/get_all.php");
      
      if (response.data.status) {
        setProducts(response.data.data);
        setFilteredData(response.data.data);
      } else {
        setMessage("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setMessage("Server error while fetching data");
    } finally {
      setLoading(false);
    }
  };

  // Search filter
  useEffect(() => {
    const filtered = products.filter((item) =>
      item.productName?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [search, products]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await httpClient.post("/products/delete.php", { id });

      if (response.data.status) {
        setProducts(products.filter((item) => item.id !== id));
        setMessage("Product deleted successfully ✅");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(response.data.message || "Failed to delete ❌");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      setMessage("Server error while deleting ❌");
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/100?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `https://easternbaysolar.com/onstores_apis/api/${imagePath}`;
  };

  // Pagination
  const indexOfLast = currentPage * entries;
  const indexOfFirst = indexOfLast - entries;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / entries);

  return (
    <div className="page-content">
      <div className="container-fluid py-4">
        <Breadcrumb />

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Product List</h4>
          <Link to="/AddProduct" className="btn btn-primary">
            <i className="fas fa-plus me-1"></i>
            Add Product
          </Link>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}>
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage("")}></button>
          </div>
        )}

        <div className="card shadow-sm">
          <div className="card-body">
            {/* Controls */}
            <div className="d-flex justify-content-between mb-3">
              <div className="d-flex align-items-center">
                Show{" "}
                <select
                  value={entries}
                  onChange={(e) => setEntries(Number(e.target.value))}
                  className="form-select d-inline w-auto mx-2"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                entries
              </div>

              <input
                type="text"
                placeholder="Search product..."
                className="form-control w-25"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading products...</p>
              </div>
            ) : currentData.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
                <p className="text-muted">No products found</p>
                <Link to="/AddProduct" className="btn btn-primary btn-sm">
                  Add Your First Product
                </Link>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Image</th>
                        <th>Category</th>
                        <th>SubCategory</th>
                        <th>Product</th>
                        <th>MRP</th>
                        <th>Offer</th>
                        <th>Stock</th>
                        <th>Weight</th>
                        <th>Discount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {currentData.map((item, index) => (
                        <tr key={item.id}>
                          <td>{indexOfFirst + index + 1}</td>

                          <td>
                            <img
                              src={getImageUrl(item.images?.[0])}
                              alt={item.productName}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "6px",
                                border: "1px solid #ddd"
                              }}
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/50?text=Error";
                              }}
                            />
                          </td>

                          <td>
                            <span className="badge bg-info">
                              {item.category || 'N/A'}
                            </span>
                          </td>

                          <td>
                            <span className="badge bg-secondary">
                              {item.subCategory || 'N/A'}
                            </span>
                          </td>

                          <td>
                            <strong>{item.productName}</strong>
                            <br />
                            <small className="text-muted">SKU: {item.sku}</small>
                          </td>

                          <td>
                            <span className="text-decoration-line-through text-muted">
                              ₹{item.mrp}
                            </span>
                          </td>

                          <td>
                            <span className="fw-bold text-success">
                              ₹{item.offerPrice}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`badge ${
                                item.stock > 0 
                                  ? item.stock <= (item.lowStockAlert || 5)
                                    ? 'bg-warning text-dark'
                                    : 'bg-success'
                                  : 'bg-danger'
                              }`}
                            >
                              {item.stock > 0 ? item.stock : 'Out of Stock'}
                            </span>
                          </td>

                          <td>
                            {item.weight} {item.unit}
                          </td>

                          <td>
                            <span className="badge bg-primary">
                              {item.discount || 0}%
                            </span>
                          </td>

                          <td>
                            <span className={`badge ${item.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                              {item.status}
                            </span>
                            {item.isFeatured === 1 && (
                              <i className="fas fa-star text-warning ms-1" title="Featured"></i>
                            )}
                          </td>

                          <td>
                            <Link
                              to={`/EditProduct/${item.id}`}
                              className="btn btn-sm btn-warning me-2"
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </Link>

                            <button
                              onClick={() => handleDelete(item.id)}
                              className="btn btn-sm btn-danger"
                              title="Delete"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredData.length)} of {filteredData.length} entries
                    </div>
                    <ul className="pagination mb-0">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        >
                          Previous
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, i) => (
                        <li
                          key={i}
                          className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;