import React, { Suspense, useEffect } from 'react'
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
import { useTranslation } from 'react-i18next'
import './lib/i18n'

const App = () => {

    const dispatch = useDispatch()
    const { i18n } = useTranslation()

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
        <Suspense fallback={'Loading'}>
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
        </Suspense>
    )
}

export default App

// TODO (frontend):
//   - Логика смены пароля (забыли пароль)
//   - Сообщения на почту
//   - Поиск пользователей
//   - UI главной страницы


// TODO (backend):
//   - Логика смены пароля (забыли пароль)
//   - Поиск пользователей
//   - Настроить документацию Swagger
