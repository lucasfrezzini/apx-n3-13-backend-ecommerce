## POST /auth

## POST /auth/token

## GET /me

## PATCH /me

## PATCH /me/address

## GET /products/{id}

## GET /search?q=query&offset=0&limit=10

## GET /me/orders

## GET /order/{orderId}

## POST /order

Genera una compra para un carrito de productos y decrementa stock. Crea una orden de pago en MercadoPago y devuelve `paymentUrl` y `paymentId`.

Body:
```
{ "orderData": { "items": [{ "productId": "<id>", "quantity": 2 }], "shippingAddress": { ... } } }
```

## POST /ipn/mercadopago

Recibe la señal webhook de MercadoPago para marcar la orden como `confirmed` cuando el pago esté aprobado, o `cancelled` en otros estados relevante.

- Endpoint no requiere auth.
- Espera `body` con `type` y `data.id` (id de pago de MercadoPago).
- Busca payment con MercadoPago API, lee `external_reference` (orderId).
- Actualiza orden:
  - `status: confirmed` si pago aprobado.
  - `status: cancelled` si pago rechazado o cancelado.
- Devuelve `{ success: true, orderId, status }`.

