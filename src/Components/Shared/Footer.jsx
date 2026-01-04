import React from "react";

const Footer = () => {
  return (
    <section>
    <footer className="footer">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 text-center">
            {new Date().getFullYear()} &copy; ON STORE. Crafted by{" "}
            <iconify-icon
              icon="iconamoon:heart-duotone"
              class="fs-18 align-middle text-danger"
            ></iconify-icon>{" "}
            <p
              className="fw-bold footer-text"
            >
              ONSTORE
            </p>
          </div>
        </div>
      </div>
    </footer>
    </section>
  );
};

export default Footer;
