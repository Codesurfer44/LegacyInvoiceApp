document.addEventListener("DOMContentLoaded", async () => {
  const detailsDiv = document.getElementById("invoiceDetails");
  const statusDiv = document.getElementById("status");

  // Get invoice ID from URL
  const params = new URLSearchParams(window.location.search);
  const invoiceId = params.get('id');

  if (!invoiceId) {
    detailsDiv.innerHTML = '<p class="error">No invoice ID provided</p>';
    return;
  }

  try {
    console.log("Fetching invoice details for ID:", invoiceId);
    const response = await fetch(`http://localhost:3000/api/invoices/${invoiceId}`);
    
    if (response.status === 404) {
      detailsDiv.innerHTML = '<p class="error">Invoice not found. It may have been deleted.</p>';
      return;
    }
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    
    const invoice = await response.json();
    console.log("Received invoice data:", invoice);

    if (!invoice) {
      throw new Error('No invoice data received');
    }

    detailsDiv.innerHTML = `
      <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber || 'N/A'}</p>
      <p><strong>Client:</strong> ${invoice.clientName || 'N/A'}</p>
      <p><strong>Email:</strong> ${invoice.clientEmail || 'N/A'}</p>
      <p><strong>Date:</strong> ${invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString() : 'N/A'}</p>
      <p><strong>Due Date:</strong> ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}</p>
      <p><strong>Amount:</strong> ${invoice.currency || ''} ${invoice.amount || 'N/A'}</p>
      <p><strong>Status:</strong> ${invoice.status || 'Pending'}</p>
      <p><strong>Description:</strong></p>
      <p>${invoice.description || 'No description provided'}</p>
    `;
  } catch (err) {
    console.error("Failed to fetch invoice details:", err);
    detailsDiv.innerHTML = `<p class="error">Error: ${err.message}</p>`;
  }
});