import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../routes'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import './Login.scss'

export const Login = () => {

    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    return (
        <div className="Login">
            <p className="Login__preview-text">Log in to your account or <Link to={ROUTES.registration}>register now</Link></p>
            <Form
                name="basic"
                initialValues={{ remember: true }}
                autoComplete="off"
                layout="vertical"
            >
                <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your username or email!' }]}
                >
                    <Input
                        placeholder="Username or Email"
                        prefix={<UserOutlined style={{ color: '#979797' }} />} 
                    />
                </Form.Item>
    
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password
                        placeholder="Password"
                        prefix={<LockOutlined style={{ color: '#979797' }} />}
                    />
                </Form.Item>
        
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}