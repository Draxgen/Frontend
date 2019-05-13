function calcPI(iterations){
    let pi = 0;
    let divisor = 1;
    for(i = 0; i <= iterations; i++){
        pi = pi + (4/divisor);
        pi = pi - (4/(divisor + 2));
        divisor += 4;
    }
    document.getElementById('output1').value = pi.toFixed(10);
}

function getFibList(howMany){
    let fibList = [1, 1];

    for(i = 2; i <= howMany; i++){
        fibList[fibList.length] = fibList[fibList.length - 1] + fibList[fibList.length - 2];

    }
    document.getElementById('output1').value = fibList.join(", ");
}

let mLText = "My dear old ~ sat me down to hear some words of wisdom \n 1. Give a man a ~ and you ~ him for a day ~ a man to ~ and he'll ~ forever \n 2. He who ~ at the right time can ~ again \n 3. Always wear ~ ~ in case you're in a ~ \n 4. Don't use your ~ to wipe your ~ Always have a clean ~ with you";

// convert the long string mLText to array of words
// Create array of user input
// Generate madlib (replace ~ with user input)

let mLArray = mLText.split(" ");
let inputArray = [];

function madLibGenerator(){
    createInputArray();
    if (checkForMissingInput()){
        document.getElementById('output1').value = "Enter all values above!";
    } else {
        createMadLibSentence();
    }
}

function createInputArray(){
    for(i = 0; i <= 13; i++){
        inputArray[i] = document.getElementById('i'+i).value;
    }
}

function checkForMissingInput(){
    let defaultArrayVals = ["Person", "Noun", "Verb", "Adjective", "Plural Verb", "Body Part", "Event"];

    for(i = 0; i < inputArray.length; i++){
        
        if(defaultArrayVals.indexOf(inputArray[i]) > -1){
            return true;
        }
    }
    return false;
}

function createMadLibSentence(){
    let arrIndex = 0;
    for(i=0; i < mLArray.length; i++){
        let matchIndex = mLArray.indexOf("~");
        mLArray[matchIndex] = inputArray[arrIndex];
        arrIndex++;
    }
    document.getElementById('output1').value = mLArray.join(" ");
}