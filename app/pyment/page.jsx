'use client';

import { useState } from "react";
import axios from "axios";

export default function PaymentPage() {
    const [amount, setAmount] = useState("10");
    const [loading, setLoading] = useState(false);

    const startPayment = async () => {
        if (!amount) return alert("Enter amount");
        setLoading(true);

        const txnid = "txn" + Date.now();

        try {
            // 🔹 Get hash from backend
            const res = await axios.post("http://localhost:5000/api/payment", {
                txnid,
                amount,
                productinfo: "Test Product",
                firstname: "John",
                email: "john@example.com",
            });

            const { hash, key } = res.data;

            // 🔹 PayU parameters
            const payuParams = {
                key,
                txnid,
                amount,
                productinfo: "Test Product",
                firstname: "John",
                email: "john@example.com",
                phone: "9999999999",
                surl: "http://localhost:3000/success",
                furl: "http://localhost:3000/failure",
                hash,
                service_provider: "payu_paisa",
                name_on_card: "John Doe",
                cardNumber: "4111111111111111",
                expiryMonth: "12",
                expiryYear: "30",
                CVV: "123",
            };

            // 🔹 Create form & submit
            const form = document.createElement("form");
            form.method = "POST";
            form.action = "https://sandbox.payu.in/_payment";

            Object.keys(payuParams).forEach((key) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = payuParams[key];
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
        } catch (err) {
            console.error(err);
            alert("Error generating hash or processing payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 50 }}>
            <h1>Pay Securely</h1>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                style={{ padding: 12, fontSize: 16, marginBottom: 20, width: 250 }}
            />
            <button onClick={startPayment} disabled={loading} style={{ padding: 15, fontSize: 18 }}>
                {loading ? "Processing..." : `Pay ${amount} ₹`}
            </button>
        </div>
    );
}
