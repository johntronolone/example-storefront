/* eslint-disable react/no-multi-comp */
import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import { isEqual } from "lodash";
import styled from "styled-components";
import Actions from "@reactioncommerce/components/CheckoutActions/v1";
import ShippingAddressCheckoutAction from "@reactioncommerce/components/ShippingAddressCheckoutAction/v1";
import FulfillmentOptionsCheckoutAction from "@reactioncommerce/components/FulfillmentOptionsCheckoutAction/v1";
import PaymentsCheckoutAction from "@reactioncommerce/components/PaymentsCheckoutAction/v1";
//import FinalReviewCheckoutAction from "@reactioncommerce/components/FinalReviewCheckoutAction/v1";
import FinalReviewCheckoutAction from "./FinalReviewCheckoutActionMod";
import { addTypographyStyles } from "@reactioncommerce/components/utils";
import withAddressValidation from "containers/address/withAddressValidation";
import Dialog from "@material-ui/core/Dialog";
import PageLoading from "components/PageLoading";
//import Router from "translations/i18nRouter";
import { Router } from "routes";
import calculateRemainderDue from "lib/utils/calculateRemainderDue";
//import { placeOrderMutation } from "../../hooks/orders/placeOrder.gql";
import { placeOrderMutation } from "containers/order/mutations.gql";
import PaymentsCheckoutActionMod from "./PaymentsCheckoutActionMod";
import withDiscount from "containers/discounts/withDiscounts";
import formatMoney from "components/CheckoutActions/utils/formatMoney";

const MessageDiv = styled.div`
  ${addTypographyStyles("NoPaymentMethodsMessage", "bodyText")}
`;

const NoPaymentMethodsMessage = () => <MessageDiv>No payment methods available</MessageDiv>;

NoPaymentMethodsMessage.renderComplete = () => "";

@withDiscount

class CheckoutActions extends Component {
  static propTypes = {
    addressValidation: PropTypes.func.isRequired,
    addressValidationResults: PropTypes.object,
    //apolloClient: PropTypes.shape({
    client: PropTypes.shape({
      mutate: PropTypes.func.isRequired
    }),
    cart: PropTypes.shape({
      account: PropTypes.object,
      checkout: PropTypes.object,
      email: PropTypes.string,
      items: PropTypes.array
    }).isRequired,
    cartStore: PropTypes.object,
    checkoutMutations: PropTypes.shape({
      onSetFulfillmentOption: PropTypes.func.isRequired,
      onSetShippingAddress: PropTypes.func.isRequired
    }),
    clearAuthenticatedUsersCart: PropTypes.func.isRequired,
    orderEmailAddress: PropTypes.string.isRequired,
    paymentMethods: PropTypes.array,
    onRemoveDiscountCodeFromCart: PropTypes.func.isRequired
  };

  state = {
    actionAlerts: {
      1: null,
      2: null,
      3: null,
      4: null
    },
    hasPaymentError: false,
    isPlacingOrder: false
  };

