import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ButtonBase from "@material-ui/core/ButtonBase";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Minus from "mdi-material-ui/Minus";
import Plus from "mdi-material-ui/Plus";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";

const styles = () => ({
  incrementButton: {
    backgroundColor: "#fafafa",
    boxSizing: "inherit",
    color: "#666666",
    padding: 6
  },
  quantityContainer: {
    border: "1px solid #d9d9d9",
    borderRadius: "2px",
    boxSizing: "border-box",
    height: "30px",
    overflow: "hidden",
    padding: 0
  },
  quantityInput: {
    "appearance": "none",
    "border": "1px solid #d9d9d9",
    "borderRadius": 0,
    "boxSizing": "inherit",
    "color": "#3c3c3c",
    "fontSize": "12px",
    "lineHeight": "2",
    "height": "30px",
    "maxWidth": "40px",
    "textAlign": "center",
    "&:focus": {
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)"
    }
  },
  editButton: {
    "borderRadius": "2px",
    "paddingTop": "2px",
    "paddingBottom": "2px",
    "paddingLeft": "6px",
    "paddingRight": "6px",
    "marginRight": "12px"
  },
  saveButton: {
    "borderRadius": "2px",
    "paddingTop": "2px",
    "paddingBottom": "2px",
    "paddingLeft": "6px",
    "paddingRight": "6px",
    "marginRight": "12px"
  },
  quantityInputBox: {
    "fontSize": "8px",
  },
  quantityInputBoxInput: {
    "height": "24px",
    "maxWidth": "80px"
  },
  valueInputText: {

  }
});

class QuantityInputMod extends Component {
  static propTypes = {
    /**
     * You can provide a `className` prop that will be applied to the outermost DOM element
     * rendered by this component. We do not recommend using this for styling purposes, but
     * it can be useful as a selector in some situations.
     */
    className: PropTypes.string,
    /**
     * MUI theme classes
     */
    classes: PropTypes.object,
    /**
     * On change hanlder for input
     */
    onChange: PropTypes.func,
    /**
     * Prepopulate the input's value.
     */
    value: PropTypes.number
  };

  static defaultProps = {
    classes: {},
    onChange() { }
  };

  constructor(props) {
    super(props);

    const value = props.value || 0;

    this.state = {
      initialValue: props.value,
      value,
      isEditing: false
    };
  }

  handleChanged(value) {
    const { onChange } = this.props;
    onChange(value);
  }

  handleQuantityInputChange = (event) => {
    const { value } = event.target;

    const numericValue = Math.floor(Number(value));

    if (Number.isNaN(numericValue)) return;

    this.setState({ value: numericValue });
    this.handleChanged(numericValue);
  };

  handleIncrementButton = () => {
    const value = this.state.value + 1;

    this.setState({ value });
    this.handleChanged(value);
  };

  handleDecrementButton = () => {
    const value = this.state.value - 1;

    if (value >= 0) {
      this.setState({ value });
      this.handleChanged(value);
    }
  };
  
  handleQtyChange = (event) => {
    const { value } = event.target;

    const numericValue = Math.floor(Number(value));

    if (Number.isNaN(numericValue)) return;
    this.setState({ value: numericValue });
    //this.handleChanged(numericValue);
  
  }
  
  handleEditButton = () => {
    if (!this.state.isEditing) {
      this.setState({ isEditing: true });
    }
  }
  
  handleSaveButton = () => {
    const { onChange } = this.props;
    onChange(this.state.value);
    if (this.state.isEditing) {
      this.setState({ isEditing: false });
    }
  }

  render() {
    const { className, classes: { incrementButton, quantityContainer, quantityInput, quantityInputBox, quantityInputBoxInput, editButton, saveButton, valueText } } = this.props;
    const { value } = this.state;
    return (
      <Fragment>
      

          {!this.state.isEditing && 
          <Grid container direction="row" justify="space-between" spacing={0} alignItems="center">
            <Grid item>
              <Typography>Qty: {this.state.initialValue}</Typography>
            </Grid>
            <Grid item>
              <IconButton 
                onClick={this.handleEditButton}
                className={editButton}
                size="small"
                variant="outlined"
                color="default"
              >
                <EditOutlinedIcon fontSize="small" />
                <Typography>Edit</Typography>
              </IconButton>
            </Grid>
          </Grid>
          } 

          {this.state.isEditing && 
          <Grid container direction="row" justify="space-between" spacing={0} alignItems="center">
            <Grid item>
              <TextField 
                className={quantityInputBox} 
                value={value} 
                onChange={this.handleQtyChange}
                InputProps={{
                  className: quantityInputBoxInput,
                  startAdornment: <InputAdornment position="start">Qty:</InputAdornment>,
                  style: { paddingLeft: "4px" }
                }}
                variant="outlined"
                size="small"
              />
              
            </Grid>
            <Grid item>
              <IconButton 
                onClick={this.handleSaveButton}
                className={saveButton}
                size="small"
                variant="outlined"
                color="default"
              >
                <SaveOutlinedIcon fontSize="small"/>
                <Typography>Save</Typography>
              </IconButton>
            </Grid>
          </Grid>
          }

      {false && <TextField
        id="addToCartQuantityInput"
        className={className}
        value={value}
        onChange={this.handleQuantityInputChange}
        InputProps={{
          startAdornment: (
            <InputAdornment>
              <ButtonBase
                color="default"
                variant="outlined"
                onClick={this.handleDecrementButton}
                className={incrementButton}
                disableRipple
                disableTouchRipple
              >
                <Minus style={{ fontSize: "14px" }} />
              </ButtonBase>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment>
              <ButtonBase
                variant="outlined"
                color="default"
                onClick={this.handleIncrementButton}
                className={incrementButton}
                disableRipple={true}
                disableTouchRipple={true}
              >
                <Plus style={{ fontSize: "14px" }} />
              </ButtonBase>
            </InputAdornment>
          ),
          disableUnderline: true,
          classes: {
            root: quantityContainer,
            input: quantityInput
          }
        }}
      />}
      </Fragment>
    );
  }
}

export default withStyles(styles)(QuantityInputMod);
