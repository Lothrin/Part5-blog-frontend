import { useState } from "react";
import Togglable from "./togglable";
import blogService from "../services/blogs";

const Blog = ({ blog, handleDelete, handleLike, user }) => {
  const [likes, setLikes] = useState(blog.likes);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleDeleteClick = () => {
    handleDelete(blog.id);
  };

  const handleLikeClick = () => {
    handleLike(blog.id, likes);
    setLikes(likes + 1);
  };

  return (
    <div style={blogStyle} data-testid="blogDiv">
      <p>{blog.title}</p> <p>{blog.author}</p>{" "}
      <button onClick={handleDeleteClick}>Delete Blog</button>
      <Togglable buttonLabel="view" className="togglableContent">
        <p>{blog.user.name}</p> <p>{blog.url}</p>
        <p>
          likes: {likes} <button onClick={handleLikeClick}>like</button>
        </p>
        <br /> <br />
      </Togglable>
    </div>
  );
};

export default Blog;
