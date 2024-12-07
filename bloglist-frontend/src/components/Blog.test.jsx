import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./blog";

describe("<Blog />", () => {
  const blog = {
    title: "My Second Blog",
    author: "John Doe",
    url: "http://example.com",
    likes: 9,
    user: { name: "Jane Doe" },
    id: "6720dfc9b0461b136ee63597",
  };
  const handleLikeMock = vi.fn();

  beforeEach(() => {
    render(<Blog blog={blog} handleLike={handleLikeMock} />);
  });

  test("renders content with only title and author", () => {
    screen.debug();

    screen.getByText("My Second Blog");
    screen.getByText("John Doe");

    const url = screen.queryByText("http://example.com");
    const likes = screen.queryByText("likes: 9");

    expect(url).toBeNull();
    expect(likes).toBeNull();
  });

  test("shows url, username and likes after view button is clicked", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("view");
    await user.click(button);

    screen.debug();

    const url = screen.getByText("http://example.com");
    const likes = screen.getByText("likes: 9");
    const username = screen.getByText("Jane Doe");

    expect(url).toBeDefined();
    expect(likes).toBeDefined();
    expect(username).toBeDefined();
  });

  test("like button is clicked twice, event handler is called twice", async () => {
    const user = userEvent.setup();
    const viewButton = screen.getByText("view");
    await user.click(viewButton);

    const likeButton = screen.getByText("like");
    await user.click(likeButton);
    await user.click(likeButton);

    expect(handleLikeMock.mock.calls).toHaveLength(2);
  });
});
