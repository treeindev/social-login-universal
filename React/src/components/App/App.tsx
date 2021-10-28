import React, { useEffect, useState } from 'react';
import { universalLogin } from '../../services/universalLogin';

import Loading from '../Loading/Loading';
import './App.scss';

function App() {
  const [loading, setLoading] = useState<Boolean>(true);
  const [user, setUser] = useState<any>(false);

  useEffect(() => {
    universalLogin.hasActiveSession()
      .then((userSession) => {
        setUser(userSession);
        setLoading(false);
      });
  })

  return (
    <div className="App">
      <header className="header">
        <p>
          Social Login Universal
        </p>
      </header>
      <section className="body">
        {loading && <Loading />}
        {!loading && <p>{user ? "user is logged in" : "user is not logged in"}</p>}
      </section>
      <footer className="footer">
        <span>Click to logout</span>
      </footer>
    </div>
  );
}

export default App;
