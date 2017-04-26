import api from '../api.js';
import React from "react";

class Timer extends React.Component {
  handleClick = (e) => {
    api.toggleTimer();
  }
  render() {
    return (
      <div class={"workato-timer " + this.props.timerStatus}
        onClick={this.handleClick}>
        {this.props.timerStatus === "off" ?
          "Click to start timer" : "Click to stop timer"}
      </div>
    )
  }
}

class CurrentPage extends React.Component {
  render() {
    return (
      <div class="pin-group">
        <Pin
          url={this.props.thisPage.url}
          text={this.props.thisPage.text}
          key={this.props.thisPage.url}
          action="add"
        />
      </div>
    )
  }
}

class OtherPages extends React.Component {
  render() {
    return (
      <div class="pin-group">
        {Object.keys(this.props.pinned).map((url, i) => {
          return <Pin
                    url={url}
                    text={this.props.pinned[url]}
                    key={url}
                    action="remove"
                  />
        })}
      </div>
    )
  }
}

class Pin extends React.Component {
  render() {
    return (
      <div class={"pin-item " + this.props.action}>
        <PinLink
          text={this.props.text}
          url={this.props.url}
        />
        <PinAction
          action={this.props.action}
          url={this.props.url}
        />
      </div>
    )
  }
}

class PinLink extends React.Component {
  render() {
    return (
      <a href={this.props.url} class="pin-link">
        {this.props.text}
      </a>
    )
  }
}

class PinAction extends React.Component {
  handleClick = (e) => {
    if(this.props.action === "add") {
      api.addPin();
    }
    else {
      api.removePin(this.props.url);
    }
  }
  render() {
    return (
      <span onClick={this.handleClick} class="pin-action">
        {this.props.action === "add" ? "pin" : "unpin"}
      </span>
    )
  }
}

export default class Layout extends React.Component {
  constructor() {
    super();
    this.state = {
      pinned: [],
      timerStatus: null,
      thisPage: null
    }
  }
  render() {
    return (
      <div id='workatoApp'>
        {this.state.timerStatus &&
          <Timer timerStatus={this.state.timerStatus} />
        }
        {this.state.thisPage &&
          <CurrentPage thisPage={this.state.thisPage} />
        }
        {Object.keys(this.state.pinned).length > 0 &&
          <OtherPages pinned={this.state.pinned} />
        }
      </div>
    );
  }
}
