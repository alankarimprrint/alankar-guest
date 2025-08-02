"use client";

import { useSelector } from "react-redux";
import { Eye, Image as ImageIcon, X } from "lucide-react";
import { useState, useEffect } from "react";
import "./OrdersTable.css";

const OrdersTable = ({ onOrderSelect }) => {
  const { orders, loading, error } = useSelector((state) => state.orders);
  const [selectedOrderImages, setSelectedOrderImages] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const STATUS_COLORS = {
    CREATED: "blue",
    IN_PROGRESS: "yellow",
    COMPLETED: "green",
    CANCELLED: "red",
    PENDING: "purple",
  };

  const PRIORITY_COLORS = {
    LOW: "green",
    MEDIUM: "blue",
    HIGH: "orange",
    URGENT: "red",
  };

  const openImageGallery = (order) => {
    if (order.images?.length > 0) {
      setSelectedOrderImages(order.images);
      setCurrentImageIndex(0);
    }
  };

  const closeModal = () => {
    setSelectedOrderImages(null);
    setCurrentImageIndex(0);
  };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      e.stopPropagation();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
                    <td>{order?.client?.name}</td>
                    <td>{order.orderType}</td>
                    <td>
                      <span
                        className={`badge badge-${
                          PRIORITY_COLORS[order.priority] || "gray"
                        }`}
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
                                  <span className="progress-label">{`${percent}`}</span>
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
                              <span className="progress-label">.</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`badge badge-${
                          STATUS_COLORS[order.status] || "gray"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      {order.orderStartDateTime
                        ? new Date(
                            order.orderStartDateTime
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>
                      {order.orderEndDateTime
                        ? new Date(order.orderEndDateTime).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          className="action-btn view-btn"
                          onClick={() => onOrderSelect(order)}
                        >
                          <Eye size={16} />
                        </button>
                        {order.images?.length > 0 && (
                          <button
                            className="action-btn images-btn"
                            onClick={() => openImageGallery(order)}
                          >
                            <ImageIcon size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Image Gallery Modal */}
        {selectedOrderImages && (
          <div className="image-modal-overlay" onClick={handleOutsideClick}>
            <div className="image-modal-content">
              <button className="close-modal-btn" onClick={closeModal}>
                <X size={24} />
              </button>
              <div className="main-image-container">
                <img
                  src={selectedOrderImages[currentImageIndex]?.imageUrl}
                  alt={`Order image ${currentImageIndex + 1}`}
                  className="modal-image"
                />
              </div>
              {selectedOrderImages.length > 1 && (
                <div className="thumbnail-container">
                  {selectedOrderImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.imageUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className={`thumbnail ${
                        idx === currentImageIndex ? "active" : ""
                      }`}
                      onClick={() => setCurrentImageIndex(idx)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrdersTable;
