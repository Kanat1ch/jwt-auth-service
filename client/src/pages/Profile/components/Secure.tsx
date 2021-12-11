import React, { useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import UserService from '../../../services/UserService'
import { useForm } from 'antd/lib/form/Form'

export const Secure = () => {

    const [oldPassword, setOldPassword] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirm, setConfirm] = useState<string>('')

    const [loading, setLoading] = useState<boolean>(false)

    const [form] = useForm()

    const handleSubmit = async () => {
        try {
            setLoading(true)
            await UserService.updatePassword(password)
            form.resetFields()
            message.success('Account successfully updated');
        } catch (e) {
            message.error('Something went wrong...');
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form
            className="Profile__form"
            name="basic"
            form={form}
            initialValues={{ remember: true }}
            autoComplete="off"
            layout="vertical"
            validateTrigger="onBlur"
            onFinish={handleSubmit}
        >
            <div className="col">
                <h2>Secure</h2>
                <Form.Item
                    label="Old password"
                    name="oldpassword"
                    rules={[
                        { required: true, message: 'Please input your old password' },
                        () => ({
                            async validator(_, value) {
                                try {
                                    if (!value) {
                                        return Promise.resolve();
                                    }
                                    const isEqual = await UserService.isPasswordEqual(oldPassword)
                                    if (!isEqual.data.errors) {
                                        return Promise.resolve();
                                    }
                                } catch (e: any) {
                                    return Promise.reject(new Error(e.response.data.message));

                                }
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        placeholder="Old password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                </Form.Item> 

                <Form.Item
                    label="New password"
                    name="password"
                    rules={[
                        { required: true, message: 'Please input new password' },
                        { min: 6, max: 30, message: 'Password must be from 6 to 30 symbols' }
                    ]}
                >
                    <Input.Password
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Item>

                <Form.Item
                    label="Repeat password"
                    name="confirm"
                    dependencies={['password']}
                    validateTrigger="onChange"
                    rules={[
                        { required: true, message: 'Please confirm your password' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Passwords do not match'))
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        placeholder="Repeat password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Update password
                    </Button>
                </Form.Item>
            </div>
        </Form>
    )
}