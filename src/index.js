import React from 'react';
import ReactDOM from 'react-dom';
import Template from './pages/template';
// import App from './App';
import './style/index.less';

const render = (Component) => {
  ReactDOM.render(<Component />, document.getElementById('root'));
};

render(Template);
