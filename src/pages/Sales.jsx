import Navbar from "../Components/Navbar";
import ActionBox from "../Components/ActionBox";
import BulkModal from "../pages/BulkModal";
import { UserContext } from "../contexts/userContext";
import { DateContext } from "../contexts/dateContext";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";


export default function Sales() {
    const nav = useNavigate();
    const { userId } = useContext(UserContext);
    const { date } = useContext(DateContext);
    const companyName = localStorage.getItem("Company");
    const [itemNames, setItemNames] = useState([]);
    const [rows, setRows] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [bulkModal, setbulkModal] = useState(false);

    useEffect(() => {
        const fetchCompanies = async () => {
            if (!companyName) {
                alert("Select a Company First");
                nav(`/select/Company`);
                return;
            } else {
                try {
                    const response = await fetch(`http://localhost:5000/fetchItems`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId: userId, companyName: companyName }),
                    });

                    const data = await response.json();
                    if (response.ok && data.items) {
                        setItemNames(data.items.map((item) => item.Name));
                    }
                } catch (error) {
                    console.log("Error Fetching Items " + error);
                }
            }
        };

        fetchCompanies();
    }, [companyName, userId, nav]);

    const addRow = () => {
        setRows([...rows, { itemName: "", quantity: 0, price: 0, amount: 0 }]);
    };

    const updateRow = (index, field, value) => {
        const updatedRows = [...rows];
    
        if (field === "quantity" || field === "price") {
            if (!updatedRows[index].itemName) {
                alert("Please select an item before entering quantity or price.");
                return;
            }
        }
    
        updatedRows[index][field] = value;
    
        if (field === "quantity" || field === "price") {
            updatedRows[index].amount = updatedRows[index].quantity * updatedRows[index].price;
        }
    
        setRows(updatedRows);
        calculateTotalAmount(updatedRows);
    };
    

    const calculateTotalAmount = (rows) => {
        const total = rows.reduce((acc, row) => acc + (row.amount || 0), 0);
        setTotalAmount(total);
    };

    const removeRow = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
        calculateTotalAmount(updatedRows);
    };

    const handleSubmit = async () => {
        if (!companyName) {
            alert("Select a Company First");
            return;
        }

        const transactionID = `TXN-${Date.now()}`;

        const payload = {
            userId: userId,
            companyName: companyName,
            transactionID: transactionID,
            date: date,
            rows: rows,
            totalAmount: totalAmount,
        };

        try {
            const response = await fetch("http://localhost:5000/submitSales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                if(data.success){
                    resetForm();
                }
            }
        } catch (error) {
            console.log("Error Submitting Transaction:", error);
        }
    };

    const resetForm = () => {
        setRows([]);
        setTotalAmount(0);
    };

    const handleBulkData = (bulkRows) => {
        setRows(bulkRows);
        calculateTotalAmount(bulkRows);
    };

    return (
        <div id="dashboardContainer" className="Container flex flex-column">
            <Navbar />
            <div id="bodyContainer" className="flex flex-row">
                {bulkModal && (<BulkModal onClose={()=>setbulkModal(false)} userId={userId} type="Sales" itemNameArray={itemNames} onBulkData={handleBulkData} />)}  
                <div id="mainSection" className="flex flex-column">
                    <div id="headerSection" className="flex flex-row spaceBetween">
                        <div className="headerTitleCard flex flex-column">
                            <p className="titleTextNormal">Transaction Date</p>
                            <p className="headerText bold">{date}</p>
                        </div>
                        <div className="headerTitleCard flex flex-column">
                            <button className="btnMini btnHalf blue" onClick={()=>setbulkModal(true)}>
                                <i className="fa-solid fa-upload"></i> Bulk Upload
                            </button>
                        </div>
                    </div>

                    <div id="displayTable" className="flex flex-column">
                        <div id="headerRow" className="row flex flex-row spaceBetween">
                            <p className="titleTextNormal bold">Sales Voucher</p>
                        </div>
                        <div className="flex flex-column spaceBetween" id="SalesTableSection">
                            <table className="salesTable">
                                <thead>
                                    <tr>
                                        <th className="col-blue">Item Name</th>
                                        <th className="col-blue">Quantity</th>
                                        <th className="col-blue">Price</th>
                                        <th className="col-blue">Amount</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, index) => (
                                        <tr key={index}>
                                            <td>
                                                <select
                                                    value={row.itemName}
                                                    onChange={(e) => updateRow(index, "itemName", e.target.value)}
                                                >
                                                    <option value="">Select Item</option>
                                                    {itemNames.map((itemName) => (
                                                        <option key={itemName} value={itemName}>
                                                            {itemName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={row.quantity}
                                                    onChange={(e) => updateRow(index, "quantity", parseFloat(e.target.value) || 0)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={row.price}
                                                    onChange={(e) => updateRow(index, "price", parseFloat(e.target.value) || 0)}
                                                />
                                            </td>
                                            <td>{row.amount.toFixed(2)}</td>
                                            <td>
                                                <button className="btnHalf red col-white circle" onClick={() => removeRow(index)}><i className="fa-solid fa-minus"></i></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <button className="addRowButton btnMini green col-white centerBoth" onClick={addRow}>
                                <i className="fa-solid fa-plus"></i> New Item
                            </button>

                            <div className="totalAmount">
                                <p className="talign_right">Total Amount: {totalAmount.toFixed(2)}</p>
                            </div>

                            <div className="flex row gap12 align_flex_end">
                                <button className="btnHalf btnMini blue" onClick={handleSubmit}>Sale</button>
                                <button className="btnHalf btnMini orange" onClick={resetForm}>Reset</button>
                            </div>
                        </div>
                    </div>
                </div>
                <ActionBox />
            </div>
        </div>
    );
}
