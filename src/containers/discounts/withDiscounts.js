import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Mutation, Query, withApollo } from 'react-apollo';
import { inject, observer } from 'mobx-react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import withShop from 'containers/shop/withShop';
import withCart from 'containers/cart/withCart';
import {
  applyDiscountCodeToCartMutation,
  removeDiscountCodeFromCartMutation,
} from './mutations.gql';
import accountCartByAccountIdQuery from "../cart/withCart";

/**
 * withDiscount higher order query component for applying and removing discounts
 * @name withDiscount
 * @param {React.Component} Component to decorate
 * @returns {React.Component} - Component with `discount` props and callbacks
 */
export default function withDiscount(Comp) {
  @withApollo
  @withShop
  @withCart
  @inject("cartStore", "authStore")
  @observer
  class WithDiscount extends React.Component {
    /*static propTypes = {
      cartStore: PropTypes.shape({
        anonymouseCartId
      }), 
    }*/

    // needed?
    /*componentDidMount() {
      const { cartStore } = this.props;
    } */ 

    //TODO: add requirement that account must be signed in? 

    /**
     * Applies a discount code to user's cart
     * @name handleApplyDiscountCodeToCart
     * @summary called when applying a discount code to a user's cart
     * @private
     * @returns {undefined} No return
     */
    handleApplyDiscountCodeToCart = async (discountCode) => {

      const { cartStore, shop, client: apolloClient } = this.props;

      //console.log({discountCode});
      try {
        const response = await apolloClient.mutate({
          mutation: applyDiscountCodeToCartMutation,
          variables: {
            input: {
              cartId: cartStore.anonymousCartId || cartStore.accountCartId,
              discountCode,
              shopId: shop._id,
              token: cartStore.anonymousCartToken || null
            }
          }//,
          /*update: (cache, { data: mutationData }) => {
            if (mutationData && mutationData.applyDiscountCodeToCart) {
              const { cart: cartPayload } = mutationData.applyDiscountCodeToCart;

              if (cartPayload) {
                // Update Apollo cache
                cache.writeQuery({
                  query: accountCartByAccountIdQuery,
                  data: { cart: cartPayload }
                });
              }
            }
          }*/
        });

        return response;

      } catch (e) {

        return e;
      }
    }

    /**
     * Removes a discount code from user's cart
     * @name handleRemoveDiscountCodeFromCart
     * @summary called when removing a discount code from a user's cart
     * @returns {undefined} No return
     */
    handleRemoveDiscountCodeFromCart = async (discountId) => {
      const { cartStore, shop, client: apolloClient } = this.props;

      apolloClient.mutate({
        mutation: removeDiscountCodeFromCartMutation,
        variables: {
          input: {
            cartId: cartStore.anonymousCartId || cartStore.accountCartId,
            discountId,
            shopId: shop._id,
            token: cartStore.anonymousCartToken || null
          }
        }//,
        /*update: (cache, { data: mutationData }) => {
          if (mutationData && mutationData.removeDiscountCodeFromCart) {
            const { cart: cartPayload } = mutationData.removeDiscountCodeFromCart;

            if (cartPayload) {
              // Update Apollo cache
              cache.writeQuery({
                query: accountCartByAccountIdQuery,
                data: { cart: cartPayload }
              });
            }
          }
        }*/
      });
    }

    render() {
      
      return (
        <Fragment>
          <Comp
            {...this.props}
            onApplyDiscountCodeToCart={this.handleApplyDiscountCodeToCart}
            onRemoveDiscountCodeFromCart={this.handleRemoveDiscountCodeFromCart}
          />
        </Fragment>
      );
    }
  }
  
  hoistNonReactStatic(WithDiscount, Comp);

  return WithDiscount;
} 

