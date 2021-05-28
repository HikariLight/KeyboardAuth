import React from 'react';
import './UserRegistration.css';

class UserRegistration extends React.Component {

    unregisteredBtn() {
        //get the value of textfield
        return (
            <div id="home">
                <h1 id="title"> Alright, gotcha. </h1>
                <h1 id="title"> I'll make sure to remember you :) </h1>
            </div>
        );
    }

    registeredBtn() {
        return(
            <div id="home">
                <h1 id="title"> You're ??? ???</h1>
                <h1 id="title"> Good to see you again :) </h1>
            </div>
        );
    }

    render () {
        if(this.props.registered === false) {
            return (
                <div>
                    <p id="name">Enter your name : </p>
                    <div contentEditable="true" id="textfield"></div>
                    <button id="submit" onClick={() => this.props.handleClick(this.unregisteredBtn())}> Submit </button>
                </div>
            );

        } else if (this.props.registered === true) {
            return (
                <div>
                    <button id="submit" onClick={() => this.props.handleClick(this.registeredBtn())}> Submit </button>
                </div>
            );
        } else {
            return (
                <div> Something wrong with registered value </div>
            );
        }        
    }
}

export default UserRegistration;
