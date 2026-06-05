export const printInvoice = (payment, user) => {
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  
  const formattedDate = new Date(payment.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const dueDate = new Date(payment.createdAt);
  dueDate.setDate(dueDate.getDate() + 30);
  const formattedDueDate = dueDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const invoiceHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice - ${payment.invoiceNumber}</title>
      <meta charset="utf-8">
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: #333;
          margin: 0;
          padding: 40px;
          line-height: 1.5;
        }
        .invoice-box {
          max-width: 800px;
          margin: auto;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
          padding: 30px;
          border: 1px solid #eee;
          border-radius: 8px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
          border-bottom: 2px solid #6366f1;
          padding-bottom: 20px;
        }
        .company-details {
          text-align: right;
        }
        .company-name {
          font-size: 24px;
          font-weight: bold;
          color: #6366f1;
          margin: 0 0 5px 0;
        }
        .company-text {
          font-size: 13px;
          color: #666;
          margin: 2px 0;
        }
        .billing-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
        }
        .billing-title {
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 8px;
        }
        .billing-info {
          font-size: 14px;
          color: #333;
        }
        .billing-name {
          font-weight: bold;
          margin-bottom: 4px;
        }
        .invoice-details {
          text-align: right;
        }
        .detail-item {
          margin: 4px 0;
          font-size: 14px;
        }
        .detail-label {
          color: #666;
        }
        .detail-value {
          font-weight: bold;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          margin-bottom: 40px;
        }
        th {
          background-color: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
          padding: 12px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          color: #64748b;
        }
        td {
          padding: 12px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 14px;
        }
        .total-section {
          display: flex;
          justify-content: flex-end;
        }
        .total-table {
          width: 250px;
          margin-bottom: 0;
        }
        .total-table td {
          border-bottom: none;
          padding: 6px 12px;
        }
        .total-row {
          font-size: 18px;
          font-weight: bold;
          color: #6366f1;
          border-top: 2px solid #e2e8f0;
        }
        .footer {
          margin-top: 60px;
          text-align: center;
          font-size: 12px;
          color: #94a3b8;
          border-t: 1px solid #f1f5f9;
          padding-top: 20px;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: bold;
          text-transform: uppercase;
          background-color: #d1fae5;
          color: #065f46;
        }
        @media print {
          body {
            padding: 0;
          }
          .invoice-box {
            border: none;
            box-shadow: none;
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <div class="header">
          <div>
            <div style="font-size: 28px; font-weight: 800; color: #6366f1; letter-spacing: -0.5px;">SaaSFlow</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Premium SaaS Platform</div>
          </div>
          <div class="company-details">
            <h3 class="company-name">SaaSFlow, Inc.</h3>
            <p class="company-text">100 Pine Street, Suite 1200</p>
            <p class="company-text">San Francisco, CA 94111</p>
            <p class="company-text">billing@saasflow.com</p>
          </div>
        </div>

        <div class="billing-row">
          <div>
            <div class="billing-title">Billed To</div>
            <div class="billing-info">
              <div class="billing-name">${user?.name || 'Customer'}</div>
              <div>${user?.email || 'customer@example.com'}</div>
            </div>
          </div>
          <div class="invoice-details">
            <div class="billing-title">Invoice Information</div>
            <div class="detail-item">
              <span class="detail-label">Invoice No:</span>
              <span class="detail-value">${payment.invoiceNumber}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Date Issued:</span>
              <span class="detail-value">${formattedDate}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Payment Status:</span>
              <span class="status-badge">${payment.status}</span>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Billing Cycle</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>SaaSFlow ${payment.planId?.name || 'Pro'} Plan Subscription</strong>
                <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Full access to all platform features and dashboard tools.</div>
              </td>
              <td>${payment.planId?.billingCycle || 'monthly'}</td>
              <td style="text-align: right; font-weight: 500;">$${payment.amount.toFixed(2)} USD</td>
            </tr>
          </tbody>
        </table>

        <div class="total-section">
          <table class="total-table">
            <tr>
              <td>Subtotal:</td>
              <td style="text-align: right;">$${payment.amount.toFixed(2)} USD</td>
            </tr>
            <tr>
              <td>Taxes & Fees (0%):</td>
              <td style="text-align: right;">$0.00 USD</td>
            </tr>
            <tr class="total-row">
              <td>Total Paid:</td>
              <td style="text-align: right;">$${payment.amount.toFixed(2)} USD</td>
            </tr>
          </table>
        </div>

        <div class="footer">
          <p>Thank you for subscribing to SaaSFlow! If you have any questions, please contact billing@saasflow.com</p>
          <p>&copy; ${new Date().getFullYear()} SaaSFlow, Inc. All rights reserved.</p>
        </div>
      </div>
      <script>
        window.onload = function() {
          window.print();
          // Optional: close window after print dialog is closed
          // window.onafterprint = function() { window.close(); }
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(invoiceHtml);
  printWindow.document.close();
};
