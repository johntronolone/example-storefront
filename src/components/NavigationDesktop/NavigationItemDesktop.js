import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { inject } from "mobx-react";
import classNames from "classnames";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import ListItemText from "@material-ui/core/ListItemText";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Popover from "@material-ui/core/Popover";
import Popper from "@material-ui/core/Popper";
import ChevronDownIcon from "mdi-material-ui/ChevronDown";
import ChevronRight from "mdi-material-ui/ChevronRight";
import ChevronUpIcon from "mdi-material-ui/ChevronUp";
import { withStyles } from "@material-ui/core/styles";
import { Router } from "routes";
import Link from "components/Link";

const styles = (theme) => ({
  popover: {
    //left: "0!important",
    //maxWidth: "100vw",
    padding: theme.spacing.unit * 2,
    //width: "100vw"
    width: '100%',
    positoin: 'relative'
  },
  grid: {
    //width: "100vw"
    //width: '100%'
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  navigationShopAllLink: {
    display: "flex",
    textDecoration: "underline",
    fontSize: "14px",
    marginTop: theme.spacing.unit * 6,
    marginBottom: theme.spacing.unit * 2,
    fontFamily: theme.typography.fontFamily
  },
  navigationShopAllLinkIcon: {
    fontSize: "12px"
  },
  primaryNavItem: {
    textTransform: "capitalize",
    transitionDuration: "400ms",
    transitionProperty: "transform",
    transitionTimingFunction: "liner",
    width: '140px'
  }
});

@inject("routingStore")
@withStyles(styles, { name: "SkNavigationItemDesktop" })
class NavigationItemDesktop extends Component {
  static propTypes = {
    classes: PropTypes.object,
    navItem: PropTypes.object,
    routingStore: PropTypes.object,
    leftOffset: PropTypes.string
  };

  static defaultProps = {
    classes: {},
    navItem: {},
    routingStore: {},
    leftOffset: '0px'
  };

  state = { 
    isSubNavOpen: false,
  };

  linkPath = (providedNavItem) => {
    const { navItem, routingStore } = this.props;

    const currentNavItem = (providedNavItem && providedNavItem.navigationItem) || navItem.navigationItem;

    return routingStore.queryString !== ""
      ? `${currentNavItem.data.url}?${routingStore.queryString}`
      : `${currentNavItem.data.url}`;
  }

  get hasSubNavItems() {
    const { navItem: { items } } = this.props;
    return Array.isArray(items) && items.length > 0;
  }

  onClick = (event) => {
    event.preventDefault();

    //if (this.hasSubNavItems) {
    //  this.setState({ isSubNavOpen: !this.state.isSubNavOpen });
    //} else {
    const path = this.linkPath();
    Router.pushRoute(path);
    //}
  };
  
  onHover = (event) => {
    event.preventDefault();    

    if (this.hasSubNavItems) { // && !this.state.wasJustClosed) {
      this.setState({ isSubNavOpen: true });
    } 
    //this.setState({ wasJustClosed: false});
  };

  onClose = (event) => {
    //event.preventDefault();

    this.setState({ isSubNavOpen: false });
    //this.setState({ wasJustClosed: true });
  };
  
  onLeaveSubNav = (event) => {
    event.preventDefault();

    this.setState({ isSubNavOpen: false });
  };

  onLeaveButton = (event) => {
    event.preventDefault();
    
    let related = event.relatedTarget ? event.relatedTarget.id : "unknown";
    
    //console.log(related);

    if (!(related == 'nav_id' || related == '')) { //(related == 'button_id' || related == 'logo_id' || related == 'header_id' ) {
      this.setState({ isSubNavOpen: false });
    }
  };

  renderSubNav(navItemGroup) {
    const menuItems = navItemGroup.items.map((item, index) => {
      const { navigationItem: { data: { contentForLanguage, classNames: navigationItemClassNames, isUrlRelative, shouldOpenInNewWindow } } } = item;
      return (
        <MenuItem dense key={index}>
          <Link
            className={navigationItemClassNames}
            onClick={this.onClose}
            route={this.linkPath(item)}
            href={this.linkPath(item)}
            isUrlAbsolute={!isUrlRelative}
            shouldOpenInNewWindow={shouldOpenInNewWindow}
          >
            <ListItemText primary={contentForLanguage} />
          </Link>
        </MenuItem>
      );
    });

   // menuItems.unshift(<Divider key="divider" />);

    return menuItems;
  }

  renderPopover() {
    const { classes, navItem, navItem: { items, navigationItem }, leftOffset } = this.props;

    if (items) {
      return (
        <Popper
          classes={{ paper: classes.popover }}
          elevation={1}
          onClose={this.onClose}
          open={this.state.isSubNavOpen}
          style={{ position: 'absolute', top: 60, marginTop: '-4px', left: leftOffset, right: 'unset', bottom: 'unset', paddingBottom: '24px', backgroundColor: 'white', borderBottom: 'solid 1px #f5f5f5', borderRight: 'solid 1px #f5f5f5', borderLeft: 'solid 1px #f5f5f5',  zIndex: 2000, borderRadius: '0 0 4px 4px'}}
          onMouseLeave={this.onLeaveSubNav}
          id="popper_id"
        >
          <Grid id="nav_id" container className={classes.grid} spacing={16}>
            {items.map((item, index) => {
              const { navigationItem: { data: { contentForLanguage, classNames: navigationItemClassNames, isUrlRelative, shouldOpenInNewWindow } } } = item;
              return (
                <Grid style={{ marginTop: '0px' }} item key={index}>
                  <MenuList disablePadding>
                    <MenuItem>
                      <Link
                        className={navigationItemClassNames}
                        href={this.linkPath(item)}
                        isUrlAbsolute={!isUrlRelative}
                        onClick={this.onClose}
                        shouldOpenInNewWindow={shouldOpenInNewWindow}
                      >
                        <ListItemText primary={contentForLanguage} />
                      </Link>
                    </MenuItem>
                    {Array.isArray(item.items) && this.renderSubNav(item)}
                  </MenuList>
                </Grid>
              );
            })}
          </Grid>
          {/*<Link
            className={classes.navigationShopAllLink}
            onClick={this.onClose}
            route={this.linkPath(navItem)}
            href={this.linkPath(navItem)}
            isUrlAbsolute={!navigationItem.data.isUrlRelative}
            shouldOpenInNewWindow={navigationItem.data.shouldOpenInNewWindow}
          >
            <span>Shop all {navigationItem.data.contentForLanguage} <ChevronRight className={classes.navigationShopAllLinkIcon} /></span>
          </Link>*/}
        </Popper>
      );
    }

    return null;
  }

  render() {
    const { classes: { primaryNavItem }, navItem, navItem: { navigationItem } } = this.props;

    return (
      <Fragment>
        <Button id='button_id' className={classNames(primaryNavItem, navigationItem.data.classNames)} color="inherit" onMouseEnter={this.onHover} onMouseLeave={this.onLeaveButton} href={this.linkPath(navItem)}>
          {navigationItem.data.contentForLanguage}
          {this.hasSubNavItems && <Fragment>{this.state.isSubNavOpen ? <ChevronDownIcon /> : <ChevronUpIcon />}</Fragment>}
        </Button>
        {this.hasSubNavItems && this.renderPopover()}
      </Fragment>
    );
  }
}

export default NavigationItemDesktop;
