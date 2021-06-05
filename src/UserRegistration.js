import React from 'react';
import './style/UserRegistration.css';
import { saveSample } from './Keylogger.js';

class UserRegistration extends React.Component {

    unregisteredBtn() {
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

    registerUser(){
        console.log("It's working kinda");
        var name = document.getElementsByClassName('nameField')[0].innerText.toLowerCase();
        if (window.localStorage.getItem(name)==null) {
            saveSample(name);
            return true;
        } else {
            alert("Name already used ! \nPlease choose an other one.");
            return false;
        }   
        
    }

    render () {
        if(this.props.registered === false) {
            return (
                <div>
                    <p id="name">Enter your name : </p>
                    <div contentEditable="true" id="textfield" className="nameField"></div>
                    <button id="submit" onClick={() => {
                        if (this.registerUser()) {
                            this.props.handleClick(this.unregisteredBtn());
                        }
                        }}> Submit </button>
                </div>
            );

        } else if (this.props.registered === true) {
            return (
                <div>
                    <button id="submit" onClick={() => {
                        //this.registerUser(); // change to read data and get name
                        this.props.handleClick(this.registeredBtn())
                    }}> Submit </button>
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
