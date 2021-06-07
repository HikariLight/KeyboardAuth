let process_data = function(data){
    // Processing captured data into initial samples
    // Turns localStorage String into an array
    // Form of the array: [letter, letter, dwell time, dwell time, flight time]

    let data_array = data.split(",");
    let result = [];

    let sub_arrays = data.length / 3;

    for (let i = 0; i < sub_arrays; i += 5){
        result.push(data_array.slice(i, i+5));
    }

    return result;
}

let construct_sample = function(sample){
    // Turns array into [digraph, time]
    let result = []
    for(let i = 0; i < sample.length; i++){
        let digraph = sample[i][0] + sample[i][1]
        let duration = parseInt(sample[i][2]) + parseInt(sample[i][3]) + parseInt(sample[i][4])
        result[i] = [digraph, duration]
    }

    return result;
}

let dupilicates_filter = function(sample){
    // Scans for duplicates. If any are found the second one is deleted and the 
    // mean of the 2 times is kept.
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
    // Processing initial samples into ready-to-use samples

    //Determining common digraphs
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
    // Sorts samples in ascending order (from lowest to highest) wrt timing data
    s1 = s1.sort(function(a,b) {
        return a[1] - b[1];
    });

    s2 = s2.sort(function(a,b) {
        return a[1] - b[1];
    });
}

export let process_sample = function(sample){
    // Calls the previous filtering functions

    let result = [];
    result = process_data(sample);
    result = construct_sample(result);
    result = dupilicates_filter(result);

    return result;
}

let filter_samples = function(s1, s2){
    // Prepares the samples for the statistical model
    // Detects common digraphs and sorts both samples

    commons_filter(s1, s2);
    sort_samples(s1, s2);
}


// STATISTICAL MODEL
let measure_distance_r = function(test_sample, training_sample){
    // First statistical model function
    // It measures the disorder in a sorted arary

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
    // Second statistical model function
    // Measures difference is time between common digraphs

    let result = 0;

    for(let i = 0; i < test_sample.length; i++){
        for(let j = 0; j < test_sample.length; j++){
            if(test_sample[i][0] == training_sample[j][0]){
                result += (test_sample[i][1] / training_sample[j][1]);
            }
        }
    }
    result /= test_sample.length;

    return result;
}

let infer_identity = function(test_sample, samples){
    let result = "Nobody";
    // let test_sample = test_sample;
    // let samples = samples
    // test_sample = process_sample(test_sample);

    return result;
}


// TESTING / DEBUGGING
let data_dhia1 = process_sample("Shift,h,421,170,120,h,e,170,104,139,e, ,104,95,113, ,b,95,153,111,b,r,153,123,120,r,o,123,101,138,o,w,101,103,94,w,n,103,96,135,n, ,96,104,48, ,f,104,119,88,f,o,119,72,144,o,x,72,119,65,x, ,119,73,182, ,j,73,79,41,j,u,79,103,489,u,m,103,79,240,m,p,79,72,183,p,s,72,71,80,s, ,71,79,96, ,o,79,79,104,o,v,79,88,56,v,e,88,120,136,e,r,120,103,72,r, ,103,128,112, ,t,128,134,100,t,h,134,151,61,h,e,151,111,71,e, ,111,90,122, ,l,90,95,87,l,a,95,127,71,a,z,127,129,87,z,y,129,96,225,y, ,96,112,112, ,d,112,120,128,d,o,120,83,121,o,g,83,88,79,g,.,88,231,56,.,Shift,231,294,112");
let data_dhia2 = process_sample("T,Shift,78,302,0,Shift,h,302,136,150,h,e,136,120,72,e, ,120,104,97, ,b,104,111,79,b,r,111,111,72,r,o,111,104,88,o,w,104,112,136,w,n,112,96,119,n, ,96,79,73, ,f,79,111,64,f,o,111,86,137,o,x,86,112,79,x, ,112,79,144, ,j,79,78,41,j,u,78,96,127,u,m,96,88,232,m,p,88,79,176,p,s,79,86,120,s, ,86,86,81, ,o,86,80,134,o,v,80,87,90,v,e,87,96,151,e,r,96,95,48,r, ,95,120,112, ,t,120,120,88,t,h,120,152,72,h,e,152,103,80,e, ,103,80,128, ,l,80,63,88,l,a,63,95,56,a,z,95,96,56,z,y,96,59,221,y, ,59,79,100, ,d,79,126,104,d,o,126,102,135,o,g,102,88,96");
filter_samples(data_dhia1, data_dhia2);

let distance_r = measure_distance_r(data_dhia1, data_dhia2);
let distance_a = measure_distance_a(data_dhia1, data_dhia2);
console.log("Distance R:", distance_r);
console.log("Distance A:", distance_a);
