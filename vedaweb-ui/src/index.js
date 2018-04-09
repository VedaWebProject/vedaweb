import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

document.body.style.backgroundColor = '#fff';
document.body.style.height = '101%';

//render app
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
