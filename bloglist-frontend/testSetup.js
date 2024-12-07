import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import axios from 'axios';


beforeAll(() => {
  axios.defaults.baseURL = 'http://localhost:3003'; 
});


afterEach(() => {
  cleanup()
})