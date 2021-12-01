import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Form, Input, Radio, Button } from 'antd'

export const Personal = () => {

    const user = useSelector((store: any) => store.user.user.data)

    const [name, setName] = useState<string>('')
    const [surname, setSurname] = useState<string>('')
    const [sex, setSex] = useState<string>('')

    return (
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
                <Button type="primary" htmlType="submit">
                    Update personal info
                </Button>
            </Form.Item>
        </div>
    )
}