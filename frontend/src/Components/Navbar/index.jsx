import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getUser } from "../../app/actions/user.actions";
import { logout } from "../../app/slices/user.slice";
import Profile from "../../Pages/Profile";
import NotificationDropdown from "../NotificationDropdown";
import UserImage from "../../assets/user.jpeg";
import { FaDumbbell, FaSearch, FaSignOutAlt, FaUser, FaHome, FaUsers, FaEnvelope } from "react-icons/fa";

Modal.setAppElement("div");

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
  }, [dispatch, user.loginStatus, navigate]);

  return (
    <div>
      <nav
        className="navbar navbar-expand-lg bg-dark border-bottom shadow-sm sticky-top text-light"
        style={{ height: "70px", zIndex: 999 }}
      >
        <div className="container">
          {/* Logo */}
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <FaDumbbell className="text-primary me-2" size={24} />
            <span className="fw-bold text-primary fs-4">FitTribe</span>
          </Link>

          {/* Mobile Toggle Button */}
          <button
            className="navbar-toggler bg-light"
            type="button"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible Navbar Content */}
          <div className={`collapse navbar-collapse ${showMobileMenu ? 'show' : ''}`}>
            {/* Search Bar - Centered on desktop */}
            <div className="d-none d-lg-block mx-auto" style={{ width: "40%" }}>
              <div className="input-group">
                <span className="input-group-text bg-dark border-end-0 border-secondary">
                  <FaSearch className="text-light" />
                </span>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-start-0 border-secondary"
                  placeholder="Search workouts, users, or exercises..."
                />
              </div>
            </div>

            {/* Navigation Links */}
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
              {!user.loginStatus ? (
                <>
                  <li className="nav-item">
                    <Link
                      to="/login"
                      className="btn btn-outline-primary rounded-pill me-2 px-3"
                    >
                      Log In
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/signup"
                      className="btn btn-primary rounded-pill px-3"
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  {/* Search Bar - For Mobile Only */}
                  <li className="nav-item d-lg-none w-100 mb-3">
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-end-0 border-secondary">
                        <FaSearch className="text-light" />
                      </span>
                      <input
                        type="text"
                        className="form-control bg-dark text-light border-start-0 border-secondary"
                        placeholder="Search workouts, users, or exercises..."
                      />
                    </div>
                  </li>

                  <li className="nav-item">
                    <Link to="/" className="nav-link position-relative px-3 text-light">
                      <FaHome size={20} />
                      <span className="d-lg-none ms-2">Home</span>
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link to="/community" className="nav-link position-relative px-3 text-light">
                      <FaUsers size={20} />
                      <span className="d-lg-none ms-2">Community</span>
                    </Link>
                  </li>

                  {/* New Messaging Nav Item */}
                  <li className="nav-item">
                    <Link to="/messaging" className="nav-link position-relative px-3 text-light">
                      <FaEnvelope size={20} />
                      <span className="d-lg-none ms-2">Messages</span>
                    </Link>
                  </li>

                  <li className="nav-item">
                    {/* Replaced FaBell with NotificationDropdown component */}
                    <NotificationDropdown />
                    <span className="d-lg-none ms-2 text-light">Notifications</span>
                  </li>

                  <li className="nav-item">
                    <Link to="/user" className="nav-link px-3 text-light">
                      <FaUser size={20} />
                      <span className="d-lg-none ms-2">Profile</span>
                    </Link>
                  </li>

                  <li className="nav-item ms-2">
                    <div
                      className="d-flex align-items-center"
                      style={{ cursor: "pointer" }}
                      onClick={() => setModalIsOpen(true)}
                    >
                      <div className="position-relative">
                        <img
                          src={user?.user?.profileImage || UserImage}
                          alt="User"
                          className="rounded-circle border border-2 border-primary"
                          height="40"
                          width="40"
                          style={{ objectFit: "cover" }}
                        />
                        <span className="position-absolute bottom-0 end-0 bg-success rounded-circle p-1 border border-dark"></span>
                      </div>
                      <span className="d-lg-none ms-2 text-light">
                        {user?.user?.name || "User"}
                      </span>
                    </div>
                  </li>

                  <li className="nav-item ms-3">
                    <button
                      className="btn btn-outline-danger rounded-pill d-flex align-items-center"
                      onClick={() => dispatch(logout())}
                    >
                      <FaSignOutAlt className="me-lg-0 me-2" />
                      <span className="d-lg-none">Logout</span>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Modal for user profile */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '12px',
            padding: '0',
            maxWidth: '90%',
            maxHeight: '90%',
            overflow: 'auto',
            border: 'none',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            background: '#1e1e1e'  // Dark background for the modal
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1000
          }
        }}
        contentLabel="User Profile Modal"
      >
        <div className="p-2">
          <button 
            className="btn btn-sm btn-dark position-absolute top-0 end-0 m-3 rounded-circle text-light"
            onClick={() => setModalIsOpen(false)}
          >
            &times;
          </button>
          <Profile closeModal={() => setModalIsOpen(false)} />
        </div>
      </Modal>
    </div>
  );
}

export default Navbar;