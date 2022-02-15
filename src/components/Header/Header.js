import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { inject } from "mobx-react";
import AppBar from "@material-ui/core/AppBar";
import Hidden from "@material-ui/core/Hidden";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { fade, withStyles } from "@material-ui/core/styles";
import { NavigationDesktop } from "components/NavigationDesktop";
import { NavigationMobile, NavigationToggleMobile } from "components/NavigationMobile";
import AccountDropdown from "components/AccountDropdown";
import { Nav } from "components/Nav";
import ShopLogo from "@reactioncommerce/components/ShopLogo/v1";
import Link from "components/Link";
//import MiniCart from "components/MiniCart";
import CartDrawer from 'components/CartDrawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

const styles = (theme) => ({
  appBar: {
    borderBottom: 'solid 1px #f5f5f5',
    position: 'absolute',
    backgroundColor: theme.palette.reaction.white,
    borderBottom: `solid 1px ${theme.palette.reaction.black05}`,
    color: theme.palette.reaction.coolGrey500
  },
  controls: {
    alignItems: "inherit",
    display: "inherit",
    flex: 1
  },
  titleText: {
    color: theme.palette.reaction.reactionBlue,
    marginRight: theme.spacing.unit,
    borderBottom: `solid 5px ${theme.palette.reaction.reactionBlue200}`
  },
  toolbar: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between"
  },
  search: {
    position: 'relative',
    borderRadius: theme.borderRadii,
    backgroundColor: theme.palette.reaction.black02,
    '&:hover': {
      backgroundColor: theme.palette.reaction.black05,
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 2,
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing.unit * 2,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,  
    paddingLeft: `calc(1em + ${theme.spacing.unit * 4}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    //[theme.breakpoints.up('md')]: {
    //  width: '20ch',
    //},
  },
});

@withStyles(styles, { name: "SkHeader" })
@inject("uiStore")
class Header extends Component {
  static propTypes = {
    classes: PropTypes.object,
    shop: PropTypes.shape({
      name: PropTypes.string.isRequired
    }),
    uiStore: PropTypes.shape({
      toggleMenuDrawerOpen: PropTypes.func.isRequired
    }).isRequired,
    viewer: PropTypes.object
  };

  static defaultProps = {
    classes: {}
  };

  //state = {
  //  anchorElement: null
  //};

//  state = {
//    isLeftDrawerOpen: false,
//    isRightDrawerOpen: false
//  };
//  
//  toggleLeftDrawer = () => {
//    //this.setState({isLeftDrawerOpen: true});
//    this.setState({ isLeftDrawerOpen: !this.state.isLeftDrawerOpen });
//  }

  //toggleDrawer = (anchor, open) => (event) => {
  //  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
  //    return;
  //  }
//
  //  setState({ ...state, [anchor]: open });
  //};
  
  handleNavigationToggleClick = () => {
    this.props.uiStore.toggleMenuDrawerOpen();
  };
    
  
  render() {
    const { classes: { appBar, controls, toolbar, titleText, menuButton, search, searchIcon, inputRoot, inputInput }, shop } = this.props;

    const anchor = 'left';

    return (
      <AppBar elevation={0}  position="static"  className={appBar}>
        <Toolbar id="header_id" className={toolbar}>
          <Nav />

          {/*<Fragment key={anchor}>

            <IconButton
              edge="start"
              className={menuButton}
              color="inherit"
              aria-label="open drawer"
              onClick={this.toggleLeftDrawer}
            >
              <MenuIcon />
            </IconButton>

            <Drawer anchor={anchor} ModalProps={BackdropProps={invisible={true} }} open={this.state.isLeftDrawerOpen} onClose={this.toggleLeftDrawer}>

          </Drawer>

          </Fragment>

          <Hidden mdUp>
            <NavigationToggleMobile onClick={this.handleNavigationToggleClick} />
          </Hidden>*/}

          <div id="logo_id" className={controls}>
            <Typography className={titleText} color="inherit" variant="h6">
              <Link route="/">
                {shop ? <ShopLogo shopName={shop.name} /> : "Example Storefront"}
              </Link>
            </Typography>
            {/*
            <Hidden smDown initialWidth={"md"}>
              <NavigationDesktop />
            </Hidden>*/
            } 
               
            {//uncomment to enable search frontend
            }
            {/*<Hidden smDown initialWidth={'sm'}>
              <div className={search}>
                <div className={searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Search…"
                  classes={{
                    root: inputRoot,
                    input: inputInput,
                  }}
                  inputProps={{ 'aria-label': 'search' }}
                />
              </div>
            </Hidden>*/}

          </div>

          <AccountDropdown />
          <CartDrawer />
          {/*<MiniCart />*/}
        </Toolbar>
        {/*<NavigationMobile />*/}
      </AppBar>
    );
  }
}

export default Header;
