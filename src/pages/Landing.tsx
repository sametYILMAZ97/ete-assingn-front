// react page for Login and Register page with antd
import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import * as antd from 'antd'

// interface array of objects with message and code
interface AlertsAttributes {
  message: string
  code: string
  id: string
  type: 'success' | 'info' | 'warning' | 'error' | undefined
}

interface arrayAlerts extends Array<AlertsAttributes> {}

const Landing: React.FC = () => {
  // states
  const [name, setName] = useState<string>('JohnDoe')
  const [password, setPassword] = useState<string>('JohnDoe')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [alerts, setAlerts] = useState<arrayAlerts>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [login, setLogin] = useState<boolean>(true)

  // functions
  // for register
  const registerUser = async () => {
    setLoading(true)
    const userData = {
      name,
      email,
      password,
      confirmPassword,
    }

    // Created fake delay to show loading
    setTimeout(() => {
      axios
        .post('/user', userData)
        .then((res) => {
          pushAlert({
            message: 'User created successfully',
            code: res.data.code,
            id: Math.random().toString(36).substring(7),
            type: 'success',
          })
          localStorage.setItem('token', `Bearer ${res.data.token}`)
          window.location.href = '/home'
        })
        .catch((err) => {
          pushAlert({
            message: err.response.data.message,
            code: err.response.data.code,
            id: Math.random().toString(36).substring(7),
            type: 'error',
          })
        })
        .finally(() => setLoading(false))
    }, 1000)
  }
  // for login
  const loginUser = async () => {
    setLoading(true)
    const userData = {
      name,
      password,
    }

    // Created fake delay to show loading
    setTimeout(() => {
      axios
        .post('/user/login', userData)
        .then((res) => {
          pushAlert({
            message: `${res.data.name} welcome back!`,
            code: res.data.code,
            id: Math.random().toString(36).substring(7),
            type: 'success',
          })
          localStorage.setItem('token', `Bearer ${res.data.token}`)
          window.location.href = '/home'
        })
        .catch((err) => {
          pushAlert({
            message: err.response.data.message,
            code: err.response.data.code,
            id: Math.random().toString(36).substring(7),
            type: 'error',
          })
        })
        .finally(() => setLoading(false))
    }, 1000)
  }

  // for error push in array
  function pushAlert({ message, code, id, type }: AlertsAttributes) {
    setAlerts((prev) => [...prev, { message, code, id, type }])
    setTimeout(() => {
      deleteError(id)
    }, 5000)
  }

  // for delete error from array
  function deleteError(id: string) {
    setAlerts((prev) => prev.filter((error) => error.id !== id))
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
      }}
    >
      <antd.Card
        title={login ? 'Login' : 'Register'}
        style={{
          width: '30rem',
          // add white shadow
          boxShadow: '0 0 2px 1px rgba(255,255,255,1)',
        }}
      >
        <antd.Form
          name="basic"
          layout="vertical"
          labelAlign="left"
          initialValues={{ remember: true }}
          autoComplete="on"
        >
          {!login && (
            <antd.Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                },
              ]}
            >
              <antd.Input
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
            </antd.Form.Item>
          )}
          <antd.Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input your name!',
              },
            ]}
          >
            <antd.Input
              placeholder="Name"
              defaultValue={name}
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />
          </antd.Form.Item>
          <antd.Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <antd.Input.Password
              placeholder="Password"
              defaultValue={password}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
          </antd.Form.Item>
          {!login && (
            <antd.Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: 'Please input your confirm password!',
                },
              ]}
            >
              <antd.Input.Password
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              />
            </antd.Form.Item>
          )}
          <antd.Form.Item
            // center it
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <antd.Button type="primary" htmlType="submit" onClick={login ? loginUser : registerUser} loading={loading}>
              {login ? 'Login' : 'Register'}
            </antd.Button>
          </antd.Form.Item>
          <antd.Typography.Text>
            {login ? 'Not a member yet?' : 'Already have an account?'}
            <Link to="" onClick={() => setLogin(!login)}>
              {login ? ' Register' : ' Login'}
            </Link>
          </antd.Typography.Text>
        </antd.Form>
      </antd.Card>
      {/* if there are alerts, show them */}
      <antd.Space
        direction="vertical"
        style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
        }}
      >
        {alerts.map((alert) => (
          <antd.Alert
            key={alert.id}
            message={alert.message}
            type={alert.type}
            showIcon
            closable
            onClose={() => deleteError(alert.id)}
          />
        ))}
      </antd.Space>
    </div>
  )
}

export default Landing
