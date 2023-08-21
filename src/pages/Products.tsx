// react page for products page with antd table and modal for update and delete products
// modal for add new product
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import * as antd from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

const Products: React.FC = () => {
  interface Company {
    _id?: string
    name: string
    legalNumber: string
    country: string
    url: string
    income: number
    expense: number
  }
  interface Product {
    _id?: string
    name: string
    category: string
    amount: number
    unit: string
    company: Company
  }

  interface AlertsAttributes {
    message: string
    code: string
    id: string
    type: 'success' | 'info' | 'warning' | 'error' | undefined
  }
  interface arrayAlerts extends Array<AlertsAttributes> {}

  const [products, setProducts] = useState<Product[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [alerts, setAlerts] = useState<arrayAlerts>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [modalType, setModalType] = useState<'add' | 'edit'>('add')

  const [currentProduct, setCurrentProduct] = useState<Product>({
    name: '',
    category: '',
    amount: 0,
    unit: '',
    company: {
      name: '',
      legalNumber: '',
      country: '',
      url: '',
      income: 0,
      expense: 0,
    } as Company,
  })

  const [currentCompany, setCurrentCompany] = useState<Company>({
    _id: '',
    name: '',
    legalNumber: '',
    country: '',
    url: '',
    income: 0,
    expense: 0,
  })

  function getAllProducts() {
    setLoading(true)
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
      .finally(() => {
        setLoading(false)
      })
  }

  function getAllCompanies() {
    axios
      .get('/company')
      .then((res) => {
        setCompanies(res.data)
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

  function deleteProduct(id: string) {
    const product = products.find((product: Product) => product._id === id)
    // pop up for confirm delete
    antd.Modal.confirm({
      title: `Are you sure you want to delete this product?`,
      icon: <DeleteOutlined style={{ color: 'red' }} />,
      content: `${product?.name} product will be deleted`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        axios
          .delete(`/product/${id}`)
          .then((res) => {
            pushAlert({
              message: 'Product deleted successfully',
              code: res.data.code,
              id: Math.random().toString(36).substring(7),
              type: 'success',
            })
            getAllProducts()
          })
          .catch((err) => {
            pushAlert({
              message: err.response.data.message,
              code: err.response.data.code,
              id: Math.random().toString(36).substring(7),
              type: 'error',
            })
          })
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  function updateProduct() {
    const data = {
      name: currentProduct.name,
      category: currentProduct.category,
      amount: currentProduct.amount,
      unit: currentProduct.unit,
      company: currentCompany._id,
    }
    if (modalType === 'edit') {
      axios
        .put(`/product/${currentProduct._id}`, data)
        .then((res) => {
          pushAlert({
            message: 'Product updated successfully',
            code: res.data.code,
            id: Math.random().toString(36).substring(7),
            type: 'success',
          })
          getAllProducts()
        })
        .catch((err) => {
          pushAlert({
            message: err.response.data.message,
            code: err.response.data.code,
            id: Math.random().toString(36).substring(7),
            type: 'error',
          })
        })
        .finally(() => {
          setVisible(false)
        })
    } else {
      axios
        .post('/product', data)
        .then((res) => {
          pushAlert({
            message: 'Product added successfully',
            code: res.data.code,
            id: Math.random().toString(36).substring(7),
            type: 'success',
          })
          getAllProducts()
        })
        .catch((err) => {
          pushAlert({
            message: err.response.data.message,
            code: err.response.data.code,
            id: Math.random().toString(36).substring(7),
            type: 'error',
          })
        })
        .finally(() => {
          setVisible(false)
        })
    }
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
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  function changeCurrentProduct(id: string) {
    const product = products.find((product) => product._id === id)
    const emptyProduct = {
      name: '',
      category: '',
      amount: 0,
      unit: '',
      company: {
        name: '',
        legalNumber: '',
        country: '',
        url: '',
        income: 0,
        expense: 0,
      } as Company,
    } as Product
    setCurrentProduct(product || emptyProduct)
    return new Promise((resolve) => {
      resolve(product || emptyProduct)
    })
  }

  function changeCurrentCompany(id: string) {
    const company = companies.find((company) => company._id === id)
    const emptyCompany = {
      _id: '',
      name: '',
      legalNumber: '',
      country: '',
      url: '',
      income: 0,
      expense: 0,
    } as Company
    setCurrentCompany(company || emptyCompany)
    return new Promise((resolve) => {
      resolve(company || emptyCompany)
    })
  }

  useEffect(() => {
    getAllProducts()
    getAllCompanies()
  }, [])

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      render: (company: Company) => <span>{company.name}</span>,
    },
    {
      title: 'Actions',
      key: 'action',
      render: (record: Product) => (
        <>
          <DeleteOutlined
            style={{ color: 'red' }}
            onClick={() => {
              deleteProduct(record._id!)
            }}
          />
          <antd.Divider type="vertical" />
          <EditOutlined
            style={{ color: 'blue' }}
            onClick={() => {
              changeCurrentProduct(record._id!).then(() => {
                changeCurrentCompany(record.company._id!).then(() => {
                  setModalType('edit')
                  setVisible(true)
                })
              })
            }}
          />
        </>
      ),
    },
  ]

  const ModalFormFields = [
    {
      name: ['name'],
      value: currentProduct.name,
    },
    {
      name: ['category'],
      value: currentProduct.category,
    },
    {
      name: ['amount'],
      value: currentProduct.amount,
    },
    {
      name: ['unit'],
      value: currentProduct.unit,
    },
    {
      name: ['company'],
      value: currentCompany.name,
    },
  ]

  return (
    // create a page for me please with antd table and modal for update and delete companies
    <div>
      <>
        <antd.Table
          columns={columns}
          dataSource={products}
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            pageSizeOptions: ['1', '10', '25', '50'],
            showSizeChanger: true,
            showTotal: (total: number, range: [number, number]) => `${range[0]}-${range[1]} of ${total} items`,
            position: ['bottomRight'],
          }}
          scroll={{ y: 480 }}
          style={{
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
          }}
        />
        <antd.Button
          type="primary"
          size="small"
          style={{
            bottom: '3rem',
          }}
          onClick={() => {
            setCurrentProduct({
              name: '',
              category: '',
              amount: 0,
              unit: '',
              company: {
                name: '',
                legalNumber: '',
                country: '',
                url: '',
                income: 0,
                expense: 0,
              } as Company,
            } as Product)
            setVisible(true)
            setModalType('add')
          }}
        >
          Add New Product
        </antd.Button>
      </>
      <antd.Space
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: '2rem',
          margin: '2rem',
        }}
      ></antd.Space>
      <antd.Modal
        title={modalType === 'add' ? 'Add new company' : 'Update company'}
        open={visible}
        onOk={() => updateProduct()}
        onCancel={() => {
          setVisible(false)
          setCurrentProduct({
            name: '',
            category: '',
            amount: 0,
            unit: '',
            company: {
              name: '',
              legalNumber: '',
              country: '',
              url: '',
              income: 0,
              expense: 0,
            } as Company,
          } as Product)
        }}
        destroyOnClose
      >
        <antd.Form name="basic" initialValues={{ remember: true }} fields={ModalFormFields}>
          <antd.Form.Item label="Name" name="name">
            <antd.Input
              value={currentProduct.name}
              onChange={(e) => {
                setCurrentProduct({ ...currentProduct, name: e.target.value })
              }}
            />
          </antd.Form.Item>
          <antd.Form.Item label="Category" name="category">
            <antd.Input
              value={currentProduct.category}
              onChange={(e) => {
                setCurrentProduct({ ...currentProduct, category: e.target.value })
              }}
            />
          </antd.Form.Item>
          <antd.Form.Item label="Amount" name="amount">
            <antd.InputNumber
              min={0}
              value={currentProduct.amount}
              onChange={(value: number | null) => {
                setCurrentProduct({ ...currentProduct, amount: Number(value) })
              }}
            />
          </antd.Form.Item>
          <antd.Form.Item label="Unit" name="unit">
            <antd.Input
              value={currentProduct.unit}
              onChange={(e) => {
                setCurrentProduct({ ...currentProduct, unit: e.target.value })
              }}
            />
          </antd.Form.Item>
          <antd.Form.Item label="Company" name="company">
            {/* select field for company */}
            <antd.Select
              style={{ width: '100%' }}
              value={currentCompany.name}
              onChange={(value: string) => {
                changeCurrentCompany(value)
              }}
            >
              {companies.map((company) => (
                <antd.Select.Option key={company._id} value={company._id}>
                  {company.name}
                </antd.Select.Option>
              ))}
            </antd.Select>
          </antd.Form.Item>
        </antd.Form>
      </antd.Modal>
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

export default Products
