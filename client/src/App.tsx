import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Login } from './components/Login/Login'
import { Signup } from './components/Signup/Signup'
import "antd/dist/antd.css"
import './styles/App.scss'
import { ROUTES } from './routes'

const App = () => {
    const isAuth = true
    return (
        <BrowserRouter>
            <div className="App">
                <Layout>
                    <Routes>
                        <Route path={ROUTES.login} element={<Login />} />
                        <Route path={ROUTES.registration} element={<Signup />} />
                        <Route
                            path="*"
                            element={
                                isAuth 
                                    ? <Navigate to={ROUTES.login} />
                                    : <Navigate to={ROUTES.registration} />
                            }
                        />
                    </Routes>
                </Layout>
            </div>
        </BrowserRouter>
    )
}

export default App
