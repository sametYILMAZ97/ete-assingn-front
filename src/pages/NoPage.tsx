// react tsx page for 404 error

import React from 'react'
import { Link } from 'react-router-dom'
import Button from 'antd/es/button'

const NoPage: React.FC = () => (
  <>
    <h1>404</h1>
    <p>Page not found</p>
    <Button type="primary">
      <Link to="/home">Back Home</Link>
    </Button>
  </>
)

export default NoPage
