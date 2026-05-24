const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory data store
let productos = [
  { id: 1, nombre: 'Laptop', precio: 1200, stock: 10 },
  { id: 2, nombre: 'Mouse', precio: 25, stock: 50 },
  { id: 3, nombre: 'Teclado', precio: 45, stock: 30 },
];
let nextId = 4;

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// GET all products
app.get('/api/productos', (req, res) => {
  res.json({ success: true, data: productos, total: productos.length });
});

// GET product by ID
app.get('/api/productos/:id', (req, res) => {
  const producto = productos.find(p => p.id === parseInt(req.params.id));
  if (!producto) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
  res.json({ success: true, data: producto });
});

// POST create product
app.post('/api/productos', (req, res) => {
  const { nombre, precio, stock } = req.body;
  if (!nombre || !precio) {
    return res.status(400).json({ success: false, message: 'nombre y precio son requeridos' });
  }
  const nuevo = { id: nextId++, nombre, precio, stock: stock || 0 };
  productos.push(nuevo);
  res.status(201).json({ success: true, data: nuevo });
});

// PUT update product
app.put('/api/productos/:id', (req, res) => {
  const idx = productos.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
  productos[idx] = { ...productos[idx], ...req.body, id: productos[idx].id };
  res.json({ success: true, data: productos[idx] });
});

// DELETE product
app.delete('/api/productos/:id', (req, res) => {
  const idx = productos.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
  productos.splice(idx, 1);
  res.json({ success: true, message: 'Producto eliminado correctamente' });
});

app.listen(PORT, () => {
  console.log(`API REST ejecutándose en puerto ${PORT}`);
});

module.exports = app;
