import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Styled from './styles';

export default class ToolbarMenuItem extends Component {
  constructor() {
    super();

    // a flag to keep track of whether the menu item was actually clicked
    this.clicked = false;

    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleOnMouseUp = this.handleOnMouseUp.bind(this);
    this.handleOnMouseDown = this.handleOnMouseDown.bind(this);
    this.setRef = this.setRef.bind(this);

    this.uniqueRef = _.uniqueId('toolbar-menu-item');
  }

  componentDidMount() {
    // adding and removing touchstart events can be done via standard React way
    // by passing onTouchStart={this.funcName} once they stop triggering mousedown events
    // see https://github.com/facebook/react/issues/9809
    this[this.uniqueRef].addEventListener('touchstart', this.handleTouchStart);
  }

  componentWillUnmount() {
    this[this.uniqueRef].removeEventListener('touchstart', this.handleTouchStart);
  }

  setRef(ref) {
    this[this.uniqueRef] = ref;
  }

  // we have to use touchStart and on mouseUp in order to be able to use the toolbar
  // with the text shape on mobile devices
  // (using the toolbar while typing text shouldn't move focus out of the textarea)
  handleTouchStart(event) {
    event.preventDefault();
    const { objectToReturn, onItemClick } = this.props;
    // if there is a submenu name, then pass it to onClick
    // if not - it's probably "Undo", "Clear All", "Multi-user", etc.
    // in the second case we'll pass undefined and it will work fine anyway
    onItemClick(objectToReturn);
  }

  handleOnMouseDown() {
    this.clicked = true;
  }

  handleOnMouseUp() {
    // checks whether the button was actually clicked
    // or if a person was drawing and just release their mouse above the menu item
    if (!this.clicked) {
      return;
    }
    this.clicked = false;

    const { objectToReturn, onItemClick } = this.props;
    // if there is a submenu name, then pass it to onClick
    // if not - it's probably "Undo", "Clear All", "Multi-user", etc.
    // in the second case we'll pass undefined and it will work fine anyway
    onItemClick(objectToReturn);
  }

  render() {
    const {
      disabled,
      label,
      icon,
      customIcon,
      onBlur,
      children,
      showCornerTriangle,
      expanded,
      haspopup,
    } = this.props;

    return (
      <Styled.ButtonWrapper
        showCornerTriangle={showCornerTriangle}
        hidden={disabled}
      >
        <Styled.ToolbarButton
          state={expanded ? 'active' : 'inactive'}
          aria-expanded={expanded}
          aria-haspopup={haspopup}
          hideLabel
          role="button"
          color="default"
          size="md"
          label={label}
          icon={icon || null}
          customIcon={customIcon || null}
          onMouseDown={this.handleOnMouseDown}
          onMouseUp={this.handleOnMouseUp}
          onKeyPress={this.handleOnMouseDown}
          onKeyUp={this.handleOnMouseUp}
          onBlur={onBlur}
          setRef={this.setRef}
          disabled={disabled}
        />
        {children}
      </Styled.ButtonWrapper>
    );
  }
}

ToolbarMenuItem.propTypes = {
  // objectToReturn, children and onBlur are passed only with menu items that have submenus
  // thus they are optional
  onBlur: PropTypes.func,
  children: PropTypes.node,
  objectToReturn: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.number,
  ]),
  onItemClick: PropTypes.func.isRequired,
  // we can have either icon from the bigbluebutton-font or our custom svg/html
  // thus they are optional
  icon: PropTypes.string,
  customIcon: PropTypes.node,
  label: PropTypes.string.isRequired,
  toolbarActive: PropTypes.bool,
  disabled: PropTypes.bool,
  showCornerTriangle: PropTypes.bool,
};

ToolbarMenuItem.defaultProps = {
  objectToReturn: null,
  icon: '',
  customIcon: null,
  onBlur: null,
  children: null,
  disabled: false,
  showCornerTriangle: false,
  toolbarActive: false,
};
