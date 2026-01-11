import { useEffect, useState } from 'react'
// import './Layout.css'
import { Outlet, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from './context/AuthContext'

const Layout = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { token } = useAuth()
    console.log('home')

    const fetchUserDetail = async () => {
        if (token) {
            setLoading(false)
        }
        else {
            console.log(token)
            navigate('/login')
        }
    }

    useEffect(() => {
        fetchUserDetail()
    }, [token])

    return (
        <>
            {
                loading ?
                    <div className="loading-container" role="main" aria-live="polite" aria-busy="true">
                        Loading
                    </div>
                    :
                    <div className="layout-page-container">
                        <div className="inner-layout-box">
                            <div className="inner-layout">
                                <Outlet />
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}

export default Layout