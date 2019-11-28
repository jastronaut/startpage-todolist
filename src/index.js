import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import StartPage from './App';

ReactDOM.render(<StartPage />, document.querySelector('main'));

serviceWorker.unregister();
