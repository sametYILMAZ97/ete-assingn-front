import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Companies from './pages/Companies'
import Products from './pages/Products'
import NoPage from './pages/NoPage'

import axios from 'axios'
import Menu from './components/Menu'
import Footer from './components/Footer'

import './index.css'

axios.defaults.baseURL = 'http://localhost:3000/api'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.common['Authorization'] = localStorage.getItem('token') || ''
// create a axios response interceptor to handle errors if token is expired
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Menu />
      </div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/products" element={<Products />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Footer />
      </div>
    </BrowserRouter>
  </React.StrictMode>
)
