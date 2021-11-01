import { useContext } from "react";

import "./Footer.scss";
import { UserContext } from "../../contexts/userContext";
import { User } from "../../models/interfaces";

interface iFooter {
  onLogout: () => void
}

const Footer:React.FC<iFooter> = ({onLogout}) => {
  const user: User = useContext(UserContext).user;

  return (
    <footer className="footer">
      <div className="content">
        {!user.active && <p>Welcome, please login with your social account</p>}
        {user.active && <p>Hi {user.full_name}, <span onClick={onLogout}>click here to logout</span></p>}
      </div>
    </footer>
  );
}

export default Footer;