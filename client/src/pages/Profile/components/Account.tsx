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

    const [verificationType, setVerificationType] = useState<'email' | 'phone'>('email')
    const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false)
    const [successVerifying, setSuccessVerifying] = useState<boolean>(false)

    const [delay, setDelay] = useState({ email: false, phone: false })
    const [timer, setTimer] = useState({ email: 30, phone: 30 })

    const dispatch = useDispatch()

    const inputRef = useRef<any>(null)

    useEffect(() => {
        if (code.length === 6) {
            const confirmBtn = document.getElementById('submit-code-btn')
            confirmBtn?.click()
            setValidateLoading(true)
        }
    }, [code])

    const verify = async (service: 'email' | 'phone') => {
        setVerificationType(service)
        setShowVerifyModal(true)
        setDelay({ ...delay, [service]: true })
        await UserService.sendVerificationCode(service)
    }

    const updateUserHandler = () => {
        dispatch(edit({ username, email, phone }))
    }

    // useEffect(() => {
    //     console.log('Username: ', username)
    // }, [username])

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
        if (delay[verificationType]) {
          interval = setInterval(() => {
            setTimer(state => ({ ...state, [verificationType]: state[verificationType] - 1 }));
          }, 1000);
          if (timer[verificationType] <= 0) {
            clearInterval(interval);
            setDelay({ ...delay, [verificationType]: false })
          }
        } else {
            setTimer({ ...timer, [verificationType]: 30 })
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [delay[verificationType], timer[verificationType]])

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
                                        onClick={() => verify('email')}
                                        type="link"
                                        className="verify-link"
                                        disabled={delay.email}
                                    >
                                        { !delay.email
                                            ? <>Verify email address<ExclamationCircleOutlined style={{ color: '#40a9ff', marginLeft: 5 }} /></>
                                            : <>Verifying. You can resend it in {timer.email}s</>
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
                                delay.email && <LoadingOutlined style={{ color: '#1890ff' }} />
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
                                        onClick={() => verify('phone')}
                                        type="link"
                                        className="verify-link"
                                        disabled={delay.phone || !user?.phone}
                                    >
                                        { !delay.phone
                                            ? <>Verify phone number<ExclamationCircleOutlined style={{ color: user?.phone ? '#40a9ff' : '#00000026', marginLeft: 5 }} /></>
                                            : <>Verifying. Resend a code in {timer.phone}s</>
                                        }
                                    </Button>
                                }
                                
                            </div>
                        }
                        name="phone"
                        className="phone-label"
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
                                delay.phone && <LoadingOutlined style={{ color: '#1890ff' }} />
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
                title={`${verificationType === 'email' ? 'Email' : 'Phone'} verification`}
                footer={!successVerifying && [
                    <Button htmlType="submit" form="verify" loading={validateLoading}>Submit</Button>
                ]}
                width={450}
            >
                <div className={`verified-modal${successVerifying ? '-success' : ''}`}>
                    { !successVerifying ?
                        <>
                        {verificationType === 'phone' && <h4>We're sent the SMS with a verification code to your phone +7 {user?.phone}</h4>}
                        {verificationType === 'email' && <h4>We're sent a verification code to your email {user?.email}</h4>}
                        <p>Please, enter a code from {verificationType === 'email' ? <>your email</> : <>SMS</>} into input below</p>
                        <Form id="verify" onFinish={() => setValidateLoading(false)} onFinishFailed={() => setValidateLoading(false)} validateTrigger="onSubmit">
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
                                                const isValidCode = await UserService.checkVerificationCode(verificationType === 'email' ? 'email' : 'phone', value.toString())
                                                dispatch(updateUserSuccess(isValidCode.data))
                                                setDelay({ ...delay, [verificationType]: false })
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
                                onClick={() => verify(verificationType)}
                                type="link"
                                className="verify-link"
                                disabled={delay[verificationType]}
                            >
                                { !delay[verificationType]
                                    ? <>Resend a code</>
                                    : <>Didn't get a code? You can resend it in {timer[verificationType]}s</>
                                }
                            </Button>
                            <Button htmlType="submit" form="verify" id="submit-code-btn" style={{ display: 'none' }} />
                        </Form>
                        </>
                    : <>
                        <CheckIcon />
                        {verificationType === 'email' && <h3>Email has been successfully verified!</h3>}
                        {verificationType === 'phone' && <h3>Phone has been successfully verified!</h3>}
                    </>}
                </div>
            </Modal>
        </>
    )
}