import React, { useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import UserService from '../../../services/UserService'
import { useForm } from 'antd/lib/form/Form'
import { t } from 'i18next'

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
            message.success(t('success.update'));
        } catch (e) {
            message.error(t('errors.wrong'));
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
                <h2>{t('Secure')}</h2>
                <Form.Item
                    label={t('Old password')}
                    name="oldpassword"
                    rules={[
                        { required: true, message: t('errors.password.empty') },
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
                                    return Promise.reject(new Error(t('errors.password.incorrect')));

                                }
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        placeholder={t('Old password')}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                </Form.Item> 

                <Form.Item
                    label={t('New password')}
                    name="password"
                    rules={[
                        { required: true, message: t('errors.password.empty') },
                        { min: 6, max: 30, message: t('errors.password.length') }
                    ]}
                >
                    <Input.Password
                        placeholder={t('New password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Item>

                <Form.Item
                    label={t('Repeat password')}
                    name="confirm"
                    dependencies={['password']}
                    validateTrigger="onChange"
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
                        placeholder={t('Repeat password')}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                    {t('Update password')}
                    </Button>
                </Form.Item>
            </div>
        </Form>
    )
}