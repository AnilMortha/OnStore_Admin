import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../../Components/Shared/Breadcrumb";

const List = () => {
  const [groceries, setGroceries] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchGroceries();
  }, []);

  useEffect(() => {
    handleSearch(search);
  }, [search, groceries]);

  const fetchGroceries = async () => {
    setLoading(true);

    setGroceries([
      { _id: "1", Categoryname: "Rice", image: "https://via.placeholder.com/80" },
      { _id: "2", Categoryname: "Oil", image: "https://via.placeholder.com/80" },
      { _id: "3", Categoryname: "Sugar", image: "https://via.placeholder.com/80" },
      { _id: "4", Categoryname: "Wheat", image: "https://via.placeholder.com/80" },
      { _id: "5", Categoryname: "Salt", image: "https://via.placeholder.com/80" },
      { _id: "6", Categoryname: "Milk", image: "https://via.placeholder.com/80" }
    ]);

    setLoading(false);
  };

  const handleSearch = (value) => {
    const filtered = groceries.filter((item) =>
      item.Categoryname.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    const updated = groceries.filter((item) => item._id !== id);
    setGroceries(updated);
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
          <h4 className="mb-0">Grocery List</h4>
          <Link to="/AddGrocery" className="btn btn-primary">
            + Add Grocery
          </Link>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">

            {/* Top Controls */}
            <div className="d-flex justify-content-between mb-3">
              <div>
                Show{" "}
                <select
                  value={entries}
                  onChange={(e) => setEntries(Number(e.target.value))}
                  className="form-select d-inline w-auto mx-2"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                entries
              </div>

              <input
                type="text"
                placeholder="Search Grocery..."
                className="form-control w-25"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : currentData.length === 0 ? (
              <p className="text-muted text-center">No groceries found</p>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Image</th>
                        <th>Grocery Name</th>
                        <th width="180">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.map((item, index) => (
                        <tr key={item._id}>
                          <td>{indexOfFirst + index + 1}</td>

                          <td>
                            <img
                              src={item.image}
                              alt={item.Categoryname}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "6px"
                              }}
                            />
                          </td>

                          <td>{item.Categoryname}</td>

                          <td>
                            <Link
                              to={`/EditGrocery/${item._id}`}
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

                {/* Pagination */}
                <div className="d-flex justify-content-end">
                  <ul className="pagination mb-0">
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
                  </ul>
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
