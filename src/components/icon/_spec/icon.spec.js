/* global describe: true, before: true, it: true */

import React from 'react';
import expect from 'expect.js';
import sd from 'skin-deep';

import Icon from '../index';

describe('Icon component', () => {

  before(() => {
    // do something before
  });

  it('should render correctly as an icon element with className=icon', () => {
    const icnTree = sd.shallowRender(
      <Icon name="action"/>
    );

    const iconVdom = icnTree.getRenderOutput();
    expect(iconVdom.type).to.eql('span');
    expect(iconVdom.props.className).to.eql('icon icon_action');
  });
});

