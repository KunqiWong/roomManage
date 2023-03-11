import 'react'
import { Button, Checkbox, Form, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { globalStore } from '@/stores/index'
import JSEncrypt from 'jsencrypt'
import Base64 from 'crypto-js/enc-base64'
import { useEffect, useState } from 'react'

export default () => {
  const naviagte = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const uncrypted = window.atob(localStorage.getItem('remember'))
  const username = window.atob(localStorage.getItem('user'))
  const [secret, setSecret] = useState(
    localStorage.getItem('remember') ? uncrypted : ''
  )
  const [user, setUser] = useState(username)
  const onFinish = (values: any) => {
    const { username, password, remember } = values
    globalStore
      .login({
        username,
        password,
      })
      .then((res) => {
        const { token } = res.data
        globalStore.setToken({ token: token, username: username })
        if (remember) {
          // const encrypt = new JSEncrypt() // 创建加密对象实例
          // const pubKey = Base64.encodeBase64()
          // encrypt.setPublicKey(pubKey) //设置公钥
          const rsaPassWord: any = window.btoa(password) // 对内容进行加密
          const userName: any = window.btoa(username)
          localStorage.setItem('remember', rsaPassWord)
          localStorage.setItem('user', userName)
        } else {
          localStorage.removeItem('remember')
        }
        naviagte('/center/home')
      })
      .catch((res) => {
        messageApi.error('账号或密码错误')
      })
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <>
      {contextHolder}
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off">
        <Form.Item
          label="职工号"
          name="username"
          initialValue={user}
          rules={[{ required: true, message: '请输入！' }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          initialValue={secret}
          rules={[{ required: true, message: '请输入！' }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>记住密码</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
