# API Contract - Ecommerce Backend

Base URL: `http://localhost:3000` (o el puerto usado por tu app)

## 📌 Error Response Shape (estándar)

```json
{
  "success": false,
  "error": "Mensaje de error",
  "status": 400,
  "code": "validation_error",
  "details": {
    "field": ["Mensaje de validación"]
  }
}
```

> Algunas rutas todavía devuelven `{ error: "..." }`, pero para las rutas con `handleRoute` usamos el formato uniforme.

---

## 1) Auth / Login

### 1.1 Enviar email para recibir código
- `POST /api/auth`
- Body:
  - `email` (string, email válido)
- Respuesta:
  - `200` `{ success: true, message: "Code sent to email" }`

Ejemplo:
```js
await fetch('/api/auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com' }),
})
```

### 1.2 Validar código y obtener token
- `POST /api/auth/token`
- Body:
  - `email` (string)
  - `code` (string)
- Respuesta:
  - `200` `{ success: true, token: "jwt-token" }`

Ejemplo:
```js
const res = await fetch('/api/auth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', code: '123456' }),
});
```

---

## 2) Productos

### 2.1 Listar todos
- `GET /api/products`
- Respuesta:
  - `200` `{ success: true, products: [ ... ] }`

### 2.2 Obtener por ID
- `GET /api/products/:id`
- Respuesta:
  - `200` `{ product: { ... } }`
  - `404` si no existe

### 2.3 Buscar por categoría
- `GET /api/store/:category`
- Respuesta:
  - `200` `{ success: true, products: [ ... ] }`

### 2.4 Listar tienda (todos)
- `GET /api/store`
- Respuesta:
  - `200` `{ products: [ ... ] }`

---

## 3) Perfil (requiere token)

### 3.1 Obtener perfil
- `GET /api/me`
- Headers:
  - `Authorization: Bearer <token>`
- Respuesta:
  - `200` `{ success: true, user: { id, email, name, phone, avatarUrl, createdAt, updatedAt } }`

### 3.2 Actualizar perfil
- `PATCH /api/me`
- Headers:
  - `Authorization: Bearer <token>`
- Body (cualquiera de):
  - `name` (string)
  - `phone` (string, formato `+123456789`)
  - `avatarUrl` (URL)
- Respuesta:
  - `200` `{ success: true, message: 'User updated', user: { ... } }`

---

## 4) Ordenes

### 4.1 Crear orden
- `POST /api/order`
- Headers:
  - `Authorization: Bearer <token>`
- Body:
  - `{ orderData: { userId, productId, quantity, totalPrice, ...opcional } }`
- `orderData` schema (zod):
  - `userId`: UUID
  - `productId`: UUID
  - `quantity`: integer > 0
  - `totalPrice`: number > 0
  - `paymentUrl` (string, url, opcional)
  - `status` (pending | confirmed | cancelled | shipped, opcional)
  - `shippingAddress` (opcionales: street, city, state, postalCode, country)
  - `paymentId` (opcional)
- Respuesta:
  - `201` `{ success: true, message: 'Order created', order: { ... } }`

---

## 5) Carga de productos (dev)
- `POST /api/load-products`
- No requiere auth
- Lee `products-dining-room.json` y crea productos con `stock: 30`
- Respuesta:
  - `200` `{ message: 'Products processed', results: [ ... ] }`

---

## 6) Consumo frontend recomendado (pseudocódigo)

```js
const authSendCode = async (email) =>
  fetch('/api/auth', { method: 'POST', body: JSON.stringify({ email }), headers: { 'Content-Type': 'application/json' } });

const authGetToken = async (email, code) => {
  const r = await fetch('/api/auth/token', { method: 'POST', body: JSON.stringify({ email, code }), headers: { 'Content-Type': 'application/json' } });
  return r.json();
};

const fetchMe = (token) => fetch('/api/me', { headers: { Authorization: `Bearer ${token}` } });
const fetchProducts = () => fetch('/api/products');
const fetchStoreByCategory = (cat) => fetch(`/api/store/${cat}`);
const createOrder = (token, orderData) =>
  fetch('/api/order', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderData }),
  });
```

---

## 7) Notas importantes
- Si usas `fetch` en frontend, valida `res.ok` y parsea JSON.
- Para auth, usa siempre token en `Authorization: Bearer ...`.
- Para errores de Zod, la respuesta usa `details` con los campos.

> Sugerencia: para mayor confiabilidad, crea un cliente API en frontend (con wrapper que centraliza `token`, errores, retry).
