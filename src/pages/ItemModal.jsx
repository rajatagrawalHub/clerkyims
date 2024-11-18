import React, {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ItemModal({ onClose, userId }) {
  const [action, setAction] = useState("");
  const [itemName, setItemName] = useState("");
  const [qtyInStock, setQtyInStock] = useState(0);
  const [selectedDeleteItem, setSelectedDeleteItem] = useState("");
  const [selectedAlterItem, setSelectedAlterItem] = useState("");
  const [items, setItems] = useState([]);

  const handleAction = (selectedAction) => {
    setAction(selectedAction);
  };

  const companyName = localStorage.getItem("Company");
  const nav = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!companyName) {
        alert("Select a Company First");
        nav(`/select/Company`);
        return;
      } else {
        if (action === "alter" || action === "delete") {
          try {
            const response = await fetch(`http://localhost:5000/fetchItems`, {
              method: 'POST',
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: userId, companyName: companyName }),
            });

            const data = await response.json();
            console.log(data.message)
            if (response.ok && data.items) {
              setItems(data.items);
            }
          } catch (error) {
            console.log("Error Fetching Items " + error);
          }
        }
      }
    };

    fetchCompanies();
  }, [action, companyName, userId, nav]);

  const onSubmit = async() =>{
        const url = (action === "create") ? "http://localhost:5000/createItems" : "http://localhost:5000/updateItems"
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userId, companyName: companyName, itemName: itemName, qtyInStock: qtyInStock }),
          });

          const data = await response.json();
          alert(data.message)
        } catch (error) {
          console.log("Error Creating/Updating Items " + error);
        }
  }

  const onDelete = async () =>{
    try {
        const response = await fetch("http://localhost:5000/deleteItems", {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userId, companyName: companyName, itemName: selectedDeleteItem }),
        });

        const data = await response.json();
        alert(data.message)
      } catch (error) {
        console.log("Error Deleting Items " + error);
      }
  }

  useEffect(() => {
    const fetchItemDetails = () => {
      const item = items.find((item) => item.Name === selectedAlterItem);
      setItemName(item?.Name || "");
      setQtyInStock(item?.Qty || 0);
    };
    if (selectedAlterItem) {
        fetchItemDetails();
      }
  }, [selectedAlterItem, items]);

  const handleSubmit = () => {
    if (action === "create" || action === "alter") {
      if (itemName.trim() === "" || qtyInStock <= 0) {
        alert("Please provide valid item details.");
        return;
      }
      onSubmit();
      setItemName("");
      setQtyInStock(0);
      setSelectedAlterItem("")
      handleAction("");
    }
  };

  const handleDelete = () => {
    if (!selectedDeleteItem) {
      alert("Please select an item to delete.");
      return;
    }
    onDelete()
    setSelectedDeleteItem("")
    handleAction("");
  };

  return (
    <div className="modalOverlay">
      <div className="modal flex flex-column">
        <div className="flex flex-row spaceBetween">
          <p className="titleText">Manage Items</p>
          <button className="btnMini btnHalf blue" onClick={onClose}>
            X
          </button>
        </div>

        {action === "create" ? (
          <>
            <div className="inputBox flex flex-row alignItems_Center spaceBetween">
              <p className="labelText bold">Item Name</p>
              <input
                type="text"
                name="Name"
                placeholder="eg. ABC Corporation"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>
            <div className="inputBox flex flex-row alignItems_Center spaceBetween">
              <p className="labelText bold">Qty In Stock</p>
              <input
                type="number"
                name="Qty"
                value={qtyInStock}
                onChange={(e) => setQtyInStock(parseInt(e.target.value) || 0)} 
              />
            </div>
            <div className="btnBox flex flex-row">
              <button className="btnMini btnHalf blue" onClick={handleSubmit}>
                Submit
              </button>
              <button className="btnMini btnHalf red" onClick={() => handleAction("")}>
                Cancel
              </button>
            </div>
          </>
        ) : action === "alter" ? (
          <>
            <div className="inputBox flex flex-row alignItems_Center spaceBetween">
              <p className="labelText bold">Select Item</p>
              <input
                list="items"
                name="Items"
                placeholder="Select Item to Alter"
                value={selectedAlterItem}
                onChange={(e) => setSelectedAlterItem(e.target.value)}
              />
              <datalist id="items">
                {items.map((item) => (
                  <option key={item.Name} value={item.Name}>
                    {item.Name}
                  </option>
                ))}
              </datalist>
            </div>
            <div className="inputBox flex flex-row alignItems_Center spaceBetween">
              <p className="labelText bold">Item Name</p>
              <input
                type="text"
                name="Name"
                placeholder="eg. ABC Corporation"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>
            <div className="inputBox flex flex-row alignItems_Center spaceBetween">
              <p className="labelText bold">Qty In Stock</p>
              <input
                type="number"
                name="Qty"
                value={qtyInStock}
                onChange={(e) => setQtyInStock(parseInt(e.target.value) || 0)}  // Parse to number
              />
            </div>
            <div className="btnBox flex flex-row">
              <button className="btnMini btnHalf blue" onClick={handleSubmit}>
                Submit
              </button>
              <button className="btnMini btnHalf red" onClick={() => handleAction("")}>
                Cancel
              </button>
            </div>
          </>
        ) : action === "delete" ? (
          <>
            <div className="inputBox flex flex-row alignItems_Center spaceBetween">
              <p className="labelText bold">Select Item</p>
              <input
                list="items"
                name="Items"
                placeholder="Select Item to Delete"
                value={selectedDeleteItem}
                onChange={(e) => setSelectedDeleteItem(e.target.value)}
              />
              <datalist id="items">
                {items.map((item) => (
                  <option key={item.Name} value={item.Name}>
                    {item.Name}
                  </option>
                ))}
              </datalist>
            </div>
            <div className="btnBox flex flex-row">
              <button className="btnMini btnHalf red" onClick={handleDelete}>
                Delete
              </button>
              <button className="btnMini btnHalf blue" onClick={() => handleAction("")}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="btnBox flex flex-row">
            <button
              className="btnMini btnHalf green"
              onClick={() => handleAction("create")}
            >
              Create Item
            </button>
            <button
              className="btnMini btnHalf orange"
              onClick={() => handleAction("alter")}
            >
              Alter Item
            </button>
            <button
              className="btnMini btnHalf red"
              onClick={() => handleAction("delete")}
            >
              Delete Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
