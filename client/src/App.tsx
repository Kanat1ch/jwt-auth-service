import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Home } from './pages/Home/Home'
import { Login } from './pages/Login/Login'
import { Signup } from './pages/Signup/Signup'
import { Profile } from './pages/Profile/Profile'
import "./styles/main.css"
import "./styles/dark.scss"
import './styles/App.scss'
import { ROUTES } from './routes'
import { useDispatch } from 'react-redux'
import { isAuth, setInit } from './store/actions/user/userAction'

const App = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark')
        }
        
        if (localStorage.getItem('token')) {
            dispatch(isAuth())
        } else {
            dispatch(setInit(true))
        }
    }, [])

    return (
        <div className="App">
            <Layout>
                <Routes>
                    <Route path={ROUTES.home} element={<Home />} />
                    <Route path={ROUTES.login} element={<Login />} />
                    <Route path={ROUTES.registration} element={<Signup />} />
                    <Route path={ROUTES.profile.root} element={<Profile />} />
                    <Route path={`${ROUTES.profile.root}/:section`} element={<Profile />} />
                    <Route path="*" element={<Navigate to={ROUTES.home} />}
                    />
                </Routes>
            </Layout>
        </div>
    )
}

export default App

// TODO (frontend):
//   - UI главной страницы
//   - Темная тема
//   - Смена языка

// TODO (backend):
//   - Логика смены пароля (забыли пароль) и в ЛК
//   - Настроить документацию Swagger
