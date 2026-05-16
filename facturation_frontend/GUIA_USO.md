# 📚 Guía de Uso - Sistema de Venta de Productos

## 🚀 Cómo Iniciar una Venta

### Opción 1: Desde la Lista de Productos
```
1. Ve a "Productos" en el menú lateral
2. Haz clic en el botón azul "💰 Nueva Venta" en la esquina superior derecha
3. Serás redirigido a la página de ventas
```

### Opción 2: Desde el Menú de Navegación
```
1. Haz clic en "Punto de Venta" en el menú lateral
2. Automáticamente irás a la página de ventas
```

### Opción 3: Desde Cada Producto
```
1. En la tabla de productos, haz clic en el botón "💰 Vender" en la fila del producto
2. Serás redirigido a la página de ventas
```

---

## 💡 Ejemplo Práctico: Hacer una Venta de "Arroz"

### Paso 1: Buscar el Producto
```
Campo: 🔍 Buscar Productos
Acción: Escribe "arroz"
Resultado: Se mostrarán solo productos que contengan "arroz" en su nombre
```

### Paso 2: Ver Resultados
```
Se mostrará una lista con:
┌─────────────────────────────────────┐
│ Arroz Blanco Premium                │
│ Stock: 50 | $2.50                   │
│ [Agregar]                           │
└─────────────────────────────────────┘
```

### Paso 3: Agregar al Carrito
```
Acción: Haz clic en el botón [Agregar]
Notificación: "✅ Arroz Blanco Premium agregado al carrito"
Carrito se actualiza:
┌────────────────────────────────────────────┐
│ RESUMEN DE VENTA                           │
├────────────────────────────────────────────┤
│ Producto: Arroz Blanco Premium             │
│ Precio: $2.50                              │
│ Cantidad: 1  [−]  [+]                      │
│ Subtotal: $2.50                    [🗑️]   │
├────────────────────────────────────────────┤
│ Total: $2.50                                │
│ [Finalizar Venta]                          │
└────────────────────────────────────────────┘
```

### Paso 4: Ajustar Cantidad
```
Acción: Haz clic en el botón [+] tres veces
Resultado:
- Cantidad aumenta de 1 a 4
- Subtotal cambia a $10.00 (4 × $2.50)
- Total se actualiza a $10.00
```

### Paso 5: Agregar Otro Producto
```
Campo: Vacía la búsqueda anterior
Acción: Escribe "azúcar"
Resultado: Se mostrarán productos de azúcar
Acción: Haz clic en [Agregar] en "Azúcar Premium"
```

### Paso 6: Ver el Carrito Actualizado
```
Carrito muestra:
┌────────────────────────────────────────────┐
│ RESUMEN DE VENTA                           │
├────────────────────────────────────────────┤
│ Arroz Blanco Premium    $2.50 × 4 = $10.00│
│ Azúcar Premium          $1.50 × 2 = $3.00 │
├────────────────────────────────────────────┤
│ Total: $13.00                              │
│ [Finalizar Venta]                          │
└────────────────────────────────────────────┘
```

### Paso 7: Finalizar la Venta
```
Acción: Haz clic en el botón azul [Finalizar Venta]
Proceso:
1. Se valida que el carrito no esté vacío
2. Se envían los datos al backend
3. El backend guarda la venta en la base de datos
4. Se muestra "✅ Venta realizada exitosamente"
5. El carrito se vacía
6. Después de 2 segundos, se redirige al Dashboard
```

---

## 🎯 Funcionalidades Especiales

### ❌ Eliminar un Producto
```
En el carrito, haz clic en el ícono 🗑️ junto al producto
Resultado: El producto se elimina del carrito
Notificación: "ℹ️ [Nombre del producto] eliminado del carrito"
```

### 📈 Aumentar Cantidad
```
Haz clic en el botón [+]
- Se aumenta la cantidad en 1
- Se recalcula automáticamente el subtotal
- Se actualiza el total
```

### 📉 Disminuir Cantidad
```
Haz clic en el botón [−]
- Se disminuye la cantidad en 1
- Si la cantidad llega a 0, se elimina el producto
- Se recalcula automáticamente el subtotal
- Se actualiza el total
```

---

## ⚠️ Validaciones Importantes

### 1. Stock Insuficiente
```
Error: Intentas agregar más unidades de lo disponible
Notificación: "❌ No hay suficiente stock"
Acción: Reduce la cantidad a lo disponible
```

### 2. Producto Agotado
```
Estado: Stock = 0
Resultado: El botón [Agregar] está deshabilitado
Notificación: El producto no aparece en los resultados
```

### 3. Carrito Vacío
```
Acción: Intentas finalizar venta sin productos
Notificación: "❌ El carrito está vacío"
Resultado: No se procesa la venta
```

---

## 📊 Datos que se Guardan en el Backend

Cuando finalizas una venta, se guardan:

```json
{
  "user_id": 1,
  "total": 13.00,
  "created_at": "2026-05-08T10:30:00Z",
  "details": [
    {
      "product_id": 1,
      "quantity": 4,
      "price": 2.50,
      "subtotal": 10.00
    },
    {
      "product_id": 2,
      "quantity": 2,
      "price": 1.50,
      "subtotal": 3.00
    }
  ]
}
```

---

## 🎨 Interfaz Visual

### Colores y Significados
- 🔵 **Azul**: Acciones principales (Nueva Venta, Finalizar)
- 🟢 **Verde**: Confirmaciones y éxitos
- 🔴 **Rojo**: Errores y eliminar
- ⚪ **Gris**: Deshabilitado o inactivo

### Notificaciones
```
✅ Verde  → Acción exitosa (producto agregado, venta realizada)
❌ Rojo   → Error (stock insuficiente, venta no realizada)
ℹ️  Azul  → Información (producto eliminado del carrito)
```

---

## 🔧 Troubleshooting

### Problema: El botón "Nueva Venta" no funciona
**Solución**: Recarga la página y verifica que estés autenticado

### Problema: Los productos no aparecen en la búsqueda
**Solución**: 
1. Verifica que haya productos en el sistema
2. Comprueba que el stock sea mayor a 0
3. Intenta buscar con un término más general

### Problema: No puedo finalizar la venta
**Solución**:
1. Verifica que haya al menos un producto en el carrito
2. Comprueba tu conexión a internet
3. Intenta recargar la página

### Problema: La cantidad no aumenta
**Solución**: Probablemente alcanzaste el límite de stock disponible

---

## ✨ Tips y Trucos

1. **Búsqueda Rápida**: Escribe solo la primera letra del producto
2. **Múltiples Productos**: Puedes agregar varios productos a la misma venta
3. **Cambio de Cantidad**: Usa los botones [±] para ajustar sin eliminar
4. **Búsqueda Vacía**: Borra el texto de búsqueda para limpiar los resultados
5. **Stock en Tiempo Real**: El sistema valida el stock antes de guardar

---

¡Listo! Ya estás preparado para usar el sistema de ventas. 🎉
