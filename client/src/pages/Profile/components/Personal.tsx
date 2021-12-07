import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Input, Radio, Button, message } from 'antd'
import { edit, removeErrors } from '../../../store/actions/user/userAction'

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
            message.success('Account successfully updated');
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
                <h2>Personal</h2>
                <Form.Item
                    label="Name"
                    name="name"
                    wrapperCol={{ span: 24 }}
                    initialValue={user?.name}
                >
                    <Input
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Item> 

                <Form.Item
                    label="Surname"
                    name="surname"
                    wrapperCol={{ span: 24 }}
                    initialValue={user?.surname}
                >
                    <Input
                        placeholder="Surname"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                    />
                </Form.Item> 

                <Form.Item
                    label="Sex"
                    name="sex"
                    wrapperCol={{ span: 24 }}
                    initialValue={user?.sex}
                >
                    <Radio.Group
                        value={sex}
                        onChange={(e) => setSex(e.target.value)}
                    >
                        <Radio value="male">Male</Radio>
                        <Radio value="female">Female</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        onClick={updateUserHandler}
                        loading={loading}
                    >
                        Update personal info
                    </Button>
                </Form.Item>
            </div>
        </Form>
    )
}