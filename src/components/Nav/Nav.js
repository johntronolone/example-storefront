import React, { Component, Fragment } from "react"; 
import PropTypes from "prop-types";
import { inject } from "mobx-react";
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import { NavItem } from 'components/Nav'; 
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  menuButton: {
    marginLeft: 0,
    marginRight: theme.spacing.unit * 1
  },
  menuIcon: {
    marginRight: theme.spacing.unit * -1
  },
  drawer: {
    width: '16em'
  },
  backDrop: {
    backgroundColor: 'rgba(255,255,255,0.0)'
  },
  menuText: {
    marginLeft: theme.spacing.unit
  }
});

@withStyles(styles, { name: 'SkNav' })
@inject("navItems")
export class Nav extends Component {
  static propTypes = {
    classes: PropTypes.object,
    navItems: PropTypes.object
  };

  static defaultProps = {
    classes: {},
    navItems: {}
  };

  state = {
    isLeftDrawerOpen: false,
  };
  
  toggleLeftDrawer = () => {
    //this.setState({isLeftDrawerOpen: true});
    this.setState({ isLeftDrawerOpen: !this.state.isLeftDrawerOpen });
  }
  
  renderNavItem(navItem, index) {
    return <NavItem toggleLeftDrawer={this.toggleLeftDrawer} key={index} navItem={navItem} />;
  }

  render() {
    const { navItems, classes: { drawer, menuButton, menuIcon, backDrop, menuText } } = this.props;
  
    const anchor = 'left';

    if (navItems && navItems.items) {
      return (
        <Fragment key={anchor}>
          <Button
            edge="start"
            className={menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick={this.toggleLeftDrawer}
          >
            <MenuIcon className={menuIcon} /> 
            <Typography className={menuText}>
              menu
            </Typography>
          </Button>
          <SwipeableDrawer 
            anchor={anchor} 
            ModalProps={{BackdropProps:{invisible: true}}} 
            open={this.state.isLeftDrawerOpen} 
            onClose={this.toggleLeftDrawer}
            onOpen={this.toggleLeftDrawer}
          >
            <div
              role="presentation"
              className={drawer}
              //onClick={this.toggleLeftDrawer}
              //onKeyDown={this.toggleLeftDrawer}
            >
              <List>
                {navItems.items.map(this.renderNavItem.bind(this))}
                {/*['one', 'two', 'three'].map((text, index) => (
                  <ListItem button key={text}>
                    <ListItemText primary={text} />
                  </ListItem>
                ))*/}
              </List>
            </div> 
        </SwipeableDrawer>
      </Fragment>
    )};

    //If navItems.items aren't available, skip rendering of navigation
    return null;
  } 
}

export default Nav;
