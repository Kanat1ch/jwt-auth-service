import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Input, Button, notification } from 'antd'
import { ExclamationCircleOutlined, LoadingOutlined, CheckOutlined } from '@ant-design/icons'
import { phoneMask } from '../../../lib/mask'
import { sendActivationMail } from '../../../store/actions/user/userAction'

export const Account = () => {

    const user = useSelector((store: any) => store.user.user.data)

    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [phone, setPhone] = useState<string>('')

    const [verifying, setVerifying] = useState<boolean>(false)
    const [retryTimer, setRetryTimer] = useState<number>(60)

    const dispatch = useDispatch()

    useEffect(() => {
        phoneMask('phone-mask')
    }, [])

    const activateAccount = () => {
        notification.success({
            message: 'Account verification',
            description: <p>We are sent an activation link to <strong>{user?.email}</strong> email address</p>,
            duration: 6,
            placement: "bottomRight"
        })

        setVerifying(true)
        dispatch(sendActivationMail())
    }

    useEffect(() => {
        let interval: any = null;
        if (verifying) {
          interval = setInterval(() => {
            setRetryTimer(sec => sec - 1);
          }, 1000);
          if (retryTimer <= 0) {
            clearInterval(interval);
            setVerifying(false)
          }
        } else {
            setRetryTimer(60)
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [verifying, retryTimer])

    return (
        <div className="col">
            <h2>Account</h2>
            <Form.Item
                label="Username"
                name="username"
                wrapperCol={{ span: 24 }}
                rules={[{ required: true }]}
                initialValue={user?.username}
            >
                <Input
                    value={username}
                    placeholder="username"
                    onChange={(e) => setUsername(e.target.value)}
                />
            </Form.Item>

            <Form.Item
                label={
                    <div className="email-label">
                        <span>Email</span>
                        { user?.isActivated
                            ? <p className="verified-text"><CheckOutlined /> Verified</p>
                            : <Button
                                onClick={() => activateAccount()}
                                type="link"
                                className="verify-link"
                                disabled={verifying}
                            >
                                { !verifying
                                    ? <>Verify email address</>
                                    : <>Verifying. You can resend it in {retryTimer}s</>
                                }
                            </Button>
                        }
                        
                    </div>
                }
                name="email"
                wrapperCol={{ span: 24 }}
                rules={[{ required: true }]}
                initialValue={user?.email}
            >
                <Input
                    type="email"
                    value={email}
                    placeholder="email@gmail.com"
                    onChange={(e) => setEmail(e.target.value)}
                    suffix={
                        !user?.isActivated ? !verifying
                            ? <ExclamationCircleOutlined style={{ color: '#ffae00' }} />
                            : <LoadingOutlined style={{ color: '#1890ff' }} />
                    : null}
                />
            </Form.Item>  

            <Form.Item
                label="Phone"
                name="phone"
                wrapperCol={{ span: 24 }}
                initialValue={user?.phone}
            >
                <Input
                    id="phone-mask"
                    value={phone}
                    placeholder="(999) 999-99-99"
                    addonBefore="+7"
                    onChange={(e) => setPhone(e.target.value)}
                />
            </Form.Item>
            
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Update account
                </Button>
            </Form.Item>
        </div>
    )
}