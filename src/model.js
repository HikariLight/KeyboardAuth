"use strict";

// example of a sample: First letter, second letter, dwell time of first, dwell time of second, flight time.

// HOW THIS ALGORITHM WORKS
// Scan the typing samples and keep only the digraphs that appear in both samples
// Sort both of the samples wrt the digraph length (dwell + flight + dwell)
// Measure the distance between the positions of one digraph in both samples
// Formula for distance : (dist1 + dist2 + dist3 + dist4) / (V ^2 - 1 / 2) (V is the length of the sample)

let construct_sample = function(sample){
    let result = []
    for(let i = 0; i < sample.length; i++){
        let digraph = sample[i][0] + sample[i][1]
        let duration = sample[i][2] + sample[i][3] + sample[i][4]
        result[i] = [digraph, duration]
    }

    return result;
}

let filter_samples = function(s1, s2){
    let digraphs = [];
    s1.forEach(item => digraphs.push(item[0]));

    s2.forEach(function(item){
        if(!digraphs.includes(item[0])){
            s2.splice(s2.indexOf(item), 1);
        }
    })

    digraphs = [];
    s2.forEach(item => digraphs.push(item[0]));

    s1.forEach(function(item){
        if(!digraphs.includes(item[0])){
            s1.splice(s1.indexOf(item), 1);
        }
    })
}

let sort_samples = function(s1, s2){
    s1 = s1.sort(function(a,b) {
        return a[1] - b[1];
    });

    s2 = s2.sort(function(a,b) {
        return a[1] - b[1];
    });
}


let measure_distance = function(test_sample, training_sample){
    let result = 0;

    for(let i = 0; i < test_sample.length; i++){
        for(let j = 0; j < test_sample.length; j++){
            if(test_sample[i][0] == training_sample[j][0]){
                result += (j - i);
            }
        }
    }

    if(test_sample.length % 2 == 0){
        result = result / ((test_sample.length ** 2) / 2)
    } else{
        result = result / (((test_sample.length ** 2) - 1) / 2)
    }

    return result;
}


let test_sample1 = construct_sample([[ "b", "r", 156, 102, 89 ],["r", "o", 102, 103, 127 ],["o", "w", 103, 153, 96 ],[ "w", "n", 153, 64, 120 ], ["a", "e", 103, 153, 96 ],[ "f", "u", 153, 64, 120 ]]);
let test_sample2 = construct_sample([[ "b", "r", 150, 110, 95 ],["r", "o", 90, 100, 110 ],["o", "w", 95, 140, 100 ],[ "w", "n", 140, 70, 110 ], ["s", "e", 103, 153, 96 ],[ "n", "a", 153, 64, 120 ]]);

filter_samples(test_sample1, test_sample2);

// sort_samples(test_sample1, test_sample2);
// let distance = measure_distance(test_sample1, test_sample2);
// console.log(distance);

console.log(test_sample1);
console.log(test_sample2);
