import Navbar from "../Components/Navbar";
import ActionBox from "../Components/ActionBox";
import { UserContext } from "../contexts/userContext";
import { DateContext } from "../contexts/dateContext";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

export default function Dashboard() {
    const nav = useNavigate();
    const { userId } = useContext(UserContext);
    const { date } = useContext(DateContext);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            nav("/login");
            return;
        }

        const fetchCompanies = async () => {
            try {
                const response = await fetch(`http://localhost:5000/getUser/${userId}`);
                const data = await response.json();

                if (response.ok) {
                    console.log(data.message)
                    setCompanies(data.Companies || []);
                }
            } catch (error) {
                console.error("Error fetching User Compnay:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, [userId, nav]);

    return (
        <div id="dashboardContainer" className="Container flex flex-column">
            <Navbar />
            <div id="bodyContainer" className="flex flex-row">
                <div id="mainSection" className="flex flex-column">
                    <div id="headerSection" className="flex flex-row spaceBetween">
                        <div className="headerTitleCard flex flex-column">
                            <p className="titleTextNormal">Current Period</p>
                            <p className="headerText bold">01 Apr 2025 - 31 Mar 2026</p>
                        </div>
                        <div className="headerTitleCard flex flex-column">
                            <p className="titleTextNormal">Transaction Date</p>
                            <p className="headerText bold">{date}</p>
                        </div>
                    </div>
                    <div id="displayTable" className="flex flex-column">
                        <div id="headerRow" className="row flex flex-row spaceBetween">
                            <p className="titleTextNormal bold">Company Name</p>
                            <p className="titleTextNormal bold">Last Transaction Date</p>
                        </div>

                        {loading && (
                            <p className="rowText bold talign_center">Loading...</p>
                        )}

                        {!loading && companies.length === 0 && (
                            <p className="rowText bold error talign_center">No Companies Created</p>
                        )}

                        {companies.map((company, index) => (
                            <div
                                key={index}
                                className="row flex flex-row spaceBetween"
                            >
                                <p className="rowText bold">M/s {company.Name}</p>
                                <p className="rowText">{company.LastTransactionDate ? company.LastTransactionDate : "No Vouchers Entered"}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <ActionBox />
            </div>
        </div>
    );
}
