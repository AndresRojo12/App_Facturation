# ⚡ Quick Start - Comienza en 30 segundos

## 🚀 Para Empezar Ahora

### Paso 1: Asegúrate de que el Backend está corriendo
```bash
cd /home/andres/Documentos/App_Facturación/facturation
python -m uvicorn main:app --reload --port 8000
```

### Paso 2: Ejecuta el Frontend
```bash
cd /home/andres/Documentos/App_Facturación/frontend/facturation_frontend
npm run dev
# http://localhost:5173
```

### Paso 3: Inicia Sesión
```
1. Abre http://localhost:5173
2. Usa tus credenciales
3. ¡Listo!
```

---

## 💰 Haz tu Primera Venta en 5 Pasos

### 1️⃣ Ir a Nueva Venta
```
Opción A: Haz clic en "💰 Nueva Venta" en ProductsList
Opción B: Haz clic en "Punto de Venta" en el menú
Opción C: Haz clic en "💰 Vender" en cualquier producto
```

### 2️⃣ Buscar Producto
```
- Escribe el nombre del producto (ej: "arroz")
- Los resultados aparecen automáticamente
```

### 3️⃣ Agregar al Carrito
```
- Haz clic en "Agregar"
- El producto aparece en la derecha
- Recibirás una confirmación ✅
```

### 4️⃣ Ajustar Cantidad
```
- Usa los botones [−] y [+]
- El total se actualiza automáticamente
- Puedes agregar más productos
```

### 5️⃣ Finalizar Venta
```
- Haz clic en "Finalizar Venta" (botón azul)
- Se guarda en el backend
- Serás redirigido al Dashboard
```

---

## 🆘 Problemas Comunes

### ❌ "El botón no funciona"
```
→ Recarga la página (F5)
→ Verifica que esté autenticado
```

### ❌ "No aparecen productos"
```
→ Verifica que haya productos en la base de datos
→ Los productos deben tener stock > 0
→ Prueba escribiendo un término más general
```

### ❌ "No puedo finalizar"
```
→ Verifica que el carrito tenga al menos 1 producto
→ Verifica tu conexión a internet
→ Recarga la página
```

### ❌ "El backend no responde"
```
→ Verifica que el servidor esté corriendo
→ Comprueba que sea en puerto 8000
→ Revisa los logs del terminal
```

---

## 📋 Archivos Importantes

| Archivo | Ubicación | Propósito |
|---------|-----------|----------|
| SaleForm.tsx | `/pages/sales/` | Lógica de venta |
| SaleCart.tsx | `/pages/sales/components/` | Carrito |
| ProductsList.tsx | `/pages/products/` | Botones de venta |
| routes/index.tsx | `/routes/` | Ruta /sales |

---

## 🎯 Lo que Funciona

✅ Búsqueda de productos  
✅ Agregar al carrito  
✅ Cambiar cantidad  
✅ Eliminar productos  
✅ Cálculo automático de totales  
✅ Validación de stock  
✅ Procesar venta  
✅ Guardar en base de datos  
✅ Notificaciones visuales  

---

## 📊 Estructura Creada

```
sales/                        ← NUEVA CARPETA
├── SaleForm.tsx             ← Componente principal
├── index.ts                 ← Exportaciones
└── components/
    └── SaleCart.tsx         ← Carrito de venta
```

---

## 🔗 Rutas Disponibles

- `/sales` - Página de venta (NUEVA)
- `/products` - Lista de productos (MODIFICADA)
- `/dashboard` - Dashboard
- `/` - Login

---

## 💡 Tips Rápidos

1. **Búsqueda rápida**: Escribe la primera letra del producto
2. **Cantidad de 1**: Cada producto inicia con cantidad 1
3. **Eliminar**: Usa el botón 🗑️ en el carrito
4. **Cambiar cantidad**: Usa los botones ± en el carrito
5. **Vaciar búsqueda**: Borra el texto para limpiar resultados

---

## 📱 Funciona en

- ✅ Desktop
- ✅ Tablet
- ✅ Móvil

---

## 🎓 Documentación Completa

Para más información, lee:
- **GUIA_USO.md** - Tutorial completo paso a paso
- **DOCUMENTACION_TECNICA.md** - Detalles técnicos
- **VISTA_PREVIA_PANTALLAS.md** - Diseño visual
- **SALES_FLOW.md** - Descripción del flujo
- **ESTRUCTURA_FINAL.md** - Estructura del proyecto

---

## ✨ ¡Listo!

**Ya tienes un sistema completo de ventas funcionando.** 

Ahora:
1. Ejecuta el backend ✅
2. Ejecuta el frontend ✅
3. Inicia sesión ✅
4. ¡Haz tu primera venta! 💰

---

## 🚀 Próximos Pasos (Opcional)

1. Agregar descuentos
2. Métodos de pago
3. Generar facturas PDF
4. Historial de ventas
5. Reportes

---

**¡Felicidades! 🎉**

Tu sistema de ventas está listo para usar.

¿Dudas? Consulta la documentación completa en los archivos .md
