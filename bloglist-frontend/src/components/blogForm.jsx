import { useState } from "react";

const BlogForm = ({ createBlog, user }) => {
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogAuthor, setNewBlogAuthor] = useState("");
  const [newBlogUrl, setNewBlogUrl] = useState("");

  const addBlog = async (event) => {
    event.preventDefault();
    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
      user: { id: user.id, username: user.username },
    });

    setNewBlogTitle("");
    setNewBlogAuthor("");
    setNewBlogUrl("");
  };

  return (
    <div>
      <h2>Create New</h2>
      <form onSubmit={addBlog}>
        <p>
          Title:{" "}
          <input
            placeholder="title"
            value={newBlogTitle}
            onChange={(event) => setNewBlogTitle(event.target.value)}
            data-testid="newBlogTitle"
          />
        </p>
        <p>
          Author:{" "}
          <input
            placeholder="author"
            value={newBlogAuthor}
            onChange={(event) => setNewBlogAuthor(event.target.value)}
            data-testid="newBlogAuthor"
          />
        </p>
        <p>
          Url:{" "}
          <input
            placeholder="url"
            value={newBlogUrl}
            onChange={(event) => setNewBlogUrl(event.target.value)}
            data-testid="newBlogUrl"
          />
        </p>
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default BlogForm;
