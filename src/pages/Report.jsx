import Navbar from "../Components/Navbar";
import ActionBox from "../Components/ActionBox";
import { UserContext } from "../contexts/userContext";
import { DateContext } from "../contexts/dateContext";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

export default function Report() {
    const nav = useNavigate();
    const { userId } = useContext(UserContext);
    const { date } = useContext(DateContext);
    const companyName = localStorage.getItem("Company");

    const [itemWiseData, setItemWiseData] = useState([]);
    const [voucherWiseData, setVoucherWiseData] = useState([]);
    const [balance, setBalance] = useState(0);
    const [view, setView] = useState("item");

    useEffect(() => {
        const fetchReportData = async () => {
            if (!companyName) {
                alert("Select a Company First");
                nav(`/select/Company`);
                return;
            } else {
                try {
                    const response = await fetch(`http://localhost:5000/fetchReports`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId, companyName }),
                    });

                    const data = await response.json();
                    if (response.ok && data) {
                        setBalance(data.balance);
                        setItemWiseData(data.itemWise);
                        setVoucherWiseData(data.voucherWise);
                    }
                } catch (error) {
                    console.log("Error Fetching Reports " + error);
                }
            }
        };

        fetchReportData();
    }, [companyName, userId, nav]);

    return (
        <div id="dashboardContainer" className="Container flex flex-column">
            <Navbar />
            <div id="bodyContainer" className="flex flex-row">
                <div id="mainSection" className="flex flex-column">
                    <div id="headerSection" className="flex flex-row spaceBetween">
                        <div className="headerTitleCard flex flex-column">
                            <p className="titleTextNormal">Report Date</p>
                            <p className="headerText bold">{date}</p>
                        </div>
                        <div className="headerTitleCard flex flex-column">
                            <p className="titleTextNormal">Comapny Balance</p>
                            <p className="headerText bold">{balance}</p>
                        </div>
                        <div className="headerActions">
                            <button className={`btnMini ${view === "item" ? "blue" : "black"} no-rt-border`} onClick={() => setView("item")}>
                                Item-Wise View
                            </button>
                            <button className={`btnMini ${view === "voucher" ? "blue" : "black"} no-lt-border`} onClick={() => setView("voucher")}>
                                Voucher-Wise View
                            </button>
                        </div>
                    </div>
                    
                    <div id="displayTable" className="flex flex-column">
                        <div id="headerRow" className="row flex flex-row center">
                            <p className="titleTextNormal bold">{view === "item" ? "Item Wise Report" : "Voucher Wise Report"}</p>
                        </div>
                        {view === "item" ? (
                            <div className="flex flex-column spaceBetween" id="SalesTableSection">
                                <table className="salesTable">
                                    <thead>
                                        <tr>
                                            <th className="col-blue">Item</th>
                                            <th className="col-blue">Sold Qty</th>
                                            <th className="col-blue">Sold Amount</th>
                                            <th className="col-blue">Purchase Qty</th>
                                            <th className="col-blue">Purchase Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody id="reportTable">
                                        {itemWiseData.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.itemName}</td>
                                                <td>{item.totalSalesQuantity}</td>
                                                <td>{item.totalSales}</td>
                                                <td>{item.totalPurchaseQuantity}</td>
                                                <td>{item.totalPurchase}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-column spaceBetween" id="SalesTableSection">
                                <table className="salesTable">
                                    <thead>
                                        <tr>
                                            <th className="col-blue">Voucher Type</th>
                                            <th className="col-blue">Total Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody id="reportTable">
                                    {Object.entries(voucherWiseData).map(([type, amount], index) => (
                                        <tr key={index}>
                                            <td>{type.charAt(0).toUpperCase() + type.slice(1)}</td>
                                            <td>{Number(amount).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
                <ActionBox />
            </div>
        </div>
    );
}
