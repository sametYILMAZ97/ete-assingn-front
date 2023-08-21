import React from 'react'
import * as antd from 'antd'
import { GithubFilled, LinkedinFilled } from '@ant-design/icons'

// create a Footer for me please with antd
// github link: https://www.linkedin.com/in/samet-yilmaz-77ba011b3/
// linkedin link: https://github.com/sametYILMAZ97
const github = 'https://www.linkedin.com/in/samet-yilmaz-77ba011b3/'
const linkedin = 'https://github.com/sametYILMAZ97'

const FooterComponent: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        left: '0',
        bottom: '0',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'black',
        fontWeight: 'bold',
        padding: '1rem 1rem',
        margin: '1rem 1rem 2rem 2rem',
        borderRadius: '0.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <GithubFilled onClick={() => window.open(github, '_blank')} style={{ fontSize: '2rem' }} />
        <antd.Divider type="vertical" />
        <LinkedinFilled onClick={() => window.open(linkedin, '_blank')} style={{ fontSize: '2rem' }} />
      </div>
    </div>
  )
}

export default FooterComponent
