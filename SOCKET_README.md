# WebSocket Order Status Tracking

Simple websocket implementation for real-time order status updates.

## Setup

1. Install dependencies:
```bash
npm install
```

## How It Works

### Server-Side

The websocket server is initialized in `app.js` and listens for clients to join order rooms.

**WebSocket Events:**

**Client to Server:**
- `join-order` - Join a room to receive updates for a specific order
  ```javascript
  socket.emit('join-order', orderId);
  ```

- `leave-order` - Leave an order room
  ```javascript
  socket.emit('leave-order', orderId);
  ```

**Server to Client:**
- `order-status-update` - Broadcasted when order status changes
  ```javascript
  {
    orderId: "order_id",
    status: "Preparing",
    order: { /* full order object */ },
    timestamp: "2026-06-04T10:30:00Z"
  }
  ```

### Emitting Status Updates

Use the `emitOrderStatusUpdate` helper to send status updates:

```javascript
import { emitOrderStatusUpdate } from "./utils/socketEmitter.js";

// In your order update logic:
emitOrderStatusUpdate(app, orderId, newStatus, updatedOrder);
```

### Frontend - Client Usage

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

// Join order for real-time updates
socket.emit('join-order', 'order_123');

// Listen for status updates
socket.on('order-status-update', (data) => {
  console.log('Order status:', data.status);
  console.log('Full order:', data.order);
  // Update UI with new status
});

// Leave when done
socket.emit('leave-order', 'order_123');
socket.disconnect();
```

## Environment Variables

Make sure your `.env` file has:
```
CLIENT_URL=http://localhost:3000
```

## REST API Unchanged

All REST API endpoints remain unchanged:
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - Fetch orders
- `POST /api/v1/menu` - Menu endpoints
- `POST /api/v1/auth` - Authentication endpoints
