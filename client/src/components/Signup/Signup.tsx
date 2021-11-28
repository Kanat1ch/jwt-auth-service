import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../routes'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import './Signup.scss'

export const Signup = () => {

    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [repeat, setRepeat] = useState<string>('')

    return (
        <div className="Signup">
            <p className="Signup__preview-text">Register or <Link to={ROUTES.login}>log in to your account</Link></p>
            <Form
                name="basic"
                initialValues={{ remember: true }}
                autoComplete="off"
                layout="vertical"
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input
                        placeholder="Username"
                        prefix={<UserOutlined style={{ color: '#979797' }} />} 
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    rules={[
                        { type: 'email', message: 'The email is not valid!' },
                        { required: true, message: 'Please input your email!' }
                    ]}
                >
                    <Input
                        placeholder="Email"
                        prefix={<MailOutlined style={{ color: '#979797' }} />} 
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

                <Form.Item
                    name="repeat"
                    rules={[{ required: true, message: 'Please repeat your password!' }]}
                >
                    <Input.Password
                        placeholder="Repeat password"
                        prefix={<LockOutlined style={{ color: '#979797' }} />}
                    />
                </Form.Item>
        
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Sign up
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}