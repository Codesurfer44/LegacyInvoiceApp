document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("invoiceForm");
  const saveBtn = document.getElementById("saveBtn");
  const invoiceNumberInput = document.getElementById("invoiceNumber");
  const statusDiv = document.getElementById("status");

  // Financial fields
  const amountInput = document.getElementById("amount");
  const taxInput = document.getElementById("taxRate");
  const discountInput = document.getElementById("discount");
  const subtotalInput = document.getElementById("subtotal");
  const totalInput = document.getElementById("total");

  // Format invoice numbers consistently
  const formatInvoiceNumber = (num) => String(num).padStart(4, '0');

  // Load last invoice number
  async function loadLastInvoiceNumber() {
    try {
      const res = await fetch("http://localhost:3000/api/invoices/last-number");
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      const lastNum = data?.lastNumber ? parseInt(data.lastNumber.toString().replace(/^0+/, ''), 10) : 0;
      invoiceNumberInput.value = formatInvoiceNumber(lastNum + 1);
    } catch (err) {
      console.error("Failed to fetch last invoice number:", err);
      invoiceNumberInput.value = "0001";
    }
  }

  await loadLastInvoiceNumber();

  // --- Listener to dynamically calculate subtotal and total ---
  form.addEventListener("input", () => {
    const amount = parseFloat(amountInput.value) || 0;
    const discount = parseFloat(discountInput.value) || 0;
    const taxRate = parseFloat(taxInput.value) || 0;

    const subtotal = Math.max(amount - discount, 0);
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    subtotalInput.value = subtotal.toFixed(2);
    totalInput.value = total.toFixed(2);
  });

  // --- Handle save ---
  saveBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const amount = parseFloat(data.amount) || 0;
    const discount = parseFloat(data.discount) || 0;
    const taxRate = parseFloat(data.taxRate) || 0;
    const subtotal = Math.max(amount - discount, 0);
    const total = subtotal + (subtotal * (taxRate / 100));

    try {
      const response = await fetch("http://localhost:3000/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          invoiceNumber: data.invoiceNumber.padStart(4, '0'),
          amount,
          discount,
          tax: taxRate,
          subtotal,
          total
        })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      console.log("Save result:", result);

      statusDiv.textContent = `✅ Invoice ${result.invoice.invoiceNumber} saved`;
      statusDiv.style.color = "#39ff14";

      // Increment invoice number for next entry
      const nextNum = parseInt(data.invoiceNumber, 10) + 1;
      invoiceNumberInput.value = formatInvoiceNumber(nextNum);

      form.reset();
      invoiceNumberInput.value = formatInvoiceNumber(nextNum);
      subtotalInput.value = "0.00";
      totalInput.value = "0.00";

    } catch (err) {
      console.error("Save failed:", err);
      statusDiv.textContent = "❌ Failed to save invoice";
      statusDiv.style.color = "#ff3333";
    }
  });
});
