import React from 'react';
import './style/ChatBot.css';

class ChatBot extends React.Component {

    /* constructor(props) {
        super(props);
    } */

    render() {
        return (
            <div>
                <h1 id="title"> I bet I can guess who you are!</h1>
                <div id="pangrams">
                    The brown fox jumps over the lazy dog. 
                    Pack my box with five dozen liquor jugs. 
                    The five boxing wizards jump quickly. 
                    How vexingly quick daft zebras jump.
                </div>
            </div>
        );
    }
}

export default ChatBot;