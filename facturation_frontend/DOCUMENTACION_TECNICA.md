# 🏗️ Documentación Técnica - Sistema de Ventas

## 📁 Estructura de Archivos Creados

```
frontend/facturation_frontend/src/
│
├── pages/
│   ├── sales/                          ← NUEVA CARPETA
│   │   ├── SaleForm.tsx               # Componente principal
│   │   ├── index.ts                   # Exportaciones
│   │   └── components/
│   │       ├── SaleCart.tsx           # Componente del carrito
│   │       └── (index.ts si necesario)
│   │
│   ├── products/
│   │   ├── ProductsList.tsx           # MODIFICADO (agregados botones)
│   │   └── ...
│   │
│   └── ...
│
├── routes/
│   └── index.tsx                       # MODIFICADO (agregada ruta /sales)
│
└── services/
    └── api.ts                          # (sin cambios)
```

## 📦 Componentes Creados

### 1. **SaleForm.tsx** - Componente Principal
**Ubicación**: `src/pages/sales/SaleForm.tsx`

**Responsabilidades**:
- Gestionar el estado de búsqueda
- Cargar productos del backend
- Gestionar el carrito de compra
- Validar stock disponible
- Enviar ventas al backend
- Mostrar notificaciones

**Props**: Ninguna (componente raíz)

**Estado Local**:
```typescript
- searchTerm: string           // Término de búsqueda
- products: Product[]          // Lista de productos
- searchResults: Product[]     // Resultados filtrados
- cartItems: CartItem[]        // Items en el carrito
- loading: boolean             // Cargando productos
- alert: AlertMessage | null   // Alerta actual
- isSubmitting: boolean        // Procesando venta
```

**Métodos Principales**:
- `fetchProducts()` - Obtiene lista de productos del API
- `addToCart(product)` - Agrega producto al carrito
- `updateQuantity(product_id, quantity)` - Actualiza cantidad
- `removeFromCart(product_id)` - Elimina producto del carrito
- `handleCheckout()` - Procesa la venta

**API Llamadas**:
- `GET /products/` - Obtener lista de productos
- `POST /sales/` - Crear nueva venta

---

### 2. **SaleCart.tsx** - Componente del Carrito
**Ubicación**: `src/pages/sales/components/SaleCart.tsx`

**Responsabilidades**:
- Mostrar tabla de productos agregados
- Permitir cambiar cantidades
- Calcular subtotales
- Mostrar total
- Permitir eliminar items
- Botón de finalizar venta

**Props**:
```typescript
interface SaleCartProps {
  items: CartItem[]
  onUpdateQuantity: (product_id: number, quantity: number) => void
  onRemoveItem: (product_id: number) => void
  onCheckout: () => void
}
```

**Interfaces**:
```typescript
interface CartItem {
  product_id: number
  product_name: string
  price: number
  quantity: number
  subtotal: number
}
```

**Características**:
- Renderizado condicional (muestra mensaje si está vacío)
- Tabla responsiva
- Botones ±/🗑️ para cada item
- Total actualizado dinámicamente
- Botón de finalizar venta

---

## 🔄 Flujo de Datos

### Flujo de Búsqueda y Agregación
```
Input: searchTerm
  ↓
useEffect detecta cambio en searchTerm
  ↓
Filtra products por nombre (toLowerCase)
  ↓
Establece searchResults
  ↓
Renderiza resultados en la UI
```

### Flujo de Agregación al Carrito
```
Usuario hace clic en "Agregar"
  ↓
addToCart(product) ejecuta
  ↓
Verifica si producto existe en carrito
  ├─ SI: actualiza cantidad (si hay stock)
  └─ NO: crea nuevo item en carrito
  ↓
Muestra notificación
  ↓
Limpia searchTerm
  ↓
SaleCart se re-renderiza
```

### Flujo de Finalización de Venta
```
Usuario hace clic en "Finalizar Venta"
  ↓
Valida que carrito no esté vacío
  ↓
Prepara datos: { items: [{product_id, quantity}] }
  ↓
POST /sales/ al backend
  ↓
Backend guarda venta
  ↓
Muestra confirmación ✅
  ↓
Vacía carrito
  ↓
Redirige a /dashboard después de 2s
```

---

## 🔗 Rutas Agregadas

**Archivo**: `src/routes/index.tsx`

```typescript
<Route path="/sales" element={token ? <SaleForm /> : <Login />} />
```

**Protección**: Requiere token de autenticación

---

## 🎯 Modificaciones en ProductsList.tsx

### 1. Botón "Nueva Venta" en Header
```typescript
<button
  onClick={() => navigate("/sales")}
  className="... bg-gradient-to-r from-blue-500 to-cyan-600 ..."
>
  💰 Nueva Venta
</button>
```

