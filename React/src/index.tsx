import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './components/App/App';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import LinkedinSDKCallback from './services/SDKs/LinkedinSDKcallback';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        {/* 
          This app tries to be SDK agnostic on its architecture. However, there are cases where custom code is required.
          The Linkedin SDK login is one of this cases. It requires a callback URL to process the user token.
          A custom React component has been created to handle this case.
        */}
        <Route exact path="/callback/linkedin" component={LinkedinSDKCallback} />

        {/*
          All other cases are going to fall on the following routing match.
        */}
        <Route component={App} />
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
