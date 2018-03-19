import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RaisedButton, TextField } from 'material-ui';

export default class Home extends Component {
  static propTypes = {
    startPoll: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className='app'>
          <TextField
          floatingLabelText='Places we can eat'
          multiLine={true}
          onChange={(e) => this.setState({ options: e.target.value })}
        />
        <RaisedButton label='Start Poll' onClick={() => this.props.startPoll(this.state.options)} />
      </div>
    );
  }
}