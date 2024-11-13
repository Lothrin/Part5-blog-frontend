import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from "./components/message"
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

 const handleLogin = async (event) => {
  event.preventDefault()
  
  try {
    const user = await loginService.login({
      username, 
      password,
    })
    console.log('Logged in user:', user) 
    window.localStorage.setItem(
      'loggedBlogappUser', JSON.stringify(user)
    )
    blogService.setToken(user.token)
    setUser(user)
    setUsername('')
    setPassword('')
  } catch (exception) {
    console.error('Login failed:', exception) 
    setErrorMessage('Wrong credentials')
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }
}

const loginForm = () => (
  <form onSubmit={handleLogin}>
    <div>
      username
        <input
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
      password
        <input
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button type="submit">login</button>
  </form>      
)


const handleLogout = () => {
  window.localStorage.removeItem('loggedBlogappUser');
  setUser(null);
  console.log('User has been logged out');
};
console.log(user);

const blogForm = () => (
  <div>
  <h2>Create New</h2>
  <form onSubmit={addBlog}>
    <p>Title: <input 
    value={newBlogTitle}
    onChange={handleBlogTitleChange}/></p>
    <p>Author: <input 
    value={newBlogAuthor}
    onChange={handleBlogAuthorChange}/></p>
    <p>Url: <input 
    value={newBlogUrl}
    onChange={handleBlogUrlChange}/></p>
    <button type="submit">save</button>
  </form></div>
)

const addBlog = (event) => {
  event.preventDefault()
  const blogObject = {
    title: newBlogTitle,
    author: newBlogAuthor,
    url: newBlogUrl
  }

  blogService
  .create(blogObject)
  .then(returnedBlog => {
    setBlogs(blogs.concat(returnedBlog))
    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  })
}

const handleBlogTitleChange = (event) => {
  console.log(event.target.value)
  setNewBlogTitle(event.target.value)
}
const handleBlogAuthorChange = (event) => {
  console.log(event.target.value)
  setNewBlogAuthor(event.target.value)
}
const handleBlogUrlChange = (event) => {
  console.log(event.target.value)
  setNewBlogUrl(event.target.value)
}

return (
  user === null ? 
    <div>
      <h2>Log in to application</h2>
      <Notification message={errorMessage} />
      {loginForm()}
    </div> 
  : 
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>
      {blogForm()} 
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
)

}

export default App