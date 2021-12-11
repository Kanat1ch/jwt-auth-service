import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../routes'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import './Login.scss'
import { useDispatch, useSelector } from 'react-redux'
import { login, removeErrors } from '../../store/actions/user/userAction'

export const Login = () => {

    const errorMessage = useSelector((state: any) => state.user.errors?.message)

    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const navigate = useNavigate()

    const dispatch = useDispatch()
    const loading = useSelector((state: any) => state.user.loadingComponent) === 'login'
    const isAuth = useSelector((state: any) => state.user.isAuth)

    const loginHandler = () => {
        try {
            dispatch(login(username, password))
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (isAuth) {
            navigate('/profile/account')
        }
    }, [isAuth, navigate])

    useEffect(() => {
        if (errorMessage) {
            message.error(errorMessage);
            dispatch(removeErrors())
        }
    }, [errorMessage])

    return (
        <div className="Login">
            <p className="Login__preview-text">Log in to your account or <Link to={ROUTES.registration}>register now</Link></p>
            <Form
                name="basic"
                initialValues={{ remember: true }}
                autoComplete="off"
                layout="vertical"
                onFinish={loginHandler}
            >
                <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your username or email!' }]}
                >
                    <Input
                        placeholder="Username or Email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        prefix={<UserOutlined style={{ color: '#979797' }} />} 
                    />
                </Form.Item>
    
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        prefix={<LockOutlined style={{ color: '#979797' }} />}
                    />
                </Form.Item>
        
                <Form.Item className="Login__actions">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        Log in
                    </Button>

                    <Button
                        type="link"
                        className="Login__forgot-password-btn"
                    >
                        Reset password
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}