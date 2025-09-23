const invoiceSearch = document.getElementById('invoiceSearch');
const invoiceTableBody = document.querySelector('#invoiceTable tbody');

let debounceTimeout;

// Set your backend URL here
const BACKEND_URL = 'http://localhost:5000'; // Adjust port if needed

// Function to render invoices into the table
function renderInvoices(invoices) {
  invoiceTableBody.innerHTML = '';
  if (!invoices || invoices.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="6" style="text-align:center; color:#ff33ff;">No invoices found</td>`;
    invoiceTableBody.appendChild(row);
    return;
  }

  invoices.forEach(inv => {
    // Define statusSpan based on the invoice status
    let statusSpan = '';
    switch (inv.status) {
      case 'Paid':
        statusSpan = `<span style="color:#39ff14;">${inv.status}</span>`;
        break;
      case 'Pending':
        statusSpan = `<span style="color:#ffcc00;">${inv.status}</span>`;
        break;
      case 'Overdue':
        statusSpan = `<span style="color:#ff3333;">${inv.status}</span>`;
        break;
      default:
        statusSpan = `<span>${inv.status}</span>`;
    }

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${inv.invoiceNumber}</td>
      <td>${inv.clientName}</td>
      <td>${inv.clientEmail}</td>
      <td>${inv.total}</td>
      <td>${statusSpan}</td>
      <td>
        <a class="orangeBtn" href="invoiceDetails.html?id=${inv._id}">View Details</a>
        <a class="redBtn" href="#" onclick="deleteInvoice('${inv._id}')">Delete</a>
      </td>
    `;
    invoiceTableBody.appendChild(row);
  });
}

// Fetch all invoices initially
async function fetchAllInvoices() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/invoices`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    if (data.success) renderInvoices(data.data);
    else throw new Error('Failed to fetch invoices from backend');
  } catch (err) {
    console.error('Failed to fetch invoices:', err);
    invoiceTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#ff3333;">Failed to load invoices. Is the backend running?</td></tr>`;
  }
}

// Live search with debounce
invoiceSearch.addEventListener('input', (e) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(async () => {
    const query = e.target.value.trim();
    if (!query) {
      // If search is empty, show all invoices
      fetchAllInvoices();
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/searchEngine?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (data.success) {
        renderInvoices(data.data);
      } else {
        invoiceTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#ff3333;">Search failed</td></tr>`;
      }
    } catch (err) {
      console.error('Search error:', err);
      invoiceTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#ff3333;">Search failed. Check backend connection.</td></tr>`;
    }
  }, 300); // 300ms debounce
});

// Initial load
fetchAllInvoices();
