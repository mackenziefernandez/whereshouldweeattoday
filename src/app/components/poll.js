import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Slider } from 'material-ui';

export default class Poll extends Component {
  static propTypes = {
    pollOptions: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      valuesOfOptions: ''
    };
  }

  onChangeSlider = () => {
    // redistribute the values of all sliders
    // set state with new values
  }

  getOptionSliders = () => {
    const pollOptions = this.props.pollOptions;
    return pollOptions.map((option, i) => {
      return <Slider key={i} step={pollOptions.length/100} value={0.5} onChange={this.onChangeSlider} />;
    });
  }

  render() {
    return (
      <div className='poll'>
        {this.getOptionSliders()}
      </div>
    );
  }
}