import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import App from './App.jsx'
import ProtectedRoute from './router/ProtectedRoute.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.js';
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './router/AppRoutes.jsx'
import AuthListener from './auth/AuthListener.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <AuthListener>
      <AppRoutes/>
      </AuthListener>
      </BrowserRouter>
    </Provider> 
  </StrictMode>,
)
