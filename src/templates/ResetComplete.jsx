import React, {useCallback} from 'react';
import {PrimaryButton} from "../components/UIkit";
import { useDispatch } from "react-redux";
import {push} from "connected-react-router";

const ResetComplete = () => {
    const dispatch = useDispatch()

    const goBackToTop = useCallback(() => {
        dispatch(push('/signin'))
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="c-section-container">
            <p>入力したアドレスにパスワードリセット用のメールをお送りしました。</p>
            <div className="module-spacer--medium" />
            <PrimaryButton label="ログイン画面" onClick={goBackToTop} />
        </div>
    );
}

export default ResetComplete