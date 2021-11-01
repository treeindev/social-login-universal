import React, { useCallback, useEffect, useState } from 'react';

import { defaultUser, UserContext } from '../../contexts/userContext';
import { User } from '../../models/interfaces';
import { universalLogin } from '../../services/universalLogin';
import Body from '../Body/Body';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import Loading from '../Loading/Loading';
import './App.scss';

function App() {
  const [loading, setLoading] = useState<Boolean>(true);
  const [user, setUser] = useState<User>(defaultUser);
  const contextValue = {user, setUser};

  const onLogin = async (SDKId: String) => {
    setLoading(true);
    setUser(
      await universalLogin.login(SDKId)
    );
    setLoading(false);
  }

  const onLogout = async () => {
    setLoading(true);
    await universalLogin.logout(user.sdk_id);
    setUser(defaultUser);
    setLoading(false);
  }

  // When application initializes it checks for existing active user.
  const initUser = useCallback( async() => {
    setLoading(true);
    setUser(await universalLogin.getUser());
    setLoading(false);
  }, []);
  useEffect(() => { initUser() }, [initUser]);

  return (
    <UserContext.Provider value={contextValue}>
      <div className="App">
        <Header />
        {loading ? <Loading /> : <Body onLogin={onLogin} />}        
        <Footer onLogout={onLogout} />
      </div>
    </UserContext.Provider>
  );
}

export default App;
