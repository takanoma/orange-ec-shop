import React, {useEffect} from 'react';
import IconButton from "@material-ui/core/IconButton";
import {Badge} from "@material-ui/core";
import {fetchProductsInCart} from "../../reducks/users/operations";
import {useDispatch, useSelector} from "react-redux";
import {getIsSignedIn, getProductsInCart, getUserId} from "../../reducks/users/selectors";
import {push} from "connected-react-router"
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import {db} from '../../firebase/index'
import MenuIcon from "@material-ui/icons/Menu";

const HeaderMenu = (props) => {
    const dispatch = useDispatch();
    const selector = useSelector((state) => state);
    const userId = getUserId(selector);
    const isSignedIn = getIsSignedIn;
    // cart配列を取得する
    let productsInCart = getProductsInCart(selector);

    //Listen products in user's cart
    useEffect(() => {
        if (!isSignedIn) return;
        const unsubscribe = db.collection('users').doc(userId).collection('cart')
            .onSnapshot(snapshots => {
                snapshots.docChanges().forEach(change => {
                    const product = change.doc.data();
                    const changeType = change.type
                    switch (changeType) {
                        case 'added':
                            productsInCart.push(product);
                            break;
                        case 'modified':
                            const index = productsInCart.findIndex(product => product.cartId === change.doc.id)
                            productsInCart[index] = product;
                            break;
                        case 'removed':
                            productsInCart = productsInCart.filter(product => product.cartId !== change.doc.id);
                            break;
                        default:
                            break;
                    }
                });

                dispatch(fetchProductsInCart(productsInCart))
            });

        return () => unsubscribe()  // これを書かないと他のページに遷移して必要なくてもリッスンしてしまうので、忘れないこと
    },[]);

    return (
        <>
            <IconButton onClick={() => dispatch(push('/cart'))}>
                <Badge badgeContent={productsInCart ? productsInCart.length : ''} color="secondary">
                    <ShoppingCartIcon />
                </Badge>
            </IconButton>
            <IconButton
                aria-label="Menu Items"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={(e) => props.handleDrawerToggle(e, true)}
                color="inherit"
            >
                <MenuIcon />
            </IconButton>
        </>
    );
};
export default HeaderMenu;