import React, { useEffect, useState } from 'react'
import { Form, Select, Switch } from 'antd'

const { Option } = Select

export const Appearance = () => {

    const [isChecked, setIsChecked] = useState<boolean>(!!localStorage.getItem('theme'))
    const [changing, setChanging] = useState<string>('')

    const handleChangeTheme = (isChecked: boolean) => {
        setTimeout(() => {
            setIsChecked(isChecked)
        }, 500)
        setChanging(isChecked ? 'dark' : 'light')
    }

    useEffect(() => {
        if (isChecked) {
            document.body.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.body.classList.remove('dark')
            localStorage.removeItem('theme')
        }
    }, [isChecked])

    return (
        <Form
            className="Profile__form"
            layout="vertical"
        >
            <div className="col">
                <h2>Appearance</h2>
                <Form.Item
                    label="Language"
                >
                    <Select defaultValue="en">
                        <Option value="en">English</Option>
                        <Option value="ru">Russian</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Dark mode"
                >
                    <Switch checked={isChecked} onChange={handleChangeTheme} checkedChildren="ON" unCheckedChildren="OFF" />
                    <div className={`change-theme-animation ${changing === 'light' ? 'light' : 'dark'} ${changing && 'active'}`}></div>
                </Form.Item>
            </div>
        </Form>
    )
}