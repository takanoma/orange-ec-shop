import React, {useCallback, useState} from 'react';
import {PrimaryButton, TextInput} from "../components/UIkit";
import { signUp } from "../reducks/users/operations";
import {useDispatch, useSelector} from "react-redux";
import {push} from "connected-react-router";
import {isValidEmailFormat} from "../function/common";
import {getMessage} from "../reducks/message/selectors";
import {signOutAction} from "../reducks/users/actions";

const SignUp = () => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState(""),
        [email, setEmail] = useState(""),
        [password, setPassword] = useState(""),
        [confirmPassword, setConfirmPassword] = useState(""),
        [usernameHelperText, setUsernameHelperText] = useState(""),
        [emailHelperText, setEmailHelperText] = useState(""),
        [passwordHelperText, setPasswordHelperText] = useState(""),
        [confirmPasswordHelperText, setConfirmPasswordHelperText] = useState("");

    const inputUsername = useCallback((event) => {
        setUsername(event.target.value)
    }, [setUsername]);

    const inputEmail = useCallback((event) => {
        setEmail(event.target.value)
    }, [setEmail]);

    const inputPassword = useCallback((event) => {
        setPassword(event.target.value)
    }, [setPassword]);

    const inputConfirmPassword = useCallback((event) => {
        setConfirmPassword(event.target.value)
    }, [setConfirmPassword]);

    const selector = useSelector(state => state);
    const message = getMessage(selector);

    const onSubmit = () => {
        setUsernameHelperText("");
        setEmailHelperText("");
        setPasswordHelperText("");
        setConfirmPasswordHelperText("");
        signOutAction();
        let hasError = false;
        if (username === "") {
            setUsernameHelperText("ユーザー名が入力されていません");
            hasError = true;
        }
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
        if (confirmPassword === "") {
            setConfirmPasswordHelperText("パスワード（再確認）が入力されていません");
            hasError = true;
        }
        if (hasError) {
            return;
        }

        dispatch(signUp(username, email, password, confirmPassword));
    }

    return (
        <div className="c-section-container">
            <h2 className="u-text__headline u-text-center">アカウント登録</h2>
            <div className="module-spacer--medium" />
            {
                message && message.content && (
                    <div className="c-section__signup__error">{message.content}</div>
                )
            }
            <TextInput
                fullWidth={true} label={"ユーザー名"} multiline={false} required={true}
                rows={1} value={username} type={"text"} onChange={inputUsername} helperText={usernameHelperText} hasError={usernameHelperText !== ""}
            />
            <TextInput
                fullWidth={true} label={"メールアドレス"} multiline={false} required={true}
                rows={1} value={email} type={"email"} onChange={inputEmail} helperText={emailHelperText} hasError={emailHelperText !== ""}
             />
             <TextInput
                 fullWidth={true} label={"パスワード"} multiline={false} required={true}
                 rows={1} value={password} type={"password"} onChange={inputPassword} helperText={passwordHelperText} hasError={passwordHelperText !== ""}
             />
             <TextInput
                 fullWidth={true} label={"パスワード（再確認）"} multiline={false} required={true}
                 rows={1} value={confirmPassword} type={"password"} onChange={inputConfirmPassword} helperText={confirmPasswordHelperText} hasError={confirmPasswordHelperText !== ""}
             />
            <div className="module-spacer--medium" />
            <div className={"center"}>
                <PrimaryButton
                    label={"アカウントを登録する"}
                    onClick={onSubmit}
                />
                <div className="module-spacer--small" />
                <p className="u-text-small c-section__signup-text-link" onClick={() => dispatch(push('/signin'))}><span>アカウントをお持ちの方はこちら</span></p>
            </div>
        </div>
    )
}

export default SignUp