### 2. Botón "Vender" en cada fila
```typescript
<button
  onClick={() => navigate("/sales")}
  className="... bg-blue-500/20 text-blue-300 ..."
>
  💰 Vender
</button>
```

### 3. Ruta actualizada para "Punto de Venta"
```typescript
"Punto de Venta": "/sales"  // Era "/punto-venta"
```

---

## 🌐 Llamadas API

### Obtener Productos
```
GET /products/
Respuesta: Product[]
```

**Modelo de Producto**:
```typescript
interface Product {
  id: number
  name: string
  price: number
  stock: number
}
```

### Crear Venta
```
POST /sales/
Body: {
  items: [
    { product_id: number, quantity: number }
  ]
}
Respuesta: {
  id: number
  total: number
  details: SaleDetail[]
}
```

---

## 📚 Dependencias

**Nuevas dependencias instaladas**:
- `lucide-react` - Iconos

**Dependencias existentes usadas**:
- `react` - Framework
- `react-router-dom` - Navegación
- `axios` - HTTP client
- `tailwindcss` - Estilos

---

## 🎨 Estilos y Clases

**Tailwind CSS Clases Utilizadas**:
- `grid` - Layout en grilla
- `flex` - Flexbox
- `rounded-lg` / `rounded-2xl` - Bordes redondeados
- `shadow` - Sombras
- `bg-blue-*` / `bg-red-*` / `bg-green-*` - Colores de fondo
- `text-*` - Colores de texto
- `hover:` - Efectos hover
- `disabled:` - Estados deshabilitados
- `focus:` - Estados focus
- `transition` - Animaciones

---

## 🔐 Autenticación

- Todas las rutas requieren token en localStorage
- Si no hay token, se redirige a login
- El token se usa en headers de API calls (implementado en ProductsList existente)

---

## 🚨 Validaciones

### En el Frontend
1. ✅ Carrito no vacío antes de finalizar
2. ✅ Cantidad <= stock disponible
3. ✅ Campo de búsqueda no vacío
4. ✅ Producto existe antes de agregar
5. ✅ Token de autenticación presente

### En el Backend
(Implementadas en backend, el frontend confía en ellas)
- Validación de usuario autenticado
- Validación de stock disponible
- Validación de producto existente
- Guardar venta y detalles

---

## 🔄 Estado Management

**Opción Actual**: React Hooks (useState, useEffect)

**Alternativas Futuras**:
- Redux Toolkit
- Context API
- Zustand
- Jotai

---

## 📱 Responsividad

- Grid layout de 1 columna en móvil
- 3 columnas en desktop (2 col búsqueda + 1 col carrito)
- Tablas con overflow horizontal
- Botones adaptables

---

## 🐛 Error Handling

**Notificaciones de Error**:
- "❌ Error al cargar los productos"
- "❌ No hay suficiente stock"
- "❌ El carrito está vacío"
- "❌ Error al realizar la venta"

**Gestión**:
- Try-catch en funciones async
- Mostrar alertas al usuario
- Mantener estado consistente

---

## ✅ Checklist de Verificación

- [x] Carpeta `/sales` creada
- [x] Componente `SaleForm.tsx` implementado
- [x] Componente `SaleCart.tsx` implementado
- [x] Ruta `/sales` agregada
- [x] Botón "Nueva Venta" en ProductsList
- [x] Botón "Vender" en cada producto
- [x] Menú actualizado para "Punto de Venta" → `/sales`
- [x] `lucide-react` instalado
- [x] Búsqueda de productos funcionando
- [x] Agregar al carrito funcionando
- [x] Cambio de cantidad funcionando
- [x] Eliminar del carrito funcionando
- [x] Cálculo de totales funcionando
- [x] Finalizar venta enviando datos al backend
- [x] Notificaciones visuales implementadas

---

## 🚀 Próximas Implementaciones Sugeridas

1. **Descuentos**
   - Descuento por producto
   - Descuento total
   - Códigos de promoción

2. **Métodos de Pago**
   - Efectivo
   - Tarjeta
   - Transferencia

3. **Clientes**
   - Seleccionar cliente
   - Crear cliente
   - Historial de cliente

4. **Facturas**
   - Generar PDF
   - Imprimir
   - Enviar por email

5. **Reportes**
   - Ventas por día/mes
   - Productos más vendidos
   - Ingresos totales

6. **Historial de Cambios**
   - Auditoría de cambios
   - Anular ventas
   - Cambios en cantidad

---

¡Sistema completamente funcional y listo para usar! 🎉
