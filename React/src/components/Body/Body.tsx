import { useContext } from "react";

import "./Body.scss";
import { UserContext } from "../../contexts/userContext";
import { User } from "../../models/interfaces";
import LoginButton from "../LoginButton/LoginButton";

interface iBody {
  onLogin: (SDKId: String) => void
}

const Body: React.FC<iBody> = ({onLogin}) => {
  const user: User = useContext(UserContext).user;

  return (
    <section className="body">
      <div className="login-container">
        <h3>Welcome, please login with your social account.</h3>
        {!user.active && <LoginButton callback={onLogin}  SDKId="facebook" />}
      </div>
    </section>
  )
}

export default Body;