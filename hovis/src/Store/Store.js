import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux';
import Reducers from '../Reducers/Reducers';

const StoreRef = createStore(Reducers, applyMiddleware(thunk, logger));

export default StoreRef;