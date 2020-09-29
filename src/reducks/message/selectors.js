import {createSelector} from 'reselect';

const userSelector = (state) => state.message;

export const getMessage = createSelector(
    [userSelector],
    state => state
)