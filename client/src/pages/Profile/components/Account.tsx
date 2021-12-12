import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Input, Button, message, Tooltip } from 'antd'
import { QuestionCircleOutlined, CheckOutlined } from '@ant-design/icons'
import { phoneMask } from '../../../lib/mask'
import { edit, removeErrors } from '../../../store/actions/user/userAction'
import AuthService from '../../../services/AuthService'
import { VerificationModal } from '../../../components/VerificationModal/VerificationModal'
import { t } from 'i18next'

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
            message.success(t('success.update'));
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
                    <h2>{t('Account')}</h2>
                    <Form.Item
                        label={t('Username')}
                        name="username"
                        rules={[
                            { required: true, message: t('errors.username.empty') },
                            { min: 3, max: 20, message: t('errors.username.length') },
                            () => ({
                                async validator(_, value) {
                                    if (!value) {
                                        return Promise.resolve();
                                    }
                                    const isValueExist = await AuthService.isExist({ username: value }, user.id)
                                    if (!isValueExist.data.errors) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(t('errors.username.exist', { value: value })));
                                },
                            }),
                        ]}
                        initialValue={user?.username}
                        validateTrigger="onBlur"
                    >
                        <Input
                            value={username}
                            placeholder="user"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item
                        label={
                            <div className="verification-label">
                                <span>{t('Email')}</span>
                                { user?.emailVerified
                                    ? <p className="verified-text"><CheckOutlined /> {t('Verified')}</p>
                                    : <div className="verify-tooltip">
                                    <Button
                                        onClick={() => setShowVerifyEmail(true)}
                                        type="link"
                                        className="verify-link"
                                    >
                                        {t('Verify email')}
                                    </Button>
                                    <Tooltip placement="topRight" title={t('Email tooltip message')}>
                                        <QuestionCircleOutlined style={{ color: '#999', marginLeft: 10, fontSize: 17 }} />
                                    </Tooltip>
                                </div>
                                }
                                
                            </div>
                        }
                        name="email"
                        rules={[
                            { type: 'email', message: t('errors.email.invalid') },
                            { required: true, message: t('errors.email.empty') },
                            () => ({
                                async validator(_, value) {
                                    if (!value) {
                                        return Promise.resolve();
                                    }
                                    const isValueExist = await AuthService.isExist({ email: value }, user.id)
                                    if (!isValueExist.data.errors) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(t('errors.email.exist', { value: value })));
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
                                <span>{t('Phone')}</span>
                                { user?.phoneVerified
                                    ? <p className="verified-text"><CheckOutlined /> {t('Verified')}</p>
                                    : <div className="verify-tooltip">
                                        <Button
                                            onClick={() => setShowVerifyPhone(true)}
                                            type="link"
                                            className="verify-link"
                                            disabled={!user?.phone}
                                        >
                                            {t('Verify phone')}
                                        </Button>
                                        <Tooltip placement="topRight" title={t('Phone tooltip message')}>
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
                            { len: 15, message: t('errors.phone.invalid') },
                            () => ({
                                async validator(_, value) {
                                    if (!value) {
                                        return Promise.resolve();
                                    }
                                    const isValueExist = await AuthService.isExist({ phone: value }, user.id)
                                    if (!isValueExist.data.errors) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(t('errors.phone.exist', { value: value })));
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
                            {t('Update account')}
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