import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getUser } from "../../app/actions/user.actions";
import { logout } from "../../app/slices/user.slice";
import Profile from "../../Pages/Profile";
import NotificationDropdown from "../NotificationDropdown";
import UserImage from "../../assets/user.jpeg";
import LogoImage from "../../assets/TasteBudsLogo.png";

Modal.setAppElement("div");

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    if (
      sessionStorage.getItem("Authorization") &&
      sessionStorage.getItem("userId")
    ) {
      if (!user.loginStatus) {
        dispatch(getUser(sessionStorage.getItem("userId")));
      }
    }

    if (!sessionStorage.getItem("Authorization")) {
      navigate("/login");
    }
  }, [dispatch, user.loginStatus]);

  return (
    <div>
      <nav
        className="navbar bg-white border-bottom shadow-sm sticky-top px-4"
        style={{ height: "65px", zIndex: 999 }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {/* Left - Logo */}
          <Link to="/" className="d-flex align-items-center">
            <img
              src={LogoImage}
              alt="Logo"
              height="45"
              className="me-2"
              style={{ objectFit: "contain" }}
            />
          </Link>

          {/* Center - Search */}
          <div className="flex-grow-1 mx-4" style={{ maxWidth: "600px" }}>
            <input
              type="text"
              className="form-control rounded-pill px-4 py-2 border bg-light"
              placeholder="Search TasteBuds"
            />
          </div>

          {/* Right - Actions */}
          <div className="d-flex align-items-center">
            {!user.loginStatus ? (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-primary rounded-pill me-2 px-3"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-primary rounded-pill px-3"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className="nav-link text-dark fw-semibold me-3">
                  Feed
                </Link>

                <Link to="/user" className="nav-link text-dark fw-semibold me-3">
                  Profile
                </Link>

                <NotificationDropdown />

                <div
                  className="d-flex align-items-center ms-3 text-decoration-none"
                  style={{ cursor: "pointer" }}
                  onClick={() => setModalIsOpen(true)}
                >
                  <img
                    src={user?.user?.profileImage || UserImage}
                    alt="User"
                    className="rounded-circle"
                    height="40"
                    width="40"
                    style={{ objectFit: "cover" }}
                  />
                </div>

                <button
                  className="btn btn-outline-danger rounded-pill ms-3 px-3"
                  onClick={() => dispatch(logout())}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Modal for user profile */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="User Profile Modal"
      >
        <div className="p-2">
          <Profile closeModal={() => setModalIsOpen(false)} />
        </div>
      </Modal>
    </div>
  );
}

export default Navbar;