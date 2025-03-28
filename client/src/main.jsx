import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

ReactDOM.createRoot(document.getElementById('root')).render(
    <>
        <div>
            <Toaster
                position="top-right"
                toastOptions={{
                    success: {
                        theme: {
                            primary: '#4aed88',
                        },
                    },
                }}
            />
        </div>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </>
) 