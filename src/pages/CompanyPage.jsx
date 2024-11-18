import React, { useState, useEffect, useContext } from "react";
import Navbar from "../Components/Navbar";
import ActionBox from "../Components/ActionBox";
import { UserContext } from "../contexts/userContext";
import { DateContext } from "../contexts/dateContext";

export default function CompanyPage({ type, company }) {
    const {date} = useContext(DateContext)
  const [companyData, setCompanyData] = useState({
    Name: "",
    Address: "",
    State: "",
    Mobile: "",
    Email: "",
    Currency: "",
    LastTransactionDate: date,
    Balance: 0
  });

  const currencies = ["INR", "USD", "GBP", "EUR"];
  const {userId} = useContext(UserContext)

  useEffect(() => {
    if (company) {
      setCompanyData({
        Name: company.Name,
        Address: company.Address || "",
        State: company.State || "",
        Mobile: company.Mobile || "",
        Email: company.Email || "",
        Currency: company.Currency || "",
        LastTransactionDate: company.LastTransactionDate || "",
        Balance: company.Balance || 0
      });
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const url = (type === 'Create') ? "http://localhost:5000/createCompany" : "http://localhost:5000/alterCompany"
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({userId,companyData}),
    });
    const data = await response.json()
    alert(data.message)
    setCompanyData({
        Name: "",
        Address: "",
        State: "",
        Mobile: "",
        Email: "",
        Currency: "",
        LastTransactionDate: date,
        Balance: 0
      })
  };

  return (
    <div id="dashboardContainer" className={`Container flex flex-column`}>
      <Navbar />
      <div id="bodyContainer" className={`flex flex-row`}>
        <div id="mainSection" className="flex flex-column">
          <div id="displayTable" className="flex flex-column">
            <div id="headerRow" className="row flex flex-row spaceBetween">
              <p className="titleTextNormal bold">{type} Company</p>
            </div>
            <div className="inputBoxContainer">
              <div className="inputBox flex flex-row alignItems_Center spaceBetween">
                <p className="labelText bold">Company Name</p>
                <input
                  type="text"
                  name="Name"
                  placeholder="eg. ABC Corporation"
                  value={companyData.Name}
                  onChange={handleChange}
                />
              </div>
              <div className="inputBox flex flex-row alignItems_Center spaceBetween">
                <p className="labelText bold">Address</p>
                <input
                  type="text"
                  name="Address"
                  placeholder="eg. 248 Diego Street, LA"
                  value={companyData.Address}
                  onChange={handleChange}
                />
              </div>
              <div className="inputBox flex flex-row alignItems_Center spaceBetween">
                <p className="labelText bold">State</p>
                <input
                  type="text"
                  name="State"
                  placeholder="Select State"
                  value={companyData.State}
                  onChange={handleChange}
                />
              </div>
              <div className="inputBox flex flex-row alignItems_Center spaceBetween">
                <p className="labelText bold">Mobile No</p>
                <input
                  type="tel"
                  name="Mobile"
                  placeholder="eg. 9876543210"
                  value={companyData.Mobile}
                  onChange={handleChange}
                />
              </div>
              <div className="inputBox flex flex-row alignItems_Center spaceBetween">
                <p className="labelText bold">Email</p>
                <input
                  type="email"
                  name="Email"
                  placeholder="eg. info@abc.com"
                  value={companyData.Email}
                  onChange={handleChange}
                />
              </div>
              <div className="inputBox flex flex-row alignItems_Center spaceBetween">
                <p className="labelText bold">Currency</p>
                <input
                  list="currencyOptions"
                  name="Currency"
                  placeholder="Base Currency"
                  value={companyData.Currency}
                  onChange={handleChange}
                />
                <datalist id="currencyOptions">
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </datalist>
              </div>
              <div className="btnBox flex flex-row">
                <button
                  className="btnMini btnHalf orange"
                  onClick={() =>
                    setCompanyData({
                      Name: "",
                      Address: "",
                      State: "",
                      Mobile: "",
                      Email: "",
                      Currency: "",
                      LastTransactionDate: date,
                      Balance: 0
                    })
                  }
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="btnMini btnHalf blue"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
        <ActionBox title={"Company"} />
      </div>
    </div>
  );
}
