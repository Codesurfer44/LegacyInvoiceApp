document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.querySelector("#invoicesTable tbody");

  try {
    const response = await fetch("http://localhost:3000/api/invoices");
    const invoices = await response.json();

    tableBody.innerHTML = "";

    if (!invoices.length) {
      tableBody.innerHTML = `<tr><td colspan="6">No invoices found</td></tr>`;
      return;
    }

    invoices.forEach(inv => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${inv.invoiceNumber}</td>
        <td>${inv.clientName}</td>
        <td>${inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString() : 'N/A'}</td>
        <td>${inv.currency || ''} ${inv.amount}</td>
        <td>${inv.status}</td>
        <td>
          <a href="invoiceDetails.html?id=${inv.id}" class="detailsBtn">View Details</a>
          <button class="deleteBtn" data-id="${inv.id}">Delete</button>
        </td>
      `;

      tableBody.appendChild(row);
    });

    // Attach delete handlers
    document.querySelectorAll('.deleteBtn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        if (!confirm('Are you sure you want to delete this invoice?')) return;

        try {
          const res = await fetch(`http://localhost:3000/api/invoices/${id}`, {
            method: 'DELETE'
          });
          const result = await res.json();
          if (res.ok) {
            alert('✅ Invoice deleted');
            e.target.closest('tr').remove(); // Remove row from table
          } else {
            alert('❌ ' + (result.error || 'Failed to delete invoice'));
          }
        } catch (err) {
          console.error(err);
          alert('⚠️ Network error');
        }
      });
    });

  } catch (err) {
    console.error("Failed to fetch invoices:", err);
    tableBody.innerHTML = `<tr><td colspan="6">Error loading invoices</td></tr>`;
  }
});