word = "mitochondrium";
letterArray = word.split('');
guessArray = "*".repeat(word.length).split("");
document.getElementById('guessWord').innerHTML = guessArray.join("");

function guessLetter(event) {
    let letter = getStringLetter(event);
    let state = findGuessedLetter(letter);

    switch(state){
        case 'alreadyGuessed':
            document.getElementById('response').innerHTML = 'You already guessed that letter';
            break;
        case 'missed':
            document.getElementById('response').innerHTML = 'Wrong letter';
            break;
        case 'guessed':
            if(checkForCompletedWord(guessArray)){
                document.getElementById('response').innerHTML = 'You guessed the whole word!';
            } else {
                document.getElementById('response').innerHTML = 'You guessed it';
            }
            break;
    }
    document.getElementById('guessWord').innerHTML = guessArray.join("");
}

function getStringLetter(event) {
    return String.fromCharCode(event.keyCode).toLowerCase();
}

function findGuessedLetter(letter) {
    let temp = letterArray;
    let result = 'missed';
    let index;

    if(guessArray.indexOf(letter) >= 0) return 'alreadyGuessed';

    do{
        index = temp.indexOf(letter);
        if(index >= 0){
            guessArray[index] = letter;
            temp[index] = '';
            result = 'guessed';
        }
    } while (index >= 0)

    return result;
}

function checkForCompletedWord(guessArray) {
    let index = guessArray.indexOf('*');
    if(index >= 0)
        return false;
    else
        return true;
}