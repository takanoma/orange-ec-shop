import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getIsSignedIn} from "./reducks/users/selectors";
import {listenAuthState} from "./reducks/users/operations";

// childrenは子要素 {Home}コンポーネントを指す
const Auth = ({children}) => {
    const dispatch  = useDispatch();
    const selector = useSelector((state) => state);
    const isSignedIn = getIsSignedIn(selector);

    useEffect(() => {
        if (!isSignedIn) {
            dispatch(listenAuthState())
        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    // redirectにすると、最初のレンダーで常にリダイレクトされてしまう
    if (!isSignedIn) {
        return <></>
    } else {
        return children
    }
}

export default Auth