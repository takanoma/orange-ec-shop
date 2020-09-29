import React, {useCallback, useState} from 'react';
import {makeStyles}                   from "@material-ui/styles";
import AppBar                         from '@material-ui/core/AppBar';
import Toolbar                        from '@material-ui/core/Toolbar';
import {useDispatch, useSelector}     from "react-redux";
import {getIsSignedIn}                  from "../../reducks/users/selectors";
import logo                           from "../../assets/img/icons/mylogo.png";
import {HeaderMenu, ClosableDrawer}   from "./index";
import {push}                         from "connected-react-router"

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
    menuBar: {
        backgroundColor: "#fff",
        color: '#444',
    },
    toolbar: {
        margin: '0 auto',
        maxWidth: 1024,
        width: '100%'
    },
    iconButtons: {
        margin: '0 0 0 auto'
    },
    logo: {
        cursor: 'pointer'
    }
});

const Header = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const selector = useSelector((state) => state);
    const isSignedIn = getIsSignedIn(selector);

    const [sideBarOpen, setSideBarOpen] = useState(false);

    const handleDrawerToggle = useCallback((event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setSideBarOpen(!sideBarOpen)
    }, [setSideBarOpen, sideBarOpen ]);

    return (
        <div className={classes.root}>
            <AppBar position="fixed" className={classes.menuBar}>
                <Toolbar className={classes.toolbar}>
                    <img className={classes.logo}
                        alt="Logo" src={logo} width="180px"
                        onClick={() => dispatch(push('/'))} role="button"
                    />
                    {isSignedIn && (
                        <div className={classes.iconButtons}>
                            <HeaderMenu handleDrawerToggle={handleDrawerToggle} />
                        </div>
                    )}
                </Toolbar>
            </AppBar>
            <ClosableDrawer open={sideBarOpen} onClose={handleDrawerToggle} />
        </div>
    );
}

export default Header