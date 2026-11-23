import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../../Components/Shared/Breadcrumb";
import httpClient from "../../Utils/httpClient";
const List = () => {
  const [groceries, setGroceries] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch categories from API on component mount
  useEffect(() => {
    fetchGroceries();
  }, []);

  useEffect(() => {
    handleSearch(search);
  }, [search, groceries]);

  const fetchGroceries = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await httpClient.get("/grocery/categories.php");
      
      console.log("API Response:", response.data);
      
      if (response.data.status) {
        setGroceries(response.data.data);
        setFilteredData(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching groceries:", error);
      setError(error.response?.data?.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };
 const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/60?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    // Update the base URL to match your project structure
    return `https://onstores.in/onstores_apis/api/${imagePath}`; // Change this URL as per your setup
  };
  

  const handleSearch = (value) => {
    const filtered = groceries.filter((item) =>
      item.category_name?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    
    try {
      setLoading(true);
      const response = await httpClient.delete(`/grocery/delete.php?id=${id}`);
      
      if (response.data.status) {
        const updated = groceries.filter((item) => item.id !== id);
        setGroceries(updated);
        setFilteredData(updated);
        alert("Category deleted successfully!");
      } else {
        alert(response.data.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert(error.response?.data?.message || "Error deleting category");
    } finally {
      setLoading(false);
    }
  };

  // Get parent category name
  const getParentName = (parentId) => {
    if (parentId === 0 || !parentId) return "Top Level";
    const parent = groceries.find(cat => cat.id === parentId);
    return parent ? parent.category_name : "Unknown";
  };

  // Pagination Logic
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
          <h4 className="mb-0">
            <i className="fas fa-list me-2"></i>
            Grocery Categories ({filteredData.length})
          </h4>
          <Link to="/AddGrocery" className="btn btn-primary">
            <i className="fas fa-plus me-2"></i>
            Add New Category
          </Link>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">

            {/* Top Controls */}
            <div className="row mb-3">
              <div className="col-md-6 d-flex align-items-center">
                <label className="me-2">Show</label>
                <select
                  value={entries}
                  onChange={(e) => {
                    setEntries(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="form-select d-inline w-auto"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="ms-2">entries</span>
              </div>

              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="fas fa-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    placeholder="Search by category name..."
                    className="form-control"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setSearch("")}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
                <button type="button" className="btn-close" onClick={() => setError("")}></button>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading categories...</p>
              </div>
            ) : currentData.length === 0 ? (
              <div className="text-center py-5">
                <img 
                  src="https://via.placeholder.com/200?text=No+Data" 
                  alt="No data"
                  className="mb-3 opacity-50"
                  style={{ maxWidth: "150px" }}
                />
                <p className="text-muted">
                  {search ? "No matching categories found" : "No categories added yet"}
                </p>
                {!search && (
                  <Link to="/AddGrocery" className="btn btn-outline-primary">
                    <i className="fas fa-plus me-2"></i>
                    Add Your First Category
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th width="50">#</th>
                        <th width="80">Image</th>
                        <th>Category Name</th>
                        <th>Status</th>
                        <th>Parent Category</th>
                        <th>Display Order</th>
                        <th>Featured</th>
                        <th width="200">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.map((item, index) => (
                        <tr key={item.id}>
                          <td>{indexOfFirst + index + 1}</td>

                          <td>
  <img
                            src={getImageUrl(item.image)}
                            alt={item.subcategory_name}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "6px",
                              border: "1px solid #ddd"
                            }}
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/60?text=Error";
                            }}
                          />

                          </td>

                          <td>
                            <strong>{item.category_name}</strong>
                            {item.icon && (
                              <span className="ms-2 badge bg-light text-dark" title="Icon">
                                <i className={`fas ${item.icon}`}></i>
                              </span>
                            )}
                          </td>

                          <td>
                            <span className={`badge bg-${item.status === 'active' ? 'success' : 'secondary'}`}>
                              {item.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </td>

                          <td>
                            {getParentName(item.parent_id)}
                          </td>

                          <td>
                            <span className="badge bg-info">{item.display_order || 0}</span>
                          </td>

                          <td>
                            {item.featured ? (
                              <span className="badge bg-warning text-dark">
                                <i className="fas fa-star me-1"></i> Featured
                              </span>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>

                          <td>
                            <div className="btn-group" role="group">
                              <Link
                                to={`/EditGrocery/${item.id}`}
                                className="btn btn-sm btn-warning"
                                title="Edit Category"
                              >
                                <i className="fas fa-edit"></i>
                              </Link>

                              <button
                                onClick={() => handleDelete(item.id)}
                                className="btn btn-sm btn-danger"
                                title="Delete Category"
                                disabled={loading}
                              >
                                <i className="fas fa-trash"></i>
                              </button>

                              <Link
                                to={`/ViewCategory/${item.id}`}
                                className="btn btn-sm btn-info"
                                title="View Details"
                              >
                                <i className="fas fa-eye"></i>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination and Info */}
                <div className="row mt-3">
                  <div className="col-md-6">
                    <p className="text-muted">
                      Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredData.length)} of {filteredData.length} entries
                    </p>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex justify-content-end">
                      <ul className="pagination mb-0">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          >
                            <i className="fas fa-chevron-left"></i>
                          </button>
                        </li>
                        
                        {[...Array(totalPages)].map((_, i) => (
                          <li
                            key={i}
                            className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
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
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          >
                            <i className="fas fa-chevron-right"></i>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default List;