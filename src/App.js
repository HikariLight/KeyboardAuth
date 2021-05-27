import React from 'react';
import './App.css';
import Hello from './Hello.js';
import Home from './Home.js';
import About from './About.js';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      content: <Hello />,
    };
    this.initialize();
    /* this.state = {
      content: <Home handleClick={this.handleClick} />,
    }; */
  }

  initialize = async () => {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay (3000);
    this.setState({content: <Home handleClick={this.handleClick} />});
  }

  handleClick = (c) => {
    this.setState({content: c});
  };
  
  render() {
    return (
      <div>
        {this.state.content}
        <footer id="menu">
          <button id="homeBtn" onClick={() => this.handleClick(<Home handleClick={this.handleClick} />)}> Home </button>
          <button id="aboutBtn" onClick={() => this.handleClick(<About />)}> About </button>
        </footer>
      </div>
    )};
}

export default App;
