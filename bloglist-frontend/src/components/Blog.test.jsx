import { render, screen } from "@testing-library/react";
import Blog from "./blog";

test("renders content with only title and author", () => {
  const blog = {
    title: "My Second Blog",
    author: "John Doe",
    url: "http://example.com",
    likes: 9,
    user: { name: "Jane Doe" },
    id: "6720dfc9b0461b136ee63597",
  };

  render(<Blog blog={blog} handleDelete={() => {}} />);

  screen.debug();

  screen.getByText("My Second Blog");
  screen.getByText("John Doe");

  const url = screen.queryByText("http://example.com");
  const likes = screen.queryByText("likes: 9");

  expect(url).toBeNull();
  expect(likes).toBeNull();
});
