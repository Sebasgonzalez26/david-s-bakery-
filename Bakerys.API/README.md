# David's Bakery API

API REST para el sistema administrativo de una panadería. Desarrollada con **ASP.NET Core 8**, **Dapper** y **SQL Server**, siguiendo **Clean Architecture**.

## Tecnologías

- C# / ASP.NET Core 8
- Dapper (micro-ORM)
- SQL Server
- Swagger / OpenAPI
- Clean Architecture (Abstracciones → DA → Flujo → API)

## Estructura del Proyecto

```
Bakerys.API/
├── Abstracciones/    # Modelos e interfaces (contratos)
├── DA/               # Acceso a datos con Dapper y Stored Procedures
├── Flujo/            # Lógica de negocio
├── API/              # Controllers y configuración
├── DB/               # Proyecto de base de datos (tablas y SPs)
└── postman/          # Colección de Postman para pruebas
```

## Módulos

### Fase 1 — MVP
- **Clientes** — CRUD completo con búsqueda
- **Pedidos** — Gestión de pedidos con detalles y estados
- **Pagos** — Registro de pagos parciales con control de saldo

### Fase 2 — Inventario y Finanzas
- **Inventario** — Productos con control de stock y movimientos
- **Finanzas** — Registro de ingresos y gastos con resumen financiero

---

## Endpoints

### Cliente
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/Cliente` | Obtener todos los clientes |
| GET | `/api/Cliente/{id}` | Obtener cliente por Id |
| GET | `/api/Cliente/buscar?busqueda=` | Buscar por nombre o teléfono |
| POST | `/api/Cliente` | Agregar cliente |
| PUT | `/api/Cliente/{id}` | Editar cliente |
| DELETE | `/api/Cliente/{id}` | Desactivar cliente |

#### Body POST/PUT
```json
{
    "nombre": "María García",
    "telefono": "8888-1234",
    "email": "maria@gmail.com",
    "notas": "Cliente frecuente"
}
```

---

### Pedido
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/Pedido` | Obtener todos los pedidos |
| GET | `/api/Pedido/{id}` | Obtener pedido con detalles y pagos |
| GET | `/api/Pedido/buscar` | Buscar con filtros |
| GET | `/api/Pedido/estados` | Obtener catálogo de estados |
| POST | `/api/Pedido` | Crear pedido |
| POST | `/api/Pedido/detalle` | Agregar detalle al pedido |
| PUT | `/api/Pedido/{id}/estado?estadoId=` | Actualizar estado |
| PUT | `/api/Pedido/{id}/cancelar?motivo=` | Cancelar pedido |

#### Body POST Pedido
```json
{
    "clienteId": 1,
    "fechaEntrega": "2026-06-15T00:00:00",
    "montoTotal": 350.00,
    "imagenReferenciaUrl": null,
    "notas": "Pastel de quinceañera"
}
```

#### Body POST Detalle
```json
{
    "pedidoId": 1,
    "descripcion": "Pastel principal",
    "sabor": "Chocolate",
    "tamanio": "Grande",
    "decoracion": "Flores blancas",
    "cantidad": 1,
    "precioUnitario": 350.00
}
```

---

### Pago
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/Pago` | Registrar pago |
| GET | `/api/Pago/pedido/{pedidoId}` | Obtener pagos de un pedido |
| GET | `/api/Pago/pedido/{pedidoId}/saldo` | Consultar saldo pendiente |

#### Body POST
```json
{
    "pedidoId": 1,
    "monto": 100.00,
    "tipoPago": "Adelanto",
    "comprobanteUrl": null,
    "notas": "Primer adelanto"
}
```
> Tipos de pago válidos: `Adelanto`, `Abono`, `Saldo Total`

---

### Producto
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/Producto` | Obtener productos (filtros: categoria, soloActivos, soloStockBajo) |
| GET | `/api/Producto/{id}` | Obtener producto con movimientos |
| POST | `/api/Producto` | Agregar producto |
| PUT | `/api/Producto/{id}` | Editar producto |
| DELETE | `/api/Producto/{id}` | Desactivar producto |

#### Body POST/PUT
```json
{
    "nombre": "Harina",
    "categoria": "Ingrediente",
    "unidadMedida": "kg",
    "stockActual": 10,
    "stockMinimo": 2,
    "precioUnitario": 1500
}
```

---

### Movimiento Inventario
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/MovimientoInventario/producto/{productoId}` | Historial de movimientos |
| POST | `/api/MovimientoInventario` | Registrar entrada o salida |

#### Body POST
```json
{
    "productoId": 1,
    "tipoMovimiento": "Entrada",
    "cantidad": 5,
    "notas": "Compra de harina"
}
```
> Tipos válidos: `Entrada`, `Salida`

---

### Transaccion
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/Transaccion` | Obtener transacciones (filtros: tipo, categoria, fechaDesde, fechaHasta) |
| GET | `/api/Transaccion/{id}` | Obtener transacción por Id |
| GET | `/api/Transaccion/resumen` | Resumen financiero del período |
| POST | `/api/Transaccion` | Registrar ingreso o gasto |
| PUT | `/api/Transaccion/{id}` | Editar transacción |
| DELETE | `/api/Transaccion/{id}` | Eliminar transacción |

#### Body POST/PUT
```json
{
    "tipo": "Gasto",
    "categoria": "Ingredientes",
    "descripcion": "Compra de azúcar",
    "monto": 12000,
    "fecha": null
}
```
> Tipos válidos: `Ingreso`, `Gasto`

---

## Reglas de Negocio

- No se puede pagar más del saldo pendiente de un pedido
- No se pueden registrar pagos en pedidos cancelados o entregados
- No se puede desactivar un cliente con pedidos activos
- No se puede registrar una salida de inventario si no hay stock suficiente
- El stock se actualiza automáticamente con cada movimiento

## Pruebas

La colección de Postman con todos los endpoints está disponible en `/postman/David's Bakery API.postman_collection.json`.

Importar en Postman: **File → Import → seleccionar el archivo**
