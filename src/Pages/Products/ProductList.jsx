import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../../Components/Shared/Breadcrumb";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  /* ================= DUMMY DATA ================= */
  useEffect(() => {
    const dummyProducts = [
      {
        id: 1,
        productName: "Basmati Rice 5kg",
        mrp: 550,
        offerPrice: 480,
        stock: 20,
        weight: "5",
        unit: "kg",
        category: "Rice",
        subCategory: "Basmati Rice",
        images: ["https://via.placeholder.com/100"],
      },
      {
        id: 2,
        productName: "Sunflower Oil 1L",
        mrp: 210,
        offerPrice: 180,
        stock: 15,
        weight: "1",
        unit: "litre",
        category: "Oil",
        subCategory: "Sunflower Oil",
        images: ["https://via.placeholder.com/100"],
      },
      {
        id: 3,
        productName: "Toor Dal 2kg",
        mrp: 320,
        offerPrice: 290,
        stock: 0,
        weight: "2",
        unit: "kg",
        category: "Pulses",
        subCategory: "Toor Dal",
        images: ["https://via.placeholder.com/100"],
      },
    ];

    setProducts(dummyProducts);
    setFilteredData(dummyProducts);
  }, []);

  /* ================= SEARCH ================= */
  useEffect(() => {
    const filtered = products.filter((item) =>
      item.productName.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [search, products]);

  /* ================= DELETE (UI ONLY) ================= */
  const handleDelete = (id) => {
    if (!window.confirm("Delete this product?")) return;
    const updated = products.filter((item) => item.id !== id);
    setProducts(updated);
    setFilteredData(updated);
  };

  /* ================= PAGINATION ================= */
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
            + Add Product
          </Link>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            {/* Controls */}
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
                placeholder="Search product..."
                className="form-control w-25"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {currentData.length === 0 ? (
              <p className="text-center text-muted">No products found</p>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Image</th>
                        <th>Grocery</th>
                        <th>SubGrocery</th>
                        <th>Product</th>
                        <th>Brand</th>
                        <th>Pricing</th>
                        <th>Stock</th>
                        <th>Weight</th>
                        <th>GST</th>
                        <th>Discount</th>
                        <th>Featured</th>
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
                              src={item.images[0]}
                              alt=""
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "6px",
                              }}
                            />
                          </td>
                          <td>{item.category}</td>
                          <td>{item.subCategory}</td>

                          
                          <td>{item.productName}</td>
                          <td>₹{item.mrp}</td>
                          <td>₹{item.offerPrice}</td>

                          <td>
                            <span
                              className={`badge ${
                                item.stock > 0 ? "bg-success" : "bg-danger"
                              }`}
                            >
                              {item.stock}
                            </span>
                          </td>

                          <td>
                            {item.weight} {item.unit}
                          </td>

                          <td>{item.discount}</td>
                          <td>{item.gst}</td>
                          <td>{item.feature}</td>

                          <td className={item.status === "Active" ? "text-success" : "text-danger"}>
                            {item.status}
                          </td>
                          <td className="d-flex">
                            <Link
                              to={`/EditProduct/${item.id}`}
                              className="btn btn-sm btn-warning me-2"
                            >
                              Edit
                            </Link>

                            <button
                              onClick={() => handleDelete(item.id)}
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
                        className={`page-item ${
                          currentPage === i + 1 ? "active" : ""
                        }`}
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

export default ProductList;
