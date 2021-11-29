import React from 'react'
import { Button, Form, Input, Radio } from 'antd'
import './Profile.scss'

export const Profile = () => {
    return (
        <div className="Profile">
            <div className="Profile__header">
                <div className="Profile__image"></div>
                <div className="Profile__info">
                    <div className="Profile__username">
                        Kanat1ch's <span>Profile</span>
                    </div>
                    <div className="Profile__actions">
                        <Button className="Profile__action">Log out</Button>
                        <Button className="Profile__action" danger>Delete account</Button>
                    </div>
                </div>
            </div>
            <div className="Profile__data">
                <Form
                    className="Profile__form"
                    name="basic"
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    layout="vertical"
                >
                    <div className="col">
                        <h2>Account info</h2>
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
                    </div>

                    <div className="col">
                        <h2>Personal info</h2>
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
                    </div>                    
            
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}