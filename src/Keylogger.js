import React, { useEffect } from 'react';

function Keylogger() {
    var startTimer = new Date().getTime();

    const listener = (event) => {
        var now = new Date().getTime();
        var deadline = now - startTimer;
        var minutes = Math.floor((deadline % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((deadline % (1000 * 60)) / 1000);
        console.log("KeyPressed : " + event.key + " at " + minutes + "m " + seconds + "s ");
    };

    useEffect(() => {
        window.addEventListener('keyup', listener);
    }, []);

    return (
        <div className="keylogger">
            <h2> KeyPressed will be displayed here </h2>
        </div>
    );
}

export default Keylogger;