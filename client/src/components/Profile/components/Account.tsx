import React from 'react'
import { Form, Input, Button } from 'antd'

export const Account = () => {
    return (
        <div className="col">
            <h2>Account</h2>
            <Form.Item
                label="Username"
                name="username"
                wrapperCol={{ span: 24 }}
                rules={[{ required: true }]}
            >
                <Input
                    placeholder="Username or Email"
                />
            </Form.Item>

            <Form.Item
                label="Email"
                name="email"
                wrapperCol={{ span: 24 }}
                rules={[{ required: true }]}
            >
                <Input
                    type="email"
                    placeholder="Email"
                />
            </Form.Item>  

            <Form.Item
                label="Phone"
                name="phone"
                wrapperCol={{ span: 24 }}
            >
                <Input
                    placeholder="Phone"
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