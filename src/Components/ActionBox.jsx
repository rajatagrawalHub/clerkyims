import React, { useEffect, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';
import Modal from './Modal';
import ItemModal from '../pages/ItemModal';
import PaymnetRecieptModal from '../pages/PaymentRecieptModal';

export default function ActionBox() {
  const nav = useNavigate();
  const {userName,userId} = useContext(UserContext)
  const [currentDate, setcurrentDate] = useState("")
  const [currentTime, setcurrentTime] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [isPModalOpen, setIsPModalOpen] = useState(false)
  const [isRModalOpen, setIsRModalOpen] = useState(false)


  useEffect(()=>{
    const now = new Date()
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = now.toLocaleDateString('en-IN', options)
    const istTime = new Date(now.getTime());
    const formattedTime = istTime.toTimeString().split(" ")[0].slice(0, 5);

    setcurrentDate(formattedDate)
    setcurrentTime(formattedTime)
  },[])

  return (
    <div id="actionSection" className="flex flex-column">
        <div id="dateTimeSection" className="flex flex-column">
            <p className="dateText bld">{currentDate}</p>
            <p className="timeText bold">{currentTime}</p>
            <p className="userText">Logged In as {userName}</p>
        </div>
        <p className="wishText">Good Morning!</p>
        <div id="actionBox" className="flex flex-column">
            <p className="actionTitle">Company</p>
            <p className="actionOption" onClick={()=> nav(`/select/Company`)}>Select Company</p>
            <p className="actionOption" onClick={()=> nav(`/create/Company`)}>Create Company</p>
            <p className="actionOption" onClick={()=> nav(`/alter/Company`)}>Alter Company</p>
            <p className="actionOption" onClick={()=> nav(`/delete/Company`)}>Delete Company</p>

            <p className="actionTitle">Items</p>
            <p className="actionOption" onClick={()=> setIsItemModalOpen(true)}>Manage Items</p>

            <p className="actionTitle">Vouchers</p>
            <p className="actionOption" onClick={()=> nav(`/sales`)}>Sales Voucher</p>
            <p className="actionOption" onClick={()=> nav(`/purchase`)}>Purchase Voucher</p>
            <p className="actionOption" onClick={()=> setIsPModalOpen(true)}>Payment</p>
            <p className="actionOption" onClick={()=> setIsRModalOpen(true)}>Reciept</p>

            <button id="tDateBtn" className="btnMini blue" onClick={()=>setIsModalOpen(true)}><i className='fa-solid fa-clock'></i>  Transaction Date</button> 
        </div>
       
        {isModalOpen && (
          <Modal onClose = {()=>setIsModalOpen(false)} />
        )}

        {isItemModalOpen && (
          <ItemModal onClose={()=>setIsItemModalOpen(false)} userId={userId} />
        )}

        {isPModalOpen && (
          <PaymnetRecieptModal onClose={()=>setIsPModalOpen(false)} userId={userId} action={"Payment"} />
        )}

        {isRModalOpen && (
          <PaymnetRecieptModal onClose={()=>setIsRModalOpen(false)} userId={userId} action={"Reciept"} />
        )}


    </div>
  )
}
