import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import UserPosts from "./Pages/UserPosts";
import User from "./Pages/User";
import SharedPosts from "./Pages/SharedPosts";
import Messaging from "./Components/Messaging/Messaging";

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <div className="body">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user" element={<User />} />
            <Route path="/user/:userId" element={<UserPosts />} />
            <Route path="/sharedposts" element={<SharedPosts />} />
            <Route path="/messaging"element={<Messaging />} />
           
          </Routes>
        </div>
      </Router>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
