import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ProductGridHero from 'components/ProductGridHero';
import Link from 'components/Link';

const styles = (theme) => ({
  container: {
    marginBottom: '-60px'
  }
});

@withStyles(styles, { name: "SkHomepageLanding" })
export default class HomepageLanding extends Component {
  static propTypes = {
    classes: PropTypes.object
  }

  render() {
    const { classes } = this.props; 
    
    const tag1 = {
      heroMediaUrl: 'https://backend.patchamp.com/assets/files/Media/bgjxx4wYZK5ScJxXL/large/pa32fx.png',
      displayTitle: 'PatchAmp',
      homepageField: 'Patching and Distribution Technology'
    };  

    const tag2 = {
      heroMediaUrl: 'https://backend.patchamp.com/assets/files/Media/W4Aiz6u666rSzirKB/large/patchbox-tag-banner.png',
      displayTitle: 'PatchBox',
      homepageField: 'Simplify IT'
    };
    
    const tag3 = {
      heroMediaUrl: 'https://backend.patchamp.com/assets/files/Media/wgxDAWHoA7Z2vsz9D/large/cable-banner-edit-5.png',
      displayTitle: 'Cables',
      homepageField: 'Custom video cables'
    };

    const tag4 = {
      heroMediaUrl: 'https://backend.patchamp.com/assets/files/Media/M2m8STiWnWR7FpAdH/large/patch-panel-banner-9.png',
      displayTitle: 'Patch Panels',
      homepageField: 'Coax, fiber, and Cat6 patch panels'
    };
    
    const tag5 = {
      heroMediaUrl: 'https://backend.patchamp.com/assets/files/Media/HqyzSDWzNpg5svBgq/large/connectors-banner-fix-4.png',
      displayTitle: 'Connectors',
      homepageField: 'Video and Cat5/6 connectors'
    };

    return (
      <div className={classes.container}>
        <Link route={'https://shop.patchamp.com/tag/patchamp?limit=15'}>
          <ProductGridHero tag={tag1} />
        </Link>
        <Link route={'https://shop.patchamp.com/tag/patchbox?limit=15'}>
          <ProductGridHero tag={tag2} />
        </Link>
        <Link route={'https://shop.patchamp.com/tag/cable-assembly?limit=15'}>  
          <ProductGridHero tag={tag3} />
        </Link>
        <Link route={'https://shop.patchamp.com/tag/patch-panels?limit=15'}>
          <ProductGridHero tag={tag4} />
        </Link>
        <Link route={'https://shop.patchamp.com/tag/connectors?limit=15'}>
          <ProductGridHero tag={tag5} />
        </Link>
      </div>
    ); 

  }

}
