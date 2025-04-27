import React, { useEffect, useState } from "react";
import PostCard from "../PostCard";
import { FaDumbbell, FaPlus } from "react-icons/fa";

function Posts({ posts, fetchType }) {
  const [postsList, setPostsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (posts) {
      setPostsList(posts);
      setIsLoading(false);
    }
  }, [posts]);

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="posts-container">
      {postsList.length ? (
        [...postsList].reverse().map((post) => {
          return (
            <div className="mb-4" key={post.id}>
              <PostCard post={post} fetchType={fetchType} />
            </div>
          );
        })
      ) : (
        <div className="text-center py-5 mb-3 bg-gradient rounded-3 shadow-sm">
          <div className="empty-state-icon mb-3">
            <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4">
              <FaDumbbell className="text-primary" size={40} />
            </div>
          </div>
          <h4 className="fw-bold text-primary">No Workouts Posted Yet</h4>
          <p className="text-muted px-4 mb-4">
            Be the first to share your fitness journey and inspire the community!
          </p>
          <button className="btn btn-primary rounded-pill px-4 py-2">
            <FaPlus className="me-2" /> Create Workout Post
          </button>
        </div>
      )}
      
      {postsList.length > 0 && (
        <div className="text-center my-4">
          <button className="btn btn-outline-primary rounded-pill px-4">
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default Posts;