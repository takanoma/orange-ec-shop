import React, {useCallback, useEffect} from 'react';
import {authenticate} from "../reducks/users/operations";
import {useDispatch, useSelector} from "react-redux";
import {push} from "connected-react-router";
import {messageAction} from "../reducks/message/actions";
import {getMessage} from "../reducks/message/selectors";

const AuthenticatedComplete = () => {
    const dispatch = useDispatch();

    const selector = useSelector(state => state);
    const message = getMessage(selector);
    const token = window.location.pathname.split('token/')[1];

    useEffect(() => {
        if (token) {
            dispatch(authenticate(token));
        }
    },[]);// eslint-disable-line react-hooks/exhaustive-deps

    const goBackToSignIn = useCallback(() => {
        dispatch(messageAction({
            type: "",
            content: ""
        }));
        dispatch(push('/signin'))
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="c-section-wrapin">
            <h2 className="u-text__headline u-text-center">本登録完了</h2>
            <div className="module-spacer--medium" />
            {
                message && message.content && (
                    <div className="c-section__signup__error">{message.content}</div>
                )
            }
            {
                message && message.type === "success" && (
                    <div className="c-section-message-area">
                        <div className="c-section-message">本登録が完了しました。</div>
                        <div className="module-spacer--small" />
                        <div className="c-section-message">サインイン画面よりサインインの上、当ショッピングサイトをご利用ください。</div>
                    </div>
                )
            }

            <div className="module-spacer--medium" />
            <p className="u-text-small c-section__signup-text-link" onClick={goBackToSignIn}><span>サインイン画面</span></p>
        </div>
    )
}

export default AuthenticatedComplete;