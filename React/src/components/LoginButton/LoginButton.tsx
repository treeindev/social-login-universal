import "./LoginButton.scss";

interface iLoginButton {
  callback: (sdk: String) => void;
  SDKId: String;
}

const LoginButton: React.FC<iLoginButton> = ({ callback, SDKId }) => {
  return (
    <button onClick={()=>callback(SDKId)} className={"loginBtn loginBtn--"+SDKId}>
      Login with {SDKId}
      {SDKId === "google" && <div id="GoogleLoginButton"></div>}
    </button>
  );
}

export default LoginButton;