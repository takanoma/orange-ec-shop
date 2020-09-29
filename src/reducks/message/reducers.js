import * as Actions from './actions';
import initialState from '../store/initialState';

export const MessageReducer = (state = initialState.message, action) => {
    switch (action.type) {
        case Actions.MESSAGE:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}