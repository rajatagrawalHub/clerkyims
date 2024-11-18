import { useNavigate } from "react-router-dom";
import "../App.css";
import Logo from "../Assets/logo.svg";
import { useState, useContext, useEffect } from "react";
import {UserContext} from "../contexts/userContext";

export default function Login(){
    const nav =useNavigate();
    const [emailuser, setEmailuser] = useState("")
    const [Password, setPassword] = useState("")
    const {setUserId, setUserName} = useContext(UserContext);

    useEffect(()=>{
        if(localStorage.getItem("uid")){
            setUserId(localStorage.getItem("uid"))
            setUserName(localStorage.getItem("uname"))
            nav("/")
        }
    })

    const authenticate = async ()=>{
        try{
            const response = await fetch("http://localhost:5000/loginUser",{
                method: 'POST',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({usernameEmail: emailuser, password: Password})
            })
            
            const data = await response.json()

            if(response.ok){
                alert(data.message)
                console.log(data.user)
            }

            if(data.user){
                setUserId(data.user._id)
                setUserName(data.user.Username)
                localStorage.setItem("uid",data.user._id)
                localStorage.setItem("uname",data.user.Username)
                nav("/")
            }

        }catch(error){
            console.error("Error Calling Login API " + error)
            alert("Failed Fetch")
        }
    }
    
    return(
        <div id="loginContainer" className="Container flex flex-row">
            <div className="imageSection">
            </div>
            <div className="formSection flex flex-column spaceBetween">
                <button className="btn btnHalf black right" onClick={()=>nav("/createUser")}>New to Clerky</button>
                <div id="logoBox" className="flex flex-column">
                    <img src={Logo} alt="Logo" id="logoImg" />
                    <p className="titleText">Welcome to Clerky</p>
                    <p className="subText">Every Boss's Favourite</p>
                </div>
                <div id="formBox" className="flex flex-column">
                    <input type="text" placeholder="Email or Username" onChange={(e)=>{setEmailuser(e.target.value)}} value={emailuser} />
                    <input type="password" placeholder="Password" onChange={(e) => {setPassword(e.target.value)}} value={Password} />
                    <button className="btn blue" onClick={authenticate}>Login</button>             
                </div>
                <p className="subText center">Please Sign In to Continue</p>
            </div>
        </div>
    );
}