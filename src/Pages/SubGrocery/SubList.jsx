import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../../Components/Shared/Breadcrumb";
import httpClient from "../../Utils/httpClient";

const SubList = () => {
  const [subGroceries, setSubGroceries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch subcategories on component mount
  useEffect(() => {
    fetchSubCategories();
  }, []);

  const fetchSubCategories = async () => {
    setLoading(true);
    try {
      const response = await httpClient.get("/subcategories/get_all.php");
      
      if (response.data.status) {
        setSubGroceries(response.data.data);
      } else {
        setMessage("Failed to fetch subcategories");
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setMessage("Server error while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subcategory?")) return;

    try {
      const response = await httpClient.post("/subcategories/delete.php", {
        id: id
      });

      if (response.data.status) {
        // Remove from UI
        setSubGroceries(subGroceries.filter((item) => item.id !== id));
        setMessage("Subcategory deleted successfully ✅");
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(response.data.message || "Failed to delete ❌");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      setMessage("Server error while deleting ❌");
    }
  };

  // Get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/60?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    // Update the base URL to match your project structure
    return `https://onstores.in/onstores_apis/api/${imagePath}`; // Change this URL as per your setup
  };

  return (
    <div className="page-content">
      <div className="container-fluid py-4">

        <Breadcrumb />

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Subcategory List</h4>
          <Link to="/AddSubGrocery" className="btn btn-primary">
            <i className="fas fa-plus me-1"></i>
            Add New Subcategory
          </Link>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert">
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage("")}></button>
          </div>
        )}

        <div className="card shadow-sm">
          <div className="card-body">

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading subcategories...</p>
              </div>
            ) : subGroceries.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
                <p className="text-muted">No Subcategories Found</p>
                <Link to="/AddSubGrocery" className="btn btn-primary btn-sm">
                  Add Your First Subcategory
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Image</th>
                      <th>Subcategory</th>
                      <th>Parent Category</th>
                      <th>Status</th>
                      <th>Display Order</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {subGroceries.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>

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
                          <strong>{item.subcategory_name}</strong>
                          {item.icon && (
                            <span className="ms-2" title="Icon">{item.icon}</span>
                          )}
                        </td>

                        <td>
                          <span className="badge bg-info">
                            {item.parent_category_name || 'N/A'}
                          </span>
                        </td>

                        <td>
                          <span className={`badge ${item.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                            {item.status || 'active'}
                          </span>
                        </td>

                        <td>
                          <span className="badge bg-light text-dark">
                            {item.display_order || 0}
                          </span>
                        </td>

                        <td>
                          <Link
                            to={`/EditSubGrocery/${item.id}`}
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
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default SubList;