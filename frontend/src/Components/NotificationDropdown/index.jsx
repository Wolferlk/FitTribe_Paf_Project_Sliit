import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getNotificationsByUserId,
  updateNotificationsById,
} from "../../app/actions/notification.action";
import { motion, AnimatePresence } from "framer-motion";
import { FaBell, FaCheckCircle, FaTimes, FaRegClock } from "react-icons/fa";
import { BsFire, BsPersonPlus, BsAward, BsChatDots } from "react-icons/bs";

function NotificationDropdown() {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userId);
  const notifications = useSelector(
    (state) => state.notification.notifications
  );
  const [isOpen, setIsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (userId) {
      dispatch(getNotificationsByUserId(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (notifications) {
      const unreadCount = notifications.filter(n => !n.isRead).length;
      setNotificationCount(unreadCount);
    }
  }, [notifications]);

  const handleOnRead = (id, e) => {
    e.stopPropagation();
    const updateNotification = {
      id,
      isRead: true,
    };
    dispatch(updateNotificationsById(updateNotification));
  };

  const getNotificationIcon = (type) => {
    const types = {
      follow: <BsPersonPlus className="text-primary" size={18} />,
      like: <BsFire className="text-danger" size={18} />,
      comment: <BsChatDots className="text-info" size={18} />,
      achievement: <BsAward className="text-warning" size={18} />,
      default: <FaRegClock className="text-secondary" size={18} />
    };
    
    return types[type] || types.default;
  };

  const getTimeAgo = (timestamp) => {
    // In a real app, calculate actual time difference
    return "Just now";
  };

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="notification-dropdown position-relative">
      <div
        onClick={toggleNotifications}
        className="nav-link position-relative px-3"
        style={{ cursor: "pointer" }}
      >
        <FaBell size={20} />
        {notificationCount > 0 && (
          <span className="position-absolute top-0 start-75 translate-middle badge rounded-pill bg-danger">
            {notificationCount}
          </span>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="position-absolute end-0 mt-2 shadow-lg rounded-lg overflow-hidden"
            style={{ width: "320px", zIndex: 1000 }}
          >
            <div className="bg-dark border-0">
              <div className="p-3 bg-gradient d-flex justify-content-between align-items-center" 
                   style={{ backgroundImage: "linear-gradient(to right, #6a11cb, #2575fc)" }}>
                <h6 className="mb-0 text-white fw-bold">Notifications</h6>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-light rounded-pill opacity-75 px-2 py-0 text-primary">
                    <small>Mark all read</small>
                  </button>
                  <button 
                    className="btn btn-sm btn-light rounded-circle opacity-75 d-flex align-items-center justify-content-center"
                    style={{ width: "24px", height: "24px" }}
                    onClick={toggleNotifications}
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              </div>
              
              <div className="notification-list" style={{ maxHeight: "400px", overflowY: "auto" }}>
                {notifications && notifications.length ? (
                  [...notifications]
                    .reverse()
                    .slice(-5)
                    .map((notification) => {
                      // Determine notification type - in a real app, this would come from your data
                      const type = notification.type || "default";
                      
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                          className={`d-flex align-items-center p-3 border-bottom border-secondary ${!notification.isRead ? 'bg-primary bg-opacity-10' : ''}`}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="notification-icon me-3 d-flex align-items-center justify-content-center rounded-circle bg-dark p-2">
                            {getNotificationIcon(type)}
                          </div>
                          
                          <div className="notification-content flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start">
                              <p className="mb-0 text-light small">
                                {notification.message}
                              </p>
                              <button
                                className="btn btn-sm text-danger p-0 ms-2"
                                onClick={(e) => handleOnRead(notification.id, e)}
                              >
                                <FaCheckCircle size={16} />
                              </button>
                            </div>
                            <small className="text-muted">{getTimeAgo(notification.timestamp)}</small>
                          </div>
                        </motion.div>
                      );
                    })
                ) : (
                  <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center text-muted">
                    <FaBell size={40} className="mb-3 opacity-50" />
                    <p className="mb-0">No notifications yet</p>
                    <small>We'll notify you when something happens</small>
                  </div>
                )}
              </div>
              
              <div className="p-2 text-center border-top border-secondary">
                <a href="/notifications" className="btn btn-sm btn-outline-light rounded-pill w-100">
                  View All Notifications
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationDropdown;