import React from 'react'
import { Form, Input, Radio, Button } from 'antd'

export const Personal = () => {
    return (
        <div className="col">
            <h2>Personal</h2>
            <Form.Item
                label="Name"
                name="name"
                wrapperCol={{ span: 24 }}
            >
                <Input
                    placeholder="Name"
                />
            </Form.Item> 

            <Form.Item
                label="Surname"
                name="surname"
                wrapperCol={{ span: 24 }}
            >
                <Input
                    placeholder="Surname"
                />
            </Form.Item> 

            <Form.Item
                label="Sex"
                name="sex"
                wrapperCol={{ span: 24 }}
            >
                <Radio.Group value="male">
                    <Radio value="male">Male</Radio>
                    <Radio value="female">Female</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Update personal info
                </Button>
            </Form.Item>
        </div>
    )
}