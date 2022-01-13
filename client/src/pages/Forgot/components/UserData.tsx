import React, { useState } from 'react'
import { Button, Form, Input } from 'antd';
import { RightOutlined } from '@ant-design/icons'
import AuthService from '../../../services/AuthService';

interface UserDataProps {
    value?: string,
    setValue: (value: string) => void
    setMethods: (methods: string[]) => void
}

export const UserData = ({ value, setValue, setMethods }: UserDataProps) => {

    const [loading, setLoading] = useState<boolean>(false)

    return (
        <div className="Forgot__inline-form-item">
            <Form.Item
                name="userdata"
                label="Username, email or phone (without +7)"
                className="Forgot__input-form-item"
                validateTrigger="onSubmit"
                rules={[
                    { required: true, message: 'Please, input some data of your account' },
                    () => ({
                        async validator(_, value) {
                            try {
                                if (!value) {
                                    return Promise.resolve();
                                }
                                setLoading(true)
                                const linked = await AuthService.linked(value)
                                setMethods(linked.data.linked)
                                return Promise.resolve()
                            } catch (e) {
                                return Promise.reject(new Error('User with this credentials was not found'));
                            } finally {
                                setLoading(false)
                            }
                        },
                    }),
                ]}
            >
                <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    autoFocus
                />
            </Form.Item>
            <Form.Item>
                <Button
                    icon={<RightOutlined />}
                    htmlType="submit"
                    loading={loading}
                />
            </Form.Item>
        </div>
        
    )
}