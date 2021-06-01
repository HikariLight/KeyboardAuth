import React, { useEffect } from 'react';
import './style/Keylogger.css';

function Keylogger() {
    var data = []; // data sent to neuronal network
    var tmp = []; // tmp to link dwell time / flight time
    var flightTime = 0; // timer key down of previous letter
    var dwellTime = {}; // dict timer key down
    var threshold = 100000; // milliseconds
    let sample = [];

    const listenerUp = (event) => {

        if (isIn(dwellTime, event.key)) {
            var elapsed = new Date().getTime() - dwellTime[event.key];

            // console.log("key up : " + event.key + " | dwell Time : " + elapsed);

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
            var x = concatenateData(data);
            // console.log(x);
            data.shift();

            sample.push(x);
        }
    };

    const listenerDown = (event) => {
        
        if (!isIn(dwellTime, event.key)) {
            var now = new Date().getTime();
            var elapsed = now - flightTime;
            if (elapsed > threshold) {
                elapsed = 0;
            }

            // console.log("key down : " + event.key + " | flight Time : " + elapsed);

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

// let saveSample = function(name){
//     window.localStorage.setItem(name, sample);
// }

export default Keylogger;