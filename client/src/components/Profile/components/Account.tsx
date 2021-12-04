import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Input, Button, notification, message, Modal } from 'antd'
import { ExclamationCircleOutlined, LoadingOutlined, CheckOutlined } from '@ant-design/icons'
import { phoneMask } from '../../../lib/mask'
import { edit, removeErrors, sendActivationMail, updateUserSuccess } from '../../../store/actions/user/userAction'
import AuthService from '../../../services/AuthService'
import UserService from '../../../services/UserService'
import { ReactComponent as CheckIcon } from '../images/check.svg'

export const Account = () => {

    const user = useSelector((store: any) => store.user.user.data)
    const loading = useSelector((store: any) => store.user.loadingComponent) === 'edit'
    const status = useSelector((state: any) => state.user.status)

    const [username, setUsername] = useState<string>(user?.username)
    const [email, setEmail] = useState<string>(user?.email)
    const [phone, setPhone] = useState<string>(user?.phone)

    const [code, setCode] = useState<string>('')
    const [validateLoading, setValidateLoading] = useState<boolean>(false)

    const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false)
    const [successVerifying, setSuccessVerifying] = useState<boolean>(false)

    const [emailVerifyingDelay, setEmailVerifyingDelay] = useState<boolean>(false)
    const [phoneVerifyingDelay, setPhoneVerifyingDelay] = useState<boolean>(false)
    const [emailRetryTimer, setEmailRetryTimer] = useState<number>(30)
    const [phoneRetryTimer, setPhoneRetryTimer] = useState<number>(30)

    const dispatch = useDispatch()

    const verifyEmail = () => {
        notification.success({
            message: 'Email verification',
            description: <p>We are sent an activation link to <strong>{user?.email}</strong> email address</p>,
            duration: 6,
            placement: "bottomRight"
        })
        setEmailVerifyingDelay(true)
        dispatch(sendActivationMail())
    }

    const inputRef = useRef<any>(null)

    useEffect(() => {
        if (code.length === 6) {
            const confirmBtn = document.getElementById('submit-code-btn')
            confirmBtn?.click()
            setValidateLoading(true)
        }
    }, [code])

    const verifyPhone = async () => {
        setShowVerifyModal(true)
        setPhoneVerifyingDelay(true)
        await UserService.sendVerificationCode()
    }

    const updateUserHandler = () => {
        dispatch(edit({ username, email, phone }))
    }

    useEffect(() => {
        phoneMask('phone-mask')
    }, [])

    useEffect(() => {
        if (loading && status === 'edited') {
            message.success('Account successfully updated');
            dispatch(removeErrors())
        }
    }, [loading, status])

    useEffect(() => {
        let interval: any = null;
        if (emailVerifyingDelay) {
          interval = setInterval(() => {
            setEmailRetryTimer(sec => sec - 1);
          }, 1000);
          if (emailRetryTimer <= 0) {
            clearInterval(interval);
            setEmailVerifyingDelay(false)
          }
        } else {
            setEmailRetryTimer(30)
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [emailVerifyingDelay, emailRetryTimer])

    useEffect(() => {
        let interval: any = null;
        if (phoneVerifyingDelay) {
          interval = setInterval(() => {
            setPhoneRetryTimer(sec => sec - 1);
          }, 1000);
          if (phoneRetryTimer <= 0) {
            clearInterval(interval);
            setPhoneVerifyingDelay(false)
          }
        } else {
            setPhoneRetryTimer(30)
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [phoneVerifyingDelay, phoneRetryTimer])

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
                        wrapperCol={{ span: 24 }}
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
                                { user?.mailVerified
                                    ? <p className="verified-text"><CheckOutlined /> Verified</p>
                                    : <Button
                                        onClick={() => verifyEmail()}
                                        type="link"
                                        className="verify-link"
                                        disabled={emailVerifyingDelay}
                                    >
                                        { !emailVerifyingDelay
                                            ? <>Verify email address<ExclamationCircleOutlined style={{ color: '#40a9ff', marginLeft: 5 }} /></>
                                            : <>Verifying. You can resend it in {emailRetryTimer}s</>
                                        }
                                    </Button>
                                }
                                
                            </div>
                        }
                        name="email"
                        wrapperCol={{ span: 24 }}
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
                            suffix={
                                emailVerifyingDelay && <LoadingOutlined style={{ color: '#1890ff' }} />
                            }
                        />
                    </Form.Item>  

                    <Form.Item
                        label={
                            <div className="verification-label">
                                <span>Phone</span>
                                { user?.phoneVerified
                                    ? <p className="verified-text"><CheckOutlined /> Verified</p>
                                    : <Button
                                        onClick={() => verifyPhone()}
                                        type="link"
                                        className="verify-link"
                                        disabled={phoneVerifyingDelay || !user?.phone}
                                    >
                                        { !phoneVerifyingDelay
                                            ? <>Verify phone number<ExclamationCircleOutlined style={{ color: user?.phone ? '#40a9ff' : '#00000026', marginLeft: 5 }} /></>
                                            : <>Verifying. Resend a code in {phoneRetryTimer}s</>
                                        }
                                    </Button>
                                }
                                
                            </div>
                        }
                        name="phone"
                        wrapperCol={{ span: 24 }}
                        initialValue={user?.phone}
                        rules={[ 
                            { len: 15, message: 'Please input a correct phone number' },
                        ]}
                    >
                        <Input
                            id="phone-mask"
                            value={phone}
                            placeholder="(999) 999-99-99"
                            addonBefore="+7"
                            onChange={(e) => setPhone(e.target.value)}
                            suffix={
                                phoneVerifyingDelay && <LoadingOutlined style={{ color: '#1890ff' }} />
                            }
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

            <Modal
                visible={showVerifyModal}
                centered
                closable={true}
                onCancel={() => setShowVerifyModal(false)}
                maskClosable={true}
                okType="default"
                okText="Verify"
                onOk={(close) => !close}
                title="Phone verification"
                footer={!successVerifying && [
                    <Button htmlType="submit" form="phone-verify" loading={validateLoading}>Submit</Button>
                ]}
                width={450}
            >
                <div className={`phone-verified-modal${successVerifying ? '-success' : ''}`}>
                    { !successVerifying ?
                        <>
                        <h4>We're sent the SMS with a verification code to your phone +7 {user?.phone}</h4>
                        <p>Please, enter a code from your device into input below</p>
                        <Form id="phone-verify" onFinish={() => setValidateLoading(false)} onFinishFailed={() => setValidateLoading(false)} validateTrigger="onSubmit">
                            <Form.Item
                                name="code"
                                rules={[
                                    () => ({
                                        async validator(_, value) {
                                            if (!value) {
                                                return Promise.reject(new Error('Please, enter a valid code'));
                                            }
                                            try {
                                                setValidateLoading(true)
                                                const isValidCode = await UserService.checkVerificationCode(value.toString())
                                                dispatch(updateUserSuccess(isValidCode.data))
                                                setPhoneVerifyingDelay(false)
                                                setSuccessVerifying(true)
                                                localStorage.setItem('token', isValidCode.data.accessToken)
                                                return Promise.resolve();
                                            } catch (e: any) {
                                                return Promise.reject(new Error(e.response.data.message));
                                            }
                                        },
                                    }),
                                ]}
                            >
                                <Input
                                    ref={inputRef}
                                    autoFocus={true}
                                    size="large"
                                    onChange={(e) => setCode(e.target.value)}
                                    value={code}
                                    maxLength={6}
                                    disabled={validateLoading}
                                />
                            </Form.Item>
                            <Button
                                onClick={() => verifyPhone()}
                                type="link"
                                className="verify-link"
                                disabled={phoneVerifyingDelay}
                            >
                                { !phoneVerifyingDelay
                                    ? <>Resend a code</>
                                    : <>Didn't get a code? You can resend it in {phoneRetryTimer}s</>
                                }
                            </Button>
                            <Button htmlType="submit" form="phone-verify" id="submit-code-btn" style={{ display: 'none' }} />
                        </Form>
                        </>
                    : <>
                        <CheckIcon />
                        <h3>Phone has been successfully verified!</h3>
                    </>}
                </div>
            </Modal>
        </>
    )
}