import React, { useEffect } from "react";
import Posts from "../../Components/Posts";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../../app/actions/post.actions";
import NewUsersSuggest from "../../Components/NewUsersSuggest";
import { FaDumbbell, FaFire, FaUsers, FaChartLine } from "react-icons/fa";

function Home() {
  const dispatch = useDispatch();
  const post = useSelector((state) => state.post);
  
  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);
  
  return (
    <div className="bg-light min-vh-100">
      {/* Top Banner */}
      {/* <div className="bg-gradient bg-primary text-white text-center py-4 mb-4">
        <h1 className="display-4 fw-bold">FitTribe</h1>
        <p className="lead">Connect. Train. Transform. Together.</p>
      </div> */}
      
      <div className="container">
        <div className="row">
          {/* Left Sidebar */}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="card shadow-sm mb-4 border-0 rounded-3">
              <div className="card-body">
                <h5 className="card-title fw-bold text-primary">Quick Navigation</h5>
                <ul className="nav flex-column nav-pills">
                  <li className="nav-item">
                    <a className="nav-link active" href="#"><FaFire className="me-2" />Feed</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#"><FaUsers className="me-2" />Community</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#"><FaDumbbell className="me-2" />Workouts</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#"><FaChartLine className="me-2" />Progress</a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="card shadow-sm border-0 rounded-3">
              <div className="card-body">
                <h5 className="card-title fw-bold text-primary">Trending Tags</h5>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <span className="badge bg-primary">#MorningWorkout</span>
                  <span className="badge bg-info">#LegDay</span>
                  <span className="badge bg-success">#Motivation</span>
                  <span className="badge bg-warning text-dark">#FitLife</span>
                  <span className="badge bg-danger">#WeightLoss</span>
                  <span className="badge bg-secondary">#Cardio</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="col-lg-6 col-md-8">
            <div className="card shadow-sm mb-4 border-0 rounded-3">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary text-white p-2 rounded-circle me-3">
                    <FaDumbbell />
                  </div>
                  <input 
                    type="text" 
                    className="form-control rounded-pill" 
                    placeholder="Share your workout journey..." 
                  />
                </div>
                <div className="d-flex justify-content-around">
                  <button className="btn btn-sm btn-light"><i className="bi bi-image me-1"></i> Photo</button>
                  <button className="btn btn-sm btn-light"><i className="bi bi-activity me-1"></i> Progress</button>
                  <button className="btn btn-sm btn-light"><i className="bi bi-trophy me-1"></i> Achievement</button>
                </div>
              </div>
            </div>
            
            <div className="card shadow-sm mb-4 border-0 rounded-3">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0 fw-bold text-primary">Fitness Tribe Members</h5>
              </div>
              <div className="card-body">
                <NewUsersSuggest />
              </div>
            </div>
            
            <div className="card shadow-sm border-0 rounded-3">
              <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-primary">Community Workouts</h5>
                <div className="dropdown">
                  <button className="btn btn-sm btn-outline-primary dropdown-toggle" type="button" id="feedFilter" data-bs-toggle="dropdown" aria-expanded="false">
                    Recent
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="feedFilter">
                    <li><a className="dropdown-item" href="#">Recent</a></li>
                    <li><a className="dropdown-item" href="#">Popular</a></li>
                    <li><a className="dropdown-item" href="#">Following</a></li>
                  </ul>
                </div>
              </div>
              <div className="card-body p-0 pt-2">
                <Posts posts={post.posts} fetchType="GET_ALL_POSTS" />
              </div>
            </div>
          </div>
          
          {/* Right Sidebar */}
          <div className="col-lg-3 col-md-4">
            <div className="card shadow-sm mb-4 border-0 rounded-3">
              <div className="card-body">
                <h5 className="card-title fw-bold text-primary">Your Stats</h5>
                <div className="d-flex justify-content-between mt-3">
                  <div className="text-center">
                    <h3 className="mb-0 fw-bold">12</h3>
                    <small className="text-muted">Workouts</small>
                  </div>
                  <div className="text-center">
                    <h3 className="mb-0 fw-bold">87</h3>
                    <small className="text-muted">Friends</small>
                  </div>
                  <div className="text-center">
                    <h3 className="mb-0 fw-bold">4</h3>
                    <small className="text-muted">Streaks</small>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card shadow-sm mb-4 border-0 rounded-3">
              <div className="card-body">
                <h5 className="card-title fw-bold text-primary">Daily Challenge</h5>
                <div className="bg-light p-3 rounded mt-3">
                  <h6 className="text-center mb-3">50 Push-ups</h6>
                  <div className="progress">
                    <div className="progress-bar bg-success" role="progressbar" style={{ width: "70%" }} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100">70%</div>
                  </div>
                  <div className="d-grid gap-2 mt-3">
                    <button className="btn btn-primary">Complete Challenge</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card shadow-sm border-0 rounded-3">
              <div className="card-body">
                <h5 className="card-title fw-bold text-primary">Workout of the Day</h5>
                <div className="mt-3">
                  <div className="d-flex align-items-center mb-2">
                    <FaDumbbell className="text-primary me-2" />
                    <span>3 x 12 Squats</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <FaDumbbell className="text-primary me-2" />
                    <span>3 x 10 Push-ups</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <FaDumbbell className="text-primary me-2" />
                    <span>3 x 15 Lunges</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaDumbbell className="text-primary me-2" />
                    <span>3 x 1 min Plank</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;