import {
    createStore as reduxCreateStore,
    combineReducers,
    applyMiddleware
} from "redux";
import {connectRouter, routerMiddleware} from "connected-react-router";
import thunk from 'redux-thunk';

import {UsersReducer} from "../users/reducers";
import {ProductsReducer} from "../products/reducers";
import {MessageReducer} from "../message/reducers";

export default function createStore(history) {
    return reduxCreateStore(
        combineReducers({
            router: connectRouter(history),
            users: UsersReducer,
            products: ProductsReducer,
            message: MessageReducer
        }),
        applyMiddleware(
            routerMiddleware(history),
            thunk
        )
    )
}