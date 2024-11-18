import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Logo from "../Assets/logo.svg";

export default function Signup() {
    const nav = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const createUser = async () => {
        try {
            const response = await fetch("http://localhost:5000/createUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                if(data.response){
                    localStorage.removeItem("uid");
                    localStorage.removeItem("uname");
                    nav("/login")
                }
            }

        } catch (error) {
            console.error("Error during signup: " + error);
            alert("Failed Insert")
        }
    };

    return (
        <div id="loginContainer" className="Container flex flex-row">
            <div className="imageSection"></div>
            <div className="formSection flex flex-column spaceBetween">
                <button className="btn btnHalf black right" onClick={() => nav("/login")}>
                    Login
                </button>
                <div id="logoBox" className="flex flex-column">
                    <img src={Logo} alt="Logo" id="logoImg" />
                    <p className="titleText">Welcome to Clerky</p>
                    <p className="subText">Every Boss's Favourite</p>
                </div>
                <div id="formBox" className="flex flex-column">
                    <input
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    <button className="btn blue" onClick={createUser}>
                        Signup
                    </button>
                </div>
                <p className="subText center">Sign Up to avail Premium</p>
            </div>
        </div>
    );
}
