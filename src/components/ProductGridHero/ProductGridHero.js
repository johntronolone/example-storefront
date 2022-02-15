import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ProductGridTitle from "components/ProductGridTitle";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
  heroImg: {
    width: "100%"
  },
  heroImgContainer: {
    width: "100%",
    height: '400px',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    //marginBottom: '1rem'
  },
  heroImgOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  heroGridContainer: {
    //maxWidth: theme.layout.mainContentMaxWidth,
    //marginLeft: - theme.spacing.unit * 3,
    //marginRight: - theme.spacing.unit * 3,
    //marginTop: '12px',
    //marginBottom: '12px'
   // marginLeft: '-24px',
   // marginRight: '-24px',
    marginLeft: '-12px',
    marginRight: '-12px'
  },
  heroTitle: {
    //paddingTop: '120px'
    //verticalAlign: 'middle'
  },
  heroTitleText: {
    color: theme.palette.reaction.white,
    fontSize: '64px',
    textAlign: 'center',
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: '90%'
  },
  heroSubText: {
    color: theme.palette.reaction.white,
    fontSize: '32px',
    textAlign: 'center',
    fontWeight: theme.typography.fontWeightLight
  },
});

@withStyles(styles, { name: "SkProductGridHero" })
export default class ProductGridHero extends Component {
  static propTypes = {
    classes: PropTypes.object,
    tag: PropTypes.object
  };

  static defaultProps = {
    classes: {},
    tag: {}
  };

  render() {
    const { classes, tag, tag: { heroMediaUrl, metafields } } = this.props;

    if (!heroMediaUrl) {
      return (
        <div>
        {tag && tag.displayTitle && <ProductGridTitle displayTitle={tag.displayTitle}/>}
        </div>
      );
    }
    
    return (
      <section className={classes.heroGridContainer}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <div className={classes.heroImgContainer} style={{backgroundImage: 'url(\''.concat(heroMediaUrl, '\')')}}>
              <div className={classes.heroImgOverlay}>
              {tag && tag.displayTitle && <div className={classes.heroTitle}><Typography className={classes.heroTitleText}>{tag.displayTitle}</Typography></div>}
              {metafields && metafields[0] && metafields[0].value && <div><Typography className={classes.heroSubText}>{metafields[0].value}</Typography></div>}
              {tag && tag.homepageField && <div><Typography className={classes.heroSubText}>{tag.homepageField}</Typography></div>}
              </div>
            </div>
          </Grid>
        </Grid>
      </section>
    );
  }
}
