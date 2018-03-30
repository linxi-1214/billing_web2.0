import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Page} from './App';
import Navbar from './navbar';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Page />, document.getElementById('root'));
ReactDOM.render(<Navbar/>, document.getElementById('navbar'));
registerServiceWorker();
