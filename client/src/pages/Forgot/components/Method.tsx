import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Select } from 'antd'
import { MailOutlined, PhoneOutlined, RightOutlined } from '@ant-design/icons'
import UserService from '../../../services/UserService'

const { Option } = Select

interface MethodProps {
    userData: string
    methods: string[]
}

export const Method = ({ userData, methods }: MethodProps) => {

    const [method, setMethod] = useState<string>('email')
    const [isChoosen, setIsChoosen] = useState<boolean>(false)
    const [code, setCode] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const onChooseMethod = async () => {
        setIsChoosen(true)
        await UserService.sendResetCode(method, userData)
    }

    useEffect(() => {
        if (code.length === 6) {
            const confirmBtn = document.getElementById('submit-code-btn')
            confirmBtn?.click()
        }
    }, [code])

    return (
        <>
            <div className="Forgot__inline-form-item">
                <Form.Item
                    label="Choose a verification method"
                    className="Forgot__input-form-item"
                    initialValue={method}
                >
                    <Select
                        value={method}
                        onChange={(value) => setMethod(value)}
                        disabled={isChoosen}
                    >
                        <Option value="email"><MailOutlined style={{ marginRight: 5 }} /> Email</Option>
                        {methods.includes('phone') && <Option value="phone"><PhoneOutlined style={{ marginRight: 5 }} /> SMS Code</Option>}
                    </Select>
                </Form.Item>
                <Form.Item>
                    { !isChoosen &&
                        <Button
                            icon={<RightOutlined />}
                            onClick={onChooseMethod}
                        />
                    }
                    
                </Form.Item>
            </div>
            { isChoosen &&
                <>
                    {method === 'email' && <h3>We're sent a verification code to your email address</h3>}
                    {method === 'phone' && <h3>We're sent the SMS verification code to your phone number</h3>}
                    <p>Please, input a code into input below</p>
                    <div className="Forgot__inline-form-item">
                        
                        <Form.Item
                            name="code"
                            validateTrigger="onSubmit"
                            rules={[
                                () => ({
                                    async validator(_, value) {
                                        if (!value) {
                                            return Promise.reject(new Error('Please, enter a valid code'));
                                        }
                                        try {
                                            setLoading(true)
                                            const isValidCode = await UserService.checkResetCode(method, userData, value.toString())
                                            localStorage.setItem('token', isValidCode.data.accessToken)
                                            return Promise.resolve();
                                        } catch (e: any) {
                                            return Promise.reject(new Error(e.response.data.message));
                                        } finally {
                                            setLoading(false)
                                        }
                                    },
                                }),
                            ]}
                        >
                            <div className="Forgot__inline-form-item">
                                <Input
                                    className="Forgot__input-code"
                                    autoFocus
                                    maxLength={6}
                                    disabled={loading}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                            </div>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                icon={<RightOutlined />}
                                htmlType="submit"
                                loading={loading}
                            />
                            <Button htmlType="submit" form="forgot" id="submit-code-btn" style={{ display: 'none' }} />
                        </Form.Item>
                        
                    </div>
                </>
            }
        </>
    )
}