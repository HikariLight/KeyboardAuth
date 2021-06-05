import React, { useEffect } from 'react';
import './style/Keylogger.css';

// global variable
var sample;

function Keylogger() {
    sample = [];
    var data = []; // data to concatenate
    var tmp = []; // tmp to link dwell time / flight time
    var flightTime = 0; // timer key down of previous letter
    var dwellTime = {}; // dict timer key down
    var threshold = 100000; // milliseconds
    
    const listenerUp = (event) => {

        if (isIn(dwellTime, event.key)) {
            var elapsed = new Date().getTime() - dwellTime[event.key];

            delete dwellTime[event.key];
        }

        for (var i = 0; i < tmp.length; i++) {
            if ((tmp[i][0] === event.key) && (tmp[i][1] == null)) {
                tmp[i][1] = elapsed;
                data.push([tmp[i][0], tmp[i][1], tmp[i][2]]);
                tmp = deleteRow(tmp, i);
            }
        }

        if (data.length >= 2) {
            sample.push(concatenateData(data));
            data.shift();
        }
    };

    const listenerDown = (event) => {
        
        if (!isIn(dwellTime, event.key)) {
            var now = new Date().getTime();
            var elapsed = now - flightTime;
            if (elapsed > threshold) {
                elapsed = 0;
            }

            dwellTime[event.key] = now; 
            tmp.push([event.key, null, elapsed]);

            flightTime = now;
        }
        
    };

    useEffect(() => {
        document.getElementById('keylogger').addEventListener('keydown', listenerDown);
        document.getElementById('keylogger').addEventListener('keyup', listenerUp);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div id="keylogger">
            <br />
            <p id="name">Enter the text above : </p>
            <div contentEditable="true" id="textfield"></div>
            <br />
        </div>
    );
}

// delete specified row of an array
function deleteRow(arr, row) {
    arr = arr.slice(0);
    arr.splice(row, 1);
    return arr;
}

// concatenate data[] for neuronal network
function concatenateData(arr) {
    var result = [null, null, null, null, null];
    for (var i = 0; i < 2; i++) {
        if (i === 0) {
            result[0] = arr[i][0];
            result[2] = arr[i][1];
        } 
        if (i === 1) {
            result[1] = arr[i][0];
            result[3] = arr[i][1];
            result[4] = arr[i][2];
        }
    }
    return result;
}

// search key in dictionnary
function isIn(dict, key) {
    for (const [letter] of Object.entries(dict)) {
        if (letter === key) {
            return true;
        }
    }
    return false;
}

// exportation
export var saveSample = function(name) {
    window.localStorage.setItem(name, sample);
};

export var getSample = function() {
    return sample;
}

export default Keylogger;