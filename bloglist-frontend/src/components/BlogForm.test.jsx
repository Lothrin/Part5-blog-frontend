import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./blogForm";

describe("<BlogForm />", () => {
  const createBlogMock = vi.fn();
  beforeEach(() => {
    render(<BlogForm createBlog={createBlogMock} />);
  });

  test("form calls eventhandler with the correct details", async () => {
    const user = userEvent.setup();

    const titleInput = screen.getByPlaceholderText("title");
    const authorInput = screen.getByPlaceholderText("author");
    const urlInput = screen.getByPlaceholderText("url");
    const sendButton = screen.getByText("save");

    await user.type(titleInput, "Test Title");
    await user.type(authorInput, "Test Author");
    await user.type(urlInput, "Test Url");
    await user.click(sendButton);

    expect(createBlogMock.mock.calls).toHaveLength(1);
    const blogDetails = createBlogMock.mock.calls[0][0];
    expect(blogDetails.title).toBe("Test Title");
    expect(blogDetails.author).toBe("Test Author");
    expect(blogDetails.url).toBe("Test Url");

    screen.debug();
  });
});