  componentDidUpdate({ addressValidationResults: prevAddressValidationResults }) {
    const { addressValidationResults } = this.props;
    if (
      addressValidationResults &&
      prevAddressValidationResults &&
      !isEqual(addressValidationResults, prevAddressValidationResults)
    ) {
      this.handleValidationErrors();
    }
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  buildData = ({ step, action }) => ({
    action,
    payment_method: this.paymentMethod, // eslint-disable-line camelcase
    shipping_method: this.shippingMethod, // eslint-disable-line camelcase
    step
  });

  get shippingMethod() {
    const { checkout: { fulfillmentGroups } } = this.props.cart;
    const { selectedFulfillmentOption } = fulfillmentGroups[0];
    return selectedFulfillmentOption ? selectedFulfillmentOption.fulfillmentMethod.displayName : null;
  }

  get paymentMethod() {
    const [firstPayment] = this.props.cartStore.checkoutPayments;
    return firstPayment ? firstPayment.payment.method : null;
  }

  setShippingAddress = async (address) => {
    //console.log('setShippingAddress (1)');
    const { checkoutMutations: { onSetShippingAddress } } = this.props;
    delete address.isValid;
    
    //const { onRemoveDiscountCodeFromCart } = this.props;
    //const { cart } = this.props;
    /*if (cart.billing && cart.billing.length) {
      //onRemoveDiscountCodeFromCart(cart.billing[0]._id);
      //console.log('setShippingAddress attempt to remove discount code...');
      //const { data, error } = await onSetShippingAddress(address).then(() => onRemoveDiscountCodeFromCart(cart.billing[0]._id));
      const { data, error } = await onRemoveDiscountCodeFromCart(cart.billing[0]._id).then(() => onSetShippingAddress(address));
      //console.log({data});
      if (data && !error && this._isMounted) {
        this.setState({
          actionAlerts: {
            1: {}
          }
        });
      }
    } else {

      const { data, error } = await onSetShippingAddress(address);
      if (data && !error && this._isMounted) {
        this.setState({
          actionAlerts: {
            1: {}
          }
        });
      }
    }*/

    const { data, error } = await onSetShippingAddress(address);

    if (data && !error && this._isMounted) {
      this.setState({
        actionAlerts: {
          1: {}
        }
      });
      return data.setShippingAddressOnCart.cart;
    }
  };

  removeDiscount = async (cartWithDiscount) => {
    //console.log('removeDiscount (2)');
    //console.log({cartWithDiscount});
    const { onRemoveDiscountCodeFromCart } = this.props;
    if (cartWithDiscount.billing && cartWithDiscount.billing.length) {
      await onRemoveDiscountCodeFromCart(cartWithDiscount.billing[0]._id);
    }
  }

  setShippingAddressWrapper = async (address) => {
    await this.setShippingAddress(address).then(xCart => this.removeDiscount(xCart));
  };

  handleValidationErrors() {
    const { addressValidationResults } = this.props;
    const { validationErrors } = addressValidationResults || [];
    const shippingAlert =
      validationErrors && validationErrors.length ? {
        alertType: validationErrors[0].type,
        title: validationErrors[0].summary,
        message: validationErrors[0].details
      } : null;
    this.setState({ actionAlerts: { 1: shippingAlert } });
  }

  setShippingMethod = async (shippingMethod) => {
    const { checkoutMutations: { onSetFulfillmentOption } } = this.props;
    const { checkout: { fulfillmentGroups } } = this.props.cart;
    const fulfillmentOption = {
      fulfillmentGroupId: fulfillmentGroups[0]._id,
      fulfillmentMethodId: shippingMethod.selectedFulfillmentOption.fulfillmentMethod._id
    };
    
    const { data, error } = await onSetFulfillmentOption(fulfillmentOption);
    //await onSetFulfillmentOption(fulfillmentOption).then(() => this.handlePaymentsReset());
  };

  handlePaymentSubmit = (paymentInput) => {
    this.props.cartStore.addCheckoutPayment(paymentInput);

    this.setState({
      hasPaymentError: false,
      actionAlerts: {
        3: {}
      }
    });
  };

  handlePaymentsReset = () => {
    this.props.cartStore.resetCheckoutPayments();
  }

  buildOrder = async () => {
    const { cart, cartStore, orderEmailAddress } = this.props;
    const cartId = cartStore.hasAccountCart ? cartStore.accountCartId : cartStore.anonymousCartId;
    const { checkout } = cart;

    const fulfillmentGroups = checkout.fulfillmentGroups.map((group) => {
      const { data } = group;
      const { selectedFulfillmentOption } = group;

      const items = cart.items.map((item) => ({
        addedAt: item.addedAt,
        price: item.price.amount,
        productConfiguration: item.productConfiguration,
        quantity: item.quantity
      }));

      return {
        data,
        items,
        selectedFulfillmentMethodId: selectedFulfillmentOption.fulfillmentMethod._id,
        shopId: group.shop._id,
        totalPrice: checkout.summary.total.amount,
        type: group.type
      };
    });

    const order = {
      cartId,
      currencyCode: checkout.summary.total.currency.code,
      email: orderEmailAddress,
      fulfillmentGroups,
      shopId: cart.shop._id
    };

    return this.setState({ isPlacingOrder: true }, () => this.placeOrder(order));
  };

  placeOrder = async (order) => {
    const { cartStore, clearAuthenticatedUsersCart, client: apolloClient } = this.props;

    // Payments can have `null` amount to mean "remaining".
    let remainingAmountDue = order.fulfillmentGroups.reduce((sum, group) => sum + group.totalPrice, 0);
    const payments = cartStore.checkoutPayments.map(({ payment }) => {
      const amount = payment.amount ? Math.min(payment.amount, remainingAmountDue) : remainingAmountDue;
      remainingAmountDue -= amount;
      return { ...payment, amount };
    });

    try {
      const { data } = await apolloClient.mutate({
        mutation: placeOrderMutation,
        variables: {
          input: {
            order,
            payments
          }
        }
      });

      // Placing the order was successful, so we should clear the
      // anonymous cart credentials from cookie since it will be
      // deleted on the server.
      cartStore.clearAnonymousCartCredentials();
      clearAuthenticatedUsersCart();

      // Also destroy the collected and cached payment input
      cartStore.resetCheckoutPayments();

      const { placeOrder: { orders, token } } = data;

      // Send user to order confirmation page
      //Router.push(`/checkout/order?orderId=${orders[0].referenceId}${token ? `&token=${token}` : ""}`);   
      Router.pushRoute("checkoutComplete", { orderId: orders[0].referenceId, token });
    } catch (error) {
      if (this._isMounted) {
        this.setState({
          hasPaymentError: true,
          isPlacingOrder: false,
          actionAlerts: {
            3: {
              alertType: "error",
              title: "Payment method failed",
              message: error.toString().replace("Error: GraphQL error:", "")
            }
          }
        });
      }
    }
  };

  renderPlacingOrderOverlay = () => {
    const { isPlacingOrder } = this.state;

    return (
      <Dialog fullScreen disableBackdropClick={true} disableEscapeKeyDown={true} open={isPlacingOrder}>
        <PageLoading delay={0} message="Placing your order..." />
      </Dialog>
    );
  };

  render() {
    const {
      addressValidation,
      addressValidationResults,
      cart,
      cartStore,
      paymentMethods
    } = this.props;

    const isSaving = false;

    const { checkout: { fulfillmentGroups, summary }, items } = cart;
    const { actionAlerts, hasPaymentError } = this.state;
    //const [fulfillmentGroup] = fulfillmentGroups;
    let [fulfillmentGroup] = fulfillmentGroups;

    // Order summary
    const { fulfillmentTotal, itemTotal, surchargeTotal, taxTotal, total } = summary;
    const checkoutSummary = {
      displayShipping: fulfillmentTotal && fulfillmentTotal.displayAmount,
      displaySubtotal: itemTotal.displayAmount,
      displaySurcharge: surchargeTotal.displayAmount,
      displayTotal: total.displayAmount,
      displayTax: taxTotal && taxTotal.displayAmount,
      items
    };
    
    let shippingSurcharge = 0;
    if (items && fulfillmentGroup && fulfillmentGroup.shippingAddress && fulfillmentGroup.shippingAddress.region) {
      items.map((item) => {
        if (item.shippingOverride) {
          item.shippingOverride.map((override) => {
            if (override.state == fulfillmentGroup.shippingAddress.region) {
              shippingSurcharge += override.surcharge * item.quantity;
            }
          });
        }
      });
    }

    if (shippingSurcharge && fulfillmentGroup && fulfillmentGroup.availableFulfillmentOptions && fulfillmentGroup.availableFulfillmentOptions[0] && fulfillmentGroup.availableFulfillmentOptions[0].price && fulfillmentGroup.availableFulfillmentOptions[0].price.displayAmount) {
      /*const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      });*/
      fulfillmentGroup.availableFulfillmentOptions[0].price.displayAmount = formatMoney(shippingSurcharge);
      //console.log('set shipping surcharge');
    }

    /*if (fulfillmentTotal && fulfillmentTotal.displayAmount) {
      fulfillmentGroup.availableFulfillmentOptions[0].price.displayAmount = fulfillmentTotal.displayAmount;
    } */ 

    const addresses = fulfillmentGroups.reduce((list, group) => {
      if (group.shippingAddress) list.push(group.shippingAddress);
      return list;
    }, []);

    const payments = cartStore.checkoutPayments.slice();
    const remainingAmountDue = calculateRemainderDue(payments, total.amount);

    let PaymentComponent = PaymentsCheckoutActionMod;
    if (!Array.isArray(paymentMethods) || paymentMethods.length === 0) {
      PaymentComponent = NoPaymentMethodsMessage;
    }

    const actions = [
      {
        id: "1",
        activeLabel: "Enter a shipping address",
        completeLabel: "Shipping address",
        incompleteLabel: "Shipping address",
        status: fulfillmentGroup.type !== "shipping" || fulfillmentGroup.shippingAddress ? "complete" : "incomplete",
        component: ShippingAddressCheckoutAction,
        onSubmit: this.setShippingAddress,
        props: {
          addressValidationResults,
          alert: actionAlerts["1"],
          fulfillmentGroup,
          onAddressValidation: addressValidation
        }
      },
      {
        id: "2",
        activeLabel: "Choose a shipping method",
        completeLabel: "Shipping method",
        incompleteLabel: "Shipping method",
        status: fulfillmentGroup.selectedFulfillmentOption ? "complete" : "incomplete",
        component: FulfillmentOptionsCheckoutAction,
        onSubmit: this.setShippingMethod,
        props: {
          alert: actionAlerts["2"],
          fulfillmentGroup
        }
      },
      {
        id: "3",
        activeLabel: "Enter payment information",
        completeLabel: "Payment information",
        incompleteLabel: "Payment information",
        status: remainingAmountDue === 0 && !hasPaymentError ? "complete" : "incomplete",
        component: PaymentComponent,
        onSubmit: this.handlePaymentSubmit,
        props: {
          addresses,
          alert: actionAlerts["3"],
          onReset: this.handlePaymentsReset,
          payments,
          paymentMethods,
          remainingAmountDue,
          isSaving
        }
      },
      {
        id: "4",
        activeLabel: "Review and place order",
        completeLabel: "Review and place order",
        incompleteLabel: "Review and place order",
        status: "incomplete",
        component: FinalReviewCheckoutAction,
        onSubmit: this.buildOrder,
        props: {
          alert: actionAlerts["4"],
          checkoutSummary,
          productURLPath: "/product/"
        }
      }
    ];

    return (
      <Fragment>
        {this.renderPlacingOrderOverlay()}
        <Actions actions={actions} />
      </Fragment>
    );
  }
}

export default withAddressValidation(CheckoutActions);

