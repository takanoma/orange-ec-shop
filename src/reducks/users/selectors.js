import {createSelector} from 'reselect';

const usersSelector = (state) => state.users;

export const getIsSignedIn = createSelector(
    [usersSelector],
    state => state.isSignedIn
)

export const getOrdersHistory = createSelector(
    [usersSelector],
    state => state.orders
)

// 現在のカート配列を返す
export const getProductsInCart = createSelector(
    [usersSelector],
    state => state.cart
)

export const getUserId = createSelector(
    [usersSelector],
    state => state.uid
)

export const getUserName = createSelector(
    [usersSelector],
    state => state.username
)