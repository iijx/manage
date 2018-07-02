import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from "react-redux";
import { createStore, applyMiddleware  } from 'redux';
import reducer from './reducers';
import thunk from 'redux-thunk';

const store = (() => {
    if (process.env.NODE_ENV !== 'prodution' && (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())) {
        return createStore(reducer, applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
    }
    else return createStore(reducer, applyMiddleware(thunk));

})();

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
, document.getElementById('root'));
