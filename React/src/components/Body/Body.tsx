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
        <h3>Welcome, {!user.active ? "please login with your social account" : user.full_name}.</h3>
        {!user.active && <div>
          <LoginButton callback={onLogin} SDKId="facebook" />
          <LoginButton callback={onLogin} SDKId="google" />
        </div>}
        {user.active && <div><img src={user.picture} /></div>}
      </div>
    </section>
  )
}

export default Body;