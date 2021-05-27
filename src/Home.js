import React from 'react';
import './Home.css';
import Keylogger from './Keylogger.js';
import UserRegistration from './UserRegistration';
import Pangrams from './Pangrams.js';
import ChatBot from './ChatBot.js';

class Home extends React.Component {
  
    constructor(props) {
      super(props);
    }
    
    render() {
      return (
        <div id="home">
          <h1 id="title">Have we met before ? </h1>
          <button id="yesBtn" onClick={() => this.props.handleClick([<ChatBot />, <Keylogger />])}> Yes </button>
          <button id="noBtn" onClick={() => this.props.handleClick([<Pangrams />, <Keylogger />, <UserRegistration handleClick={this.props.handleClick}/>])}> No </button>
        </div>
      )};
  } 

export default Home;