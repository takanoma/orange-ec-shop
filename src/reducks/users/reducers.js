import * as Actions from './actions';
import initialState from '../store/initialState';

// actionが発生した際に、どのようにstateを変化させるか設定する
export const UsersReducer = (state = initialState.users, action) => {
    switch (action.type) {
        case Actions.SIGN_IN:
            return {
                ...state,
                ...action.payload
            }
        case Actions.FETCH_ORDERS_HISTORY:
            return {
                ...state,
                orders: [...action.payload]
            };
        case Actions.FETCH_PRODUCTS_IN_CART:
            return {
                ...state,
                // cartは配列
                cart: [...action.payload] // 現在の商品配列を新しい商品配列で上書きする
            };
        case Actions.SIGN_OUT:
            return {
                // サインアウト時は既存のあたいは捨てて、初期状態に戻す
                //
                ...action.payload
            }
        default:
            return state
    }
}