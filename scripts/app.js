import { products, dailySales } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
  // Actualizar estadísticas
  document.getElementById('total-products').textContent = products.length;
  document.getElementById('daily-sales').textContent = dailySales;

  // Renderizar tabla de productos
  const tableBody = document.querySelector('#products-table tbody');
  products.forEach(product => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>$${product.price}</td>
      <td>${product.stock}</td>
      <td>
        <button class="btn-edit">Editar</button>
        <button class="btn-delete">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  // Botón "Añadir Producto"
  document.getElementById('add-product').addEventListener('click', () => {
    alert('Funcionalidad de añadir producto (simulada)');
  });
});