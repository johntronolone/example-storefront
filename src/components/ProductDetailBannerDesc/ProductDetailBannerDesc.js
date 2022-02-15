import React, { Component } from "react";
import PropTypes from "prop-types";
//import { makeStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
//import AppBar from "@material-ui/core/AppBar";
//import Tabs from "@material-ui/core/Tabs";
//import Tab from "@material-ui/core/Tab";
//import Box from '@material-ui/core/Box';
import ProductDetailTabPanel from "components/ProductDetailTabPanel";


//}));

class ProductDetailBannerDesc extends Component {
  static propTypes = {
    descItems: PropTypes.arrayOf(PropTypes.object)
  }
 
  render() {
    const { descItems } = this.props;
    //const [value, setValue] = React.useState(0);
    //if (!descItems) return null;
    
    if (descItems) {
      return (
        <Grid item sm={12}>
          <ProductDetailTabPanel items={descItems}>
          </ProductDetailTabPanel> 
        </Grid>
      );
    } else {
      return null;
    };

  }
}

  //{ desc && <Typography>{desc[0].key}</Typography> }
        //<AppBar position="static">
        //  <Tabs value={desc[0].value} onChange={handleChange} aria-label="simple tabs example">
        //    <Tab label="Item One" {...desc[0].key} />
        //  </Tabs>
        //</AppBar>
        //<TabPanel value={desc[0].value} index={0}>
        //  Item One
        //</TabPanel>

export default ProductDetailBannerDesc;
