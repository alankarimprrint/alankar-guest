"use client";

import { useSelector, useDispatch } from "react-redux";

import { updateOrderStepStatus } from "../store/ordersSlice";
import { useState } from "react";
import "./OrderDetails.css";
import { ArrowLeft } from "lucide-react";

const STATUS_OPTIONS = [
  "CREATED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "PENDING",
];
// const STEP_COLORS = ["#2563eb", "#fda4af", "#fde68a", "#e9d5ff", "#bbf7d0"];
// const STEP_COLORS = ["#1e40af", "#be123c", "#b45309", "#7e22ce", "#15803d"];
const STEP_COLORS = ["#3b82f6", "#f87171", "#facc15", "#c084fc", "#4ade80"];



const OrderDetails = ({ orderId, onBack }) => {
  const dispatch = useDispatch();
  const [updatingStepId, setUpdatingStepId] = useState(null);

  // ✅ Get the latest order from Redux by ID
  const order = useSelector((state) =>
    state.orders.orders.find((o) => o.id === orderId)
  );

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
            <label>Created at:</label>
            <span>{new Date(order.createdAt).toLocaleString()}</span>
          </div>
          <div>
            <label>Status:</label>
            <span className="badge badge-yellow">{order.status}</span>
          </div>
          <div>
            <label>Priority:</label>
            <span className="badge badge-red">{order.priority}</span>
          </div>
          <div>
            <label>Start Date:</label>
            <span>{new Date(order.startDate).toLocaleString()}</span>
          </div>
          <div>
            <label>End Date:</label>
            <span>{new Date(order.endDate).toLocaleString()}</span>
          </div>
        </div>

        <div className="description">
          <label>Description:</label>
          <p>{order.description}</p>
        </div>
      </div>

      <div className="section">
        <h3>Work Progress</h3>

        {/* Original multicolor bar */}
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

        {/* ✅ New green bar for completed steps only */}
        <div className="progress-bar-completed">
          {order.steps.map((step, idx) => (
            <div
              key={step.id}
              className="progress-segment"
              style={{
                backgroundColor:
                  step.status === "COMPLETED" ? "#22c55e" : "transparent", // Green or skip
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
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
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
              src={img}
              alt={`uploaded-${idx}`}
              className="uploaded-image"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
