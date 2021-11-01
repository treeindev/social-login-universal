import "./LoginButton.scss";

interface iLoginButton {
  callback: (sdk: String) => void;
  SDKId: String;
}

const LoginButton: React.FC<iLoginButton> = ({ callback, SDKId }) => {
  return (
    <button onClick={()=>callback(SDKId)} className="loginBtn loginBtn--facebook">
      Login with Facebook
    </button>
  );
}

export default LoginButton;