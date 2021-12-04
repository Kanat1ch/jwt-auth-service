import React from 'react'
import { Form, Input, Button } from 'antd'

export const Secure = () => {
    return (
        <Form
            className="Profile__form"
            name="basic"
            initialValues={{ remember: true }}
            autoComplete="off"
            layout="vertical"
        >
            <div className="col">
                <h2>Secure</h2>
                <Form.Item
                    label="Old password"
                    name="password"
                    wrapperCol={{ span: 24 }}
                    rules={[{ required: true }]}
                >
                    <Input.Password
                        placeholder="Old password"
                    />
                </Form.Item> 

                <Form.Item
                    label="Repeat password"
                    name="repeat"
                    wrapperCol={{ span: 24 }}
                    rules={[{ required: true }]}
                >
                    <Input.Password
                        placeholder="Repeat password"
                    />
                </Form.Item> 

                <Form.Item
                    label="New password"
                    name="newPassword"
                    wrapperCol={{ span: 24 }}
                    rules={[{ required: true }]}
                >
                    <Input.Password
                        placeholder="New password"
                    />
                </Form.Item> 

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Update password
                    </Button>
                </Form.Item>
            </div>
        </Form>
    )
}