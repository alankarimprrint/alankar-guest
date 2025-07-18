"use client";

import { useSelector, useDispatch } from "react-redux";
import { updateOrderStepStatus } from "../store/ordersSlice";
import { useState, useEffect } from "react";
import "./OrderDetails.css";
import { ArrowLeft, X } from "lucide-react";

const STATUS_OPTIONS = [
  "CREATED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "PENDING",
];
const PRIORITY_COLORS = {
  LOW: "green",
  MEDIUM: "blue",
  HIGH: "orange",
  URGENT: "red",
};
const STEP_COLORS = ["#3b82f6", "#f87171", "#facc15", "#c084fc", "#4ade80"];

const OrderDetails = ({ orderId, onBack }) => {
  const dispatch = useDispatch();
  const [updatingStepId, setUpdatingStepId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const STATUS_COLORS = {
    CREATED: "blue",
    IN_PROGRESS: "yellow",
    COMPLETED: "green",
    CANCELLED: "red",
    PENDING: "purple",
  };

  const order = useSelector((state) =>
    state.orders.orders.find((o) => o.id === orderId)
  );

  const closeModal = () => setSelectedImage(null);

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

  const handleStepStatusChange = async (stepId, status) => {
    setUpdatingStepId(stepId);
    try {
      await dispatch(
        updateOrderStepStatus({ orderStepId: stepId, status })
      ).unwrap();
    } catch (err) {
      alert("Error updating step status.");
    } finally {
      setUpdatingStepId(null);
    }
  };

  return (
    <div className="order-details-container">
      <div className="order-details-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Orders
        </button>
        <h2>Order Details</h2>
      </div>

      <div className="section">
        <div className="grid-header">
          <div>
            <label>Type:</label>
            <span>{order.orderType}</span>
          </div>
          
          <div>
            <label>Priority:</label>
            <span
              className={`badge badge-${
                PRIORITY_COLORS[order.priority] || "gray"
              }`}
            >
              {order.priority}
            </span>
          </div>
          <div>
  <label>Status:</label>
  <span className={`badge badge-${STATUS_COLORS[order.status] || "gray"}`}>
    {order.status}
  </span>
</div>
          <div>
            <label>Created at:</label>
            <span>
              {order.createdAtDateTime
                ? new Date(order.createdAtDateTime).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          
          <div>
            <label>Start Date:</label>
            <span>
              {order.orderStartDateTime
                ? new Date(order.orderStartDateTime).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          <div>
            <label>End Date:</label>
            <span>
              {order.orderEndDateTime
                ? new Date(order.orderEndDateTime).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>

        <div className="description">
          <label>Description:</label>
          <p>{order.description}</p>
        </div>
      </div>

      <div className="section">
        <h3>Work Progress</h3>
        <div className="progress-bar-multicolor">
          {order.steps.map((step, idx) => (
            <div
              key={step.id}
              className="progress-segment"
              style={{
                backgroundColor: STEP_COLORS[idx % STEP_COLORS.length],
                width: `${100 / order.steps.length}%`,
              }}
            />
          ))}
        </div>
        <div className="progress-bar-completed">
          {order.steps.map((step, idx) => (
            <div
              key={step.id}
              className="progress-segment"
              style={{
                backgroundColor:
                  step.status === "COMPLETED" ? "#22c55e" : "transparent",
                width: `${100 / order.steps.length}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="section">
        <h3>Order Steps</h3>
        {order.steps.map((step, idx) => (
          <div
            className="step-box"
            key={step.id}
            style={{
              backgroundColor: STEP_COLORS[idx % STEP_COLORS.length] + "20",
            }}
          >
            <div className="step-left">
              <div
                className="step-index"
                style={{
                  backgroundColor: STEP_COLORS[idx % STEP_COLORS.length],
                }}
              >
                {String(idx + 1).padStart(2, "0")}
              </div>
              <div>
                <div className="step-title">{step.orderStepName}</div>
                <div className="step-measurement">
                  Measurement : {step.measurement || "N/A"}
                </div>
              </div>
            </div>
            <div className="step-right">
              <select
                value={step.status}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  if (newStatus !== step.status) {
                    handleStepStatusChange(step.id, newStatus);
                  }
                }}
                disabled={updatingStepId === step.id}
                className={`status-select ${
                  step.status === "COMPLETED" ? "completed-status" : ""
                }`}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option
                    key={s}
                    value={s}
                    style={{
                      backgroundColor: s === "COMPLETED" ? "#22c55e" : "white",
                      color: s === "COMPLETED" ? "white" : "black",
                    }}
                  >
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      <div className="section">
        <h3>All Uploaded Images</h3>
        <div className="images-grid">
          {order.images?.map((img, idx) => (
            <img
              key={idx}
              src={img?.imageUrl}
              alt={`uploaded-${idx}`}
              className="uploaded-image"
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>

      {selectedImage && (
        <div className="image-modal-overlay" onClick={handleOutsideClick}>
          <div className="image-modal-content">
            <button className="close-modal-btn" onClick={closeModal}>
              <X size={24} />
            </button>
            <img
              src={selectedImage.imageUrl}
              alt="Full size preview"
              className="modal-image"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
