import CartItems from "components/CartItems";
//import CartSummary from "@reactioncommerce/components/CartSummary/v1";
import CartSummary from "./CartSummary";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import withDiscount from "containers/discounts/withDiscounts";
import { Form } from 'reacto-form';
import TextInput from '@reactioncommerce/components/TextInput/v1';
import Button from '@reactioncommerce/components/Button/v1';
import ErrorsBlock from '@reactioncommerce/components/ErrorsBlock/v1';

const styles = (theme) => ({
  summary: {
    borderTop: theme.palette.borders.default
  },
  discountInputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    //width: '100%'
    maxWidth: '400px',
    float: 'right'
  },
  discountCodeApplyButton: {
  },
  discountInputField: {
    width: '100%',
  },
  discountCodeApplyButton: {
    height: '38px'
  },
  discountRemoveText: {
    margin: 'auto 20px auto 0'
  },
  discountRemoveCodeText: {
    margin: 'auto 20px auto 0',
    color: '#0db781',
    fontWeight: 700,
  },
  summaryTitle: {
    fontSize: '16px',
    fontWeight: 700
  }
});

@withStyles(styles, { name: "SkCheckoutSummary" })
@withDiscount
class CheckoutSummary extends Component {
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
      }),
      billing: PropTypes.arrayOf(PropTypes.object)
    }),
    classes: PropTypes.object,
    hasMoreCartItems: PropTypes.bool,
    loadMoreCartItems: PropTypes.func,
    onChangeCartItemsQuantity: PropTypes.func,
    onRemoveCartItems: PropTypes.func,
    shop: PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string
    }),
    onApplyDiscountCodeToCart: PropTypes.func.isRequired,
    onRemoveDiscountCodeFromCart: PropTypes.func.isRequired
  }

  state = {
    discountCodeInput: '',
    discountCodeErrors: [],
    discountAmount: 0
  };

  static defaultProps = {
    hasMoreCartItems: false,
    loadMoreCartItems() {},
    onChangeCartItemsQuantity() {},
    onRemoveCartItems() {}
  }


  //
  // Handler Methods
  //
  setApplyDiscountCode = async () => {
    const { onApplyDiscountCodeToCart } = this.props;

    //console.log(this.state.discountCodeInput);
    const { data } = await onApplyDiscountCodeToCart(this.state.discountCodeInput);
    
    if (data) {
      this.setState({ discountCodeErrors: [] });
      if (data.applyDiscountCodeToCart.cart.checkout.summary.discountTotal.amount) {
        this.setState({ discountAmount: data.applyDiscountCodeToCart.cart.checkout.summary.discountTotal.amount });
      }
    } else {
      this.setState({ discountCodeErrors: [{ name: 'discountCodeInput', message: 'Discount code is invalid or expired.'}] });
      this.setState({ discountAmount: 0 });
    }
    
  }

  handleDiscountCodeInputChange = (event) => {
    this.setState({ discountCodeInput: event });
    this.setState({ discountCodeErrors: [] });
    //this.setState({discountCodeInput: event.target.value});
  }

  handleRemoveDiscountCode = (_id) => {
    const { onRemoveDiscountCodeFromCart } = this.props;
    
    //console.log(_id);
    onRemoveDiscountCodeFromCart(_id);
  }

  handleItemQuantityChange = (quantity, cartItemId) => {
    const { onChangeCartItemsQuantity } = this.props;

    onChangeCartItemsQuantity({ quantity, cartItemId });
  }

  handleRemoveItem = (_id) => {
    const { onRemoveCartItems } = this.props;

    onRemoveCartItems(_id);
  }

  renderCartItems() {
    const { cart, hasMoreCartItems, loadMoreCartItems, classes } = this.props;
    
    if (cart && Array.isArray(cart.items)) {
      return (
        <Grid item xs={12}>

        <Typography className={classes.summaryTitle}>Cart Summary</Typography>
          <CartItems
            isMiniCart
            isReadOnly
            hasMoreCartItems={hasMoreCartItems}
            onLoadMoreCartItems={loadMoreCartItems}
            items={cart.items}
            onChangeCartItemQuantity={this.handleItemQuantityChange}
            onRemoveItemFromCart={this.handleRemoveItem}
          />
        </Grid>
      );
    }

    return null;
  }

  renderCartSummary() {
    const { cart, classes } = this.props;

    if (cart && cart.checkout && cart.checkout.summary) {
      const {
        discountTotal,
        fulfillmentTotal,
        itemTotal,
        surchargeTotal,
        taxTotal,
        total
      } = cart.checkout.summary;

      //if (discountTotal.amount) {      
        return (
          <Grid item xs={12} className={classes.summary}>
            <CartSummary
              isDense
              displayShipping={fulfillmentTotal && fulfillmentTotal.displayAmount}
              displaySubtotal={itemTotal && itemTotal.displayAmount}
              displaySurcharge={surchargeTotal && surchargeTotal.displayAmount}
              displayTax={taxTotal && taxTotal.displayAmount}
              displayTotal={total && total.displayAmount}
              displayDiscount={this.state.discountAmount}
              itemsQuantity={cart.totalItemQuantity}
            />
          </Grid>
        );
      //} else { 
      /*  return (
          <Grid item xs={12} className={classes.summary}>
            <CartSummary
              isDense
              displayShipping={fulfillmentTotal && fulfillmentTotal.displayAmount}
              displaySubtotal={itemTotal && itemTotal.displayAmount}
              displaySurcharge={surchargeTotal && surchargeTotal.displayAmount}
              displayTax={taxTotal && taxTotal.displayAmount}
              displayTotal={total && total.displayAmount}
              itemsQuantity={cart.totalItemQuantity}

              displayDiscount={discountTotal && discountTotal.displayAmount}
            />
          </Grid>
        );
      }*/
    }

    return null;
  }

  renderApplyDiscount() {
    const { cart, classes } = this.props;
    
    return (
      <Fragment>
        <Grid className={classes.discountInputContainer}>
                  
          <div className={classes.discountInputField}>
            <TextInput
              name="discountCodeInput"
              value={this.state.discountCodeInput}
              onChanging={this.handleDiscountCodeInputChange}
              placeholder={'Discount code'}
              errors={this.state.discountCodeErrors}
          />
          </div>
          <Button className={classes.discountCodeApplyButton} onClick={this.setApplyDiscountCode} >
            Apply
          </Button>

        </Grid>
        <ErrorsBlock names={["discountCodeInput"]} errors={this.state.discountCodeErrors} />
      </Fragment>
    );
  }

  renderRemoveDiscount = ( billing, billingIdx ) => {
    const { classes } = this.props;
    
    //console.log(billing._id);

    return (
      <div key={billingIdx}>
        <div className={classes.discountInputContainer}>
          <Typography className={classes.discountRemoveText}>Promo code: </Typography>
          <Typography className={classes.discountRemoveCodeText}>{billing.data.code}</Typography>
          <Button
            onClick={ () => this.handleRemoveDiscountCode(billing._id)}
          >
            Remove code
          </Button>
        </div>
      </div>
    );
  }

  renderDiscountInput() {
    const { cart, classes } = this.props;

    if (cart) {
      if (cart.billing && cart.billing.length) {
        return (
          <Fragment>
            <Grid item xs={12}>
              { cart.billing.map(this.renderRemoveDiscount)}
            </Grid>
          </Fragment>
        ); 
      } else {
        return (
          <Fragment>
            <Grid item xs={12}>
              { this.renderApplyDiscount() }
            </Grid>
          </Fragment>
        );
      }
    }

    return null;  
  }

  /*componentDidUpdate() {
    const {cart} = this.props;
    //console.log({cart});
    if (this.state.discountAmount != cart.checkout.summary.discountTotal.amount) {
      this.setState({ discountAmount: cart.checkout.summary.discountTotal.amount });
    }
  }*/
  
  render() {
    const {cart} = this.props;
    //console.log({cart});

    return (
      <aside>
        <Grid container spacing={24}>
          {this.renderCartItems()}
          {this.renderCartSummary()}
          {this.renderDiscountInput()}
        </Grid>
      </aside>
    );
  }
}

export default CheckoutSummary;
