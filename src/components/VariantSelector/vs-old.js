import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import VariantItem from 'components/VariantItem';

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

@withStyles(styles, { name: "SkVariantSelector" })
export default class VariantSelector extends Component {
  static propTypes = {
    classes: PropTypes.object,
    currencyCode: PropTypes.string.isRequired,
    onSelectOption: PropTypes.func,
    onSelectVariant: PropTypes.func,
    product: PropTypes.object.isRequired,
    selectedOptionId: PropTypes.string,
    selectedVariantId: PropTypes.string,
    variants: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectors: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  //dropdownEntries = Array.apply(null, Array(this.props.selectors.length).map(u, i) => {''});

  //dropdownEntries.apply(entry => {entry = ''});

  dropdownEntries = Array(this.props.selectors.length).fill('');  

  state = {
      vals: this.dropdownEntries
  }

  

  renderVariant = (variant) => {

    const { classes, currencyCode, onSelectVariant, selectedVariantId } = this.props;

    const active = (selectedVariantId === variant._id);

    return (
      <div className={classes.variantItem} key={variant._id}>
        <VariantItem
          currencyCode={currencyCode}
          handleClick={() => { onSelectVariant(variant); }}
          isActive={active}
          variant={variant}
        />
        {/*this.renderBadges(variant)*/}
      </div>
    );
  }

  renderFormControl = (selector, selIndex) => {
    const { classes, variants } = this.props;

    //const [val, setVal] = React.useState('');
    
    //[val, setVal] = React.useState('');
      
    const handleChange = (event) => {
      let vals = [...this.state.vals];

      //console.log(vals);
      
      //let val = {vals[selIndex];
      //val = event.target.value;
      vals[selIndex] = event.target.value;

      this.setState({vals});

      //console.log(this.state.vals);
      
      //let val = {...vals[selIndex]};
      //val = event.target.value;
      //vals[selIndex] = val;
      //this.setState({

      //this.state.val = event.target.value;
      //this.setState({ val[selIndex]: event.target.value });
      // construct variant
      //console.log(this.dropdownEntries);
        // then run () => { onSelectVariant(variant); } 
    };

    
    const options = selector.selectorOptionsAsCSV.split(',');
    
    return (
      <div key={selIndex}>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">{selector.selectorName}</InputLabel>
          <Select
            id="demo-simple-select"
            //value={this.state.val[selIndex]}
            value={this.state.vals[selIndex]}
            onChange={handleChange}
          >
            {options.map((option, index) => (
              <MenuItem key={index} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    );
  }
  
  render() {
    const { classes, variants, selectors } = this.props;
    
 
    return (
      <div>
        {selectors && selectors.map(this.renderFormControl)}
        {/* create a checkbox that shows/removes all variants
                the selected variant should always appear
                use state:
                  => active variant always appears
                  => inactive variants   */}
 
        {variants && variants.map(this.renderVariant)}
      </div> 
    );
  }
}
