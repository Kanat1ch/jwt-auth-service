import React from 'react'
import { ROUTES } from '../../routes'
import { Button } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import './Header.scss'
import { Link } from 'react-router-dom'

export const Header = () => {

    const isAuth = true

    return (
        <header className="Header">
            <div className="Header__container container">
                <div className="Header__logo">
                    <Link to={ROUTES.home}>
                        <span>Auth</span>Service
                    </Link>
                </div>
                <div className="Header__links">
                    {
                        !isAuth ?
                        <>
                            <div className="Header__link">
                                <Link to={ROUTES.login}>
                                    <Button type="primary">Log In</Button>
                                </Link>
                            </div>
                            <div className="Header__link">
                                <Link to={ROUTES.registration}>
                                    <Button>Sign Up</Button>
                                </Link>
                            </div>
                        </>
                        : <div className="Header__link">
                            <Link to={ROUTES.profile.account}>
                                <Button type="primary" icon={<UserOutlined />}>Account</Button>
                            </Link>
                        </div>
                    }
                </div>
            </div>
        </header>
    )
}