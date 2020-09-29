import {signInAction, signOutAction, fetchProductsInCartAction, fetchOrdersHistoryAction} from "./actions";
import {push} from "connected-react-router";
import {auth, FirebaseTimestamp, db} from "../../firebase/index";
import {messageAction} from "../message/actions";
import {generateRandomChar, getEncryptedString, sendEmail} from "../../function/common";
import {userRegistrationBody, userRegistrationTitle} from "../../mail/userRegistration";
import {userReRegistrationBody, userReRegistrationTitle} from "../../mail/userReRegistration";
import {config} from "../../const/config";

// 必要に応じて、operation -> action のフローで呼ばれる
const usersRef = db.collection('users')

export const addProductToCart = (addedProduct) => {
    return async (dispatch, getState) => {
        const uid = getState().users.uid;
        const cartRef = usersRef.doc(uid).collection('cart').doc();
        addedProduct['cartId'] = cartRef.id;
        // dbに設定
        await cartRef.set(addedProduct);
        dispatch(push('/'))
    }
}

// Cart情報を更新
export const fetchProductsInCart = (products) => {
    return async (dispatch) => {
        dispatch(fetchProductsInCartAction(products))
    }
}

/* reduxの関数なので、dispatchを通して呼ばれる */
export const listenAuthState = () => {
    return async (dispatch) => {
        return auth.onAuthStateChanged(user => {
            if (user) {
                const uid = user.uid;

                db.collection('users').doc(uid).get()
                    .then(snapshots => {
                        const data = snapshots.data();
                        dispatch(signInAction({
                            isSignedIn: true,
                            role: data.role,
                            uid: uid,
                            username: data.username,
                            isAuthenticated: data.is_authenticated
                        }))
                    })
            } else {
                console.info("push signin");
                dispatch(push('/signin'))
            }
        })
    }
}

export const fetchOrdersHistory = () => {
    return async (dispatch, getState) => {
        const uid = getState().users.uid;
        const list = []

        usersRef.doc(uid).collection('orders')
            .orderBy('updated_at', "desc").get()
            .then(snapshots => {
                snapshots.forEach(snapshot => {
                    const data = snapshot.data();
                    list.push(data)
                });
                // storeの更新
                dispatch(fetchOrdersHistoryAction(list))
            })
    }
}


export const signIn = (email, password) => {
    return async (dispatch) => {
        auth.signInWithEmailAndPassword(email, password)
            .then(result => {
                const user = result.user

                if (user) {
                    const uid = user.uid

                    db.collection('users').doc(uid).get()
                        .then(snapshots => {
                            const data = snapshots.data()
                            dispatch(signInAction({
                                isSignedIn: true,
                                role: data.role,
                                uid: uid,
                                username: data.username,
                                isAuthenticated: data.is_authenticated
                            }))

                            dispatch(push('/'))
                        })
                }
            }).catch(e => {
                dispatch(messageAction({
                    type: "error",
                    content: `メールアドレスまたはパスワードが間違っています。もう一度ご確認の上、ログインしてください。`
                }));
        })
    }
}

export const resetPassword = (email) => {
    return async (dispatch) => {
        auth.sendPasswordResetEmail(email)
            .then(() => {
                dispatch(messageAction({
                    type: "error",
                    content: "入力したアドレスにパスワードリセット用のメールをお送りしました。"
                }));
                dispatch(push('/signin/reset/complete'))
            }).catch(() => {
                dispatch(messageAction({
                    type: "error",
                    content: "登録されていないメールアドレスです。もう一度ご確認ください。"
                }));
            })
    }
}

export const signUp = (username, email, password, confirmPassword) => {

    return async (dispatch) => {

        if (password !== confirmPassword) {
            dispatch(messageAction({
                type: "error",
                content: "パスワードが一致しません。もう一度ご確認ください。"
            }));
            return false
        }

        return auth.createUserWithEmailAndPassword(email, password)
            .then(result => {
                const user = result.user

                if (user) {
                    const uid = user.uid;
                    const timestamp = FirebaseTimestamp.now();
                    const token = generateRandomChar(16);

                    const userInitialDate = {
                        created_at: timestamp,
                        email: email,
                        role: 'customer',
                        uid: uid,
                        updated_at: timestamp,
                        username: username,
                        is_authenticated: false,
                        token: token
                    }

                    db.collection('users').doc(uid).set(userInitialDate)
                        .then(async() => {
                            await sendEmail(email, userRegistrationTitle, userRegistrationBody(email, config().common.url + "/signup/token/" + token), 0);
                            const target = getEncryptedString(encodeURI(email));
                            dispatch(push('/signup/regist/' + target));

                        })
                }
            }).catch(e => {
                if (e.code === 'auth/email-already-in-use') {
                    dispatch(messageAction({
                        type: "error",
                        content: `すでに登録されているメールアドレスです。パスワードをお忘れの場合は、パスワードのリセットをおためしください。`
                    }));
                } else {
                    dispatch(messageAction({
                        type: "error",
                        content: `アカウント登録に失敗失敗しました。通信環境をご確認のうえ、もう一度お試しください。`
                    }));
                }
            })
    }

}

export const signOut = () => {
    console.info("signOut");
    return async (dispatch) => {
        auth.signOut()
            .then(() => {
                // firebaseの認証をsignOut状態にしたら、reduxの状態もsignOut状態にする
                dispatch(signOutAction());
                dispatch(push('/signin'))
            })
    }
}

export const authenticate = (token) => {
    return async (dispatch) => {
        db.collection('users').where("token", "==", token).get()
            .then(async(snapshots) => {
                snapshots.forEach(async(snapshot) => {
                    const data = snapshot.data();
                    if (data.is_authenticated) {
                        dispatch(messageAction({
                            type: "error",
                            content: "すでに本登録が完了しています。サインイン画面よりサインインの上、当ショッピングサイトをご利用ください。"
                        }));
                        return;
                    }
                    let date = data.updated_at.toDate();
                    date.setDate(date.getDate() + 1);
                    const currentDate = new Date();

                    if (date.getTime() < currentDate.getTime()) {
                        dispatch(messageAction({
                            type: "error",
                            content: "認証メールの有効期限が切れております。再発行しましたので、メールをご確認ください。"
                        }));
                        const token = generateRandomChar(16);
                        let entity = {
                            uid: data.uid,
                            token: token,
                            updated_at: FirebaseTimestamp.now()
                        };
                        await db.collection('users').doc(data.uid).set(entity, {merge: true});
                        await sendEmail(data.email, userReRegistrationTitle, userReRegistrationBody(data.email, config().common.url + "/signup/token/" + token), 0);
                        return;
                    }

                    let entity = {
                        uid: data.uid,
                        is_authenticated: true,
                        updated_at: FirebaseTimestamp.now()
                    };
                    await db.collection('users').doc(data.uid).set(entity, {merge: true});
                    dispatch(messageAction({
                        type: "success",
                        content: ""
                    }));
                })
            })
    }
}

