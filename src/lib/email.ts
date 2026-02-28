import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderConfirmationOptions {
  to: string;
  customerName: string;
  orderId: number;
  items: { productName: string; unitPrice: number; quantity: number }[];
  totalAmount: number;
  address: string;
}

export async function sendOrderConfirmation(opts: OrderConfirmationOptions) {
  const itemRows = opts.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:6px 12px;border-bottom:1px solid #eee">${i.productName}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right">${(i.unitPrice * i.quantity).toFixed(2)} лв.</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#333">
      <h2 style="color:#6b21a8">Поръчка #${opts.orderId} потвърдена</h2>
      <p>Здравейте, <strong>${opts.customerName}</strong>,</p>
      <p>Вашата поръчка беше получена успешно. Ще ce свържем c вас за доставката.</p>

      <table style="width:100%;border-collapse:collapse;margin:20px 0">
        <thead>
          <tr style="background:#f5f5f5">
            <th style="padding:8px 12px;text-align:left">Продукт</th>
            <th style="padding:8px 12px;text-align:center">Бр.</th>
            <th style="padding:8px 12px;text-align:right">Сума</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:10px 12px;font-weight:bold;text-align:right">Общо:</td>
            <td style="padding:10px 12px;font-weight:bold;text-align:right">${opts.totalAmount.toFixed(2)} лв.</td>
          </tr>
        </tfoot>
      </table>

      <p><strong>Адрес за доставка:</strong> ${opts.address}</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
      <p style="color:#888;font-size:13px">Aromaten &mdash; Ароматно Магазинче</p>
    </div>`;

  await resend.emails.send({
    from: "Aromaten <onboarding@resend.dev>",
    to: opts.to,
    subject: `Потвърждение на поръчка #${opts.orderId}`,
    html,
  });
}
