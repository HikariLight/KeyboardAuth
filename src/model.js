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
    let lowest_score = 1000000;
    let scores = {};
    let result = "Nobody";

    for (const [name, training_sample] of Object.entries(samples)){
        let train_sample = process_sample(training_sample);
        filter_samples(test_sample, train_sample);
        let score = measure_distance_r(test_sample, train_sample) + measure_distance_a(test_sample, train_sample);
        scores[name] = score;
      }

    for (const [name, score] of Object.entries(scores)){
        if(score < lowest_score){
            lowest_score = score;
            result = name;
        }
      }

    return result;
}

// TESTING / DEBUGGING
let local_storage = {
    "julien": "Shift,h,247,134,127,h,e,134,136,71,e, ,136,96,105, ,b,96,96,87,b,r,96,112,64,r,o,112,105,120,o,w,105,103,105,w,n,103,97,119,n, ,97,94,81, ,f,94,119,88,f,o,119,88,111,o,x,88,94,97,x, ,94,79,144, ,j,79,88,71,j,u,88,78,169,u,m,78,71,208,m,p,71,79,152,p,s,79,63,72,s, ,63,80,71, ,o,80,81,104,o,v,81,47,73,v,e,47,112,111,e,r,112,104,72,r, ,104,104,120, ,t,104,119,81,t,h,119,145,55,h,e,145,104,80,e, ,104,75,145, ,l,75,71,72,l,a,71,104,87,a,z,104,96,64,z,y,96,95,185,y, ,95,95,144, ,d,95,110,137,d,o,110,103,103,o,g,103,88,88",
    "dhia": "Shift,h,421,170,120,h,e,170,104,139,e, ,104,95,113, ,b,95,153,111,b,r,153,123,120,r,o,123,101,138,o,w,101,103,94,w,n,103,96,135,n, ,96,104,48, ,f,104,119,88,f,o,119,72,144,o,x,72,119,65,x, ,119,73,182, ,j,73,79,41,j,u,79,103,489,u,m,103,79,240,m,p,79,72,183,p,s,72,71,80,s, ,71,79,96, ,o,79,79,104,o,v,79,88,56,v,e,88,120,136,e,r,120,103,72,r, ,103,128,112, ,t,128,134,100,t,h,134,151,61,h,e,151,111,71,e, ,111,90,122, ,l,90,95,87,l,a,95,127,71,a,z,127,129,87,z,y,129,96,225,y, ,96,112,112, ,d,112,120,128,d,o,120,83,121,o,g,83,88,79,g,.,88,231,56,.,Shift,231,294,112",
    "azerty": "Shift,h,264,159,158,h,e,159,120,97,e, ,120,102,96, ,b,102,144,96,b,r,144,175,160,r,o,175,95,216,o,w,95,167,160,w,n,167,144,71,n, ,144,102,201, ,f,102,136,63,f,o,136,96,120,o,x,96,119,89,x, ,119,79,160, ,j,79,80,71,j,u,80,79,145,u,m,79,72,208,m,p,72,64,153,p,s,64,78,48,s, ,78,87,87, ,o,87,80,97,o,v,80,63,63,v,e,63,104,103,e,r,104,87,73,r, ,87,136,111, ,t,136,152,97,t,h,152,143,120,h,e,143,118,72,e, ,118,80,143, ,l,80,64,72,l,a,64,134,58,a,z,134,119,79,z,y,119,119,208,y, ,119,112,183, ,d,112,118,281,d,o,118,62,153,o,g,62,79,47",
};

// Identical to the "dhia" sample in local_storage
let data_dhia1 = process_sample("Shift,h,421,170,120,h,e,170,104,139,e, ,104,95,113, ,b,95,153,111,b,r,153,123,120,r,o,123,101,138,o,w,101,103,94,w,n,103,96,135,n, ,96,104,48, ,f,104,119,88,f,o,119,72,144,o,x,72,119,65,x, ,119,73,182, ,j,73,79,41,j,u,79,103,489,u,m,103,79,240,m,p,79,72,183,p,s,72,71,80,s, ,71,79,96, ,o,79,79,104,o,v,79,88,56,v,e,88,120,136,e,r,120,103,72,r, ,103,128,112, ,t,128,134,100,t,h,134,151,61,h,e,151,111,71,e, ,111,90,122, ,l,90,95,87,l,a,95,127,71,a,z,127,129,87,z,y,129,96,225,y, ,96,112,112, ,d,112,120,128,d,o,120,83,121,o,g,83,88,79,g,.,88,231,56,.,Shift,231,294,112");
let identity = infer_identity(data_dhia1, local_storage);
console.log(identity);