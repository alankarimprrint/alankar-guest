"use client";

import { useSelector } from "react-redux";
import { Eye } from "lucide-react";
import Sidebar from "./Sidebar";
import "./OrdersTable.css";

const OrdersTable = ({ onOrderSelect }) => {
  const { orders, loading, error } = useSelector((state) => state.orders);

  if (loading) return <div className="orders-container">Loading orders...</div>;
  if (error)
    return <div className="orders-container text-red-500">Error: {error}</div>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white to-blue-50">
      {/* Main Content */}
      <main className="flex-1 px-8 py-6 overflow-auto">
        <div className="table-container">
          <h2>All Orders list</h2>

          <div className="overflow-x-auto">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Client Name</th>
                  <th>Order Type</th>
                  <th>Priority</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order.id}>
                    <td>{String(index + 1).padStart(2, "0")}</td>
                    <td>{order.customerName}</td>
                    <td>{order.orderType}</td>
                    <td>
                      <span
                        className={`priority-${
                          order.priority?.toLowerCase?.() || "low"
                        } status-badge`}
                      >
                        {order.priority}
                      </span>
                    </td>
                    <td>
                      <div className="progress-bar-container">
                        {order.steps?.length > 0 ? (
                          (() => {
                            const total = order.steps.length;
                            const completed = order.steps.filter(
                              (step) => step.status === "COMPLETED"
                            ).length;
                            const percent = Math.round(
                              (completed / total) * 100
                            );

                            return (
                              <div className="progress-wrapper">
                                
                                <div
                                  className="progress-bar"
                                  style={{ width: `${percent}%` }}
                                >
                                  <span className="progress-label">{`${percent}%`}</span>
                                </div>
                              </div>
                            );
                          })()
                        ) : (
                          <div className="progress-wrapper">
                            <div
                              className="progress-bar"
                              style={{ width: `0%` }}
                            >
                              <span className="progress-label">0%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`status-${order.status
                          .toLowerCase()
                          .replace(/\s/g, "-")} status-badge`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      {order.orderDate
                        ? new Date(order.orderStartDateTime).toLocaleString()
                        : "N/A"}
                    </td>
                    <td>
                      {order.orderDate
                        ? new Date(order.orderEndDateTime).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="text-center">
                      <button
                        className="action-btn view-btn"
                        onClick={() => onOrderSelect(order)}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrdersTable;
