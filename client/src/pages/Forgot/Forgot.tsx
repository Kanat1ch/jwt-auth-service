import React, { useState } from 'react'
import { Button, Form, message, Steps } from 'antd'
import { UserOutlined, SolutionOutlined, LockOutlined, RightOutlined } from '@ant-design/icons'
import './Forgot.scss'
import { t } from 'i18next'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../routes'
import { UserData } from './components/UserData'
import { Method } from './components/Method'
import { SetPassword } from './components/SetPassword'
import UserService from '../../services/UserService'

const { Step } = Steps

export const Forgot = () => {

    const navigate = useNavigate()

    const [step, setStep] = useState<number>(0)
    const [userData, setUserData] = useState<string>('')
    const [methods, setMethods] = useState<string[]>([])
    const [password, setPassword] = useState<string>('')

    const onStepChange = async () => {
        if (step === 2) {
            await UserService.updatePassword(password)
            message.success('Your password has been successfully updated')
            return navigate('/login')
        }

        setStep(step => step + 1)
    }

    return (
        <div className="Forgot">
            <p className="Forgot__preview-text">Reset your password or <Link to={ROUTES.login}>{t('login now')}</Link></p>
            <Steps className="Forgot__steps" size="small" current={step}>
                <Step title="Who are you?" description="Enter your some account data" icon={<UserOutlined />} />
                <Step title="Verification" description="Enter a verification code" icon={<SolutionOutlined />} />
                <Step title="New password" description="Set up a new password" icon={<LockOutlined />} />
                
            </Steps>

            <Form
                name="forgot"
                initialValues={{ remember: true }}
                autoComplete="off"
                layout="vertical"
                requiredMark={false}
                className="Forgot__form"
                onFinish={onStepChange}
            >
                { step === 0 && 
                    <UserData
                        value={userData}
                        setValue={setUserData}
                        setMethods={setMethods}
                    />
                }
                { step === 1 &&
                    <Method
                        userData={userData}
                        methods={methods}
                    />
                }
                { step === 2 &&
                    <>
                        <SetPassword
                            value={password}
                            setValue={setPassword}
                        />
                    </>
                }
            </Form>
        </div>
    )
}