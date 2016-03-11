/* global describe: true, before: true, it: true */

import React from 'react';
import expect from 'expect.js';
import sd from 'skin-deep';

import Button from '../index';

describe('Button component', () => {

  before(() => {
    // do something before
  });

  it('should render correctly as a button element', () => {
    const btnTree = sd.shallowRender(
      <Button
        name="aButton"
        id="anId"
        isPrimary={true}
        isDisabled={false}
        action={() => {}}>
        En knapp
      </Button>
    );
    const vdomBtn = btnTree.getRenderOutput();
    expect(vdomBtn).to.have.property('type', 'button');
    expect(vdomBtn.props.type).to.eql('button');
    expect(vdomBtn.props.name).to.eql('aButton');
    expect(vdomBtn.props.id).to.eql('anId');
    expect(vdomBtn.props.className).to.eql('btn btn-primary');
    expect(vdomBtn.props.disabled).to.eql(null);
    expect(vdomBtn.props.children).to.eql([null, 'En knapp', null]);
  });

  it('should render correctly as a button element with an icon component as a child', () => {
    const btnTree = sd.shallowRender(
      <Button
        name="aButton"
        id="anId"
        isPrimary={true}
        isDisabled={false}
        action={() => {}}
        isLeftIcon={true}
        icon="checkmark">
        En knapp
      </Button>
    );
    const vdomBtn = btnTree.getRenderOutput();
    expect(vdomBtn).to.have.property('type', 'button');
    expect(vdomBtn.props.type).to.eql('button');
    expect(vdomBtn.props.name).to.eql('aButton');
    expect(vdomBtn.props.id).to.eql('anId');
    expect(vdomBtn.props.className).to.eql('btn btn-primary btn-icon-left');
    expect(vdomBtn.props.disabled).to.eql(null);

    const iconElement = btnTree.dive(['Icon']);
    const iconVdom = iconElement.getRenderOutput();
    expect(iconVdom.type).to.eql('svg');
    expect(iconVdom.props.className).to.eql('icon');

  });
});

