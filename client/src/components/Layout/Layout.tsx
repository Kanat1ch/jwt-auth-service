import React, { ReactNode } from 'react'
import { Header } from '../Header/Header'
import './Layout.scss'

interface LayoutProps {
    children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="Layout">
            <Header />
            <div className="Layout__content">
                <div className="Layout__container container">
                    {children}
                </div>
            </div>
        </div>
    )
}