import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { login, register } from "../../app/actions/user.actions";
import { FaGoogle, FaFacebook, FaInstagram, FaDumbbell, FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

function AuthPage() {
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(login({ username, password }))
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(register({ username, email, password }))
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
  };

  const handleOAuthLogin = (provider) => {
    // Implementation for OAuth 2.0 login with different providers
    console.log(`Logging in with ${provider}`);
    // Redirect to OAuth provider
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.8 }
    }
  };

  const slideVariants = {
    hidden: { opacity: 0, x: isLogin ? 50 : -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, x: isLogin ? -50 : 50, transition: { duration: 0.6 } }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      background: "linear-gradient(135deg, #0a0a0a, #1a1a1a)"
    }}>
      <div className="container">
        <div className="row" style={{
          borderRadius: "20px",
          overflow: "hidden",
          maxWidth: "1000px",
          margin: "0 auto",
          boxShadow: "0 15px 50px rgba(0,0,0,0.3)"
        }}>
          {/* Left Section - Branding and Animation */}
          <motion.div 
            className="col-md-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              background: "linear-gradient(45deg, #1e3c72, #2a5298)",
              padding: "3rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              overflow: "hidden",
              color: "white"
            }}
          >
            {/* Pattern overlay */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")",
              pointerEvents: "none"
            }}></div>
            
            <div style={{
              position: "relative",
              zIndex: 1,
              textAlign: "center"
            }}>
              <motion.div 
                style={{
                  display: "inline-block",
                  marginBottom: "24px"
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "linear" }}
              >
                <FaDumbbell size={60} />
              </motion.div>
              
              <motion.h1 
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  marginBottom: "25px",
                  textAlign: "center"
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                FitTribe
              </motion.h1>
              
              <motion.p 
                style={{
                  fontSize: "1.25rem",
                  marginBottom: "30px"
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 1 }}
              >
                {isLogin ? "Join the tribe. Transform together." : "Become part of something greater."}
              </motion.p>
              
              <motion.div 
                style={{
                  marginTop: "20px"
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <img 
                  src="/api/placeholder/400/300" 
                  alt="Fitness Community" 
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
                    transition: "all 0.3s ease"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = "translateY(-5px)";
                    e.target.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.3)";
                  }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Right Section - Login/Register Form */}
          <motion.div 
            className="col-md-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              backgroundColor: "#ffffff",
              padding: "3rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <div style={{
              maxWidth: "400px",
              margin: "0 auto",
              width: "100%"
            }}>
              {/* Auth Mode Toggle */}
              <div style={{
                display: "flex",
                marginBottom: "1.5rem",
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid #eaeaea"
              }}>
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    border: "none",
                    background: isLogin ? "#2a5298" : "#ffffff",
                    color: isLogin ? "#ffffff" : "#6c757d",
                    fontWeight: isLogin ? "bold" : "normal",
                    transition: "all 0.3s ease"
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    border: "none",
                    background: !isLogin ? "#2a5298" : "#ffffff",
                    color: !isLogin ? "#ffffff" : "#6c757d",
                    fontWeight: !isLogin ? "bold" : "normal",
                    transition: "all 0.3s ease"
                  }}
                >
                  Register
                </button>
              </div>

              <AnimatePresence mode="wait">
                {isLogin ? (
                  <motion.div
                    key="login"
                    variants={slideVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <h2 style={{
                      marginBottom: "1.5rem",
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "#333"
                    }}>Welcome Back!</h2>
                    
                    {/* Social Login Buttons */}
                    <div style={{
                      marginBottom: "1.5rem"
                    }}>
                      <p style={{
                        textAlign: "center",
                        color: "#6c757d",
                        marginBottom: "15px"
                      }}>Sign in with</p>
                      <div style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "12px"
                      }}>
                        <motion.button 
                          type="button" 
                          className="btn btn-outline-primary"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            borderRadius: "50px",
                            padding: "8px 16px",
                            transition: "all 0.3s ease"
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        
                        >
                          <FaGoogle /> Google
                        </motion.button>
                        <motion.button 
                          type="button" 
                          className="btn btn-outline-primary"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            borderRadius: "50px",
                            padding: "8px 16px",
                            transition: "all 0.3s ease"
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleOAuthLogin("Facebook")}
                        >
                          <FaFacebook /> Facebook
                        </motion.button>
                        <motion.button 
                          type="button" 
                          className="btn btn-outline-primary"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            borderRadius: "50px",
                            padding: "8px 16px",
                            transition: "all 0.3s ease"
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleOAuthLogin("Instagram")}
                        >
                          <FaInstagram /> Instagram
                        </motion.button>
                      </div>
                    </div>
                    
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "1.5rem 0"
                    }}>
                      <div style={{
                        flexGrow: 1,
                        height: "1px",
                        backgroundColor: "#dee2e6"
                      }}></div>
                      <span style={{
                        padding: "0 15px",
                        color: "#6c757d",
                        fontSize: "14px"
                      }}>or</span>
                      <div style={{
                        flexGrow: 1,
                        height: "1px",
                        backgroundColor: "#dee2e6"
                      }}></div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLoginSubmit}>
                      <div style={{ marginBottom: "1rem" }}>
                        <label htmlFor="username" style={{
                          marginBottom: "8px",
                          display: "block",
                          fontWeight: "500",
                          color: "#444"
                        }}>Username</label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text" style={{
                              backgroundColor: "#f8f9fa",
                              borderRadius: "8px 0 0 8px",
                              padding: "12px"
                            }}>
                              <FaUser color="#6c757d" />
                            </span>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                            style={{
                              padding: "12px",
                              borderRadius: "0 8px 8px 0",
                              transition: "all 0.3s ease"
                            }}
                          />
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: "1.5rem" }}>
                        <label htmlFor="password" style={{
                          marginBottom: "8px",
                          display: "block",
                          fontWeight: "500",
                          color: "#444"
                        }}>Password</label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text" style={{
                              backgroundColor: "#f8f9fa",
                              borderRadius: "8px 0 0 8px",
                              padding: "12px"
                            }}>
                              <FaLock color="#6c757d" />
                            </span>
                          </div>
                          <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            style={{
                              padding: "12px",
                              borderRadius: "0 8px 8px 0",
                              transition: "all 0.3s ease"
                            }}
                          />
                        </div>
                      </div>
                      
                      <motion.button
                        type="submit"
                        className="btn w-100 mb-3"
                        style={{
                          backgroundColor: "#2a5298",
                          borderColor: "#2a5298",
                          color: "white",
                          borderRadius: "8px",
                          fontWeight: "500",
                          padding: "12px",
                          transition: "all 0.3s ease"
                        }}
                        whileHover={{ 
                          scale: 1.02,
                          backgroundColor: "#1e3c72"
                        }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        ) : null}
                        {isLoading ? "Signing In..." : "Sign In"}
                      </motion.button>
                    </form>
                    
                    <div style={{
                      textAlign: "center",
                      marginTop: "1.5rem"
                    }}>
                      <Link to="/forgotpassword" style={{
                        textDecoration: "none",
                        color: "#2a5298"
                      }}>
                        Forgot Password?
                      </Link>
                      <p style={{
                        marginTop: "15px",
                        marginBottom: "0"
                      }}>
                        Don't have an account?{" "}
                        <button
                          type="button"
                          onClick={toggleAuthMode}
                          style={{
                            background: "none",
                            border: "none",
                            fontWeight: "bold",
                            color: "#2a5298",
                            padding: 0,
                            cursor: "pointer"
                          }}
                        >
                          Sign Up
                        </button>
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="register"
                    variants={slideVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <h2 style={{
                      marginBottom: "1.5rem",
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "#333"
                    }}>Create an Account</h2>

                    {/* Register Form */}
                    <form onSubmit={handleRegisterSubmit}>
                      <div style={{ marginBottom: "1rem" }}>
                        <label htmlFor="reg-username" style={{
                          marginBottom: "8px",
                          display: "block",
                          fontWeight: "500",
                          color: "#444"
                        }}>Username</label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text" style={{
                              backgroundColor: "#f8f9fa",
                              borderRadius: "8px 0 0 8px",
                              padding: "12px"
                            }}>
                              <FaUser color="#6c757d" />
                            </span>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            id="reg-username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
                            required
                            style={{
                              padding: "12px",
                              borderRadius: "0 8px 8px 0",
                              transition: "all 0.3s ease"
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: "1rem" }}>
                        <label htmlFor="email" style={{
                          marginBottom: "8px",
                          display: "block",
                          fontWeight: "500",
                          color: "#444"
                        }}>Email</label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text" style={{
                              backgroundColor: "#f8f9fa",
                              borderRadius: "8px 0 0 8px",
                              padding: "12px"
                            }}>
                              <FaEnvelope color="#6c757d" />
                            </span>
                          </div>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            style={{
                              padding: "12px",
                              borderRadius: "0 8px 8px 0",
                              transition: "all 0.3s ease"
                            }}
                          />
                        </div>
                        <small style={{ color: "#888", marginTop: "6px", display: "block" }}>
                          We'll never share your email with anyone else.
                        </small>
                      </div>
                      
                      <div style={{ marginBottom: "1rem" }}>
                        <label htmlFor="reg-password" style={{
                          marginBottom: "8px",
                          display: "block",
                          fontWeight: "500",
                          color: "#444"
                        }}>Password</label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text" style={{
                              backgroundColor: "#f8f9fa",
                              borderRadius: "8px 0 0 8px",
                              padding: "12px"
                            }}>
                              <FaLock color="#6c757d" />
                            </span>
                          </div>
                          <input
                            type="password"
                            className="form-control"
                            id="reg-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password"
                            required
                            style={{
                              padding: "12px",
                              borderRadius: "0 8px 8px 0",
                              transition: "all 0.3s ease"
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: "1.5rem" }}>
                        <label htmlFor="confirm-password" style={{
                          marginBottom: "8px",
                          display: "block",
                          fontWeight: "500",
                          color: "#444"
                        }}>Confirm Password</label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text" style={{
                              backgroundColor: "#f8f9fa",
                              borderRadius: "8px 0 0 8px",
                              padding: "12px"
                            }}>
                              <FaLock color="#6c757d" />
                            </span>
                          </div>
                          <input
                            type="password"
                            className="form-control"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            required
                            style={{
                              padding: "12px",
                              borderRadius: "0 8px 8px 0",
                              transition: "all 0.3s ease"
                            }}
                          />
                        </div>
                      </div>
                      
                      <motion.button
                        type="submit"
                        className="btn w-100 mb-3"
                        style={{
                          backgroundColor: "#2a5298",
                          borderColor: "#2a5298",
                          color: "white",
                          borderRadius: "8px",
                          fontWeight: "500",
                          padding: "12px",
                          transition: "all 0.3s ease"
                        }}
                        whileHover={{ 
                          scale: 1.02,
                          backgroundColor: "#1e3c72"
                        }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        ) : null}
                        {isLoading ? "Registering..." : "Create Account"}
                      </motion.button>
                    </form>
                    
                    <div style={{
                      textAlign: "center",
                      marginTop: "1.5rem"
                    }}>
                      <p style={{
                        fontSize: "14px",
                        color: "#6c757d",
                        marginBottom: "15px"
                      }}>
                        By signing up, you agree to our Terms of Service and Privacy Policy
                      </p>
                      <p style={{
                        marginBottom: "0"
                      }}>
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={toggleAuthMode}
                          style={{
                            background: "none",
                            border: "none",
                            fontWeight: "bold",
                            color: "#2a5298",
                            padding: 0,
                            cursor: "pointer"
                          }}
                        >
                          Sign In
                        </button>
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;