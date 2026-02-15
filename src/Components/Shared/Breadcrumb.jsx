import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <>
      <style>
        {`
          .breadcrumb-container {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            font-size: 14px;
            margin-bottom: 20px;
          }

          .breadcrumb-item {
            cursor: pointer;
            color: #0d6efd;
            transition: color 0.2s ease;
          }

          .breadcrumb-item:hover {
            color: #0a58ca;
            text-decoration: underline;
          }

          .breadcrumb-separator {
            margin: 0 8px;
            color: #6c757d;
          }

          .breadcrumb-active {
            color: #6c757d;
            cursor: default;
            text-decoration: none;
          }
        `}
      </style>

      <div className="breadcrumb-container">
        {/* Dashboard */}
        <span
          className="breadcrumb-item"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </span>

        {pathnames.map((value, index) => {
          const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
          const isLast = index === pathnames.length - 1;

          return (
            <React.Fragment key={routeTo}>
              <span className="breadcrumb-separator">/</span>

              {isLast ? (
                <span className="breadcrumb-active">
                  {value.replace("-", " ").toUpperCase()}
                </span>
              ) : (
                <span
                  className="breadcrumb-item"
                  onClick={() => navigate(routeTo)}
                >
                  {value.replace("-", " ").toUpperCase()}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

export default Breadcrumb;
