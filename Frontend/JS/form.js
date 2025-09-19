const invoiceNumber = document.getElementById("invoiceNumber");
const invoiceDate = document.getElementById("invoiceDate");
const dueDate = document.getElementById("dueDate");
const currency = document.getElementById("currency");
const clientName = document.getElementById("clientName");
const clientCompany = document.getElementById("clientCompany");
const clientEmail = document.getElementById("clientEmail");
const clientPhone = document.getElementById("clientPhone");
const clientAddress = document.getElementById("clientAddress");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const taxRate = document.getElementById("taxRate");
const discount = document.getElementById("discount");
const subtotal = document.getElementById("subtotal");
const total = document.getElementById("total");
const paymentTerms = document.getElementById("paymentTerms");
const paymentMethod = document.getElementById("paymentMethod");
const notes = document.getElementById("notes");
const saveBtn = document.getElementById("saveBtn");

// Debug: check if any are null
console.log({
  invoiceNumber, invoiceDate, dueDate, currency,
  clientName, clientCompany, clientEmail, clientPhone, clientAddress,
  description, amount, taxRate, discount, subtotal, total,
  paymentTerms, paymentMethod, notes, saveBtn
});


document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('invoiceForm');
  const saveBtn = document.getElementById('saveInvoice');

  if (!form || !saveBtn) {
    console.error("Form or Save button not found in the DOM");
    return;
  }

  saveBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    // Build invoice object from form inputs
    const items = [];
    document.querySelectorAll('.invoice-item').forEach(itemRow => {
      const description = itemRow.querySelector('.item-description').value.trim();
      const quantity = parseFloat(itemRow.querySelector('.item-quantity').value);
      const price = parseFloat(itemRow.querySelector('.item-price').value);

      if (description && quantity && price >= 0) {
        items.push({ description, quantity, price });
      }
    });

    const invoice = {
      invoiceNumber: document.getElementById('invoiceNumber').value.trim(),
      clientName: document.getElementById('clientName').value.trim(),
      clientEmail: document.getElementById('clientEmail').value.trim(),
      items, // make sure items is an array of {description, quantity, price}
      tax: parseFloat(document.getElementById('taxRate').value) || 0,
      discount: parseFloat(document.getElementById('discount').value) || 0,
      status: document.getElementById('status')?.value || 'Pending', // optional
      currency: document.getElementById('currency').value || 'USD',
      dueDate: document.getElementById('dueDate').value || null,
      paymentMethod: document.getElementById('paymentMethod').value || 'N/A',
      notes: document.getElementById('notes').value || '',
      createdBy: document.getElementById('createdBy')?.value || 'N/A'
    };


    console.log("REQ BODY:", invoice);

    try {
      const res = await fetch('http://localhost:5000/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoice)
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("Save failed:", errData);
        alert('Save failed: ' + (errData.errors || errData.message || 'Unknown error'));
        return;
      }

      const data = await res.json();
      console.log("Invoice saved:", data);
      alert('Invoice saved successfully!');
      form.reset();
    } catch (err) {
      console.error("Fetch error:", err);
      alert('Save failed: Check console for details.');
    }
  });
});
