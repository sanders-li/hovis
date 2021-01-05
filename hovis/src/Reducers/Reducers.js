import { combineReducers } from 'redux';
import animationPlayingReducer from './animationReducer';

const reducers = combineReducers({
    animationPlayingReducer: animationPlayingReducer
});

export default reducers;