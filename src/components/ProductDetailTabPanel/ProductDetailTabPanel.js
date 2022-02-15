import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
//import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
//import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Divider from 'components/Divider'; 

/*
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div style={{ padding: 20 }}>
          <Typography style={{whiteSpace: 'pre-line'}}>{children}</Typography>
        </div>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}*/

//const useStyles = makeStyles((theme) => ({
//  root: {
//    flexGrow: 1,
//    backgroundColor: theme.palette.background.paper,
//  },
//}));

const styles = (theme) => ({
  specContainer: {
    flexGrow: 1
  },
  specItemContainer: {
    padding: theme.spacing.unit,
    minWidth: '33%'
  },
  specItem: {
    padding: theme.spacing.unit,
    whiteSpace: 'pre-line',
    paddingBottom: theme.spacing.unit * 4,
  },
  specTitle: {  
    padding: theme.spacing.unit
  }
});


@withStyles(styles, {name: 'SkTabPanel'})
export class ProductDetailTabPanel extends Component {
  static propTypes = {
    classes: PropTypes.object,
    items: PropTypes.arrayOf(PropTypes.object)
  }
  
  renderItem(item, index) {
    const { classes: { specItem, specTitle, specItemContainer } } = this.props;
    
    let descSplit = item.value.split('\\n');
    let descJoin = descSplit.join('\n');
  
    if (item) {
      return( 
        <Grid className={specItemContainer} item md key={index}>
          <Typography className={specTitle}>{item.key}</Typography>
          <Divider />
          <Typography className={specItem}>{descJoin}</Typography>
        </Grid>
      );
    } else {
      return null;
    }
  }
  
  render() {
    const { items, classes: { specContainer } } = this.props;
    if (items) {
      return (
        <div className={specContainer}>
          <Grid container style={{justifyContent:'space-between'}}>
            {items && items.map((i, idx )=> this.renderItem(i, idx))}
          </Grid>
        </div>
      );
    } else {
      return null;
    }
  }

}

export default ProductDetailTabPanel;

/*
export default function SimpleTabs(props) {
  //const classes = useStyles();
  const [value, setValue] = React.useState(0);

  //const items = props;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //var itemsLen = props.items.length;

  //var innerData = "";

  //for (var i = 0; i < itemsLen; i++) {
    //innerData +="<Tab label='";
    //innerData += props.items[i].key;
    //innerData += "' {...a11yProps(";
    //innerData += i;
    //innerData += ")} />";
  //};
  
  //const key1;

  //if (props.key1) {
    //key1 = props.key1;
  //} else {
    
  //}

  if (props.items.length == 3) { 

    var val1_split = props.items[0].value.split('\\n');
    var val2_split = props.items[1].value.split('\\n');
    var val3_split = props.items[2].value.split('\\n');
    var val1_join = val1_split.join('\n');
    var val2_join = val2_split.join('\n');
    var val3_join = val3_split.join('\n');
    var maxLines = Math.max(val1_split.length, val2_split.length, val3_split.length);

    return (
      <div style={{ minHeight: maxLines*24 + 40}}>
        <AppBar position="static" elevation={0}>
          <Tabs 
            value={value} 
            onChange={handleChange} 
            aria-label="simple tabs example" 
            variant="scrollable" 
            scrollButtons="auto"
            indicatorColor="primary"
          >
            <Tab label={props.items[0].key} {...a11yProps(0)} />
            <Tab label={props.items[1].key} {...a11yProps(1)} />
            <Tab label={props.items[2].key} {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          {val1_join}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {val2_join}
        </TabPanel>
        <TabPanel value={value} index={2}>
          {val3_join}
        </TabPanel>
      </div>
    );
  } else if (props.items.length == 2) {
    
    var val1_split = props.items[0].value.split('\\n');
    var val2_split = props.items[1].value.split('\\n');
    var val1_join = val1_split.join('\n');
    var val2_join = val2_split.join('\n');
    var maxLines = Math.max(val1_split.length, val2_split.length);

    return (  
      <div style={{ minHeight: maxLines*24 + 40}}>
        <AppBar position="static" elevation={0}>
          <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" variant="scrollable" scrollButtons="auto">
            <Tab label={props.items[0].key} {...a11yProps(0)} />
            <Tab label={props.items[1].key} {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          {val1_join}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {val2_join}
        </TabPanel>
      </div>
    );
  } else if (props.items.length == 1) {

    var val1_split = props.items[0].value.split('\\n');
    var val1_join = val1_split.join('\n');
    var maxLines = val1_split.length;

    return (
      <div style={{ minHeight: maxLines*24 + 40}}>
        <AppBar position="static" elevation={0}>
          <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" variant="scrollable" scrollButtons="auto">
            <Tab label={props.items[0].key} {...a11yProps(0)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          {val1_join}
        </TabPanel>
      </div>
    );
  } else {
    return null
  };
}*/
