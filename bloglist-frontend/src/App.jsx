import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/message";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/togglable";
import BlogForm from "./components/blogForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState({ text: null, error: true });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      console.log("User set from localStorage:", user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleDelete = async (id) => {
    try {
      await blogService.deleteBlog(id);
      setBlogs(blogs.filter((blog) => blog.id !== id));
      setMessage({ text: "Blog deleted successfully!", error: false });
      setTimeout(() => setMessage({ text: null, error: false }), 5000);
    } catch (error) {
      console.error("Error deleting the blog:", error);
      setMessage({ text: "Failed to delete blog", error: true });
      setTimeout(() => setMessage({ text: null, error: false }), 5000);
    }
  };

  const handleLike = async (id, newLikes) => {
    const blogToUpdate = blogs.find((blog) => blog.id === id);

    if (blogToUpdate) {
      const updatedBlog = {
        ...blogToUpdate,
        likes: newLikes,
      };

      try {
        const returnedBlog = await blogService.update(id, updatedBlog);

        setBlogs(blogs.map((blog) => (blog.id === id ? returnedBlog : blog)));
      } catch (error) {
        console.error("Error updating the blog:", error);
      }
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      console.log("Logged in user:", user);
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      console.log("Login successful - setting message");
      setMessage({
        text: `Login successful, logged in as ${user.username}`,
        error: false,
      });
      setTimeout(() => {
        setMessage({ text: null, error: true });
      }, 5000);
    } catch (exception) {
      console.error("Login failed:", exception);
      setMessage({ text: "Wrong Credentials", error: true });
      setTimeout(() => {
        setMessage({ text: null, error: true });
      }, 5000);
    }
  };
  console.log(user);

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
          data-testid="username"
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
          data-testid="password"
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
    console.log("User has been logged out");
    setMessage({ text: "Logout Successful", error: false });

    setTimeout(() => {
      setMessage({ text: null, error: true });
    }, 5000);
  };

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();

    try {
      const blogWithUser = {
        ...blogObject,
        user: {
          id: user.id,
          username: user.username,
        },
      };

      const returnedBlog = await blogService.create(blogWithUser);

      setBlogs(blogs.concat(returnedBlog));

      console.log("Blog Added Successfully - setting message");

      setMessage({
        text: `A new blog "${blogObject.title}" by "${blogObject.author}" is added!`,
        error: false,
      });

      setTimeout(() => {
        setMessage({ text: null, error: false });
      }, 5000);
    } catch (error) {
      console.error("Error adding blog:", error);

      setMessage({ text: "Failed to add blog", error: true });

      setTimeout(() => {
        setMessage({ text: null, error: false });
      }, 5000);
    }
  };

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} user={user} />
    </Togglable>
  );

  return user === null ? (
    <div>
      <h2>Log in to application</h2>
      <Notification message={message.text} error={message.error} />
      {loginForm()}
    </div>
  ) : (
    <div>
      <h2>Blogs</h2>
      <Notification message={message.text} error={message.error} />
      <p>
        {user.name} logged in <button onClick={handleLogout}>Logout</button>
      </p>
      {blogForm()}
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleDelete={handleDelete}
          handleLike={handleLike}
          user={user}
        />
      ))}
    </div>
  );
};

export default App;
