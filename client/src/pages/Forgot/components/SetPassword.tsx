import React from 'react'
import { Button, Form, Input } from 'antd';
import { RightOutlined } from '@ant-design/icons'
import { t } from 'i18next';

interface UserDataProps {
    value?: string,
    setValue: (value: string) => void
}

export const SetPassword = ({ value, setValue }: UserDataProps) => {
    return (
        <>
            <Form.Item
                name="password"
                label="New password"
                className="Forgot__input-form-item"
                validateTrigger="onBlur"
                rules={[
                    { required: true, message: t('errors.password.empty') },
                    { min: 6, max: 30, message: t('errors.password.length') }
                ]}
            >
                <Input.Password
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    autoFocus
                />
            </Form.Item>
            <Form.Item
                name="confirm"
                label="Confirm password"
                className="Forgot__input-form-item"
                validateTrigger="onBlur"
                rules={[
                    { required: true, message: t('errors.confirm.empty') },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error(t('errors.confirm.notMatch')))
                        },
                    }),
                ]}
            >
                <Input.Password
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </Form.Item>
            <Form.Item>
                <Button
                    htmlType="submit"
                    type="primary"
                >
                    Submit
                </Button>
            </Form.Item>
        </>
        
    )
}