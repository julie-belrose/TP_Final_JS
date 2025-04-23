const BASE_URL = "https://trouve-mot.fr/api";
let MAX_TEST = 5;
let wordToGuess = ' ';
let currentWordProposed = [];
const allWordSolution = [];
let currentLettersKeyboards = [];
let LENGTH_WORD_TO_GUESS = 0;
const MAX_WORDS = 11;
const MAX_LENGTH = 9;
const MIN_LENGTH = 4;
let wordToGuessPosition = [];

const colorValid = '#008000';
const colorSemiValid = '#FFD700'

const regexLettersFrench = /^[a-zA-ZÀ-ÿ]$/;

//call API
const apiCall = async ({ url, method ="GET"})=> {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json"
        },
    };

    try {
        const res = await fetch(url, options);

        if (!res.ok) {
            throw new Error(`HTTP error: ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error("Error in apiCall :", err);
        throw err;
    }
};

const randomLength = (max) =>{
    const borneMax = MAX_LENGTH - MIN_LENGTH + 1;
    LENGTH_WORD_TO_GUESS = Math.floor(Math.random() * borneMax) + MIN_LENGTH;
    console.log(`length choose : ${LENGTH_WORD_TO_GUESS}`);
};

//add function select random words
const selectRandomWords = (words) =>{
    const randomSelect = Math.floor(Math.random() * MAX_WORDS);
    wordToGuess = words[randomSelect].name;
    console.log(`wordToGuess : ${wordToGuess}`);
    // wordToGuessPosition = generatePosition(wordToGuess);
    console.table(wordToGuessPosition);
};

//for give 10 words
const getWordsToGuess = async (number, length) => {
    try {
        const data = await apiCall({
            url: `${BASE_URL}/size/${length}/${number}`,
            method: "GET",
        });
        console.log("data", data);
        selectRandomWords(data);
    } catch (error) {
        console.error("Error in call API GET by length :", error);
    }
};

//generate value et position
const generatePosition = (word, withStatut = false) =>{
    console.log(`generatePosition  + word : ${word}  , status : ${withStatut}`);
    return Array.from(word, (lettre, index) => ({
        value: withStatut ? "" : lettre,
         position: index,
        ...(withStatut && { statut: 0 })
    }));
};


//add tab for test
const generateTabFortTest = () =>{
    console.log('generateTabFortTest');
    for (let i = 0; i < MAX_TEST; i++) {
        let tab = generatePosition( wordToGuess, true);
        currentLettersKeyboards.push(tab);
    }
    console.table(currentLettersKeyboards);
};

// ---
//add function to delete key listen keyboard
const deleteLetter = (letter) =>{

};

//add function to check word proposed if exists

//add function to activate enter
const checkConditionValidation= () =>{
    if (  checkLengthCurrentWord()){
        //do something
        //compare position
    }

};

//add function to stock data listen keyboard
const stockLettersProposed = (letter) =>{
    console.log('currentLetter in stockLettersProposed ' + letter);
    console.log('currentWord ' + currentWordProposed);
    if (currentWordProposed.length === 0){ //todo delete this ?
        generateTabFortTest();
    }


    if (regexLettersFrench.test(letter) && currentWordProposed.length < (MAX_LENGTH -1)) {
        console.log('currentWord' + currentWordProposed);
        console.log('max length' + MAX_LENGTH);
        currentWordProposed.push(letter);
    }
    return currentWordProposed;
};

//add function to listen the keyboard
//si good number of data  function to stock listen keyboard => function to stop listen keyboard
// ---
//add function to check type of content enter in keyboard
// switch case
//si Enter
//si Escape
// Si string
//default -> send error
const listenKeyboard = () => {
    let codeKeyLetter = '';

    console.log(`listen Keyboard active`);

    document.addEventListener("keydown", (event) => {
        const key = event.key;

        console.log(event.key)
        if (regexLettersFrench.test(event?.key)){
            codeKeyLetter = event.key;
        }

        if ([...wordToGuess].length > [...currentWordProposed].length) {
            switch (key) {
                case 'Backspace': //delete
                    console.log("Backspace key");
                    deleteLetter(key);
                    break;
                case 'Enter':
                    console.log("Enter key ");
                    checkConditionValidation();
                    break;
                case codeKeyLetter:
                    console.log("Letter key ");
                    stockLettersProposed(key.toUpperCase());
                    break;
                default:
                    return console.error(`this key ${key.toUpperCase()} is not authorized`);
            }
        }

    });
};

const initApp = async () =>{
    randomLength(MAX_LENGTH);
    await getWordsToGuess(MAX_WORDS, LENGTH_WORD_TO_GUESS).then(res => res);
    console.log(`wordToGuess init : ${wordToGuess}`);
    wordToGuessPosition = generatePosition(wordToGuess);
    console.log(`init wordToGuess init : ${wordToGuess}`);
    console.table(wordToGuessPosition);
    generateTabFortTest();
    listenKeyboard();
};

initApp().then(res => res);

//add function to calculate tests
const getTestsRemaining = () =>{
    console.log( `recept decremente test : ${MAX_TEST}`);
    return (MAX_TEST < 0 ) ? MAX_TEST -= (MAX_TEST -1)  : 0;
};

//add function toDisplay test with wordGuest length * number test

//display letter in div
// ---
//add function to create div in container_word

//add function to give color to letter//

//add function to check position of letter to compare word chose
            //si good position  function to give color to letter -> green
            // si good letter function to give color to letter -> jaune
// ---