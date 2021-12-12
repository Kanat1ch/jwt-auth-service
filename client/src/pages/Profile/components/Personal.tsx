import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Input, Radio, Button, message } from 'antd'
import { edit, removeErrors } from '../../../store/actions/user/userAction'
import { t } from 'i18next'

export const Personal = () => {

    const user = useSelector((store: any) => store.user.user.data)
    const loading = useSelector((store: any) => store.user.loadingComponent) === 'edit'
    const status = useSelector((state: any) => state.user.status)
    
    const dispatch = useDispatch()

    const [name, setName] = useState<string>(user?.name)
    const [surname, setSurname] = useState<string>(user?.surname)
    const [sex, setSex] = useState<string>(user?.sex)

    const updateUserHandler = () => {
        dispatch(edit({ name, surname, sex }))
    }

    useEffect(() => {
        if (loading && status === 'edited') {
            message.success(t('success.update'));
            dispatch(removeErrors())
        }
    }, [loading, status])

    return (
        <Form
            className="Profile__form"
            name="basic"
            initialValues={{ remember: true }}
            autoComplete="off"
            layout="vertical"
            onFinish={updateUserHandler}
        >
            <div className="col">
                <h2>{t('Personal')}</h2>
                <Form.Item
                    label={t('Name')}
                    name="name"
                    initialValue={user?.name}
                >
                    <Input
                        placeholder={t('Name')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Item> 

                <Form.Item
                    label={t('Surname')}
                    name="surname"
                    initialValue={user?.surname}
                >
                    <Input
                        placeholder={t('Surname')}
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                    />
                </Form.Item> 

                <Form.Item
                    label={t('Sex')}
                    name="sex"
                    initialValue={user?.sex}
                >
                    <Radio.Group
                        value={sex}
                        onChange={(e) => setSex(e.target.value)}
                    >
                        <Radio value="male">{t('Male')}</Radio>
                        <Radio value="female">{t('Female')}</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        onClick={updateUserHandler}
                        loading={loading}
                    >
                        {t('Update personal info')}
                    </Button>
                </Form.Item>
            </div>
        </Form>
    )
}