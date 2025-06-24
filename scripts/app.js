// Selección de elementos del DOM
const productForm = document.getElementById('product-form');
const productTable = document.getElementById('products-table');
const searchInput = document.getElementById('search');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const closeModal = document.querySelector('.close-modal');
const cancelBtn = document.getElementById('cancel-btn');
const addProductBtn = document.getElementById('add-product');
const notification = document.getElementById('notification');

// Estado inicial
let editingId = null;
let products = JSON.parse(localStorage.getItem('products')) || [];

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateStats();
});

// Event Listeners
addProductBtn.addEventListener('click', () => openModal('add'));
closeModal.addEventListener('click', () => closeModalHandler());
cancelBtn.addEventListener('click', () => closeModalHandler());
productForm.addEventListener('submit', handleFormSubmit);
searchInput.addEventListener('input', filterProducts);

// Renderizar tabla de productos
function renderProducts(productsToRender = products) {
  const tableBody = productTable.querySelector('tbody');
  tableBody.innerHTML = '';

  if (productsToRender.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5">No hay productos registrados</td></tr>';
    return;
  }

  productsToRender.forEach(product => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>$${product.price}</td>
      <td>${product.stock}</td>
      <td class="actions">
        <button class="btn-edit" data-id="${product.id}">Editar</button>
        <button class="btn-delete" data-id="${product.id}">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  // Agregar eventos a los botones dinámicos
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => openModal('edit', btn.dataset.id));
  });

  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => deleteProduct(btn.dataset.id));
  });
}

// Abrir modal (añadir/editar)
function openModal(action, id = null) {
  editingId = id;
  modal.style.display = 'block';

  if (action === 'add') {
    modalTitle.textContent = 'Añadir Producto';
    productForm.reset();
  } else {
    modalTitle.textContent = 'Editar Producto';
    const product = products.find(p => p.id == id);
    document.getElementById('name').value = product.name;
    document.getElementById('price').value = product.price;
    document.getElementById('stock').value = product.stock;
  }
}

// Cerrar modal
function closeModalHandler() {
  modal.style.display = 'none';
  editingId = null;
}

// Manejar envío del formulario
function handleFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(productForm);
  const productData = {
    id: editingId || generateId(),
    name: formData.get('name'),
    price: parseFloat(formData.get('price')),
    stock: parseInt(formData.get('stock'))
  };

  // Validación
  if (!productData.name || isNaN(productData.price) || isNaN(productData.stock)) {
    showNotification('Por favor complete todos los campos correctamente', 'error');
    return;
  }

  if (editingId) {
    // Editar producto existente
    products = products.map(p => p.id == editingId ? productData : p);
    showNotification('Producto actualizado correctamente', 'success');
  } else {
    // Añadir nuevo producto
    products.push(productData);
    showNotification('Producto añadido correctamente', 'success');
  }

  saveToLocalStorage();
  renderProducts();
  updateStats();
  closeModalHandler();
  productForm.reset();
}

// Generar ID único
function generateId() {
  return products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
}

// Eliminar producto
function deleteProduct(id) {
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    products = products.filter(p => p.id != id);
    saveToLocalStorage();
    renderProducts();
    updateStats();
    showNotification('Producto eliminado correctamente', 'success');
  }
}

// Filtrar productos
function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.id.toString().includes(searchTerm)
  );
  renderProducts(filteredProducts);
}

// Actualizar estadísticas
function updateStats() {
  document.getElementById('total-products').textContent = products.length;
  document.getElementById('daily-sales').textContent = calculateDailySales();
}

// Calcular ventas diarias (simulado)
function calculateDailySales() {
  return products.reduce((total, product) => total + (product.price * 2), 0);
}

// Guardar en LocalStorage
function saveToLocalStorage() {
  localStorage.setItem('products', JSON.stringify(products));
}

// Mostrar notificación
function showNotification(message, type) {
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.style.display = 'block';

  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}