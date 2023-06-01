import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link } from "react-router-dom";

const Nav = () => {
    const { user } = useContext(UserContext);
    
    return (
      <nav className="nav">
        <Link to="/home" className="link-homepage"> Homepage </Link>
        <p><b>Logged in as:</b> { user }</p>
      </nav>
    );
 };
  
export default Nav;