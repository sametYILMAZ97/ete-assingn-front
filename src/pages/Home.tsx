// react page for Home page with antd

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import * as antd from 'antd'

const Home: React.FC = () => {
  interface Company {
    name: string
    legalNumber: string
    country: string
    url: string
    income: number
    expense: number
  }
  interface Product {
    name: string
    category: string
    amount: number
    unit: string
    // company field is like Company interface
    company: Company
  }
  interface AlertsAttributes {
    message: string
    code: string
    id: string
    type: 'success' | 'info' | 'warning' | 'error' | undefined
  }
  interface arrayAlerts extends Array<AlertsAttributes> {}

  const [companies, setCompanies] = useState<Company[]>([])
  const [last3Companies, setLast3Companies] = useState<Company[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [alerts, setAlerts] = useState<arrayAlerts>([])
  const [highestRevenue, setHighestRevenue] = useState<Company>()
  const [lowestRevenue, setLowestRevenue] = useState<Company>()

  function getAllCompanies() {
    axios
      .get('/company')
      .then((res) => {
        setCompanies(res.data)
        setHighestRevenue(
          res.data.reduce((prev: Company, current: Company) => (prev.income > current.income ? prev : current))
        )
        setLowestRevenue(
          res.data.reduce((prev: Company, current: Company) => (prev.income < current.income ? prev : current))
        )
        pushAlert({
          message: 'Companies loaded successfully',
          code: res.data.code,
          id: Math.random().toString(36).substring(7),
          type: 'success',
        })
      })
      .catch((err) => {
        // push alert to array
        pushAlert({
          message: err.response.data.message,
          code: err.response.data.code,
          id: Math.random().toString(36).substring(7),
          type: 'error',
        })
      })
  }

  function getAllProducts() {
    axios
      .get('/product')
      .then((res) => {
        setProducts(res.data)
        pushAlert({
          message: 'Products loaded successfully',
          code: res.data.code,
          id: Math.random().toString(36).substring(7),
          type: 'success',
        })
      })
      .catch((err) => {
        // push alert to array
        pushAlert({
          message: err.response.data.message,
          code: err.response.data.code,
          id: Math.random().toString(36).substring(7),
          type: 'error',
        })
      })
  }

  function getLast3Companies() {
    axios
      .get('/company/filter/last3')
      .then((res) => {
        setLast3Companies(res.data)
        pushAlert({
          message: 'Last 3 Companies loaded successfully',
          code: res.data.code,
          id: Math.random().toString(36).substring(7),
          type: 'success',
        })
      })
      .catch((err) => {
        // push alert to array
        pushAlert({
          message: err.response.data.message,
          code: err.response.data.code,
          id: Math.random().toString(36).substring(7),
          type: 'error',
        })
      })
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

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      getAllCompanies()
      getLast3Companies()
      getAllProducts()
      setLoading(false)
    }, 2000)
  }, [])

  useEffect(() => {
    // // set highest revenue
    // const highestRevenue = companies.reduce((prev, current) => {
    //   return prev.income > current.income ? prev : current
    // })
    // setHighestRevenue(highestRevenue)
    // // set lowest revenue
    // const lowestRevenue = companies.reduce((prev, current) => {
    //   return prev.income < current.income ? prev : current
    // })
    // setLowestRevenue(lowestRevenue)
    // // set highest products
    // const highestProducts = products.reduce((prev, current) => {
    //   return prev.amount > current.amount ? prev : current
    // })
    // setHighestProducts(highestProducts)
    // // set lowest products
    // const lowestProducts = products.reduce((prev, current) => {
    //   return prev.amount < current.amount ? prev : current
    // })
    // setLowestProducts(lowestProducts)
  }, [companies, products])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <antd.Space
        direction="horizontal"
        size="large"
        style={{
          margin: '8rem 0rem 1rem 0rem',
        }}
      >
        <Link to="/companies">
          <antd.Card
            title="Registered Companies"
            style={{
              width: '14rem',
              height: '8rem',
              backdropFilter: 'blur(5px)',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
            }}
            hoverable
            bordered={false}
          >
            <antd.Typography.Title level={3}>{companies.length}</antd.Typography.Title>
          </antd.Card>
        </Link>
        <Link to="/products">
          <antd.Card
            title="Registered Products"
            style={{
              width: '14rem',
              height: '8rem',
              backdropFilter: 'blur(5px)',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
            }}
            hoverable
            bordered={false}
          >
            <antd.Typography.Title level={3}>{products.length}</antd.Typography.Title>
          </antd.Card>
        </Link>
        <antd.Card
          title="Highest Revenue"
          style={{
            width: '14rem',
            height: '8rem',
          }}
        >
          <antd.Typography.Title level={5}>
            {highestRevenue?.name} -{' '}
            {
              // regex for currency format
              highestRevenue?.income.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })
            }
          </antd.Typography.Title>
        </antd.Card>
        <antd.Card
          title="Lowest Revenue"
          style={{
            width: '14rem',
            height: '8rem',
          }}
        >
          <antd.Typography.Title level={5}>
            {lowestRevenue?.name} -{' '}
            {
              // regex for currency format
              lowestRevenue?.income.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })
            }
          </antd.Typography.Title>
        </antd.Card>
      </antd.Space>
      <antd.Card
        title="Last 3 Companies"
        size="default"
        style={{
          margin: '1rem 0',
          width: '48rem',
        }}
      >
        <antd.List
          itemLayout="horizontal"
          dataSource={last3Companies}
          loading={loading}
          renderItem={(item) => (
            <antd.List.Item
              style={{
                height: '2rem',
              }}
            >
              <antd.Typography.Title
                level={5}
                style={{
                  margin: 0,
                  padding: 0,
                }}
              >
                {`${item.name} - ${item.legalNumber}`}
              </antd.Typography.Title>
              <antd.Typography.Text
                style={{
                  float: 'right',
                }}
              >
                {
                  // regex for currency format
                  item.income.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })
                }
              </antd.Typography.Text>
            </antd.List.Item>
          )}
        />
      </antd.Card>{' '}
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

export default Home
