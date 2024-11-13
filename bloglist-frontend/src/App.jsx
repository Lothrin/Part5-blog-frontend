import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from "./components/message"
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
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

 const handleLogin = async (event) => {
  event.preventDefault()
  
  try {
    const user = await loginService.login({
      username, 
      password,
    })
    console.log('Logged in user:', user) // Debug line to check user data
    window.localStorage.setItem(
      'loggedBlogappUser', JSON.stringify(user)
    )
    blogService.setToken(user.token)
    setUser(user)
    setUsername('')
    setPassword('')
  } catch (exception) {
    console.error('Login failed:', exception) // Debug line to check errors
    setErrorMessage('Wrong credentials')
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }
}

const handleLogout = () => {
  window.localStorage.removeItem('loggedBlogappUser');
  setUser(null);
  console.log('User has been logged out');
};
console.log(user);

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
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
)

}

export default App