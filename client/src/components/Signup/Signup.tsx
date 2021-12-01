import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../routes'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import './Signup.scss'
import { useDispatch, useSelector } from 'react-redux'
import { registration } from '../../store/actions/user/userAction'

export const Signup = () => {

    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [repeat, setRepeat] = useState<string>('')

    const navigate = useNavigate()

    const dispatch = useDispatch()
    const loading = useSelector((state: any) => state.user.loadingComponent) === 'registration'
    const isAuth = useSelector((state: any) => state.user.isAuth)

    const signupHandler = () => {
        try {
            dispatch(registration(username, email, password))
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
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        prefix={<MailOutlined style={{ color: '#979797' }} />} 
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

                <Form.Item
                    name="repeat"
                    rules={[{ required: true, message: 'Please repeat your password!' }]}
                >
                    <Input.Password
                        placeholder="Repeat password"
                        value={repeat}
                        onChange={(e) => setRepeat(e.target.value)}
                        prefix={<LockOutlined style={{ color: '#979797' }} />}
                    />
                </Form.Item>
        
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        onClick={signupHandler}
                        loading={loading}
                    >
                        Sign up
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}