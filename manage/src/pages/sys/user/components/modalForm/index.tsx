import { Children, useState } from 'react'
import { Button, message, Modal, Space } from 'antd'
// import styles from './index.module.scss'

export default ({ children, handleSubmit, username, handleDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
    handleSubmit(username)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      {contextHolder}
      <Space style={{ fontSize: '5px' }}>
        <Button size="small" type="primary" onClick={showModal}>
          修改权限
        </Button>
        <Button
          size="small"
          type="primary"
          onClick={() => handleDelete(username)}
          danger>
          删除用户
        </Button>
      </Space>
      <Modal
        title="修改访问权限"
        open={isModalOpen}
        okText={'确认'}
        cancelText={'取消'}
        onOk={handleOk}
        onCancel={handleCancel}>
        {children}
      </Modal>
    </>
  )
}
