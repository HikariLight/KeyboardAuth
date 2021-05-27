import React, { useEffect } from 'react';
import './UserRegistration.css';

class UserRegistration extends React.Component {

    constructor(props) {
        super(props);
    }

    submitBtn() {
        return (
            <div id="home">
                <h1 id="title"> Alright, gotcha. </h1>
                <h1 id="title"> I'll make sure to remember you :) </h1>
            </div>
        );
    }

    render () {
        return (
            <div>
                <p id="name">Enter your name : </p>
                <div contentEditable="true" id="textfield"></div>
                <button id="submit" onClick={() => this.props.handleClick(this.submitBtn())}> Submit </button>
            </div>
        );
    }
}

export default UserRegistration;
