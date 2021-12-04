import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../routes'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import './Signup.scss'
import { useDispatch, useSelector } from 'react-redux'
import { registration } from '../../store/actions/user/userAction'
import AuthService from '../../services/AuthService'

export const Signup = () => {

    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirm, setConfirm] = useState<string>('')

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
                onFinish={signupHandler}
            >
                <Form.Item
                    name="username"
                    rules={[
                        { required: true, message: 'Please input your username' },
                        { min: 3, max: 20, message: 'Username must be from 3 to 20 symbols' },
                        () => ({
                            async validator(_, value) {
                                if (!value) {
                                    return Promise.resolve();
                                }
                                const isValueExist = await AuthService.isExist({ username: value })
                                if (!isValueExist.data.errors) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error(`Username ${value} is already exist`));
                            },
                        }),
                    ]}
                    validateTrigger="onBlur"
                >
                    <Input
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        prefix={<UserOutlined style={{ color: '#979797' }} />}
                        maxLength={20}
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    rules={[
                        { type: 'email', message: 'The email is not valid' },
                        { required: true, message: 'Please input your email' },
                        () => ({
                            async validator(_, value) {
                                if (!value) {
                                    return Promise.resolve();
                                }
                                const isValueExist = await AuthService.isExist({ email: value })
                                if (!isValueExist.data.errors) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error(`Email ${value} is already exist`));
                            },
                        }),
                    ]}
                    validateTrigger="onBlur"
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
                    rules={[
                        { required: true, message: 'Please input your password' },
                        { min: 6, max: 30, message: 'Password must be from 6 to 30 symbols' }
                    ]}
                    validateTrigger="onBlur"
                >
                    <Input.Password
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        prefix={<LockOutlined style={{ color: '#979797' }} />}
                    />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Please confirm your password' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Passwords do not match'));
                            },
                        }),
                    ]}
                    validateTrigger="onBlur"
                >
                    <Input.Password
                        placeholder="Repeat password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        prefix={<LockOutlined style={{ color: '#979797' }} />}
                    />
                </Form.Item>
        
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        Sign up
                    </Button>
                </Form.Item>
            </Form>
        </div>  
    )
}