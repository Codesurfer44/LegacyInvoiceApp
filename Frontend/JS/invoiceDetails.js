document.addEventListener("DOMContentLoaded", async () => {
  const detailsDiv = document.getElementById("invoiceDetails");
  const params = new URLSearchParams(window.location.search);
  const invoiceId = params.get('id');

  if (!invoiceId) {
    detailsDiv.innerHTML = '<p class="error">No invoice ID provided</p>';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/invoices/${invoiceId}`);
    if (response.status === 404) {
      detailsDiv.innerHTML = '<p class="error">Invoice not found. It may have been deleted.</p>';
      return;
    }
    if (!response.ok) throw new Error(`Server error: ${response.status}`);

    const invoice = await response.json();

    detailsDiv.innerHTML = `
      <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber || 'N/A'}</p>
      <p><strong>Client Name:</strong> ${invoice.clientName || 'N/A'}</p>
      <p><strong>Client Email:</strong> ${invoice.clientEmail || 'N/A'}</p>
      <p><strong>Invoice Date:</strong> ${invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString() : 'N/A'}</p>
      <p><strong>Due Date:</strong> ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}</p>
      <p><strong>Amount:</strong> ${invoice.currency || ''} ${invoice.amount || 0}</p>
      <p><strong>Status:</strong> ${invoice.status || 'Pending'}</p>
      <p><strong>Description:</strong> ${invoice.description || 'None'}</p>
      <p><strong>Tax:</strong> ${invoice.tax || 0}</p>
      <p><strong>Discount:</strong> ${invoice.discount || 0}</p>
      <p><strong>Subtotal:</strong> ${invoice.subtotal || 0}</p>
      <p><strong>Total:</strong> ${invoice.total || 0}</p>
      <p><strong>Payment Method:</strong> ${invoice.paymentMethod || 'N/A'}</p>
      <p><strong>Notes:</strong> ${invoice.notes || 'None'}</p>
      <p><strong>Created By:</strong> ${invoice.createdBy || 'N/A'}</p>
      <p><strong>Created At:</strong> ${invoice.createdAt ? new Date(invoice.createdAt).toLocaleString() : 'N/A'}</p>
    `;
  } catch (err) {
    console.error("Failed to fetch invoice details:", err);
    detailsDiv.innerHTML = `<p class="error">Error: ${err.message}</p>`;
  }
});