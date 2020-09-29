import React, {useCallback, useState} from 'react';
import {PrimaryButton, TextInput} from "../components/UIkit";
import {signIn} from "../reducks/users/operations";
import { useDispatch, useSelector } from "react-redux";
import {push} from "connected-react-router";
import {getMessage} from "../reducks/message/selectors";
import {isValidEmailFormat} from "../function/common";

const SignIn = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState(""),
        [password, setPassword] = useState(""),
        [emailHelperText, setEmailHelperText] = useState(""),
        [passwordHelperText, setPasswordHelperText] = useState("");

    const selector = useSelector(state => state);
    const message = getMessage(selector);

    const inputEmail = useCallback((event) => {
        setEmail(event.target.value)
    }, [setEmail]);

    const inputPassword = useCallback((event) => {
        setPassword(event.target.value)
    }, [setPassword]);

    const onSubmit = () => {
        setEmailHelperText("");
        setPasswordHelperText("");
        let hasError = false;
        if (email === "") {
            setEmailHelperText("メールアドレスが入力されていません");
            hasError = true;
        } else if (!isValidEmailFormat(email)) {
            setEmailHelperText("メール形式として妥当ではありません");
            hasError = true;
        }
        if (password === "") {
            setPasswordHelperText("パスワードが入力されていません");
            hasError = true;
        }

        if (hasError) {
            return;
        }
        dispatch(signIn(email, password));
    }

    return (
        <div className="c-section-wrapin">
            <h2 className="u-text__headline u-text-center">サインイン</h2>
            <div className="module-spacer--medium" />
            {
                message && message.content && (
                    <div className="c-section__login__error">{message.content}</div>
                )
            }
            <div className="c-section__login">
                <TextInput
                    fullWidth={true} label={"メールアドレス"} multiline={false} required={true}
                    rows={1} value={email} type={"email"} onChange={inputEmail} helperText={emailHelperText} hasError={emailHelperText !== ""}
                />
                <TextInput
                    fullWidth={true} label={"パスワード"} multiline={false} required={true}
                    rows={1} value={password} type={"password"} onChange={inputPassword} helperText={passwordHelperText} hasError={passwordHelperText !== ""}
                />
                <div className="module-spacer--medium" />
                <div className={"center"}>
                    <PrimaryButton
                        label={"サインイン"}
                        onClick={() => onSubmit()}
                    />
                    <div className="module-spacer--small" />
                    <p className="u-text-small c-section__login-text-link" onClick={() => dispatch(push('/signin/reset'))}>パスワードを忘れた方は<span>こちら</span></p>
                    <p className="u-text-small c-section__login-text-link" onClick={() => dispatch(push('/signup'))}><span>アカウント登録がまだですか？</span></p>
                </div>
            </div>
        </div>
    )
}

export default SignIn