import React from 'react';
import './style/Hello.css';

class Hello extends React.Component {
    render () {
        return (
            <div id="home">
                <h1 id="title" className="transition"> Hi ! </h1>
            </div>
        );
    }
}

export default Hello;