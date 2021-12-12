import React, { useEffect, useState } from 'react'
import { Form, Select, Switch } from 'antd'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'

const { Option } = Select

export const Appearance = () => {

    const { i18n } = useTranslation()

    const [isChecked, setIsChecked] = useState<boolean>(!!localStorage.getItem('theme'))
    const [changing, setChanging] = useState<string>('')

    const handleChangeTheme = (isChecked: boolean) => {
        setTimeout(() => {
            setIsChecked(isChecked)
        }, 500)
        setChanging(isChecked ? 'dark' : 'light')
    }

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang)
        localStorage.setItem('lang', lang)
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
                <h2>{t('Appearance')}</h2>
                <Form.Item
                    label={t('Language')}
                >
                    <Select defaultValue={localStorage.getItem('lang') || 'en'} onChange={changeLanguage}>
                        <Option value="en">{t('English')}</Option>
                        <Option value="ru">{t('Russian')}</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label={t('Dark mode')}
                >
                    <Switch checked={isChecked} onChange={handleChangeTheme} checkedChildren={t('ON')} unCheckedChildren={t('OFF')} />
                    <div className={`change-theme-animation ${changing === 'light' ? 'light' : 'dark'} ${changing && 'active'}`}></div>
                </Form.Item>
            </div>
        </Form>
    )
}