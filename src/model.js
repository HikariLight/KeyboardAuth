"use strict";

let construct_sample = function(sample){
    let result = []
    for(let i = 0; i < sample.length; i++){
        let digraph = sample[i][0] + sample[i][1]
        let duration = sample[i][2] + sample[i][3] + sample[i][4]
        result[i] = [digraph, duration]
    }

    return result;
}

let dupilicates_filter = function(sample){
    let result = []

    for(let i = 0; i < sample.length; i++){
        if(!result.includes(sample[i])){
            result.push(sample[i]);
        } 
        else{
            result[i][1] = (result[i][1] + sample[i][1]) / 2;
        }
    }

    return result;
}

let commons_filter = function(s1, s2){
    let s1_digraphs = [];
    s1.forEach(item => s1_digraphs.push(item[0]));

    let s2_digraphs = [];
    s2.forEach(item => s2_digraphs.push(item[0]));

    let digraphs = s1_digraphs.filter(item => s2_digraphs.includes(item));

    // Have to loop backwards because if the array's indexes change then it'll quit the loop 
    let i = s1.length;

    while (i--){
        if(!digraphs.includes(s1[i][0])){
        s1.splice(i, 1);
        }
    } 

    i = s2.length;
    while (i--){
        if(!digraphs.includes(s2[i][0])){
        s2.splice(i, 1);
        }
    } 
}

let sort_samples = function(s1, s2){
    s1 = s1.sort(function(a,b) {
        return a[1] - b[1];
    });

    s2 = s2.sort(function(a,b) {
        return a[1] - b[1];
    });
}

let process_samples = function(s1, s2){
    s1 = construct_sample(s1);
    s1 = dupilicates_filter(s1);

    s2 = construct_sample(s2);
    s2 = dupilicates_filter(s2);

    commons_filter(s1, s1);
    sort_samples(s1, s2);
}

let measure_distance_r = function(test_sample, training_sample){
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

let measure_distance_a = function(test_sample, training_sample){
    let result = 0;

    for(let i = 0; i < test_sample.length; i++){
        for(let j = 0; j < test_sample.length; j++){
            if(test_sample[i][0] == training_sample[j][0]){
                result += (test_sample[i][1] / training_sample[j][1]);
            }
        }
    }

    return result;
}

let measure_distance_s = function(test_sample, training_sample){
    return true;
}

let compare_samples = function(test_sample){
    return true;
}

let test_sample1 = [[ "b", "r", 156, 102, 159 ],["r", "o", 102, 103, 127 ],["o", "w", 103, 153, 116 ],[ "w", "n", 153, 64, 120 ], ["a", "e", 103, 153, 116 ],[ "f", "u", 153, 64, 120 ]];
let test_sample2 = [[ "b", "r", 150, 110, 95 ],["r", "o", 90, 100, 110 ],["o", "w", 95, 140, 100 ],[ "w", "n", 140, 70, 110 ], ["s", "e", 103, 153, 96 ],[ "n", "a", 153, 64, 120 ]];

test_sample1 = construct_sample(test_sample1);
test_sample2 = construct_sample(test_sample2);

commons_filter(test_sample1, test_sample2);
sort_samples(test_sample1, test_sample2); 

let distance_r = measure_distance_r(test_sample1, test_sample2);
let distance_a = measure_distance_a(test_sample1, test_sample2);
console.log("Distance R:", distance_r);
console.log("Distance A:", distance_a);
