import React, {useCallback} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getProductsInCart} from "../reducks/users/selectors";
import List from "@material-ui/core/List";
import {makeStyles} from "@material-ui/core/styles";
import {CartListItem} from "../components/Products";
import {PrimaryButton, GreyButton} from "../components/UIkit";
import {push} from "connected-react-router"

const useStyles = makeStyles((theme) => ({
    root: {
        margin: '0 auto',  // 上下：0　左右：auto となり左右中央寄せ
        maxWidth: 512,
        width: '100%'
    },
}));

const CartList = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const selector = useSelector(state => state);
    const productsInCart = getProductsInCart(selector);

    const goToOrder = useCallback(() => {
        dispatch(push('/order/confirm'))
    }, [dispatch]);

    const backToTop = useCallback(() => {
        dispatch(push('/'))
    }, [dispatch]);

    const isAuthenticated = selector.users.isAuthenticated;

    // product.cartId は users/operations.js@addProductToCartを参照
    return (
        <section className="c-section-wrapin">
            <h2 className="u-text__headline">ショッピングカート</h2>
            <List className={classes.root}>
                {productsInCart.length > 0 && (
                    productsInCart.map(product => <CartListItem product={product} key={product.cartId} />)
                )}
            </List>
            <div className="module-spacer--medium" />
            <div className="p-grid__column">
                {
                    productsInCart.length > 0 ?
                        isAuthenticated ? (
                                <PrimaryButton label={"レジへ進む"} onClick={goToOrder} />
                        ) :
                                (
                                    <div className="c-section__shopping-cart-warning">
                                        メールアドレスの認証が確認できていないため、購入することができません。<br/>
                                        メール受信箱をご確認の上、メールアドレスの認証をお願いいたします。
                                    </div>
                                )
                        : (
                            <div className="c-section__shopping-cart-noting">ショッピングカートに商品がありません</div>
                        )
                }


                <div className="module-spacer--extra-extra-small"/>
                <GreyButton label={"ショッピングを続ける"} onClick={backToTop} />
            </div>
        </section>
    );
};
export default CartList;