import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../../app/actions/post.actions";
import Posts from "../../Components/Posts";
import NewUsersSuggest from "../../Components/NewUsersSuggest";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaDumbbell, 
  FaFire, 
  FaUsers, 
  FaChartLine, 
  FaMoon, 
  FaSun, 
  FaCamera, 
  FaTrophy, 
  FaChartBar,
  FaBell,
  FaCog,
  FaUserCircle,
  FaHashtag
} from "react-icons/fa";

function Home() {
  const dispatch = useDispatch();
  const post = useSelector((state) => state.post);
  const [darkMode, setDarkMode] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  useEffect(() => {
    dispatch(getPosts());
    
    // Animation for stats
    setTimeout(() => {
      setShowStats(true);
    }, 500);
    
    // Apply dark mode if saved in localStorage
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, [dispatch]);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
    document.body.classList.toggle('dark-mode');
  };
  
  return (
    <div className={`min-vh-100 ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      {/* Top Navigation Bar */}
      
      
      <div className="container mt-0">
        <div className="row">
          {/* Left Sidebar */}
          <div className="col-lg-3 d-none d-lg-block">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className={`card mb-4 border-0 rounded-lg ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-white shadow-sm'}`}
            >
              <div className="card-body">
                <h5 className={`card-title fw-bold ${darkMode ? 'text-light' : 'text-primary'}`}>Quick Navigation</h5>
                <ul className={`nav flex-column nav-pills mt-3 ${darkMode ? 'nav-dark' : ''}`}>
                  <li className="nav-item mb-2">
                    <a className={`nav-link ${darkMode ? 'text-light active bg-primary' : 'active'} d-flex align-items-center`} href="#">
                      <FaFire className="me-3" />
                      <span>Feed</span>
                    </a>
                  </li>
                  <li className="nav-item mb-2">
                    <a className={`nav-link ${darkMode ? 'text-light' : ''} d-flex align-items-center`} href="#">
                      <FaUsers className="me-3" />
                      <span>Community</span>
                    </a>
                  </li>
                  <li className="nav-item mb-2">
                    <a className={`nav-link ${darkMode ? 'text-light' : ''} d-flex align-items-center`} href="#">
                      <FaDumbbell className="me-3" />
                      <span>Workouts</span>
                    </a>
                  </li>
                  <li className="nav-item mb-2">
                    <a className={`nav-link ${darkMode ? 'text-light' : ''} d-flex align-items-center`} href="#">
                      <FaChartLine className="me-3" />
                      <span>Progress</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className={`nav-link ${darkMode ? 'text-light' : ''} d-flex align-items-center`} href="#">
                      <FaCog className="me-3" />
                      <span>Settings</span>
                    </a>
                  </li>
                  <li className="nav-item">
                   <button 
                    className={`btn btn-sm ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'}`} 
                    onClick={toggleDarkMode}
                  >
                    {darkMode ? <FaSun /> : <FaMoon />}
                  </button>
                  </li>
                </ul>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`card border-0 rounded-lg ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-white shadow-sm'}`}
            >
              <div className="card-body">
                <h5 className={`card-title fw-bold ${darkMode ? 'text-light' : 'text-primary'}`}>
                  <FaHashtag className="me-2" /> Trending Tags
                </h5>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <motion.span 
                    whileHover={{ scale: 1.1 }} 
                    className="badge bg-primary">
                    #MorningWorkout
                  </motion.span>
                  <motion.span 
                    whileHover={{ scale: 1.1 }} 
                    className="badge bg-info">
                    #LegDay
                  </motion.span>
                  <motion.span 
                    whileHover={{ scale: 1.1 }} 
                    className="badge bg-success">
                    #Motivation
                  </motion.span>
                  <motion.span 
                    whileHover={{ scale: 1.1 }} 
                    className="badge bg-warning text-dark">
                    #FitLife
                  </motion.span>
                  <motion.span 
                    whileHover={{ scale: 1.1 }} 
                    className="badge bg-danger">
                    #WeightLoss
                  </motion.span>
                  <motion.span 
                    whileHover={{ scale: 1.1 }} 
                    className="badge bg-secondary">
                    #Cardio
                  </motion.span>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Main Content */}
          <div className="col-lg-6 col-md-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`card mb-4 border-0 rounded-lg ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-white shadow-sm'}`}
            >
              <div className="card-body">
                <div className={`d-flex align-items-center p-2 rounded-pill mb-3 ${darkMode ? 'bg-secondary bg-opacity-25' : 'bg-light'}`}>
                  <div className="bg-primary text-white p-2 rounded-circle me-3">
                    <FaUserCircle size={18} />
                  </div>
                  <input 
                    type="text" 
                    className={`form-control border-0 ${darkMode ? 'bg-secondary bg-opacity-25 text-light' : 'bg-light'}`}
                    placeholder="Share your workout journey..." 
                  />
                </div>
                <div className="d-flex justify-content-around">
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    className={`btn btn-sm ${darkMode ? 'btn-outline-light' : 'btn-outline-primary'} rounded-pill`}
                  >
                    <FaCamera className="me-2" /> Photo
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    className={`btn btn-sm ${darkMode ? 'btn-outline-light' : 'btn-outline-primary'} rounded-pill`}
                  >
                    <FaChartBar className="me-2" /> Progress
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    className={`btn btn-sm ${darkMode ? 'btn-outline-light' : 'btn-outline-primary'} rounded-pill`}
                  >
                    <FaTrophy className="me-2" /> Achievement
                  </motion.button>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`card mb-4 border-0 rounded-lg ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-white shadow-sm'}`}
            >
              <div className={`card-header border-0 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
                <h5 className={`mb-0 fw-bold ${darkMode ? 'text-light' : 'text-primary'}`}>
                  <FaUsers className="me-2" /> Fitness Tribe Members
                </h5>
              </div>
              <div className="card-body">
                <NewUsersSuggest darkMode={darkMode} />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`card border-0 rounded-lg ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-white shadow-sm'}`}
            >
              <div className={`card-header d-flex justify-content-between align-items-center border-0 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
                <h5 className={`mb-0 fw-bold ${darkMode ? 'text-light' : 'text-primary'}`}>
                  <FaFire className="me-2" /> Community Workouts
                </h5>
                <div className="dropdown">
                  <button 
                    className={`btn btn-sm ${darkMode ? 'btn-outline-light' : 'btn-outline-primary'} dropdown-toggle rounded-pill`} 
                    type="button" 
                    id="feedFilter" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    Recent
                  </button>
                  <ul className={`dropdown-menu ${darkMode ? 'dropdown-menu-dark' : ''}`} aria-labelledby="feedFilter">
                    <li><a className="dropdown-item" href="#">Recent</a></li>
                    <li><a className="dropdown-item" href="#">Popular</a></li>
                    <li><a className="dropdown-item" href="#">Following</a></li>
                  </ul>
                </div>
              </div>
              <div className="card-body p-0 pt-2">
                <Posts posts={post.posts} fetchType="GET_ALL_POSTS" darkMode={darkMode} />
              </div>
            </motion.div>
          </div>
          
          {/* Right Sidebar */}
          <div className="col-lg-3 col-md-4">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className={`card mb-4 border-0 rounded-lg ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-white shadow-sm'}`}
            >
              <div className="card-body">
                <h5 className={`card-title fw-bold ${darkMode ? 'text-light' : 'text-primary'}`}>
                  <FaChartLine className="me-2" /> Your Stats
                </h5>
                <AnimatePresence>
                  {showStats && (
                    <div className="d-flex justify-content-between mt-4">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-center"
                      >
                        <div className={`circular-progress-container ${darkMode ? 'dark' : ''}`}>
                          <h3 className="mb-0 fw-bold">12</h3>
                        </div>
                        <small className={`${darkMode ? 'text-light' : 'text-muted'}`}>Workouts</small>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-center"
                      >
                        <div className={`circular-progress-container ${darkMode ? 'dark' : ''}`}>
                          <h3 className="mb-0 fw-bold">87</h3>
                        </div>
                        <small className={`${darkMode ? 'text-light' : 'text-muted'}`}>Friends</small>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-center"
                      >
                        <div className={`circular-progress-container ${darkMode ? 'dark' : ''}`}>
                          <h3 className="mb-0 fw-bold">4</h3>
                        </div>
                        <small className={`${darkMode ? 'text-light' : 'text-muted'}`}>Streaks</small>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`card mb-4 border-0 rounded-lg ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-white shadow-sm'}`}
            >
              <div className="card-body">
                <h5 className={`card-title fw-bold ${darkMode ? 'text-light' : 'text-primary'}`}>
                  <FaFire className="me-2" /> Daily Challenge
                </h5>
                <div className={`p-3 rounded-lg mt-3 ${darkMode ? 'bg-secondary bg-opacity-25' : 'bg-light'}`}>
                  <h6 className="text-center mb-3">50 Push-ups</h6>
                  <div className="progress bg-secondary bg-opacity-25">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "70%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="progress-bar bg-success" 
                      role="progressbar" 
                      aria-valuenow="70" 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    >
                      70%
                    </motion.div>
                  </div>
                  <div className="d-grid gap-2 mt-3">
                    <motion.button 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-primary rounded-pill"
                    >
                      Complete Challenge
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`card border-0 rounded-lg ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-white shadow-sm'}`}
            >
              <div className="card-body">
                <h5 className={`card-title fw-bold ${darkMode ? 'text-light' : 'text-primary'}`}>
                  <FaDumbbell className="me-2" /> Workout of the Day
                </h5>
                <div className="mt-3">
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                    className={`d-flex align-items-center p-2 mb-2 rounded ${darkMode ? 'bg-secondary bg-opacity-10 hover-dark' : 'bg-light hover-light'}`}
                  >
                    <FaDumbbell className={`${darkMode ? 'text-light' : 'text-primary'} me-2`} />
                    <span>3 x 12 Squats</span>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                    className={`d-flex align-items-center p-2 mb-2 rounded ${darkMode ? 'bg-secondary bg-opacity-10 hover-dark' : 'bg-light hover-light'}`}
                  >
                    <FaDumbbell className={`${darkMode ? 'text-light' : 'text-primary'} me-2`} />
                    <span>3 x 10 Push-ups</span>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                    className={`d-flex align-items-center p-2 mb-2 rounded ${darkMode ? 'bg-secondary bg-opacity-10 hover-dark' : 'bg-light hover-light'}`}
                  >
                    <FaDumbbell className={`${darkMode ? 'text-light' : 'text-primary'} me-2`} />
                    <span>3 x 15 Lunges</span>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.9 }}
                    className={`d-flex align-items-center p-2 rounded ${darkMode ? 'bg-secondary bg-opacity-10 hover-dark' : 'bg-light hover-light'}`}
                  >
                    <FaDumbbell className={`${darkMode ? 'text-light' : 'text-primary'} me-2`} />
                    <span>3 x 1 min Plank</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* CSS Styles */}
      <style jsx>{`
        .dark-mode {
          background-color: #121212;
          color: #f8f9fa;
        }
        
        .circular-progress-container {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, #e6e6e6, #ffffff);
          box-shadow: 5px 5px 10px #d9d9d9, -5px -5px 10px #ffffff;
          margin: 0 auto 10px;
          transition: all 0.3s ease;
        }
        
        .circular-progress-container.dark {
          background: linear-gradient(145deg, #2c2c2c, #252525);
          box-shadow: 5px 5px 10px #1e1e1e, -5px -5px 10px #323232;
        }
        
        .nav-dark .nav-link:not(.active):hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .hover-light:hover {
          background-color: #e9ecef;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .hover-dark:hover {
          background-color: rgba(255, 255, 255, 0.1);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default Home;