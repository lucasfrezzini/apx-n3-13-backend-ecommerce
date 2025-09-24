## POST /auth

## POST /auth/token

## GET /me

## PATCH /me

## PATCH /me/address

## GET /products/{id}

## GET /search?q=query&offset=0&limit=10

## POST /order?productId={id}

Genera una compra en nuestra base de datos y además genera una orden de pago en MercadoPago. Devuelve una URL de MercadoPago a donde vamos a redigirigir al user para que pague y el orderId.

## GET /me/orders

Devuelve todas mis ordenes con sus status.

## GET /order/{orderId}

Devuelve una orden con toda la data incluyendo el estado de la orden.

## POST /ipn/mercadopago

Recibe la señal de MercadoPago para confirmar que el pago fué realizado con éxito. Cambia el estado de la compra en nuestra base y le envía un email al usuario para avisarle que el pago se realizó correctamente. También se debe generar algún aviso hacia quienes deban procesar esta compra. Esto último es algo interno así que puede ser un email o un registro en Airtable.
