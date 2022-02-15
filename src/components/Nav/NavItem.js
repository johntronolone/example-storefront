import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { inject } from "mobx-react";
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from "@material-ui/core/Button";
import { Router } from 'routes';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Link from "components/Link";

const styles = (theme) => ({
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
  subNav: {
    marginLeft: theme.spacing.unit * 3,
  },
  listItem: {
    textTransform: 'none',
  }
});

@withStyles(styles, { name: 'SkNavItem' })
@inject('routingStore')
class NavItem extends Component {
  static propTypes = {
    classes: PropTypes.object,
    navItem: PropTypes.object,
    routingStore: PropTypes.object
  };

  static defaultProps = {
    classes: {},
    navItem: {},
    routingStore: {}
  };

  onClick = (event) => {
    /*const path = this.linkPath();
    Router.pushRoute(path);*/
  };

  onSubNavClick = (passedItem) => {
    const path = this.linkPath(passedItem);
    Router.pushRoute(path);
  }

  //const [open, setOpen] = React.useState(true);
  state = {
    isMenuOpen: false 
  };

  handleClick = (event) => {
    //setOpen(!open);
    this.setState({ isMenuOpen: !this.state.isMenuOpen });
  };

  onRouteItemClick = () => {
    //event.preventDefault();

    //const path = this.linkPath();
    //Router.pushRoute(path);
  
    this.props.toggleLeftDrawer();
  }

  onRouteParentClick = () => {

    const path = this.linkPath();
    Router.pushRoute(path);
  
    this.props.toggleLeftDrawer();
  }

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
  
  
  
  render() {
    const { navItem, navItem: { navigationItem, items }, classes } = this.props;
      
    if (this.hasSubNavItems) {
      const shopall = 'All ';    
  
      return (
        <Fragment>
        <ListItem button key={navigationItem.data.contentForLanguage} onClick={this.handleClick}>
          <ListItemText primary={navigationItem.data.contentForLanguage} />
          {this.state.isMenuOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.state.isMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {items.map((item, index) => {
              const { navigationItem: { data: { contentForLanguage } } } = item;
              
              {/* if has sub nav items -> render another Collapse element & revise button */}
              return (
                <ListItem button component={Button} className={classes.listItem} key={contentForLanguage} href={this.linkPath(item)} onClick={this.onRouteItemClick} >
                  <ListItemText className={classes.subNav} primary={contentForLanguage} primaryTypographyProps={{fontSize: '40px'}} />
                </ListItem>
              );
            })}
            <ListItem button component={Button} className={classes.listItem} key={navigationItem.data.contentForLanguage} href={this.linkPath(navItem)} onClick={this.onRouteItemClick}>
              <ListItemText className={classes.subNav} primary={shopall.concat(navigationItem.data.contentForLanguage)}>
                <ChevronRight />
              </ListItemText>
            </ListItem>
          </List>
        </Collapse>
        </Fragment>
      );
    } else {
      return (
        <ListItem button key={navigationItem.data.contentForLanguage} href={this.linkPath(navItem)} onClick={this.onRouteParentClick}>
          <ListItemText primary={navigationItem.data.contentForLanguage} />
        </ListItem>
      );
    }
  }
}

export default NavItem;
