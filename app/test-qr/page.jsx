"use client";

import { useState } from "react";

export default function TestQR() {
  const [qr, setQr] = useState("");

  const generateQR = async () => {
    const res = await fetch("/api/payments/qrph/create", {
      method: "POST",
    });

    const data = await res.json();

    setQr(data.attachedPayment.data.attributes.next_action.code.image_url);
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={generateQR}>Generate QR</button>

      {qr && <img src={qr} alt='QRPH' width={300} />}
    </div>
  );
}
