import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const SignIn = () => {
    const [signInInput, setSignInInput] = useState("")
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleChange = (event) => {
        setSignInInput(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setUser("weegembump");
        navigate('/home');
    }

    return (
        <form onSubmit={ handleSubmit } className="sign-in">
          <label htmlFor="sign-in">Please provide your username: </label>
          <input
            type="text"
            id="sign-in"
            value={ signInInput }
            onChange={ handleChange }
            placeholder="weegembump"
          />
          <button type="submit">Sign In</button>
        </form>
      );
};
  
export default SignIn;
