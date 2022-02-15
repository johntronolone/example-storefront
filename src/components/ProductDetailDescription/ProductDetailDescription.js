import React, { Component } from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";

/**
 * Product detail description field
 * @class ProductDetailDescription
 */
class ProductDetailDescription extends Component {
  static propTypes = {
    /**
     * Product description
     */
    children: PropTypes.string
  }

  render() {
    const { children, ...props } = this.props;

    if (!children) return null;
    
    // fix to un-escape new line characters in database
    var children_split = children.split('\\n');
    var children_join = children_split.join('\n');

    return (
      <div style={{ padding: 20 }}>
        <Typography style={{whiteSpace: 'pre-line'}} component="div" {...props}>{children_join}</Typography>
      </div>
    );
  }
}

export default ProductDetailDescription;
