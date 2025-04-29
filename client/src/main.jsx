import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { AuthProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
    <>
        <div>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#232329',
                        color: '#fff',
                        border: '1px solid #bbb8ff'
                    },
                    success: {
                        iconTheme: {
                            primary: '#bbb8ff',
                            secondary: '#232329'
                        }
                    }
                }}
            />
        </div>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </>
) 