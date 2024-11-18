import React, { useContext, useState } from 'react'
import { DateContext } from '../contexts/dateContext'

export default function Modal({onClose}) {
  const {date,setDate} = useContext(DateContext)
  const [inputDate, setInputDate] = useState(date)

  const changeDate = ()=>{
    if(inputDate){
      alert("Transaction Date changed to: " + inputDate)
      setDate(inputDate)
      onClose()
    }else{
      alert("Please Choose a Valid Date")
    }
  }

  return (
    <div className="modalOverlay">
        <div className="modal flex flex-column">
            <p className="titleText">Transaction Date</p>
            <input type="date" value={inputDate} onChange={(e)=>{setInputDate(e.target.value)}} />
            <div className="btnBox flex felx-row">
                <button className="btnMini btnHalf blue" onClick={changeDate}>Submit</button> 
                <button className="btnMini btnHalf red" onClick={onClose}>Cancel</button> 
            </div>
        </div>
    </div>
  )
}
