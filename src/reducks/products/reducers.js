import * as Actions from './actions';
import initialState from '../store/initialState';

export const ProductsReducer = (state = initialState.products, action) => {
    switch (action.type) {
        case Actions.DELETE_PRODUCT:
            return {
                ...state,
                list: [...action.payload]
            }
        case Actions.FETCH_PRODUCTS :
            // 現在のstateに対して、storeのproduct list[]に対して追加する
            return {
                ...state,
                list: [...action.payload]
            }
        default:
            return state
    }
}
