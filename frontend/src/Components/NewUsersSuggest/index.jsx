import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../app/actions/user.actions";
import UserImage from "../../assets/user.jpeg";
import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";
import { FaUserFriends, FaRunning, FaDumbbell, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";

function NewUsersSuggest() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [usersList, setUsersList] = useState([]);
  
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);
  
  useEffect(() => {
    setUsersList(user.users);
  }, [user.users]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Fitness interest tags with pastel colors
  const fitnessInterests = [
    { icon: <FaRunning className="text-info" />, label: "Runner" },
    { icon: <FaDumbbell className="text-success" />, label: "Lifter" },
    { icon: <FaHeart className="text-danger" />, label: "Active" }
  ];

  return (
    <motion.div 
      className="new-users-suggest"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white d-flex align-items-center justify-content-between p-3 border-0">
          <div className="d-flex align-items-center">
            <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-2">
              <FaUserFriends className="text-primary" size={16} />
            </div>
            <h6 className="mb-0 fw-bold text-primary">Fitness Friends</h6>
          </div>
          <Link to="/discover" className="text-decoration-none">
            <small className="text-primary">View All</small>
          </Link>
        </div>
        
        {user && usersList.length ? (
          <motion.div 
            className="user-suggestions p-2"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <div className="row g-2">
              {[...usersList]
                .reverse()
                .slice(-4)
                .map((userItem, index) => {
                  // Randomly select an interest tag
                  const interest = fitnessInterests[Math.floor(Math.random() * fitnessInterests.length)];
                  
                  return (
                    <motion.div 
                      key={userItem.id} 
                      className="col-6"
                      variants={itemVariants}
                    >
                      <div className="user-card p-2 rounded border bg-white">
                        <div className="d-flex align-items-center">
                          <Link
                            className="text-decoration-none text-dark"
                            to={`/user/${userItem.id}`}
                          >
                            <div className="position-relative">
                              <img
                                src={userItem.profileImage ? userItem.profileImage : UserImage}
                                className="rounded-circle border border-2 border-primary"
                                alt="Profile"
                                width="40"
                                height="40"
                                style={{ objectFit: "cover" }}
                              />
                              <span className="position-absolute bottom-0 end-0 bg-success rounded-circle p-1 border border-white" 
                                    style={{width: "8px", height: "8px"}}></span>
                            </div>
                          </Link>
                          <div className="ms-2 flex-grow-1">
                            <Link
                              className="text-decoration-none text-dark"
                              to={`/user/${userItem.id}`}
                            >
                              <h6 className="mb-0 fw-bold text-truncate" style={{fontSize: "0.9rem"}}>{userItem.username}</h6>
                            </Link>
                            <div className="d-flex align-items-center mt-1">
                              <span className="badge bg-light text-dark rounded-pill" style={{fontSize: "0.65rem"}}>
                                {interest.icon} <span className="ms-1">{interest.label}</span>
                              </span>
                            </div>
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FollowButton userDetails={userItem} fetchType="SUGGESTION" buttonSize="sm" />
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
              
            <motion.div 
              className="text-center py-2 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/discover" className="btn btn-primary btn-sm rounded-pill px-3 shadow-sm" style={{fontSize: "0.8rem"}}>
                Find More Friends <FaUserFriends className="ms-1" />
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <div className="text-center py-4">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <FaDumbbell className="text-primary mb-2" size={24} />
            </motion.div>
            <p className="text-muted small">Finding fitness buddies...</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default NewUsersSuggest;