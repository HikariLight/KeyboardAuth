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
    let digraphs = [];

    for(let i = 0; i < sample.length; i++){
        if(!digraphs.includes(sample[i][0])){
            digraphs.push(sample[i][0])
            result.push(sample[i]);
        }
    }

    return result;
}


let process_sample = function(sample){
    // Calls the previous filtering functions

    let result = [];
    result = construct_sample(sample);
    result = dupilicates_filter(result);

    return result;
}


// SAMPLES FILTERS
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

let process_samples = function(s1, s2){
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
            if(test_sample[i][0] === training_sample[j][0]){
                result += Math.abs(j - i);
            }
        }
    }

    if(test_sample.length % 2 === 0){
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
    let similar_digraphs = 0;

    for(let i = 0; i < test_sample.length; i++){
        for(let j = 0; j < test_sample.length; j++){
            if(test_sample[i][0] === training_sample[j][0]){
                let similar = Math.max(test_sample[i][1], training_sample[j][1]) / Math.min(test_sample[i][1], training_sample[j][1]);
                if(1 < similar && similar< 1.2){
                    similar_digraphs += 1;
                }
            }
        }
    }

    console.log(similar_digraphs);
    result = 1 - (similar_digraphs / test_sample.length);
    return result;
}

export let infer_identity = function(testing_sample, saved_samples){
    // Calls the statistical model functions to guess the identity of the user
    
    let test_sample = process_sample(testing_sample);
    let lowest_score = 1000000;
    let scores = {};
    let result = "Nobody";
    
    for (const [name, training_sample] of Object.entries(saved_samples)){

        let saved_sample = process_data(training_sample);
        saved_sample = process_sample(saved_sample);
        process_samples(test_sample, saved_sample);

        let score = measure_distance_r(test_sample, saved_sample) + measure_distance_a(test_sample, saved_sample);
        scores[name] = score;
      }

    for (const [name, score] of Object.entries(scores)){
        if(score < lowest_score){
            lowest_score = score;
            result = name;
        }
      }
    
    // Identification threshhold
    if(lowest_score > 1.3){
        result = "Nobody";
    }

    return result;
}
