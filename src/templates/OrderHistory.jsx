import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import List from "@material-ui/core/List";
import {getOrdersHistory} from "../reducks/users/selectors";
import {OrderHistoryItem} from "../components/Products";
import {fetchOrdersHistory} from "../reducks/users/operations";
import { makeStyles } from '@material-ui/core/styles';
import {push} from "connected-react-router";

const useStyles = makeStyles((theme) => ({
    orderList: {
        background: theme.palette.grey["100"],
        margin: '0 auto',
        padding: 32,
        [theme.breakpoints.down('sm')]: {
            width: '100%'
        },
        [theme.breakpoints.up('md')]: {
            width: 768
        }
    },
}))

const OrderHistory = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const selector = useSelector(state  => state)
    const orders = getOrdersHistory(selector);

    // 関数に渡す引数がない、依存関係がないので、初回だけレンダリング
    useEffect(() => {
        dispatch(fetchOrdersHistory())
    },[]);// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <section className="c-section-wrapin">
            <List className={classes.orderList}>
                {orders.length === 0 && (
                    <div>注文履歴がありません</div>
                )}
                {orders.length > 0 && (
                    orders.map((order, index) => <OrderHistoryItem order={order} key={index} />)
                )}
            </List>
            <div className="module-spacer--medium" />
            <p className="u-text-small c-section__reset-text-link" onClick={() => dispatch(push('/'))}><span>トップページ</span></p>
        </section>
    );
};

export default OrderHistory;