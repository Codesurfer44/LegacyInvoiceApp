/*
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    console.error("No invoice ID provided in URL.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/invoices/${id}`);
    const invoice = await res.json();

    if (invoice.success && invoice.data) {
      const data = invoice.data;

      document.getElementById('invoiceNumber').textContent = data.invoiceNumber || "N/A";
      document.getElementById('clientName').textContent = data.clientName || "N/A";
      document.getElementById('clientEmail').textContent = data.clientEmail || "N/A";
      document.getElementById('status').textContent = data.status || "Pending";
      document.getElementById('total').textContent = `${data.total || 0} ${data.currency || ""}`;

      // populate items
      const itemsList = document.getElementById('itemsList');
      itemsList.innerHTML = "";
      if (data.items && data.items.length > 0) {
        data.items.forEach(it => {
          const li = document.createElement('li');
          li.textContent = `${it.description} - ${it.quantity} × ${it.price}`;
          itemsList.appendChild(li);
        });
      } else {
        const li = document.createElement('li');
        li.textContent = "No items found.";
        itemsList.appendChild(li);
      }
    } else {
      console.error("Invoice not found:", invoice);
    }
  } catch (err) {
    console.error("Failed to fetch invoice details:", err);
  }
});
*/

// Frontend/js/invoiceDetails.js

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    console.error("No invoice ID provided in URL.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/invoices/${id}`);
    const invoice = await res.json();

    if (!invoice.success || !invoice.data) {
      console.error("Invoice not found:", invoice);
      return;
    }

    const data = invoice.data;

    // Helper function to set text and class for status
    const setStatus = (el, status) => {
      el.textContent = status || "Pending";
      el.className = `status ${status || "Pending"}`;
    };

    // Populate invoice details
    document.getElementById('invoiceNumber').textContent = data.invoiceNumber || "N/A";
    document.getElementById('invoiceDate').textContent = data.invoiceDate || "N/A";
    document.getElementById('dueDate').textContent = data.dueDate || "N/A";
    document.getElementById('clientName').textContent = data.clientName || "N/A";
    document.getElementById('clientCompany').textContent = data.clientCompany || "N/A";
    document.getElementById('clientEmail').textContent = data.clientEmail || "N/A";
    document.getElementById('clientPhone').textContent = data.clientPhone || "N/A";
    document.getElementById('clientAddress').textContent = data.clientAddress || "N/A";
    document.getElementById('description').textContent = data.description || "N/A";
    document.getElementById('amount').textContent = `${data.amount || 0} ${data.currency || ""}`;
    document.getElementById('taxRate').textContent = `${data.taxRate || 0}%`;
    document.getElementById('discount').textContent = `${data.discount || 0}%`;
    document.getElementById('subtotal').textContent = `${data.subtotal || 0} ${data.currency || ""}`;
    document.getElementById('paymentTerms').textContent = data.paymentTerms || "N/A";
    document.getElementById('paymentMethod').textContent = data.paymentMethod || "N/A";
    document.getElementById('currency').textContent = data.currency || "N/A";
    document.getElementById('total').textContent = `${data.total || 0} ${data.currency || ""}`;

    // Set status with proper class
    const statusEl = document.getElementById('status');
    setStatus(statusEl, data.status);

    // Populate items
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = "";
    if (data.items && data.items.length > 0) {
      data.items.forEach(it => {
        const li = document.createElement('li');
        li.textContent = `${it.description} - ${it.quantity} × ${it.price}`;
        itemsList.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.textContent = "No items found.";
      itemsList.appendChild(li);
    }

  } catch (err) {
    console.error("Failed to fetch invoice details:", err);
  }
});