document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("invoiceForm");
  const saveBtn = document.getElementById("saveBtn");
  const invoiceNumberInput = document.getElementById("invoiceNumber");
  const statusDiv = document.getElementById("status");

  // Format invoice numbers consistently
  const formatInvoiceNumber = (num) => {
    return String(num).padStart(4, '0');
  };

  async function loadLastInvoiceNumber() {
    try {
      const res = await fetch("http://localhost:3000/api/invoices/last-number");
      
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      
      const data = await res.json();
      console.log("Last invoice data:", data);

      if (data && data.lastNumber) {
        const lastNum = parseInt(data.lastNumber.toString().replace(/^0+/, ''), 10);
        invoiceNumberInput.value = formatInvoiceNumber(lastNum + 1);
      } else {
        invoiceNumberInput.value = "0001";
      }
    } catch (err) {
      console.error("Failed to fetch last invoice number:", err);
      invoiceNumberInput.value = "0001";
    }
  }

  await loadLastInvoiceNumber();

  saveBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("http://localhost:3000/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          invoiceNumber: data.invoiceNumber.padStart(4, '0') // Ensure proper formatting
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
    } catch (err) {
      console.error("Save failed:", err);
      statusDiv.textContent = "Failed to save invoice";
      statusDiv.style.color = "#ff3333";
    }
  });
});s