import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Home } from './components/Home/Home'
import { Login } from './components/Login/Login'
import { Signup } from './components/Signup/Signup'
import { Profile } from './components/Profile/Profile'
import "./styles/main.css"
import './styles/App.scss'
import { ROUTES } from './routes'
import { useDispatch } from 'react-redux'
import { isAuth, setInit } from './store/actions/user/userAction'

const App = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        if (localStorage.getItem('token')) {
            dispatch(isAuth())
        } else {
            dispatch(setInit(true))
        }
    }, [dispatch])

    return (
        <div className="App">
            <Layout>
                <Routes>
                    <Route path={ROUTES.home} element={<Home />} />
                    <Route path={ROUTES.login} element={<Login />} />
                    <Route path={ROUTES.registration} element={<Signup />} />
                    <Route path={ROUTES.profile.section} element={<Profile />} />
                    <Route path="*" element={<Navigate to={ROUTES.home} />}
                    />
                </Routes>
            </Layout>
        </div>
    )
}

export default App

// TODO (frontend):
//   - Запросы на backend (по Ulbi TV)
//   - Обработка ошибок с сервера
//   - UI главной страницы
//   - Верстка сообщений на почту
//   - Темная тема
//   - Смена языка

// TODO (backend):
//   - Логика смены пароля (забыли пароль) и в ЛК
//   - Изменение данных пользователя в ЛК (посмотреть hospital)
//   - Настроить документацию Swagger
