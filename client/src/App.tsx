import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Login } from './components/Login/Login'
import { Signup } from './components/Signup/Signup'
import { Profile } from './components/Profile/Profile'
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
                        <Route path={ROUTES.profile} element={<Profile />} />
                        <Route
                            path="*"
                            element={
                                isAuth 
                                    ? <Navigate to={ROUTES.profile} />
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

// TODO (frontend):
//   - UI header'a авторизованного пользователя
//   - Изображение профиля
//   - UI смены пароля
//   - Запросы на backend (по Ulbi TV)
//   - Обработка ошибок с сервера
//   - UI главной страницы
//   - Маска для телефона
//   - Верстка сообщений на почту
//   - Адаптив

// TODO (backend):
//   - Добавление изображения в БД
//   - Логика смены пароля (забыли пароль) и в ЛК
//   - Изменение данных пользователя в ЛК (посмотреть hospital)
