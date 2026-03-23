# API Contract - Ecommerce Backend

Base URL: `https://apx-n3-13-backend-ecommerce.vercel.app`

---

## Error Response Shape (estándar)

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

---

## 1) Autenticación

### 1.1 Enviar código al email
- **POST** `/api/auth`
- Body:
  ```json
  { "email": "user@example.com" }
  ```
- Respuesta: `200` `{ success: true, message: "Code sent to email" }`

### 1.2 Validar código y obtener token
- **POST** `/api/auth/token`
- Body:
  ```json
  { "email": "user@example.com", "code": "123456" }
  ```
- Respuesta: `200` `{ success: true, token: "jwt-token" }`

---

## 2) Productos

### 2.1 Listar todos los productos
- **GET** `/api/products`
- Query params (todos opcionales):
  - `category` (string): filtrar por categoría (ej: "bedroom", "living")
  - `random` (boolean): order aleatorio
  - `limit` (number): limitar cantidad de resultados
  - `sort` (string): ordenar por precio (`price_asc`, `price_desc`)
- Respuesta: `200` `{ success: true, products: [...] }`

**Ejemplos de uso:**
```bash
# Todos los productos
GET /api/products

# Productos random para home
GET /api/products?random=true&limit=6

# Por categoría
GET /api/products?category=bedroom

# Ordenar por precio
GET /api/products?sort=price_asc
GET /api/products?sort=price_desc
```

### 2.2 Obtener producto por ID
- **GET** `/api/products/:id`
- Respuesta: `200` `{ success: true, product: { ... } }`
- Error: `404` si no existe

### 2.3 Buscar (Algolia)
- **GET** `/api/search`
- Query params:
  - `q` (string): texto de búsqueda
  - `offset` (number): página (default 0)
  - `limit` (number): resultados por página (default 20)
- Respuesta: `200` `{ success: true, query, page, total, totalPages, hitsPerPage, results }`

### 2.4 Reindexar productos en Algolia
- **POST** `/api/search/sync`
- Respuesta: `200` `{ success: true, message, total, synced, results }`

---

## 3) Usuario (requiere token)

### 3.1 Obtener perfil
- **GET** `/api/me`
- Headers: `Authorization: Bearer <token>`
- Respuesta: `200` `{ success: true, user: { id, email, name, phone, avatarUrl, address, createdAt, updatedAt } }`

### 3.2 Actualizar perfil
- **PATCH** `/api/me`
- Headers: `Authorization: Bearer <token>`
- Body (opcionales):
  ```json
  { "name": "...", "phone": "...", "avatarUrl": "..." }
  ```
- Respuesta: `200` `{ success: true, message: "User updated", user: { ... } }`

### 3.3 Actualizar dirección
- **PATCH** `/api/me/address`
- Headers: `Authorization: Bearer <token>`
- Body:
  ```json
  {
    "street": "...",
    "city": "...",
    "state": "...",
    "postalCode": "...",
    "country": "..."
  }
  ```
- Respuesta: `200` `{ message: "User Address Updated" }`

### 3.4 Obtener mis órdenes
- **GET** `/api/me/orders`
- Headers: `Authorization: Bearer <token>`
- Respuesta: `200` `{ orders: [...], quantity: n }`

---

## 4) Órdenes

### 4.1 Crear orden / checkout
- **POST** `/api/order`
- Headers: `Authorization: Bearer <token>`
- Body:
  ```json
  {
    "orderData": {
      "items": [{ "productId": "uuid", "quantity": 1 }],
      "shippingAddress": {
        "street": "...",
        "city": "...",
        "state": "...",
        "postalCode": "...",
        "country": "..."
      }
    }
  }
  ```
- Respuesta: `201` `{ success: true, message: "Checkout created", order, paymentUrl, paymentId }`

### 4.2 Obtener orden por ID
- **GET** `/api/order/:orderId`
- Headers: `Authorization: Bearer <token>`
- Respuesta: `200` `{ success: true, order: { ... } }`

### 4.3 Webhook / IPN de Mercado Pago
- **POST** `/api/ipn/mercadopago`
- Sin auth ( Mercado Pago envía la notificación)
- Body: webhook payload de Mercado Pago
- Proceso:
  - Extrae `data.id` o `id` del payment
  - Consulta payment con SDK de Mercado Pago
  - Si status = `approved` → actualiza orden a `confirmed` y descuenta stock
  - Si status = `cancelled/rejected/refunded/chargeback` → actualiza orden a `cancelled`
- Respuesta: `200` `{ success: true, message: "IPN received", orderId, status }`

---

## 5) Carga de productos (dev)
- **POST** `/api/load-products`
- Sin auth
- Lee `products-*.json` y crea productos con stock: 30
- Respuesta: `200` `{ message: "Products processed", results: [...] }`

---

## 6) Ejemplos de uso en frontend

```typescript
import { apiClient } from "./apiClient";

// Auth
const { token } = await apiClient.sendCode("user@example.com");
const { token } = await apiClient.verifyCode("user@example.com", "123456");

// Productos
const { products } = await apiClient.getProducts();
const { products } = await apiClient.getProducts({ category: "bedroom" });
const { product } = await apiClient.getProductById("uuid");

// Usuario
const { user } = await apiClient.getMe(token);
await apiClient.updateMe(token, { name: "Juan" });

// Órdenes
const { order, paymentUrl } = await apiClient.createOrder(token, {
  items: [{ productId: "uuid", quantity: 1 }],
});

// Búsqueda
const { results } = await apiClient.search("sofa", { limit: 10 });
```

---

## 7) Notas importantes

- Todas las respuestas de éxito incluyen `success: true`
- Errores incluyen `success: false`, `error`, y optionally `code` y `details`
- Para endpoints protegidos, usar header `Authorization: Bearer <token>`
- El token se obtiene en `/api/auth/token` y tiene expiración configurable
- El stock se descuenta solo cuando el pago es aprobado (`confirmed`)