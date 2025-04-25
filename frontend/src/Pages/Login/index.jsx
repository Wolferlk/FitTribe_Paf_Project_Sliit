import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { login } from "../../app/actions/user.actions";
import LoginImage from "../../assets/login.png";

function Login() {
  const dispatch = useDispatch();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e8f0fe, #ffffff)",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "950px",
          height: "500px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
          borderRadius: "20px",
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      >
        {/* Left Image and Title Section */}
        <div
          style={{
            width: "50%",
            backgroundColor: "#1DA1F2",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            padding: "40px",
          }}
        >
          <h1
            style={{
              fontSize: "30px",
              fontWeight: "bold",
              marginBottom: "25px",
              textAlign: "center",
            }}
          >
            TEST YOUR TASTEBUDS
          </h1>
          <img
            src={LoginImage}
            alt="login"
            width={360}
            height={260}
            style={{
              borderRadius: "12px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Right Login Form Section */}
        <div
          style={{
            width: "50%",
            padding: "60px 50px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2
            style={{
              fontSize: "26px",
              fontWeight: "600",
              marginBottom: "30px",
              color: "#333",
              textAlign: "center",
            }}
          >
            Log in to your account
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontWeight: "500",
                  display: "block",
                  marginBottom: "8px",
                  color: "#444",
                }}
              >
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                }}
              />
              <small style={{ color: "#888", marginTop: "6px", display: "block" }}>
                We'll never share your username.
              </small>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label
                style={{
                  fontWeight: "500",
                  display: "block",
                  marginBottom: "8px",
                  color: "#444",
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: "#1DA1F2",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                transition: "0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0d8ddb")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#1DA1F2")}
            >
              Log In
            </button>
          </form>

          <hr style={{ margin: "30px 0", borderColor: "#eee" }} />

          <Link
            to="/forgotpassword"
            style={{
              textDecoration: "none",
              color: "#1DA1F2",
              fontWeight: "500",
              textAlign: "center",
              display: "block",
            }}
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;