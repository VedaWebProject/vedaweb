import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import {unregister} from './registerServiceWorker';

import './index.css';

import { BrowserRouter as Router } from 'react-router-dom'

import Browserizr from 'browserizr';


//alert and block if IE/Edge
if (Browserizr.is_ie || Browserizr.is_edge) {
    alert("We suspect you are using the Internet Explorer or Microsoft Edge.\nUnfortunately, VedaWeb only works with modern web browsers.\nYou will need to use Firefox, Chrome or something similar instead.");
} else {

    //info for mobile
    if (Browserizr.is_mobile) {
        alert("We suspect you are using a mobile device.\nVedaWeb is not optimized for mobile devices. We recommend to use a desktop browser instead.");
    }

    //render app
    ReactDOM.render(
        <Router basename={process.env.PUBLIC_URL}>
            <App />
        </Router>
        , document.getElementById('root')
    );
    unregister(); //unregister existing service worker

}



