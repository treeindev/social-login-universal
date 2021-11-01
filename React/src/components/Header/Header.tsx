import { useContext } from "react";

import "./Header.scss";
import { UserContext } from "../../contexts/userContext";
import { User } from "../../models/interfaces";

function Header() {
  const user: User = useContext(UserContext).user;

  return (
    <header className="header">
      <div className="content">
        <h1>
          Social Login Universal
        </h1>
        {user.active && <h4>Hello {user.full_name}</h4>}
      </div>
    </header>
  )
}

export default Header;