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
