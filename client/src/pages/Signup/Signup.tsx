import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../routes'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import './Signup.scss'
import { useDispatch, useSelector } from 'react-redux'
import { registration } from '../../store/actions/user/userAction'
import AuthService from '../../services/AuthService'
import { t } from 'i18next'

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
            <p className="Signup__preview-text">{t('Register or')} <Link to={ROUTES.login}>{t('login now')}</Link></p>
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
                        { required: true, message: t('errors.username.empty') },
                        { min: 3, max: 20, message: t('errors.username.length') },
                        () => ({
                            async validator(_, value) {
                                if (!value) {
                                    return Promise.resolve();
                                }
                                const isValueExist = await AuthService.isExist({ username: value })
                                if (!isValueExist.data.errors) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error(t('errors.username.exist', { value: value })));
                            },
                        }),
                    ]}
                    validateTrigger="onBlur"
                >
                    <Input
                        placeholder={t('Username')}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        prefix={<UserOutlined style={{ color: '#979797' }} />}
                        maxLength={20}
                        autoFocus
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    rules={[
                        { type: 'email', message: t('errors.email.invalid') },
                        { required: true, message: t('errors.email.empty') },
                        () => ({
                            async validator(_, value) {
                                if (!value) {
                                    return Promise.resolve();
                                }
                                const isValueExist = await AuthService.isExist({ email: value })
                                if (!isValueExist.data.errors) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error(t('errors.email.exist', { value: value })));
                            },
                        }),
                    ]}
                    validateTrigger="onBlur"
                >
                    <Input
                        placeholder={t('Email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        prefix={<MailOutlined style={{ color: '#979797' }} />} 
                    />
                </Form.Item>
    
                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: t('errors.password.empty') },
                        { min: 6, max: 30, message: t('errors.password.length') }
                    ]}
                    validateTrigger="onBlur"
                >
                    <Input.Password
                        placeholder={t('Password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        prefix={<LockOutlined style={{ color: '#979797' }} />}
                    />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: t('errors.confirm.empty') },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error(t('errors.confirm.notMatch')));
                            },
                        }),
                    ]}
                    validateTrigger="onBlur"
                >
                    <Input.Password
                        placeholder={t('Repeat password')}
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
                        {t('Signup')}
                    </Button>
                </Form.Item>
            </Form>
        </div>  
    )
}