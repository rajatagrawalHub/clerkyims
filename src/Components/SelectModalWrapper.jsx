import React, { useState, useEffect, useContext } from "react";
import SelectModal from "../Components/SelectModal";
import CompanyPage from "../pages/CompanyPage";
import { UserContext } from "../contexts/userContext";
import { useNavigate } from "react-router-dom";

export default function SelectModalWrapper({ type }) {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const {userId} = useContext(UserContext);
  const nav = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
        try{
            const response = await fetch(`http://localhost:5000/getUser/${userId}`);
            const data = await response.json()
            if (response.ok) {
                console.log(data.message)
                setCompanies(data.Companies || []);
            }
        } catch (error) {
            console.error("Error fetching User Comapny:", error);
        }
    };

    fetchCompanies();
  }, [userId]);

  const handleDelete = async () => {
    if (!selectedCompany) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the company "${selectedCompany.Name}"?`
    );

    if (confirmDelete) {
      try {
        const response = await fetch("http://localhost:5000/deleteCompany", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, companyName: selectedCompany.Name }),
        });

          const data = await response.json();
          alert(data.message);
          
          if(response.ok){
            setCompanies((prev) =>
              prev.filter((company) => company.Name !== selectedCompany.Name)
            );
            setSelectedCompany(null);
          }
          
      } catch (error) {
        console.error("Error Calling Delete API ", error);
      }
    }
  };

  if (selectedCompany) {
    if(type === "Select"){
      localStorage.setItem('Company',selectedCompany.Name)
      nav('/')
    }else if(type !== "Delete"){
      return <CompanyPage type={type} company={selectedCompany} />;
    }else{
      handleDelete()
    }
  }

  console.log(companies);

  return (
    <SelectModal
      companies={companies}
      onSelect={(company) => setSelectedCompany(company)}
    />
  );
}
