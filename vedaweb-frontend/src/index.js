import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

import './index.css';

import { BrowserRouter as Router } from 'react-router-dom'

import Browserizr from 'browserizr';


//just alert if IE or mobile
if (Browserizr.is_ie || Browserizr.is_edge) {
    alert("We suspect you are using the Internet Explorer or Microsoft Edge.\nUnfortunately, VedaWeb only works with modern web browsers.\nYou will need to use Firefox, Chrome or something similar instead.");
} else if (Browserizr.is_mobile) {
    alert("We suspect you are using a mobile device.\nUnfortunately, VedaWeb is not designed to work on mobile devices. You will need to try to use a desktop browser instead.");
} else {

    //render app
    ReactDOM.render(
        <Router basename={process.env.PUBLIC_URL}>
            <App />
        </Router>
        , document.getElementById('root')
    );
    registerServiceWorker();

}



