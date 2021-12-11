import { Button, Form, Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import useCountdown from '../../hooks/useCountdown';
import UserService from '../../services/UserService';
import { updateUserSuccess } from '../../store/actions/user/userAction';
import { ReactComponent as CheckIcon } from './images/check.svg'

interface VerificationModalProps {
    type: VetificationType
    visible: boolean
    showSuccess?: boolean
    userCredentials: string
    onClose: () => void
}

type VetificationType = 'email' | 'phone'


export const VerificationModal = ({ type, visible, showSuccess, userCredentials, onClose }: VerificationModalProps) => {

    const [code, setCode] = useState<string>('')
    const [success, setSuccess] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const dispatch = useDispatch()
    const timer = useCountdown(30)

    useEffect(() => {
        if (visible && !timer.isActive) {
            sendCode()
            timer.start()
        }
    }, [visible])

    useEffect(() => {
        if (code.length === 6) {
            const confirmBtn = document.getElementById('submit-code-btn')
            confirmBtn?.click()
        }
    }, [code])

    const sendCode = async () => {
        await UserService.sendVerificationCode(type)
    }

    const onFinish = () => {
        setLoading(false)

        if (!showSuccess) {
            onClose()
        }
    }

    let title = ''
    let credentialsInfo = ''
    let codeFromInfo = ''
    let successMessage = ''

    switch (type) {
        case 'email':
            title = 'Email verification'
            credentialsInfo = `We're sent a verification code to your email ${userCredentials}`
            codeFromInfo = `Please, enter a code from your email into input below`
            successMessage = 'Email has been successfully verified!'
            break
        case 'phone':
            title = 'Phone verification'
            credentialsInfo = `We're sent the SMS with a verification code to your phone +7 ${userCredentials}`
            codeFromInfo = `Please, enter a code from SMS into input below`
            successMessage = 'Phone has been successfully verified!'
            break
    }

    return (
        <Modal
            visible={visible}
            centered
            closable={true}
            onCancel={onClose}
            maskClosable={true}
            okType="default"
            okText="Verify"
            onOk={(close) => !close}
            title={title}
            footer={!success && [
                <Button htmlType="submit" form="verify" loading={loading}>Submit</Button>
            ]}
            width={450}
        >
            <div className={`verified-modal${success ? '-success' : ''}`}>
                { !success ?
                    <>
                    <h4>{credentialsInfo}</h4>
                    <p>{codeFromInfo}</p>
                    <Form id="verify" onFinish={onFinish} onFinishFailed={() => setLoading(false)} validateTrigger="onSubmit">
                        <Form.Item
                            name="code"
                            rules={[
                                () => ({
                                    async validator(_, value) {
                                        if (!value) {
                                            return Promise.reject(new Error('Please, enter a valid code'));
                                        }
                                        try {
                                            setLoading(true)
                                            const isValidCode = await UserService.checkVerificationCode(type, value.toString())
                                            dispatch(updateUserSuccess(isValidCode.data))
                                            setSuccess(true)
                                            localStorage.setItem('token', isValidCode.data.accessToken)
                                            return Promise.resolve();
                                        } catch (e: any) {
                                            return Promise.reject(new Error(e.response.data.message));
                                        }
                                    },
                                }),
                            ]}
                        >
                            <Input
                                autoFocus={true}
                                size="large"
                                onChange={(e) => setCode(e.target.value)}
                                value={code}
                                maxLength={6}
                                disabled={loading}
                            />
                        </Form.Item>
                        <Button
                            onClick={sendCode}
                            type="link"
                            className="verify-link"
                            disabled={timer.isActive}
                        >
                            { !timer.isActive
                                ? <>Resend a code</>
                                : <>Didn't get a code? You can resend it in {timer.time}s</>
                            }
                        </Button>
                        <Button htmlType="submit" form="verify" id="submit-code-btn" style={{ display: 'none' }} />
                    </Form>
                    </>
                : showSuccess && 
                    <>
                        <CheckIcon />
                        <h3>{successMessage}</h3>
                    </>
                }
            </div>
        </Modal>
    )
}