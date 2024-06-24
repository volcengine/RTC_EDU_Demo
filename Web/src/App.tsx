import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from '@/pages/Login';
import Scene from '@/pages/Scene';
import Replay from '@/pages/Replay';
import { BASENAME } from './config';
import Auth from './components/Auth';
import Meeting from './scene/Meeting';
import Edub from './scene/Edub';
import Small from './scene/Edus';
import { useSelector } from './store';
import '@/theme/dark.css';
import '@/theme/light.css';

function App() {
  const theme = useSelector((state) => state.ui.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.className = theme;
  }, [theme]);

  return (
    <BrowserRouter basename={BASENAME}>
      <Auth>
        <Routes>
          <Route path="/">
            <Route path="login" element={<Login />} />
            <Route path="replay" element={<Replay />} />
            <Route path="vc" element={<Meeting />} />
            <Route path="edub" element={<Edub />} />
            <Route path="edus" element={<Small />} />
            <Route path="/:unknown" element={<Navigate to="/" replace />} />
            <Route index element={<Scene />} />
          </Route>
        </Routes>
      </Auth>
    </BrowserRouter>
  );
}

export default App;
