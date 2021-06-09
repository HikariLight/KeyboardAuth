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
            if(test_sample[i][0] == training_sample[j][0]){
                result += Math.abs(j - i);
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
    let similar_digraphs = 0;

    for(let i = 0; i < test_sample.length; i++){
        for(let j = 0; j < test_sample.length; j++){
            if(test_sample[i][0] == training_sample[j][0]){
                let similar = Math.max(test_sample[i][1], training_sample[j][1]) / Math.min(test_sample[i][1], training_sample[j][1]);
                if(1 < similar < 1.2){
                    similar_digraphs += 1;
                }
            }
        }
    }

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
    if(lowest_score > 1.2){
        result = "Nobody";
    }

    return result;
}

let test_dhia = "T,Shift,86,264,0,Shift,h,264,80,174,h,e,80,104,72,e, ,104,103,129, ,b,103,119,96,b,r,119,127,80,r,o,127,122,104,o,w,122,126,131,w,n,126,72,109,n, ,72,79,104, ,f,79,120,48,f,o,120,87,128,o,x,87,95,96,x, ,95,71,152, ,j,71,63,192,j,u,63,95,136,u,m,95,63,232,m,p,63,77,146,p,s,77,70,70,s, ,70,109,65, ,o,109,72,103,o,v,72,104,144,v,e,104,136,144,e,r,136,79,88,r, ,79,120,104, ,t,120,160,104,t,h,160,151,96,h,e,151,128,72,e, ,128,79,129, ,l,79,72,111,l,a,72,127,56,a,z,127,96,80,z,y,96,88,256,y, ,88,103,152, ,d,103,104,496,d,o,104,71,105,o,g,71,80,102,g,.,80,128,48,., ,128,87,232, ,P,87,95,160,P,Shift,95,568,129,Shift,a,568,151,200,a,c,151,127,96,c,k,127,79,88,k, ,79,103,152, ,m,103,71,120,m,y,71,96,56,y, ,96,88,104, ,b,88,96,112,b,o,96,95,96,o,x,95,120,128,x, ,120,88,152, ,w,88,95,120,w,i,95,80,128,i,t,80,126,81,t,h,126,86,64,h, ,86,95,95, ,f,95,111,112,f,i,111,78,169,i,v,78,120,55,v,e,120,88,72,e, ,88,87,121, ,d,87,104,95,d,o,104,96,137,o,z,96,95,80,z,e,95,112,47,e,n,112,80,408,n, ,80,88,144, ,l,88,62,161,l,u,62,110,176,u,q,110,95,159,q,Backspace,95,88,1064,Backspace,Backspace,88,96,152,Backspace,i,96,88,168,i,q,88,103,96,q,u,103,87,136,u,o,87,95,225,o,r,95,104,119,r, ,104,86,137, ,j,86,88,1191,j,u,88,77,178,u,g,77,127,71,g,.,127,112,40,., ,112,80,176, ,Shift,80,601,95,Shift,h,601,102,176,h,e,102,88,63,e, ,88,95,96, ,f,95,96,88,f,i,96,80,120,i,v,80,127,81,v,e,127,80,71,e, ,80,80,104, ,b,80,79,168,b,o,79,86,89,o,x,86,135,119,x,i,135,87,152,i,n,87,120,120,n,g,120,79,80,g, ,79,95,120, ,w,95,111,296,w,i,111,79,144,i,z,79,152,248,z,a,152,160,120,a,r,160,120,104,r,d,120,143,249,d,s,143,3607,80,s, ,3607,80,319, ,j,80,56,152,j,u,56,78,145,u,m,78,48,223,m,p,48,79,129,p, ,79,99,88, ,q,99,104,95,q,u,104,152,136,u,i,152,88,88,i,c,88,118,137,c,k,118,71,112,k,l,71,80,207,l,y,80,112,112,y,.,112,103,49,., ,103,88,159, ,Shift,88,544,208,Shift,o,544,78,144,o,w,78,88,87,w, ,88,80,112, ,v,80,127,481,v,e,127,96,95,e,x,96,132,240,x,i,132,96,128,i,n,96,136,232,n,g,136,87,96,g,l,87,88,128,l,y,88,104,104,y, ,104,95,145, ,q,95,120,215,q,u,120,151,161,u,i,151,71,112,i,c,71,134,128,c,k,134,72,127,k, ,72,96,104, ,d,96,175,105,d,a,175,136,119,a,f,136,111,161,f,t,111,87,207,t, ,87,72,112, ,z,72,136,432,z,e,136,95,225,e,b,95,71,216,b,e,71,64,16,e,r,64,88,231,r,a,88,103,33,a,s,103,103,312,s, ,103,96,191, ,j,96,64,224,j,u,64,79,137,u,m,79,71,223,m,p,71,71,152,p,.,71,167,120,.,Shift,167,328,592";
let test_julien = "T,Shift,114,370,0,Shift,h,370,119,375,h,e,119,91,233,e, ,91,114,60, ,b,114,106,174,b,r,106,113,120,r,o,113,109,130,o,w,109,135,164,w,n,135,98,103,n, ,98,132,142, ,f,132,103,309,f,o,103,89,115,o,x,89,107,141,x, ,107,78,116, ,j,78,75,175,j,u,75,92,113,u,m,92,96,209,m,p,96,103,134,p,s,103,72,171,s, ,72,86,59, ,o,86,111,161,o,v,111,68,117,v,e,68,112,123,e,r,112,130,43,r, ,130,95,108, ,t,95,85,129,t,h,85,94,92,h,e,94,98,114,e, ,98,72,75, ,l,72,98,134,l,a,98,164,110,a,z,164,155,87,z,y,155,102,106,y, ,102,109,259, ,d,109,112,172,d,o,112,91,152,o,g,91,80,159,g,Shift,80,209,166,Shift, ,209,100,485, ,Shift,100,236,285,Shift,a,236,145,143,a,c,145,129,195,c,k,129,93,98,k, ,93,112,148, ,m,112,91,205,m,y,91,102,204,y, ,102,105,196, ,b,105,88,165,b,o,88,97,116,o,x,97,127,198,x, ,127,103,322, ,w,103,126,378,w,i,126,97,116,i,t,97,93,161,t,h,93,74,108,h, ,74,119,148, ,f,119,89,112,f,i,89,85,119,i,v,85,168,117,v,e,168,164,77,e, ,164,120,287, ,d,120,95,274,d,o,95,93,130,o,z,93,129,124,z,e,129,146,53,e,n,146,99,153,n, ,99,100,123, ,l,100,91,212,l,i,91,103,166,i,q,103,112,191,q,u,112,61,232,u,o,61,101,497,o,r,101,95,149,r, ,95,119,416, ,j,119,80,497,j,u,80,95,118,u,g,95,193,238,g,Shift,193,190,147,Shift, ,190,109,392, ,Shift,109,332,713,Shift,h,332,86,213,h,e,86,86,137,e, ,86,114,74, ,f,114,110,119,f,i,110,101,145,i,v,101,98,106,v,e,98,92,161,e, ,92,118,1701, ,b,118,86,260,b,o,86,106,263,o,x,106,118,289,x,i,118,102,123,i,n,102,113,152,n,g,113,102,120,g, ,102,120,186, ,w,120,87,849,w,i,87,101,68,i,a,101,147,157,a,Backspace,147,112,1109,Backspace,z,112,145,186,z,a,145,121,37,a,r,121,113,171,r,d,113,161,163,d,s,161,8504,83,s, ,8504,103,987, ,j,103,86,219,j,u,86,107,120,u,m,107,85,220,m,p,85,90,127,p, ,90,112,162, ,q,112,101,157,q,u,101,103,71,u,i,103,123,113,i,c,123,112,153,c,k,112,102,79,k,l,102,109,143,l,y,109,107,209,y,Shift,107,288,575,Shift, ,288,106,445, ,Shift,106,695,532,Shift,o,695,109,249,o,w,109,119,206,w, ,119,104,157, ,v,104,119,174,v,e,119,135,50,e,x,135,109,276,x,i,109,95,96,i,n,95,109,149,n,g,109,80,129,g,l,80,96,68,l,y,96,108,198,y, ,108,86,1042, ,q,86,127,173,q,u,127,85,67,u,i,85,114,115,i,c,114,105,124,c,k,105,102,99,k, ,102,109,420, ,d,109,119,622,d,a,119,131,51,a,f,131,93,156,f,t,93,150,219,t, ,150,93,2271, ,z,93,134,201,z,e,134,135,33,e,b,135,104,185,b,r,104,104,85,r,a,104,133,43,a,s,133,95,183,s, ,95,109,155, ,j,109,90,230,j,u,90,105,109,u,m,105,93,211,m,p,93,97,138,p,Shift,97,172,223"

test_dhia = process_data(test_dhia);
test_julien = process_data(test_julien);

test_dhia = process_sample(test_dhia);
test_julien = process_sample(test_julien);

process_samples(test_dhia, test_julien);

console.log(measure_distance_r(test_dhia, test_julien));
console.log(measure_distance_a(test_dhia, test_julien));
