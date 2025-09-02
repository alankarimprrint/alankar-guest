"use client";

import OrdersTable from "./OrdersTable";
import Sidebar from "./Sidebar";
import "./OrdersDashboard.css";

const OrdersDashboard = ({ onOrderSelect }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };
  return (
    <div className="dashboard-layout">
     
      <main className="dashboard-main">
        <div className="top-bar text-left text-sm text-gray-600 mb-6">
          {getGreeting()}! <span className="font-bold">TEAM</span>
        </div>
        <OrdersTable onOrderSelect={onOrderSelect} />
      </main>
    </div>
  );
};

export default OrdersDashboard;
