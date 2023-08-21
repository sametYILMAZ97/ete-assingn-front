// react page for companies page with antd table and modal for update and delete companies
// modal for add new company
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import * as antd from 'antd'
import * as antdCharts from '@ant-design/charts'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

const Companies: React.FC = () => {
  interface Company {
    _id?: string
    name: string
    legalNumber: string
    country: string
    url: string
    income: number
    expense: number
  }

  interface AlertsAttributes {
    message: string
    code: string
    id: string
    type: 'success' | 'info' | 'warning' | 'error' | undefined
  }
  interface arrayAlerts extends Array<AlertsAttributes> {}

  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [alerts, setAlerts] = useState<arrayAlerts>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [modalType, setModalType] = useState<'add' | 'edit'>('add')

  const [currentCompany, setCurrentCompany] = useState<Company>({
    name: '',
    legalNumber: '',
    country: '',
    url: '',
    income: 0,
    expense: 0,
  })

  function getAllCompanies() {
    setLoading(true)
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
      .finally(() => {
        setLoading(false)
      })
  }

  function deleteCompany(id: string) {
    const company = companies.find((company) => company._id === id)
    // pop up for confirm delete
    antd.Modal.confirm({
      title: `Are you sure you want to delete this company?`,
      icon: <DeleteOutlined style={{ color: 'red' }} />,
      content: `${company?.name} company will be deleted`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        axios
          .delete(`/company/${id}`)
          .then((res) => {
            pushAlert({
              message: 'Company deleted successfully',
              code: res.data.code,
              id: Math.random().toString(36).substring(7),
              type: 'success',
            })
            getAllCompanies()
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

  function updateCompany() {
    const data = {
      name: currentCompany.name,
      legalNumber: currentCompany.legalNumber,
      country: currentCompany.country,
      url: currentCompany.url,
      income: currentCompany.income,
      expense: currentCompany.expense,
    }
    if (modalType === 'edit') {
      axios
        .put(`/company/${currentCompany._id}`, data)
        .then((res) => {
          pushAlert({
            message: 'Company updated successfully',
            code: res.data.code,
            id: Math.random().toString(36).substring(7),
            type: 'success',
          })
          getAllCompanies()
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
        .post('/company', data)
        .then((res) => {
          pushAlert({
            message: 'Company added successfully',
            code: res.data.code,
            id: Math.random().toString(36).substring(7),
            type: 'success',
          })
          getAllCompanies()
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

  function changeCurrentCompany(id: string) {
    const company = companies.find((company) => company._id === id)
    const emptyCompany = {
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
    getAllCompanies()
  }, [])

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Legal Number',
      dataIndex: 'legalNumber',
      key: 'legalNumber',
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: 'Income',
      dataIndex: 'income',
      key: 'income',
    },
    {
      title: 'Expense',
      dataIndex: 'expense',
      key: 'expense',
    },
    {
      title: 'Actions',
      key: 'action',
      render: (record: Company) => (
        <>
          <DeleteOutlined
            style={{ color: 'red' }}
            onClick={() => {
              deleteCompany(record._id!)
            }}
          />
          <antd.Divider type="vertical" />
          <EditOutlined
            style={{ color: 'blue' }}
            onClick={() => {
              changeCurrentCompany(record._id!).then(() => {
                setModalType('edit')
                setVisible(true)
              })
            }}
          />
        </>
      ),
    },
  ]

  const config = {
    data: companies,
    xField: 'name',
    yField: 'income',
    seriesField: 'country',
    height: 300,
    point: {
      size: 5,
      shape: 'diamond',
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: 'transparent',
          fill: 'red',
        },
      },
    },
  }

  // companies profits pie chart
  const configPie = {
    appendPadding: 10,
    data: companies,
    angleField: 'income',
    colorField: 'name',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: '{name}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [{ type: 'element-active' }],
  }

  const ModalFormFields = [
    {
      name: ['name'],
      value: currentCompany.name,
    },
    {
      name: ['legalNumber'],
      value: currentCompany.legalNumber,
    },
    {
      name: ['country'],
      value: currentCompany.country,
    },
    {
      name: ['url'],
      value: currentCompany.url,
    },
    {
      name: ['income'],
      value: currentCompany.income,
    },
    {
      name: ['expense'],
      value: currentCompany.expense,
    },
  ]

  return (
    // create a page for me please with antd table and modal for update and delete companies
    <div>
      <>
        <antd.Table
          columns={columns}
          dataSource={companies}
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            pageSizeOptions: ['1', '10', '25', '50'],
            showSizeChanger: true,
            showTotal: (total: number, range: [number, number]) => `${range[0]}-${range[1]} of ${total} items`,
            position: ['bottomRight'],
          }}
          scroll={{ y: 480 }}
          summary={() => {
            let totalIncome = 0
            let totalExpense = 0
            companies.forEach((company) => {
              totalIncome += company.income
              totalExpense += company.expense
            })
            return (
              <antd.Table.Summary.Row>
                <antd.Table.Summary.Cell index={0}>Total</antd.Table.Summary.Cell>
                <antd.Table.Summary.Cell index={1}></antd.Table.Summary.Cell>
                <antd.Table.Summary.Cell index={2}></antd.Table.Summary.Cell>
                <antd.Table.Summary.Cell index={3}></antd.Table.Summary.Cell>
                <antd.Table.Summary.Cell index={4}>{totalIncome}</antd.Table.Summary.Cell>
                <antd.Table.Summary.Cell index={5}>{totalExpense}</antd.Table.Summary.Cell>
              </antd.Table.Summary.Row>
            )
          }}
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
            setCurrentCompany({
              name: '',
              legalNumber: '',
              country: '',
              url: '',
              income: 0,
              expense: 0,
            })
            setVisible(true)
            setModalType('add')
          }}
        >
          Add New Company
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
      >
        <antd.Typography.Title level={3}>Companies income</antd.Typography.Title>
        <antdCharts.Line
          {...config}
          style={{
            width: '64rem',
          }}
        />
        <antd.Divider type="horizontal" />
        <antd.Typography.Title level={3} style={{}}>
          Companies profits
        </antd.Typography.Title>
        <antdCharts.Pie
          {...configPie}
          style={{
            width: '32rem',
          }}
        />
      </antd.Space>
      <antd.Modal
        title={modalType === 'add' ? 'Add new company' : 'Update company'}
        open={visible}
        onOk={() => updateCompany()}
        onCancel={() => {
          setVisible(false)
          setCurrentCompany({
            name: '',
            legalNumber: '',
            country: '',
            url: '',
            income: 0,
            expense: 0,
          })
        }}
        destroyOnClose
      >
        <antd.Form name="basic" initialValues={{ remember: true }} fields={ModalFormFields}>
          <antd.Form.Item label="Name" name="name">
            <antd.Input
              value={currentCompany.name}
              onChange={(e) => {
                setCurrentCompany({ ...currentCompany, name: e.target.value })
              }}
            />
          </antd.Form.Item>
          <antd.Form.Item label="Legal Number" name="legalNumber">
            <antd.Input
              value={currentCompany.legalNumber}
              onChange={(e) => {
                setCurrentCompany({ ...currentCompany, legalNumber: e.target.value })
              }}
            />
          </antd.Form.Item>
          <antd.Form.Item label="Country" name="country">
            <antd.Input
              value={currentCompany.country}
              onChange={(e) => {
                setCurrentCompany({ ...currentCompany, country: e.target.value })
              }}
            />
          </antd.Form.Item>
          <antd.Form.Item label="URL" name="url">
            <antd.Input
              value={currentCompany.url}
              onChange={(e) => {
                setCurrentCompany({ ...currentCompany, url: e.target.value })
              }}
            />
          </antd.Form.Item>
          <antd.Form.Item label="Income" name="income">
            <antd.InputNumber
              min={0}
              value={currentCompany.income}
              onChange={(value: number | null) => {
                setCurrentCompany({ ...currentCompany, income: Number(value) })
              }}
            />
          </antd.Form.Item>
          <antd.Form.Item label="Expense" name="expense">
            <antd.InputNumber
              min={0}
              value={currentCompany.expense}
              onChange={(value: number | null) => {
                setCurrentCompany({ ...currentCompany, expense: Number(value) })
              }}
            />
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

export default Companies
