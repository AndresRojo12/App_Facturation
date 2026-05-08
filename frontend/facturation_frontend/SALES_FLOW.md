# Flujo de Venta de Productos - Documentación

## 📋 Estructura Creada

```
frontend/facturation_frontend/src/pages/sales/
├── SaleForm.tsx              # Componente principal del formulario de venta
├── components/
│   └── SaleCart.tsx         # Componente que muestra el carrito/resumen
└── index.ts                 # Exportaciones
```

## 🎯 Características del Flujo de Venta

### 1. **Página de Venta** (`SaleForm.tsx`)
   - **Búsqueda de Productos**: Campo de búsqueda en tiempo real
   - **Filtrado Automático**: Filtra por nombre del producto
   - **Validación de Stock**: Muestra solo productos con stock disponible
   - **Alertas Visuales**: Notificaciones de éxito, error e información

### 2. **Carrito de Venta** (`SaleCart.tsx`)
   - **Tabla de Productos**: Muestra todos los productos agregados
   - **Gestión de Cantidad**:
     - Botón (+) para aumentar cantidad
     - Botón (-) para disminuir cantidad
     - Validación de stock disponible
   - **Cálculo de Subtotal**: Por cada producto (cantidad × precio)
   - **Total Dinámico**: Suma total de todos los subtotales
   - **Botón de Eliminar**: Quitar productos del carrito
   - **Botón Finalizar Venta**: Procesa la venta al backend

## 🔄 Flujo de Operación

### Paso 1: Acceder a Nueva Venta
   - Desde **ProductsList**: Haz clic en el botón **"💰 Nueva Venta"** en la barra superior
   - O desde el menú lateral: Haz clic en **"Punto de Venta"**
   - O desde cada producto: Haz clic en el botón **"💰 Vender"**

### Paso 2: Buscar Productos
   - Ingresa el nombre del producto en el buscador
   - Ejemplo: "arroz", "azúcar", "harina"
   - Los resultados se filtran automáticamente

### Paso 3: Agregar al Carrito
   - Haz clic en el botón **"Agregar"** junto al producto
   - El producto aparece automáticamente en el carrito a la derecha
   - Recibirás una notificación de confirmación

### Paso 4: Ajustar Cantidad
   - En el carrito, usa los botones **+** y **-** para cambiar cantidad
   - Si intentas agregar más de lo disponible en stock, recibirás una alerta
   - El subtotal se actualiza automáticamente

### Paso 5: Ver Total
   - El **total de la venta** se actualiza en tiempo real
   - Se muestra en grande en la sección derecha

### Paso 6: Finalizar Venta
   - Haz clic en el botón **"Finalizar Venta"** (azul)
   - Se envía la venta al backend
   - Se guarda en la base de datos
   - Se redirige al Dashboard automáticamente

## 📊 Estructura de Datos Enviados al Backend

```javascript
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 3,
      "quantity": 1
    }
  ]
}
```

## 🎨 Interfaz Visual

### Colores Utilizados
- **Azul**: Botones de venta y acciones principales
- **Rojo**: Botones de eliminar
- **Verde**: Confirmar acciones
- **Gris**: Deshabilitado o inactivo

### Notificaciones
- ✅ **Verde**: Venta exitosa
- ❌ **Rojo**: Error en la operación
- ℹ️ **Azul**: Información importante

## 🔗 Rutas Disponibles

- `/sales` - Página principal de ventas (SaleForm)
- `/products` - Lista de productos (ProductsList)
- `/dashboard` - Dashboard principal

## ⚙️ Configuración Requerida

### Dependencias Instaladas
- `lucide-react` - Iconos
- `axios` - Llamadas HTTP
- `react-router-dom` - Enrutamiento

### Variables de Entorno
- `VITE_BASE_URL` - URL base del backend

## 💡 Notas Importantes

1. **Stock en Tiempo Real**: El sistema valida el stock disponible
2. **Usuario Autenticado**: Solo usuarios autenticados pueden hacer ventas
3. **Persistencia**: Las ventas se guardan inmediatamente en el backend
4. **Historial**: Puedes ver el historial en las facturas

## 🚀 Próximas Mejoras Sugeridas

1. Agregar historial de ventas recientes
2. Permitir descuentos por producto o total
3. Agregar métodos de pago
4. Permitir generar facturas PDF
5. Agregar clientes a las ventas
6. Historial de cambios de cantidad
