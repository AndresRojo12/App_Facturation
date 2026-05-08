# 🖥️ Vista Previa de Pantallas - Sistema de Ventas

## 📱 Pantalla 1: ProductsList con Botones de Venta

```
┌──────────────────────────────────────────────────────────────────┐
│  💼 Facturación Pro                    🔍 Buscar...  💰 Nueva    ➕│
│                                                      Venta  Producto│
├──────────────────────────────────────────────────────────────────┤
│ Gestión                                                           │
│ Productos                                                         │
│ Administra tu catálogo de productos, precios e inventario.       │
├────────────────────────────────────────────────────────────────│
│  ID │ Nombre           │ Precio  │ Stock │ Estado         │ Acción  │
├────────────────────────────────────────────────────────────────│
│  1  │ Arroz Blanco     │ $2.50   │ 50    │ ● Activo       │ 💰      │
│     │                  │         │       │                │ ✏️ 🗑️   │
├────┼──────────────────┼─────────┼───────┼────────────────┼──────┤
│  2  │ Azúcar Premium   │ $1.50   │ 30    │ ● Activo       │ 💰      │
│     │                  │         │       │                │ ✏️ 🗑️   │
├────┼──────────────────┼─────────┼───────┼────────────────┼──────┤
│  3  │ Harina 5kg       │ $3.00   │ 15    │ ⚠️ Bajo stock  │ 💰      │
│     │                  │         │       │                │ ✏️ 🗑️   │
└────────────────────────────────────────────────────────────────┘
   Productos mostrados: 3 / 3          [← Anterior]  [Siguiente →]
```

---

## 💰 Pantalla 2: SaleForm - Búsqueda y Carrito

```
┌────────────────────────────────────────────────────────────────────┐
│  Nueva Venta                                                       │
│  Busca productos y agrega cantidades para crear una venta          │
├────────────────────────────────────────────────────────────────────┤
│
│  ┌─────────────────────────────────────────────────┐              │
│  │  Buscar Productos                               │              │
│  │  🔍 Busca por nombre (ej: arroz, azúcar, etc.)  │              │
│  │                                                 │              │
│  │  Resultados:                                    │ RESUMEN      │
│  │  ┌──────────────────────────────┐               │ DE VENTA     │
│  │  │ Arroz Blanco Premium         │               │              │
│  │  │ Stock: 50 | $2.50            │               │ [Vacío]      │
│  │  │            [Agregar]         │               │              │
│  │  └──────────────────────────────┘               │              │
│  │  ┌──────────────────────────────┐               │              │
│  │  │ Arroz Integral Orgánico      │               │              │
│  │  │ Stock: 25 | $3.50            │               │              │
│  │  │            [Agregar]         │               │              │
│  │  └──────────────────────────────┘               │              │
│  │                                                 │              │
│  └─────────────────────────────────────────────────┘              │
│
└────────────────────────────────────────────────────────────────────┘
```

---

## 🛒 Pantalla 3: Con Productos Agregados al Carrito

```
┌────────────────────────────────────────────────────────────────────┐
│  Nueva Venta                                                       │
├────────────────────────────────────────────────────────────────────┤
│
│  Buscar Productos              │    RESUMEN DE VENTA              │
│  ┌──────────────────┐          │    ┌───────────────────────────┐ │
│  │🔍 Busca por...   │          │    │ Producto | Prec | Cant | │ │
│  └──────────────────┘          │    │──────────────────────────│ │
│                                │    │ Arroz      2.50 × 4      │ │
│  Resultados:                   │    │ [−] 4 [+]       Subtotal│ │
│  ┌──────────────────┐          │    │                  $10.00 │ │
│  │ Azúcar Premium   │          │    │                    [🗑️] │ │
│  │ S: 30 | $1.50    │          │    │──────────────────────────│ │
│  │  [Agregar]       │          │    │ Azúcar     1.50 × 2      │ │
│  └──────────────────┘          │    │ [−] 2 [+]       Subtotal│ │
│                                │    │                   $3.00 │ │
│  ┌──────────────────┐          │    │                    [🗑️] │ │
│  │ Harina 5kg       │          │    │──────────────────────────│ │
│  │ S: 15 | $3.00    │          │    │     Total: $13.00        │ │
│  │  [Agregar]       │          │    │  [Finalizar Venta]       │ │
│  └──────────────────┘          │    └───────────────────────────┘ │
│                                │                                  │
└────────────────────────────────────────────────────────────────────┘
```

---

## ✅ Pantalla 4: Confirmación de Venta

```
┌────────────────────────────────────────────────────────────────────┐
│  ✅ Venta realizada exitosamente                                   │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  El sistema está redirigiendo al Dashboard...                      │
│                                                                    │
│  📊 Resumen de tu venta:                                           │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ Total vendido: $13.00                                        │ │
│  │ Productos: 2                                                 │ │
│  │ Horario: 08/05/2026 - 14:30                                 │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Te redirigiremos en 2 segundos...                                │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Colores y Elementos Visuales

### Botones
```
┌─────────────────────┐
│ 💰 Nueva Venta      │  ← Azul (Primario)
└─────────────────────┘

┌─────────────────────┐
│ Finalizar Venta     │  ← Azul Oscuro (Acción Principal)
└─────────────────────┘

┌─────────────────────┐
│ ➕ Crear Producto   │  ← Verde (Secundario)
└─────────────────────┘

┌─────────────────────┐
│ [−]   4   [+]       │  ← Grises (Controles)
└─────────────────────┘

