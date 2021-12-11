import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Input, Button, message, Tooltip } from 'antd'
import { QuestionCircleOutlined, CheckOutlined } from '@ant-design/icons'
import { phoneMask } from '../../../lib/mask'
import { edit, removeErrors } from '../../../store/actions/user/userAction'
import AuthService from '../../../services/AuthService'
import { VerificationModal } from '../../../components/VerificationModal/VerificationModal'

export const Account = () => {

    const user = useSelector((store: any) => store.user.user.data)
    const loading = useSelector((store: any) => store.user.loadingComponent) === 'edit'
    const status = useSelector((state: any) => state.user.status)

    const [username, setUsername] = useState<string>(user?.username)
    const [email, setEmail] = useState<string>(user?.email)
    const [phone, setPhone] = useState<string>(user?.phone)

    const [showVerifyEmail, setShowVerifyEmail] = useState<boolean>(false)
    const [showVerifyPhone, setShowVerifyPhone] = useState<boolean>(false)

    const dispatch = useDispatch()

    const updateUserHandler = () => {
        dispatch(edit({ username, email, phone }))
    }

    useEffect(() => {
        phoneMask('basic_phone')
    }, [])

    useEffect(() => {
        if (loading && status === 'edited') {
            message.success('Account successfully updated');
            dispatch(removeErrors())
        }
    }, [loading, status])

    return (
        <>
            <Form
                className="Profile__form"
                name="basic"
                initialValues={{ remember: true }}
                autoComplete="off"
                layout="vertical"
                onFinish={updateUserHandler}
            >
                <div className="col">
                    <h2>Account</h2>
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            { required: true, message: 'Please input your username' },
                            { min: 3, max: 20, message: 'Username must be from 3 to 20 symbols' },
                            () => ({
                                async validator(_, value) {
                                    if (!value) {
                                        return Promise.resolve();
                                    }
                                    const isValueExist = await AuthService.isExist({ username: value }, user.id)
                                    if (!isValueExist.data.errors) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(`Username ${value} is already exist`));
                                },
                            }),
                        ]}
                        initialValue={user?.username}
                        validateTrigger="onBlur"
                    >
                        <Input
                            value={username}
                            placeholder="username"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item
                        label={
                            <div className="verification-label">
                                <span>Email</span>
                                { user?.emailVerified
                                    ? <p className="verified-text"><CheckOutlined /> Verified</p>
                                    : <div className="verify-tooltip">
                                    <Button
                                        onClick={() => setShowVerifyEmail(true)}
                                        type="link"
                                        className="verify-link"
                                    >
                                        Verify email address
                                    </Button>
                                    <Tooltip placement="topRight" title="With verificated email address you can enable two factor authentication using this method">
                                        <QuestionCircleOutlined style={{ color: '#999', marginLeft: 10, fontSize: 17 }} />
                                    </Tooltip>
                                </div>
                                }
                                
                            </div>
                        }
                        name="email"
                        rules={[
                            { type: 'email', message: 'The email is not valid' },
                            { required: true, message: 'Please input your email' },
                            () => ({
                                async validator(_, value) {
                                    if (!value) {
                                        return Promise.resolve();
                                    }
                                    const isValueExist = await AuthService.isExist({ email: value }, user.id)
                                    if (!isValueExist.data.errors) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(`Email ${value} is already exist`));
                                },
                            }),
                        ]}
                        validateTrigger="onBlur"
                        initialValue={user?.email}
                    >
                        <Input
                            type="email"
                            value={email}
                            placeholder="email@gmail.com"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Item>  

                    <Form.Item
                        label={
                            <div className="verification-label">
                                <span>Phone</span>
                                { user?.phoneVerified
                                    ? <p className="verified-text"><CheckOutlined /> Verified</p>
                                    : <div className="verify-tooltip">
                                        <Button
                                            onClick={() => setShowVerifyPhone(true)}
                                            type="link"
                                            className="verify-link"
                                            disabled={!user?.phone}
                                        >
                                            Verify phone number
                                        </Button>
                                        <Tooltip placement="topRight" title="With verificated phone number you can enable two factor authentication using this method">
                                            <QuestionCircleOutlined style={{ color: '#999', marginLeft: 10, fontSize: 17 }} />
                                        </Tooltip>
                                    </div>
                                }
                                
                            </div>
                        }
                        name="phone"
                        className="phone-label"
                        initialValue={user?.phone}
                        rules={[ 
                            { len: 15, message: 'Please input a correct phone number' },
                            () => ({
                                async validator(_, value) {
                                    if (!value) {
                                        return Promise.resolve();
                                    }
                                    const isValueExist = await AuthService.isExist({ phone: value }, user.id)
                                    if (!isValueExist.data.errors) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(`Phone +7 ${value} is already exist`));
                                },
                            }),
                        ]}
                        validateTrigger="onBlur"
                    >
                        <Input
                            id="basic_phone"
                            value={phone}
                            placeholder="(999) 999-99-99"
                            addonBefore="+7"
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </Form.Item>
                    
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            Update account
                        </Button>
                    </Form.Item>
                </div>
            </Form>

            <VerificationModal
                type="email"
                visible={showVerifyEmail}
                userCredentials={user?.email}
                showSuccess
                onClose={() => setShowVerifyEmail(false)}
            />

            <VerificationModal
                type="phone"
                visible={showVerifyPhone}
                userCredentials={user?.phone}
                showSuccess
                onClose={() => setShowVerifyPhone(false)}
            />
        </>
    )
}