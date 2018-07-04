import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import 'react-select/dist/react-select.css'
import 'react-virtualized-select/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import 'css/index.css'
import 'css/report.less'


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
