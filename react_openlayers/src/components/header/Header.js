import React from 'react';
import {makeStyles} from '@material-ui/core/styles/index';
import AppBar from '@material-ui/core/AppBar/index';
import Toolbar from '@material-ui/core/Toolbar/index';
import Typography from '@material-ui/core/Typography/index';
import IconButton from '@material-ui/core/IconButton/index';
import MenuIcon from '@material-ui/icons/Menu';
import HelpIcon from '@material-ui/icons/Help';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    rightToolbar: {
        marginLeft: 'auto',
        marginRight: -20,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        color: 'white',
    }
}));

export default function Header() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static" style={{ background: '#2e3842', height: '60px !important'}} >
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Terrestrial Water Storage Assessment
                    </Typography>
                    <section className={classes.rightToolbar}>
                        <IconButton edge="end" aria-label="help" className={classes.menuButton} color="inherit"
                                    target="_blank"  href=".out/index.html?path=/info/components--basic-map"
                        >
                            <HelpIcon/>
                        </IconButton>
                    </section>
                </Toolbar>
            </AppBar>
        </div>
    );
}