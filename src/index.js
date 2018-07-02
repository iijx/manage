import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose  } from 'redux';
import reducer from './reducers';
import thunk from 'redux-thunk';


const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk),
);

const store = createStore(reducer, enhancer);
// const store = (() => {
//     if (process.env.NODE_ENV !== 'prodution' && (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())) {
//         return createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__((applyMiddleware(thunk))));
//     }
//     else return createStore(reducer, applyMiddleware(thunk));

// })();

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
, document.getElementById('root'));
