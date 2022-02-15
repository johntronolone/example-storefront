import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Router } from "routes";
import { inject, observer } from "mobx-react";
import withCart from 'containers/cart/withCart';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import IconButton from '@material-ui/core/IconButton';
import Button from "@reactioncommerce/components/Button/v1";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
//import MiniCartComponent from "@reactioncommerce/components/MiniCart/v1";
import CartItems from "components/CartItems";
//import CartEmptyMessage from "@reactioncommerce/components/CartEmptyMessage/v1";
import CartDrawerItems from 'components/CartDrawerItems';
import CartDrawerItemsComponent from "components/CartDrawerItems";
import CartDrawerEmptyMessage from 'components/CartDrawerEmptyMessage';
import variantById from "lib/utils/variantById";
import Badge from '@material-ui/core/Badge';

const styles = ({ palette, zIndex }) => ({
  drawer: {
    //width: '16rem'
  }, 
  cart: {
    backgroundColor: palette.common.white
  },
  emptyCart: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    //width: 360,
    height: 320,
    //border: palette.borders.default
  },
  badge: {
    width: 20,
    height: 20,
    top: 8,
    left: 12
  },
  continueShopping: {
    display: "flex", 
    justifyContent: "center",
    paddingTop: "24px",
    paddingBottom: "24px"
  }
});

@withStyles(styles, { name: 'SkCartDrawer' })
@withCart
@inject("uiStore")
@observer
export default class CartDrawer extends Component {
  static propTypes = {
    cart: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.object),
      checkout: PropTypes.shape({
        itemTotal: PropTypes.shape({
          displayAmount: PropTypes.string
        }),
        taxTotal: PropTypes.shape({
          displayAmount: PropTypes.string
        })
      })
    }),
    classes: PropTypes.object,
    hasMoreCartItems: PropTypes.bool,
    loadMoreCartItems: PropTypes.func,
    onChangeCartItemsQuantity: PropTypes.func,
    onRemoveCartItems: PropTypes.func,
    uiStore: PropTypes.shape({
      isCartOpen: PropTypes.bool.isRequired,
      openCart: PropTypes.func.isRequired,
      closeCart: PropTypes.func.isRequired
    })
  };

  //static defaultProps = {
  //  classes: {}
  //} 

  handlePopperOpen = () => {
    const { uiStore: { openCart } } = this.props;
    openCart();
  }

  openRightDrawer = () => {
    //this.setState({ isRightDrawerOpen: !this.state.isRightDrawerOpen });
    //const { openCart } = this.props.uiStore;
    const { uiStore: { openCart } } = this.props;
    openCart();
  }  

  closeRightDrawer = () => {
    const { uiStore: { closeCart } } = this.props;
    closeCart(0);
  } 

  handleCheckoutButtonClick = () => {
    this.closeRightDrawer();
    Router.pushRoute("/cart/checkout");
  }

  //handleClick = () => Router.pushRoute("/");
  handleEmptyMessageClick = () => {
    this.closeRightDrawer();
  }
  
  handleItemQuantityChange = (quantity, cartItemId) => {
    const { onChangeCartItemsQuantity } = this.props;

    onChangeCartItemsQuantity({ quantity, cartItemId });
  }

  handleRemoveItem = async (itemId) => {
    const { cart: { items }, onRemoveCartItems } = this.props;
    const { data, error } = await onRemoveCartItems(itemId);

    if (data && !error) {
      const { cart: { _id } } = data.removeCartItems;
      const removedItem = { cart_id: _id, ...variantById(items, itemId) }; // eslint-disable-line camelcase

      // Track removed item
      //this.trackAction({ cartItems: removedItem, action: PRODUCT_REMOVED });
    }
  };
 
 
  renderCart() {
    const { cart, classes, hasMoreCartItems, loadMoreCartItems } = this.props;

    if (cart && Array.isArray(cart.items) && cart.items.length) {
      return (
        <Fragment>
          <CartDrawerItems
            cart={cart}
            onCheckoutButtonClick={this.handleCheckoutButtonClick}
            components={{
              QuantityInput: "div",
              CartItems: (cartItemProps) => (
                <CartItems
                  {...cartItemProps}
                  hasMoreCartItems={hasMoreCartItems}
                  onRemoveItemFromCart={this.handleRemoveItem}
                  onChangeCartItemQuantity={this.handleItemQuantityChange}
                  onLoadMoreCartItems={loadMoreCartItems}
                />
              )
            }}
          />
          <div className={classes.continueShopping}> 
            <Button actionType="secondary" onClick={this.handleEmptyMessageClick}>Continue shopping</Button>
          </div>
        </Fragment>
      );
    }

    return (
      <div className={classes.emptyCart}>
        <div>
          <CartDrawerEmptyMessage onClick={this.handleEmptyMessageClick} />
        </div>
      </div>
    );
    
  }
    
  render() {
    const { cart, classes, uiStore } = this.props;
    const anchor = 'right';
    const { isCartOpen } = uiStore;
    const id = (isCartOpen) ? "simple-popper" : null;

    return (
      <Fragment key={anchor}>
      <IconButton
        edge='start'
        color='inherit'
        aria-label='right drawer'
        onClick={this.openRightDrawer}
      >
        {(cart && cart.totalItemQuantity > 0)
          ? (
            <Badge
              badgeContent={cart.totalItemQuantity}
              color="primary"
              classes={{ badge: classes.badge }}
            >
              <ShoppingCartIcon />
            </Badge>
          )
          : <ShoppingCartIcon />
        }
      </IconButton>
      <SwipeableDrawer
        anchor={anchor} 
        ModalProps={{BackdropProps:{invisible: true}}} 
        id={id} 
        open={isCartOpen} 
        onClose={this.closeRightDrawer} 
        onOpen={this.openRightDrawer}
      >
        <div
          role='presentation'
          className={classes.drawer}
        >
          <div className={classes.cart}>
            {this.renderCart()}
          </div>
        </div>
      </SwipeableDrawer>
      </Fragment>
    );
  } 

}
