import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SelectModal({ companies, onSelect }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        navigate("/");
      }
    };
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);
  return (
    <div className="modalOverlay">
      <div className="fullModal flex flex-column">
        <p className="modalTitle">Select Company</p>
        {companies.length > 0 ? (
          companies.map((company) => (
            <div
              key={company._id}
              className="row flex flex-row spaceBetween"
              onClick={() => onSelect(company)}
            >
              <p className="rowText bold">{company.Name}</p>
              <p className="rowText bold">{company.LastTransactionDate}</p>
            </div>
          ))
        ) : (
          <p className="rowText bold error talign_center">No Companies Found</p>
        )}
      </div>
    </div>
  );
}
