import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, updateUserById, deleteUserById } from "../../app/actions/user.actions";
import storage from "../../util/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function Profile(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [username, setUsername] = useState(user?.user?.username);
  const [email, setEmail] = useState(user?.user?.email);
  const [contactNumber, setContactNumber] = useState(user?.user?.contactNumber);
  const [country, setCountry] = useState(user?.user?.country);
  const [profileImage, setProfileImage] = useState(user?.user?.profileImage ? user.user.profileImage : null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Animation styles
  const keyframes = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    @keyframes slideIn {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes progressBar {
      from { width: 0%; }
      to { width: 100%; }
    }
  `;

  // Styles object
  const styles = {
    container: {
      backgroundColor: "#f8f9fa",
      borderRadius: "15px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      padding: "2rem",
      animation: "fadeIn 0.5s ease-out forwards",
    },
    header: {
      color: "#2563eb",
      textAlign: "center",
      fontWeight: "600",
      marginBottom: "1.5rem",
      position: "relative",
      animation: "fadeIn 0.6s ease-out forwards",
    },
    headerLine: {
      height: "3px",
      background: "linear-gradient(90deg, rgba(37,99,235,0.2) 0%, rgba(37,99,235,1) 50%, rgba(37,99,235,0.2) 100%)",
      width: "100px",
      margin: "1rem auto 2rem",
      borderRadius: "10px",
    },
    formControl: {
      border: "1px solid #e2e8f0",
      borderRadius: "10px",
      padding: "0.75rem 1rem",
      fontSize: "1rem",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
      transition: "all 0.3s ease",
    },
    formLabel: {
      color: "#4b5563",
      fontWeight: "500",
      marginBottom: "0.5rem",
      display: "block",
      animation: "slideIn 0.4s ease-out forwards",
    },
    formGroup: {
      marginBottom: "1.5rem",
      animation: "fadeIn 0.5s ease-out forwards",
    },
    profileImageContainer: {
      textAlign: "center",
      marginBottom: "2rem",
      animation: "fadeIn 0.7s ease-out forwards",
    },
    profileImage: {
      width: "150px",
      height: "150px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "4px solid #2563eb",
      boxShadow: "0 10px 20px rgba(37, 99, 235, 0.2)",
      margin: "0 auto 1.5rem",
      transition: "all 0.3s ease",
    },
    uploadBtn: {
      position: "relative",
      overflow: "hidden",
      backgroundColor: "#e2e8f0",
      color: "#4b5563",
      border: "none",
      borderRadius: "10px",
      padding: "0.75rem 1rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    fileInput: {
      position: "absolute",
      top: "0",
      left: "0",
      opacity: "0",
      width: "100%",
      height: "100%",
      cursor: "pointer",
    },
    progressContainer: {
      height: "6px",
      backgroundColor: "#e2e8f0",
      borderRadius: "3px",
      margin: "1rem 0",
      overflow: "hidden",
    },
    progressBar: {
      height: "100%",
      backgroundColor: "#2563eb",
      borderRadius: "3px",
      transition: "width 0.3s ease",
    },
    buttonRow: {
      display: "flex",
      gap: "1rem",
      marginTop: "2rem",
      animation: "fadeIn 0.8s ease-out forwards",
    },
    cancelBtn: {
      backgroundColor: "#f3f4f6",
      color: "#4b5563",
      border: "none",
      borderRadius: "10px",
      padding: "0.75rem 1rem",
      flex: "1",
      transition: "all 0.3s ease",
      fontWeight: "500",
    },
    updateBtn: {
      backgroundColor: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "10px",
      padding: "0.75rem 1rem",
      flex: "1",
      transition: "all 0.3s ease",
      fontWeight: "500",
    },
    deleteBtn: {
      backgroundColor: "#ef4444",
      color: "white",
      border: "none",
      borderRadius: "10px",
      padding: "0.75rem 1rem",
      transition: "all 0.3s ease",
      fontWeight: "500",
      marginTop: "1rem",
    },
    removeImageBtn: {
      backgroundColor: "#ef4444",
      color: "white",
      border: "none",
      borderRadius: "10px",
      padding: "0.5rem 1rem",
      fontSize: "0.875rem",
      marginTop: "1rem",
      transition: "all 0.3s ease",
    }
  };

  useEffect(() => {
    dispatch(getUser(user.userId));
  }, [dispatch, user.userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userUpdate = {
      id: user.user.id,
      username,
      email,
      contactNumber,
      country,
      profileImage
    };

    dispatch(updateUserById(userUpdate));
    props.closeModal();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      dispatch(deleteUserById(user.userId));
      props.closeModal();
    }
  };

  const uploadImage = (e) => {
    const file = e.target.files[0];

    if (!file) {
      alert("Please upload an image first!");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    
    const storageRef = ref(storage, `/users/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      },
      (err) => {
        console.log(err);
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setProfileImage(url);
          setUploading(false);
        });
      }
    );
  };

  const removeProfilePicture = () => {
    setProfileImage("https://i.discogs.com/57iTb7iRduipsfyksYodpaSpz_eEjtg52zPBhCwBPhI/rs:fit/g:sm/q:40/h:300/w:300/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTY5Nzg2/ODEtMTU0OTgxMTIz/OC02NjMxLmpwZWc.jpeg");
  };

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container} className="container">
        <h1 style={styles.header} className="mb-4">Update Your Profile</h1>
        <div style={styles.headerLine}></div>
        
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div style={styles.profileImageContainer}>
              {profileImage && (
                <img
                  src={profileImage}
                  style={styles.profileImage}
                  alt="Profile"
                  className="img-fluid"
                />
              )}
              
              <div className="mb-3">
                <button 
                  style={styles.uploadBtn} 
                  className="btn w-100"
                  onMouseOver={(e) => e.target.style.backgroundColor = "#cbd5e1"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#e2e8f0"}
                >
                  <i className="bi bi-cloud-arrow-up me-2"></i>
                  {uploading ? "Uploading..." : "Change Profile Picture"}
                  <input
                    type="file"
                    style={styles.fileInput}
                    onChange={uploadImage}
                    accept="image/*"
                  />
                </button>
                
                {uploading && (
                  <div style={styles.progressContainer}>
                    <div 
                      style={{
                        ...styles.progressBar,
                        width: `${uploadProgress}%`,
                        animation: "progressBar 1s ease-out"
                      }}
                    ></div>
                  </div>
                )}
                
                {profileImage && (
                  <button 
                    style={styles.removeImageBtn}
                    className="btn"
                    onClick={removeProfilePicture}
                    onMouseOver={(e) => e.target.style.opacity = "0.9"}
                    onMouseOut={(e) => e.target.style.opacity = "1"}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Remove Picture
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="username">
                  <i className="bi bi-person me-2"></i>Username
                </label>
                <input
                  type="text"
                  style={styles.formControl}
                  className="form-control"
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  readOnly
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="contactNumber">
                  <i className="bi bi-telephone me-2"></i>Contact Number
                </label>
                <input
                  type="text"
                  style={styles.formControl}
                  className="form-control"
                  id="contactNumber"
                  placeholder="Enter your contact number"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  pattern="[0-9]{10}"
                  onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="email">
                  <i className="bi bi-envelope me-2"></i>Email Address
                </label>
                <input
                  type="email"
                  style={styles.formControl}
                  className="form-control"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="country">
                  <i className="bi bi-geo me-2"></i>Country
                </label>
                <input
                  type="text"
                  style={styles.formControl}
                  className="form-control"
                  id="country"
                  placeholder="Enter your country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
              
              <div style={styles.buttonRow} className="d-flex flex-column flex-md-row">
                <button
                  type="button"
                  style={styles.cancelBtn}
                  className="btn"
                  onClick={props.closeModal}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#e5e7eb"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#f3f4f6"}
                >
                  CANCEL
                </button>
                
                <button
                  type="submit"
                  style={styles.updateBtn}
                  className="btn"
                  onMouseOver={(e) => e.target.style.backgroundColor = "#1d4ed8"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#2563eb"}
                >
                  <i className="bi bi-check2 me-2"></i>
                  UPDATE PROFILE
                </button>
              </div>
              
              <button
                type="button"
                style={styles.deleteBtn}
                className="btn w-100 mt-3"
                onClick={handleDelete}
                onMouseOver={(e) => e.target.style.backgroundColor = "#dc2626"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#ef4444"}
              >
                <i className="bi bi-trash me-2"></i>
                DELETE ACCOUNT
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;