import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "components/Link";

const date = new Date();

const styles = (theme) => ({
  footer: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    //paddingBottom: theme.spacing.unit * 2,
    //paddingTop: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
    borderTop: 'solid 1px #f5f5f5',
    backgroundColor: '#ffffff',
    position: 'relative',
    bottom: 0,
    width: '100%' 
  }
});

const Footer = ({ ...props }) => (
  <footer className={props.classes.footer}>
    <Typography variant="caption">
      &copy; {date.getFullYear()} PatchAmp | Questions? Contact us at +1 (201) 457-1504 or sales@patchamp.com |&nbsp;
      <a href={'https://www.patchamp.com/'}> 
        PatchAmp Website
      </a>
    </Typography>
  </footer>
);

Footer.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles, { name: "SkFooter" })(Footer);
