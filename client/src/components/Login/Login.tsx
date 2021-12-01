import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../routes'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import './Login.scss'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../store/actions/user/userAction'

export const Login = () => {

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
        
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        onClick={loginHandler}
                        loading={loading}
                    >
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}