import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.less';
import App from './App';
import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
