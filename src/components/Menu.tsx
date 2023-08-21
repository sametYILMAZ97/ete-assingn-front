import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Menu from 'antd/es/menu'

const MenuComponent: React.FC = () => {
  const [token, setToken] = useState<string>('')

  useEffect(() => {
    setToken(localStorage.getItem('token') || '')
  }, [token])

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
  }
  return (
    <Menu
      mode="horizontal"
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '50%',
        fontWeight: 'bold',
        padding: '0 2rem',
        marginTop: '1rem',
        marginBottom: '2rem',
        borderRadius: '0.5rem',
      }}
    >
      {token && (
        <>
          <Menu.Item key="home">
            <Link to="/home">Home</Link>
          </Menu.Item>
          <Menu.Item key="companies">
            <Link to="/companies">Companies</Link>
          </Menu.Item>
          <Menu.Item key="products">
            <Link to="/products">Products</Link>
          </Menu.Item>

          <Menu.Item key="logout">
            <Link to="/" onClick={logout}>
              Logout
            </Link>
          </Menu.Item>
          <Menu.Item key="test" style={{ float: 'right' }}>
            <Link to="/randomtext">404 Test</Link>
          </Menu.Item>
        </>
      )}
      {!token && (
        <Menu.Item key="login">
          <Link to="/">Login and Register</Link>
        </Menu.Item>
      )}
    </Menu>
  )
}

export default MenuComponent
