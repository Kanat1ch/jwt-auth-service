import React from 'react'
import { ROUTES } from '../../routes'
import { Button, Skeleton } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import './Header.scss'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { t } from 'i18next'

export const Header = () => {

    const isAppInit = useSelector((state: any) => state.user.init)
    const isUserAuthorized = useSelector((state: any) => state.user.isAuth)

    return (
        <header className="Header">
            <div className="Header__container container">
                <div className="Header__logo">
                    <Link to={ROUTES.home}>
                        <span>Auth</span>Service
                    </Link>
                </div>
                { isAppInit ?
                <div className="Header__links">
                    {
                        !isUserAuthorized ?
                        <>
                            <div className="Header__link">
                                <Link to={ROUTES.login}>
                                    <Button className="login-btn" type="primary">{t('Login')}</Button>
                                </Link>
                            </div>
                            <div className="Header__link">
                                <Link to={ROUTES.registration}>
                                    <Button className="signup-btn">{t('Signup')}</Button>
                                </Link>
                            </div>
                        </>
                        : <div className="Header__link">
                            <Link to={ROUTES.profile.account}>
                                <Button type="primary" icon={<UserOutlined />}>{t('Account')}</Button>
                            </Link>
                        </div>
                    }
                </div>
                : <Skeleton.Button active style={{ width: 112, height: 32 }} shape="square" /> }
            </div>
        </header>
    )
}