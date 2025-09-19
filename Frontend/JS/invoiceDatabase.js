// Frontend/js/invoiceDatabase.js

document.addEventListener("DOMContentLoaded", async () => {
  const invoiceTableBody = document.querySelector("#invoiceTable tbody");
  const statusMessage = document.getElementById("statusMessage");

  // Load invoices
  const loadInvoices = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/invoices");
      if (!res.ok) throw new Error("Failed to fetch invoices");

      const data = await res.json();
      const invoices = data.data || [];

      invoiceTableBody.innerHTML = "";
      if (invoices.length === 0) {
        statusMessage.textContent = "No invoices found.";
        return;
      }

      invoices.forEach(inv => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${inv.invoiceNumber}</td>
          <td>${inv.clientName}</td>
          <td>${inv.clientEmail}</td>
          <td>${inv.total}</td>
          <td>${inv.status}</td>
          <td>
            <a class="orangeBtn" href="invoiceDetails.html?id=${inv._id}">View Details</a>
            <a class="redBtn" href="#" onclick="deleteInvoice('${inv._id}')">Delete</a>
          </td>
        `;
        invoiceTableBody.appendChild(row);
      });
      statusMessage.textContent = "";
    } catch (err) {
      console.error("Error loading invoices:", err);
      statusMessage.textContent = "Error loading invoices.";
    }
  };

  // Delete invoice
  window.deleteInvoice = async (id) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/invoices/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        alert("Invoice deleted successfully");
        loadInvoices();
      } else {
        alert("Failed to delete invoice: " + result.message);
      }
    } catch (err) {
      console.error("Failed to delete invoice:", err);
      alert("Error deleting invoice");
    }
  };

  // Initial load
  loadInvoices();
});