┌─────────────────────┐
│ 🗑️ Eliminar        │  ← Rojo (Peligro)
└─────────────────────┘
```

### Notificaciones
```
┌────────────────────────────────────────────┐
│ ✅ Arroz agregado al carrito              │  ← Verde (Éxito)
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ ❌ No hay suficiente stock                 │  ← Rojo (Error)
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ ℹ️  Arroz eliminado del carrito           │  ← Azul (Info)
└────────────────────────────────────────────┘
```

---

## 📊 Tabla del Carrito - Detalles

```
┌──────────────┬───────┬──────────┬──────────┬──────────┐
│   Producto   │ Precio│ Cantidad │ Subtotal │ Acciones │
├──────────────┼───────┼──────────┼──────────┼──────────┤
│ Arroz Blanco │ $2.50 │  [−] 4 [+] │ $10.00  │    🗑️   │
├──────────────┼───────┼──────────┼──────────┼──────────┤
│ Azúcar Prem  │ $1.50 │  [−] 2 [+] │  $3.00  │    🗑️   │
├──────────────┼───────┼──────────┼──────────┼──────────┤
│              │       │          │ TOTAL:   │ $13.00   │
└──────────────┴───────┴──────────┴──────────┴──────────┘
```

---

## 🔍 Búsqueda - Estados

### Estado 1: Búsqueda Vacía
```
┌─────────────────────────────────┐
│ 🔍 Busca por nombre del produc...│
│                                 │
│ (Sin resultados mostrados)       │
└─────────────────────────────────┘
```

### Estado 2: Escribiendo
```
┌─────────────────────────────────┐
│ 🔍 Busca por nombre del produc...│
│    "arr"                         │
│                                 │
│ Resultados encontrados:         │
│ • Arroz Blanco                  │
│ • Arroz Integral                │
└─────────────────────────────────┘
```

### Estado 3: Sin Resultados
```
┌─────────────────────────────────┐
│ 🔍 Busca por nombre del produc...│
│    "xxxxxx"                      │
│                                 │
│ No se encontraron productos    │
└─────────────────────────────────┘
```

---

## 📱 Versión Móvil (Stack Vertical)

```
┌──────────────────────────┐
│  Nueva Venta             │
├──────────────────────────┤
│ Buscar Productos         │
│ ┌────────────────────┐   │
│ │🔍 Busca por...     │   │
│ └────────────────────┘   │
│                          │
│ ┌────────────────────┐   │
│ │ Arroz Blanco       │   │
│ │ $2.50   [Agregar]  │   │
│ └────────────────────┘   │
├──────────────────────────┤
│ RESUMEN DE VENTA         │
│ ┌────────────────────┐   │
│ │ Arroz      $ 10.00 │   │
│ │ Azúcar     $ 3.00  │   │
│ ├────────────────────┤   │
│ │ Total:     $ 13.00 │   │
│ │[Finalizar Venta]   │   │
│ └────────────────────┘   │
└──────────────────────────┘
```

---

## 🎯 Transiciones y Animaciones

### Hover en Botón de Agregar
```
SIN HOVER              CON HOVER
┌─────────────┐        ┌─────────────┐
│   Agregar   │   →    │   Agregar   │  (brillo aumentado)
└─────────────┘        └─────────────┘
```

### Agregar Producto al Carrito
```
1. Usuario hace clic
   ↓
2. Notificación aparece con transición fade-in
   ↓
3. Carrito se actualiza suavemente
   ↓
4. Notificación desaparece después de 4 segundos
```

---

## 📋 Flujo Completo Visual

```
┌─────────────┐
│  Dashboard  │
└──────┬──────┘
       │
       ↓
┌─────────────────────┐      ┌──────────────┐
│  ProductsList       │  OR  │ Menú Lateral │
│ • Nueva Venta       │      │ • Punto de   │
│ • Vender (x prod)   │      │   Venta      │
└──────┬──────────────┘      └────────┬─────┘
       │                              │
       └──────────────────────────────┘
                  ↓
       ┌──────────────────────┐
       │    SaleForm.tsx      │
       │  • Buscar producto   │
       │  • Agregar carrito   │
       │  • Ver total         │
       └──────────┬───────────┘
                  │
          ┌───────┴───────┐
          ↓               ↓
    ┌─────────────┐  ┌──────────┐
    │ Finalizar   │  │ Cancelar │
    │   Venta     │  │ Venta    │
    └──────┬──────┘  └────┬─────┘
           │              │
           ↓              ↓
     ┌───────────┐  ┌──────────┐
     │ Backend   │  │ Dashboard│
     │ Guardar   │  │ Sin      │
     │ Venta     │  │ cambios  │
     └─────┬─────┘  └──────────┘
           │
           ↓
     ┌──────────────┐
     │ Dashboard    │
     │ Venta        │
     │ Completada   │
     └──────────────┘
```

---

## 🎭 Estados de la UI

### Carrito Vacío
```
┌────────────────────────────┐
│  RESUMEN DE VENTA          │
├────────────────────────────┤
│                            │
│ Agrega productos para      │
│ comenzar una venta         │
│                            │
└────────────────────────────┘
```

### Carrito Lleno
```
┌────────────────────────────┐
│  RESUMEN DE VENTA          │
├────────────────────────────┤
│ Producto1  $10.00          │
│ Producto2  $ 3.00          │
├────────────────────────────┤
│ Total: $13.00              │
│ [Finalizar Venta]          │
└────────────────────────────┘
```

### Procesando Venta
```
┌────────────────────────────┐
│  Procesando venta...       │
│                            │
│ ⏳ Por favor espera         │
│                            │
└────────────────────────────┘
```

---

¡Así se verá tu sistema de ventas! 🎨✨
