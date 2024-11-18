import { useNavigate } from "react-router-dom";
import logo from "../Assets/logo.svg"

export default function NavBar(){
    const nav = useNavigate()
    const logout = () =>{
        localStorage.removeItem("uid")
        localStorage.removeItem("uname")
        localStorage.removeItem("Company")
        localStorage.removeItem("Items")
        localStorage.removeItem("tDate")
        nav("/login")
    }

    return(
        <div id="navBar" className="flex flex-row spaceBetween">
                <div id="navbarLeft">
                    <img src={logo} alt="Logo Clerky" id="navbarLogoImage" />
                </div>
                <div id="navbarRight" className="flex flex-row center">
                    <div className="navButtons red" onClick={()=>nav("/report")}>
                        <i className="fa-solid fa-chart-pie"></i>
                    </div>
                    <div className="navButtons green" onClick={()=> nav("/")}>
                        <i className="fa-solid fa-home"></i>
                    </div>
                    <div className="navButtons blue">
                        <i className="fa-solid fa-sun"></i>
                    </div>

                    <div className="navButtons darkBlue">
                        <i className="fa-solid fa-refresh" onClick={()=>window.location.reload()}></i>
                    </div>

                    <div id="profileLogo"></div>

                    <div className="navButtons orange" onClick={logout}>
                        <i className="fa-solid fa-door-open"></i>
                    </div>
                </div>
            </div>
    );
}