import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../../Components/Shared/Breadcrumb";

const SubList = () => {
  const [subGroceries, setSubGroceries] = useState([]);

  useEffect(() => {
    setSubGroceries([
      {
        _id: "1",
        SubCategoryname: "Basmati Rice",
        categoryName: "Rice",
        image: "https://via.placeholder.com/60"
      },
      {
        _id: "2",
        SubCategoryname: "Sunflower Oil",
        categoryName: "Oil",
        image: "https://via.placeholder.com/60"
      }
    ]);
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    const updated = subGroceries.filter((item) => item._id !== id);
    setSubGroceries(updated);
  };

  return (
    <div className="page-content">
      <div className="container-fluid py-4">

        <Breadcrumb />

        {/* Header */}
        <div className="d-flex justify-content-between mb-3">
          <h4>Sub Grocery List</h4>
          <Link to="/AddSubGrocery" className="btn btn-primary">
            + Add Sub Grocery
          </Link>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">

            {subGroceries.length === 0 ? (
              <p className="text-center text-muted">No Sub Groceries Found</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Image</th>
                      <th>Sub Grocery</th>
                      <th>Parent Grocery</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {subGroceries.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>

                        <td>
                          <img
                            src={item.image}
                            alt={item.SubCategoryname}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "6px"
                            }}
                          />
                        </td>

                        <td>{item.SubCategoryname}</td>
                        <td>{item.categoryName}</td>

                        <td>
                          <Link
                            to={`/EditSubGrocery/${item._id}`}
                            className="btn btn-sm btn-warning me-2"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(item._id)}
                            className="btn btn-sm btn-danger"
                          >
                            Delete
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
