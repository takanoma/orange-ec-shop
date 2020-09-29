import React, {useCallback, useState} from 'react';
import {PrimaryButton, TextInput} from "../components/UIkit";
import { resetPassword } from "../reducks/users/operations";
import {useDispatch, useSelector} from "react-redux";
import {push} from "connected-react-router";
import {messageAction} from "../reducks/message/actions";
import {isValidEmailFormat} from "../function/common";
import {getMessage} from "../reducks/message/selectors";

const Reset = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState(""),
          [emailHelperText, setEmailHelperText] = useState("");

    const inputEmail = useCallback((event) => {
        setEmail(event.target.value)
    }, [setEmail]);

    const selector = useSelector(state => state);
    const message = getMessage(selector);

    const onSubmit = () => {
        setEmailHelperText("");
        let hasError = false;
        if (email === "") {
            setEmailHelperText("メールアドレスが入力されていません");
            hasError = true;
        } else if (!isValidEmailFormat(email)) {
            setEmailHelperText("メール形式として妥当ではありません");
            hasError = true;
        }

        if (hasError) {
            return;
        }

        dispatch(resetPassword(email));
    }

    const goBackToSignIn = useCallback(() => {
        dispatch(messageAction({
            type: "",
            content: ""
        }));
        dispatch(push('/signin'))
    }, [dispatch])


    return (
        <div className="c-section-container">
            <h2 className="u-text__headline u-text-center">パスワードリセット</h2>
            <div className="module-spacer--medium" />
            {
                message && message.content && (
                    <div className="c-section__reset__error">{message.content}</div>
                )
            }
            <TextInput
                fullWidth={true} label={"メールアドレス"} multiline={false} required={true}
                rows={1} value={email} type={"email"} onChange={inputEmail} helperText={emailHelperText} hasError={emailHelperText !== ""}
             />
            <div className="module-spacer--medium" />
            <div className={"center"}>
                <PrimaryButton
                    label={"パスワードをリセットする"}
                    onClick={() => onSubmit()}
                />
                <div className="module-spacer--small" />
                <p className="u-text-small c-section__reset-text-link"onClick={goBackToSignIn}><span>サインイン画面</span></p>
            </div>
        </div>
    )
}

export default Reset