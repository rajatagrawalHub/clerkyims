import React, {useContext, useEffect, useState } from "react";
import {DateContext} from "../contexts/dateContext";

export default function PaymnetRecieptModal({ onClose, userId, action }) {
  const [amount, setAmount] = useState(0)
  const {date} = useContext(DateContext)

  const companyName = localStorage.getItem("Company");
 
  const onSubmit = async() =>{
        const transactionID = `TXN-${Date.now()}`;
        const url = (action === "Payment") ? "http://localhost:5000/removeBalance" : "http://localhost:5000/addBalance"
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userId, companyName: companyName, amount: amount, date: date, transactionID: transactionID }),
          });

          const data = await response.json();
          alert(data.message)
        } catch (error) {
          console.log("Error Creating/Updating Items " + error);
        }
  }

  const handleSubmit = () => {
      if (amount<0) {
        alert("Please provide valid Amount.");
        return;
      }

      onSubmit();
      setAmount(0)
      onClose();
  };

  return (
    <div className="modalOverlay">
      <div className="modal flex flex-column">
        <div className="flex flex-row spaceBetween">
          <p className="titleText">{action} Voucher</p>
          <button className="btnMini btnHalf blue" onClick={onClose}>
            X
          </button>
        </div>
        <>
            <div className="inputBox flex flex-row alignItems_Center spaceBetween">
              <p className="labelText bold">Amount</p>
              <input
                type="number"
                name="Amount"
                placeholder= {action === "Payment" ? "Enter Amount Paid" : "Enter Amount Recieved"}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="btnBox flex flex-row">
              <button className="btnMini btnHalf blue" onClick={handleSubmit}>
                Submit
              </button>
              <button className="btnMini btnHalf red" onClick={() => setAmount(0)}>
                Reset
              </button>
            </div>
          </>
      </div>
    </div>
  );
}
