import React, { useEffect, useState } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import Auth from './components/Auth';
import Login from './pages/Login';
import Meeting from './pages/View';

import styles from './app.less';
import './theme/dark.css';
import './theme/light.css';

import { useAppSelector } from './store/hooks';
import Scene from './pages/Scene';
import Edus from './pages/Edus';
import Edub from './pages/Edub';
import useDeviceAuth from './core/hooks/useDeviceAuth';

const App: React.FC = () => {
  const { theme } = useAppSelector((state) => state.ui);

  useEffect(() => {
    const root = document.documentElement;
    root.className = theme;
  }, [theme]);

  useDeviceAuth();

  return (
    <div className={styles.app}>
      <HashRouter>
        <Auth>
          <Switch>
            <Route path="/login" exact>
              <Login />
            </Route>
            <Route path="/vc" exact>
              <Meeting />
            </Route>
            <Route path="/edub" exact>
              <Edub />
            </Route>
            <Route path="/edus" exact>
              <Edus />
            </Route>
            <Route path="/" exact>
              <Scene />
            </Route>
          </Switch>
        </Auth>
      </HashRouter>
    </div>
  );
};

export default App;
