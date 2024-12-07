import { useState } from "react";
import Togglable from "./togglable";
import blogService from "../services/blogs";

const Blog = ({ blog, handleDelete }) => {
  const [likes, setLikes] = useState(blog.likes);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLike = async () => {
    const id = blog.id;
    const updatedBlog = { ...blog, likes: likes + 1 };

    try {
      const returnedBlog = await blogService.update(id, updatedBlog);

      setLikes(returnedBlog.likes);
    } catch (error) {
      console.error("Error updating the blog:", error);
    }
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
          likes: {likes} <button onClick={handleLike}>like</button>
        </p>
        <button onClick={handleDeleteClick}>remove</button>
        <br /> <br />
      </Togglable>
    </div>
  );
};

export default Blog;
