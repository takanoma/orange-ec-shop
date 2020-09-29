import React from 'react';
import {Route, Switch} from "react-router";
import {
    ProductDetail, ProductList, OrderConfirm, OrderHistory,
    SignUp, SignIn, Reset, ProductEdit, CartList, UserMyPage, OrderComplete,
    TemporaryRegistration, AuthenticatedComplete, ResetComplete
} from "./templates";
import Auth from "./Auth";

const Router = () => {
    return(
        <Switch>
            <Route exact path={"/signup"} component={SignUp} />
            <Route exact path={"/signup/regist/:email"} component={TemporaryRegistration}/>
            <Route exact path={"/signup/token/:token"} component={AuthenticatedComplete}/>
            <Route exact path={"/signin"} component={SignIn} />
            <Route exact path={"/signin/reset"} component={Reset} />
            <Route exact path={"/signin/reset/complete"} component={ResetComplete} />

            <Auth>
                <Route exact path={"(/)?"} component={ProductList} />
                <Route exact path={"/product/:id"} component={ProductDetail} />
                <Route path={"/product/edit(/:id)?"} component={ProductEdit} />
                <Route exact path={"/cart"} component={CartList} />
                <Route exact path="/order/confirm" component={OrderConfirm} />
                <Route exact path="/order/complete" component={OrderComplete} />
                <Route exact path="/order/history" component={OrderHistory} />
                <Route exact path="/user/mypage" component={UserMyPage} />
            </Auth>

        </Switch>
    )
};
export default Router