import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../config/api";
import { getAccessToken } from "../utils/getAccessToken";

// Fetch all orders
export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  const accessToken = sessionStorage.getItem("accessToken");

  const response = await api.get("/api/orders/getallorders", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.data;
});

// Update main order status
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }) => {
    const accessToken = getAccessToken();
    const response = await api.post(
      "/change/orderstatus",
      { orderId, status },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.status === 200) {
      return { orderId, status };
    }
    throw new Error("Failed to update status");
  }
);

// ✅ Update individual step status
export const updateOrderStepStatus = createAsyncThunk(
  "orders/updateOrderStepStatus",
  async ({ orderStepId, status }) => {
    const accessToken = getAccessToken();
    console.log("/api/orderstep/updateorderstepstatus token:", accessToken);

    const response = await api.put(
      `/api/orderstep/updateorderstepstatus?orderStepId=${orderStepId}&OrderStepStatus=${status}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("/api/orderstep/updateorderstepstatus response", response);

    if (response.status === 200) {
      return { orderStepId, status };
    }
    throw new Error("Failed to update step status");
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, status } = action.payload;
        const order = state.orders.find((order) => order.id === orderId);
        if (order) {
          order.status = status;
        }
      })
      // ✅ Moved this inside builder block
      .addCase(updateOrderStepStatus.fulfilled, (state, action) => {
        const { orderStepId, status } = action.payload;

        for (const order of state.orders) {
          const step = order.steps?.find((s) => s.id === orderStepId);
          if (step) {
            // ✅ Update step status
            step.status = status;

            // ✅ Now check if all steps are COMPLETED
            const allCompleted = order.steps.every(
              (s) => s.status === "COMPLETED"
            );

            // ✅ Update order status accordingly
            if (allCompleted) {
              order.status = "COMPLETED";
            } else {
              order.status = "IN_PROGRESS";
            }

            break; // Stop after updating the relevant order
          }
        }
      });
  },
});

export default ordersSlice.reducer;
