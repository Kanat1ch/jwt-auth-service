import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Form, Input, Button } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { phoneMask } from '../../../lib/mask'

export const Account = () => {

    const user = useSelector((store: any) => store.user.user.data)

    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [phone, setPhone] = useState<string>('')

    useEffect(() => {
        phoneMask('phone-mask')
    }, [])

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
                label={<div className="email-label"><span>Email</span> <Button type="link" className="verify-link">Verify email address</Button></div>}
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
                    suffix={<ExclamationCircleOutlined style={{ color: '#ffae00' }} />}
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