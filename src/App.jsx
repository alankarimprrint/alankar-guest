"use client"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom" // Only if using React Router
import OrdersDashboard from "./components/OrdersDashboard"
import Login from "./components/Login"
import OrderDetails from "./components/OrderDetails"
import { fetchOrders } from "./store/ordersSlice"
import { isAccessTokenExpired } from "./utils/tokenUtils"
import "./App.css"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken")
    if (token && !isAccessTokenExpired(token)) {
      setIsAuthenticated(true)
      dispatch(fetchOrders())
    } else {
      setIsAuthenticated(false)
      sessionStorage.clear()
    }
  }, [dispatch])

  const handleLogin = () => {
    setIsAuthenticated(true)
    dispatch(fetchOrders())
  }

  const handleLogout = () => {
    sessionStorage.clear()
    setIsAuthenticated(false)
  }

  const handleOrderSelect = (order) => {
    setSelectedOrder(order)
  }

  const handleBackToOrders = () => {
    setSelectedOrder(null)
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  if (selectedOrder) {
    return <OrderDetails orderId={selectedOrder.id} onBack={handleBackToOrders} />
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Alankar Guest - Order Management</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>
      <OrdersDashboard onOrderSelect={handleOrderSelect} />
    </div>
  )
}

export default App
