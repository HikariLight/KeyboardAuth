import React from 'react';
import './Home.css';
import Keylogger from './Keylogger.js';
import UserRegistration from './UserRegistration';
import Pangrams from './Pangrams.js';
import ChatBot from './ChatBot.js';

class Home extends React.Component {

    yesEvent = () => {
      this.registered = true;
      this.props.handleClick([<ChatBot />, <Keylogger />, <UserRegistration handleClick={this.props.handleClick} registered={this.registered} />]);
    }

    noEvent = () => {
      this.registered = false;
      this.props.handleClick([<Pangrams />, <Keylogger />, <UserRegistration handleClick={this.props.handleClick} registered={this.registered}/>]);
    }
    
    render() {
      return (
        <div id="home">
          <h1 id="title">Have we met before ? </h1>
          <button id="yesBtn" onClick = {this.yesEvent} > Yes </button>
          <button id="noBtn" onClick = {this.noEvent} > No </button>
        </div>
      )
    };
}

export default Home;