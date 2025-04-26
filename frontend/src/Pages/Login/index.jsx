import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { login } from "../../app/actions/user.actions";
import LoginImage from "../../assets/login.png";
import { useEffect } from "react";

function Login() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(login({ username, password })).finally(() => setIsLoading(false));
  };

  const handleOAuthLogin = (provider) => {
    // Implementation for OAuth login would go here
    console.log(`Logging in with ${provider}`);
    // This would typically redirect to the OAuth provider's auth page
  };

  // Simple animation effect on mount
  useEffect(() => {
    const loginCard = document.getElementById("login-card");
    const leftPanel = document.getElementById("left-panel");
    const rightPanel = document.getElementById("right-panel");
    
    // Apply animations after component mounts
    setTimeout(() => {
      loginCard.classList.add("show");
      leftPanel.classList.add("slide-in-left");
      rightPanel.classList.add("slide-in-right");
    }, 100);
  }, []);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" 
         style={{
           background: "linear-gradient(135deg, #e8f4fd, #f0e8fd)",
           fontFamily: "'Poppins', 'Segoe UI', sans-serif"
         }}>
      
      {/* CSS for animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-50px); }
            to { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes floatingShape {
            0% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(5deg); }
            100% { transform: translateY(0) rotate(0deg); }
          }
          
          .shape {
            position: absolute;
            border-radius: 50%;
            opacity: 0.2;
          }
          
          .shape-1 {
            width: 150px;
            height: 150px;
            background-color: #4361ee;
            top: -20px;
            left: -50px;
            animation: floatingShape 8s ease-in-out infinite;
          }
          
          .shape-2 {
            width: 100px;
            height: 100px;
            background-color: #3a0ca3;
            bottom: 30%;
            right: -30px;
            animation: floatingShape 10s ease-in-out infinite;
          }
          
          .shape-3 {
            width: 70px;
            height: 70px;
            background-color: #4cc9f0;
            bottom: -20px;
            left: 30%;
            animation: floatingShape 7s ease-in-out infinite;
          }
          
          #login-card {
            opacity: 0;
            transform: translateY(20px);
          }
          
          #login-card.show {
            animation: fadeIn 0.6s ease-out forwards;
          }
          
          #left-panel {
            opacity: 0;
          }
          
          #left-panel.slide-in-left {
            animation: slideInLeft 0.8s ease-out 0.3s forwards;
          }
          
          #right-panel {
            opacity: 0;
          }
          
          #right-panel.slide-in-right {
            animation: slideInRight 0.8s ease-out 0.3s forwards;
          }
          
          .btn-social:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          }
          
          .btn-social {
            transition: all 0.3s ease;
            width: 45px;
            height: 45px;
          }
          
          .btn-submit {
            transition: all 0.3s ease;
          }
          
          .btn-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          }
        `}
      </style>
      
      <div className="container p-2">
        <div className="card shadow border-0 rounded-4" id="login-card" style={{ maxWidth: "950px", overflow: "hidden" }}>
          <div className="row g-0">
            {/* Left Panel */}
            <div className="col-md-6" id="left-panel" style={{ background: "linear-gradient(135deg, #4361ee, #3a0ca3)", position: "relative", overflow: "hidden" }}>
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
              
              <div className="d-flex flex-column justify-content-center align-items-center text-white p-5 h-100 position-relative">
                <h1 className="fw-bold mb-4" style={{ fontSize: "2rem" }}>TEST YOUR TASTEBUDS</h1>
                <p className="text-center mb-4 fs-5 text-light">Discover new flavors, share your favorites</p>
                <div className="text-center p-3 rounded-circle bg-white bg-opacity-10" 
                     style={{ width: "220px", height: "220px", backdropFilter: "blur(5px)" }}>
                  <img
                    src={LoginImage || "/api/placeholder/200/200"}
                    alt="Login"
                    className="img-fluid rounded-circle p-2"
                    style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>
            
            {/* Right Panel */}
            <div className="col-md-6" id="right-panel">
              <div className="card-body p-4 p-md-5">
                <h2 className="card-title text-center fw-bold mb-4">Welcome Back!</h2>
                
                {/* Social Login */}
                <div className="mb-4 text-center">
                  <p className="text-muted mb-3">Login with</p>
                  <div className="d-flex justify-content-center gap-3 mb-3">
                    <button 
                      onClick={() => handleOAuthLogin('Google')} 
                      className="btn btn-light btn-social rounded-circle d-flex align-items-center justify-content-center"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleOAuthLogin('Facebook')} 
                      className="btn btn-primary btn-social rounded-circle d-flex align-items-center justify-content-center"
                    >
                      <svg width="10" height="18" viewBox="0 0 10 18" fill="#ffffff">
                        <path d="M6.067 18V9.782h2.753l.413-3.2H6.067V4.546c0-.927.258-1.558 1.586-1.558h1.695V.125A22.65 22.65 0 0 0 6.878 0C4.436 0 2.763 1.491 2.763 4.23v2.352H0v3.2h2.763V18h3.304Z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleOAuthLogin('Instagram')} 
                      className="btn btn-social rounded-circle d-flex align-items-center justify-content-center"
                      style={{ background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", color: "white" }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="d-flex align-items-center my-4">
                    <hr className="flex-grow-1" />
                    <span className="px-2 text-muted small">Or login with email</span>
                    <hr className="flex-grow-1" />
                  </div>
                </div>
                
                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label fw-semibold">Username</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">Password</label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="rememberMe" />
                      <label className="form-check-label small" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <Link to="/forgotpassword" className="text-decoration-none small fw-semibold">
                      Forgot Password?
                    </Link>
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 mb-4 btn-submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Logging in...
                      </>
                    ) : "Sign In"}
                  </button>
                </form>
                
                <p className="text-center mt-4 mb-0">
                  Don't have an account? <Link to="/register" className="text-decoration-none fw-semibold">Register now</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;