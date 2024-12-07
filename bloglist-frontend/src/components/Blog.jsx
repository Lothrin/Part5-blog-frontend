import { useState } from "react";
import Togglable from "./togglable";
import blogService from "../services/blogs";

const Blog = ({ blog, handleDelete, handleLike }) => {
  const [likes, setLikes] = useState(blog.likes);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLikeClick = () => {
    handleLike(blog.id, likes);
    setLikes(likes + 1);
  };

  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      handleDelete(blog.id);
    }
  };

  return (
    <div style={blogStyle}>
      <p>{blog.title}</p> <p>{blog.author}</p>
      <Togglable buttonLabel="view" className="togglableContent">
        <p>{blog.user.name}</p> <p>{blog.url}</p>
        <p>
          likes: {likes} <button onClick={handleLikeClick}>like</button>
        </p>
        <button onClick={handleDeleteClick}>remove</button>
        <br /> <br />
      </Togglable>
    </div>
  );
};

export default Blog;
