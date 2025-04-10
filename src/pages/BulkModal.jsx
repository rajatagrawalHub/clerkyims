import React, {useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";

export default function BulkModal({ onClose, userId, type, itemNameArray, onBulkData  }) {
  const fileInputRef = useRef();
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
      "application/vnd.ms-excel"
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a valid .xlsx or .csv file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const [headers, ...rows] = jsonData;
      const expectedHeaders = ["Item Name", "Quantity", "Price"];

      if (
        !headers ||
        headers.length !== 3 ||
        !expectedHeaders.every((header, idx) => headers[idx] === header)
      ) {
        alert("Invalid file format. Headers must be: Item Name, Quantity, Price");
        return;
      }

      const validRows = [];
      const invalidItems = [];

      rows.forEach((row, idx) => {
        const [itemName, quantity, price] = row;
        if (!itemNameArray.includes(itemName)) {
          invalidItems.push(itemName);
          return;
        }
        
        if(quantity == "" || price == ""){
          return;
        }

        validRows.push({
          itemName,
          quantity: parseFloat(quantity) || 0,
          price: parseFloat(price) || 0,
          amount: (parseFloat(quantity) || 0) * (parseFloat(price) || 0),
        });
      });

      if (invalidItems.length > 0) {
        alert("These items were not found and ignored:\n" + invalidItems.join(", "));
      }

      if (validRows.length > 0) {
        onBulkData(validRows);
        onClose(); // Close the modal after processing
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleDownloadTemplate = () => {
    const data = itemNameArray.map((name) => ({
      "Item Name": name,
      Quantity: "",
      Price: "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data, {
      header: ["Item Name", "Quantity", "Price"],
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

    XLSX.writeFile(workbook, "bulk_upload_template.xlsx");
  };

  return (
    <div className="modalOverlay">
      <div className="modal flex flex-column">
        <div className="flex flex-row spaceBetween">
          <p className="titleText">{"Bulk " + type + " Upload"}</p>
          <button className="btnMini btnHalf blue" onClick={onClose}>
            X
          </button>
        </div>
        <div className="flex flex-row gap-12">
          <button className="btnMini btnHalf orange" onClick={handleDownloadTemplate}>Download Template</button>
        </div>
        <div className="flex flex-row gap-12">
            <input type="file" id="fileInput" accept=".xlsx,.csv"
            ref={fileInputRef}
            onChange={handleFileUpload} />
        </div>
      </div>
    </div>
  );
}
