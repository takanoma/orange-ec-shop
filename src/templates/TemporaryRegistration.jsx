import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {push} from "connected-react-router";
import {getMessage} from "../reducks/message/selectors";
import {getDecryptedString} from "../function/common";

const TemporaryRegistration = () => {
    const dispatch = useDispatch();
    const selector = useSelector(state => state);
    const message = getMessage(selector);

    let encoded = window.location.pathname.split('regist/')[1];
    let email = "";
    if (encoded) {
        email = getDecryptedString(encoded);
        email = decodeURI(email);
    }

    return (
        <div className="c-section-wrapin">
            <h2 className="u-text__headline u-text-center">仮登録完了</h2>
            <div className="module-spacer--medium" />
            {
                message && message.content && (
                    <div className="c-section__signup__error">{message.content}</div>
                )
            }
            <div className="c-section-message-area">
                <div className="c-section-message">ご登録頂いたアカウントはまだ本登録が完了しておりません。</div>
                <div className="module-spacer--small" />
                <div className="c-section-message">ご登録いただいたメールアドレス</div>
                <div className="c-section-message">
                    <div className="c-section-mail">{email}</div>
                </div>
                <div className="c-section-message">に本登録手続きのご案内メールを送信しました。</div>
                <div className="module-spacer--small" />
                <div className="c-section-message">本登録手続きのご案内メールに記載されたURLより24時間以内に本登録をおこなってください。</div>
            </div>
            <div className="module-spacer--medium" />
            <p className="u-text-small c-section__signup-text-link" onClick={() => dispatch(push('/signin'))}><span>サインイン画面</span></p>
        </div>
    )
}

export default TemporaryRegistration;