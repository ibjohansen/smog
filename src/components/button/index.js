import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Icon from '../icon';

class Button extends Component {

  render() {
    const {
      name,
      title,
      id,
      children,
      isPrimary,
      isLeftIcon,
      isDisabled,
      icon,
      action,
      isRight,
      isTight,
      isBig,
      className
    } = this.props;

    const classes = classNames({
      btn: !isTight,
      'btn-tight': isTight,
      'btn-big': isBig,
      'btn-primary': isPrimary ? true : null,
      'btn-secondary': !isPrimary ? true : null,
      'btn-icon-left': icon && isLeftIcon ? true : null,
      'btn-icon-right': icon && !isLeftIcon ? true : null,
      right: isRight
    }, className);

    return (
      <button
        type="button"
        name={name}
        title={title}
        id={id}
        className={classes}
        disabled={isDisabled ? 'disabled' : null}
        onClick={action}>
        {icon && isLeftIcon ? <Icon name={icon}/> : null}
        {children}
        {icon && !isLeftIcon ? <Icon name={icon}/> : null}
      </button>
    );
  }
}

Button.propTypes = {
  isPrimary: PropTypes.bool.isRequired,
  action: PropTypes.func.isRequired,
  children: PropTypes.any,
  name: PropTypes.string,
  title: PropTypes.string,
  id: PropTypes.string,
  isLeftIcon: PropTypes.bool,
  isDisabled: PropTypes.bool,
  icon: PropTypes.string,
  isRight: PropTypes.bool,
  isTight: PropTypes.bool,
  isBig: PropTypes.bool,
  className: PropTypes.string
};

export default Button;
