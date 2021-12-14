import { useEffect, useState } from "react";
import { utilities } from "../utilities";
import { LINKEDIN_MESSAGE_KEY, LINKEDIN_SDK_STORAGE_KEY } from "./LinkedinSDK";

interface ParamsType {
  state: string;
  code?: string;
  error?: string;
  error_description?: string;
};

/**
 * This is the React component that will get executed after user logs into Linkedin
 * This is a requirement of the 3 legged authentication system.
 */
function LinkedinSDKCallback() {
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const params: ParamsType = utilities.parseURL(window.location.search);
    if (params.state !== localStorage.getItem(LINKEDIN_SDK_STORAGE_KEY)) {
      setErrorMessage('State does not match');
    } else if (params.error) {
      const errorMessage =
        params.error_description || 'Login failed. Please try again.';
      window.opener &&
        window.opener.postMessage(
          {
            error: params.error,
            state: params.state,
            errorMessage,
            from: LINKEDIN_MESSAGE_KEY
          },
          window.location.origin,
        );
      // Close tab if user cancelled login
      if (params.error === 'user_cancelled_login') {
        window.close();
      }
    }

    if (params.code) {
      window.opener &&
        window.opener.postMessage(
          {
            code: params.code,
            state: params.state,
            from: LINKEDIN_MESSAGE_KEY
          },
          window.location.origin,
        );
    }
  }, []);

  return(<h1>I shall send a post message to my window.opener</h1>);
}

export default LinkedinSDKCallback;