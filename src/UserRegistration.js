import React from 'react';
import './style/UserRegistration.css';
import { saveSample, getSample } from './Keylogger.js';

class UserRegistration extends React.Component {

    unregisteredBtn() {
        return (
            <div id="home">
                <h1 id="title"> Alright, gotcha. </h1>
                <h1 id="title"> I'll make sure to remember you :) </h1>
            </div>
        );
    }

    registeredBtn(name) {
        return(
            <div id="home">
                <h1 id="title"> You're {name} </h1>
                <h1 id="title"> Good to see you again :) </h1>
            </div>
        );
    }

    loadingPage() {
        return(
            <div id="load"></div>
        );
    }

    registerUser(){
        var name = document.getElementsByClassName('nameField')[0].innerText.toLowerCase();
        name = name.replace(/\s/g, "");
        if (name === "") {
            alert("You need to specify a name !");
            return false;
        } else if (window.localStorage.getItem(name) == null) {
            saveSample(name);
            return true;
        } else {
            alert("Name already used ! \nPlease choose an other one.");
            return false;
        }   
    }

    identifyUser() {
        var currentUser = getSample();
        // var id = compareSample(currentUser);
        // return id;
        return null;
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
                        this.props.handleClick(this.loadingPage());
                        //var id = this.identifyUser(); // compareSample and return the name
                        //this.props.handleClick(this.registeredBtn(id));
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
