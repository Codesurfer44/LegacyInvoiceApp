function calculateInvoiceTotal() {
  const itemsContainer = document.getElementById('itemsContainer');
  const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
  const discount = parseFloat(document.getElementById('discount').value) || 0;
  const totalField = document.getElementById('total');

  let subtotal = 0;

  itemsContainer.querySelectorAll('.invoice-item').forEach(item => {
    const quantity = parseFloat(item.querySelector('.item-quantity').value) || 0;
    const price = parseFloat(item.querySelector('.item-price').value) || 0;
    subtotal += quantity * price;
  });

  const discountAmount = subtotal * (discount / 100);
  const taxedAmount = (subtotal - discountAmount) * (taxRate / 100);
  const total = subtotal - discountAmount + taxedAmount;

  totalField.value = total.toFixed(2);
}

// Attach listeners for dynamic total calculation
function attachTotalListeners() {
  const itemsContainer = document.getElementById('itemsContainer');
  const taxRateField = document.getElementById('taxRate');
  const discountField = document.getElementById('discount');
  const addItemBtn = document.getElementById('addItemBtn');

  // Update total when tax or discount changes
  [taxRateField, discountField].forEach(field => {
    field.addEventListener('input', calculateInvoiceTotal);
  });

  // Update total when item quantity or price changes
  itemsContainer.addEventListener('input', e => {
    if (e.target.classList.contains('item-quantity') || e.target.classList.contains('item-price')) {
      calculateInvoiceTotal();
    }
  });

  // Recalculate total when new items are added
  addItemBtn.addEventListener('click', () => {
    setTimeout(calculateInvoiceTotal, 50); // small delay for DOM update
  });
}

// ----------------------
// DOM Ready
// ----------------------
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('invoiceForm');
  const saveBtn = document.getElementById('saveInvoice');
  const itemsContainer = document.getElementById('itemsContainer');

  if (!form || !saveBtn) return;

  attachTotalListeners();
  calculateInvoiceTotal(); // initial calculation

  // Add new item dynamically
  const addItemBtn = document.getElementById('addItemBtn');
  addItemBtn.addEventListener('click', e => {
    e.preventDefault();
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('invoice-item');
    itemDiv.innerHTML = `
      <input type="text" class="item-description" placeholder="Description" required>
      <input type="number" class="item-quantity" placeholder="Quantity" min="1" required>
      <input type="number" class="item-price" placeholder="Price" min="0" required>
      <button type="button" class="removeItemBtn">Remove</button>
    `;
    itemsContainer.appendChild(itemDiv);

    // Attach remove listener
    itemDiv.querySelector('.removeItemBtn').addEventListener('click', () => {
      itemDiv.remove();
      calculateInvoiceTotal();
    });
  });

  // Save invoice
  saveBtn.addEventListener('click', async e => {
    e.preventDefault();

    const items = [...itemsContainer.querySelectorAll('.invoice-item')].map(item => ({
      description: item.querySelector('.item-description').value.trim(),
      quantity: parseFloat(item.querySelector('.item-quantity').value) || 0,
      price: parseFloat(item.querySelector('.item-price').value) || 0
    })).filter(i => i.description && i.quantity && i.price >= 0);

    const invoice = {
      invoiceNumber: form.invoiceNumber.value.trim(),
      invoiceDate: form.invoiceDate.value || null,
      dueDate: form.dueDate.value || null,
      clientName: form.clientName.value.trim(),
      clientCompany: form.clientCompany?.value.trim() || '',
      clientEmail: form.clientEmail.value.trim(),
      clientPhone: form.clientPhone?.value.trim() || '',
      clientAddress: form.clientAddress?.value.trim() || '',
      items,
      tax: parseFloat(form.taxRate.value) || 0,
      discount: parseFloat(form.discount.value) || 0,
      status: form.status?.value || 'Pending',
      currency: form.currency.value || 'USD',
      paymentMethod: form.paymentMethod.value || 'N/A',
      paymentTerms: form.paymentTerms?.value || '',
      notes: form.notes?.value || '',
      createdBy: form.createdBy?.value || 'N/A'
    };

    try {
      const res = await fetch('http://localhost:5000/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoice)
      });

      if (!res.ok) {
        const errData = await res.json();
        alert('Save failed: ' + (errData.errors || errData.message || 'Unknown error'));
        return;
      }

      alert('Invoice saved successfully!');
      form.reset();
      calculateInvoiceTotal();
    } catch (err) {
      console.error(err);
      alert('Save failed: Check console for details.');
    }
  });
});