const BASE_URL = "https://trouve-mot.fr/api";
const MAX_TEST = 5;
let currentTest = 0;
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
const regexRemoveAccentFr = /[\u0300-\u036f]/g;

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
    wordToGuess =  wordToGuess.normalize('NFD').replace(regexRemoveAccentFr, '');
    wordToGuess = wordToGuess.toUpperCase();
    console.log(`wordToGuess : ${wordToGuess}`);
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
        value: withStatut ? ' ' : lettre.toUpperCase(),
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
};

// ---
//add function to delete key listen keyboard
const deleteLetter = () =>{
    console.log('deleteLetter');
        const deleteIndex = currentWordProposed.findLastIndex(obj => obj.value !== ' ');
        if (deleteIndex !== -1) {
            currentWordProposed[deleteIndex] = {
                ...currentWordProposed[deleteIndex],
                value: ' ',
            };
            console.log('deleteLetter');
            console.table(currentWordProposed);
            updateRender('container_current_world', currentWordProposed);
        }
};

//add function to check word proposed if exists
const saveNewProposition = (currentWordProposed) => {
    console.log(`saveNewProposition`);
    currentLettersKeyboards[currentTest] = [...currentWordProposed];
    console.table(currentLettersKeyboards);
}

const newCycleProp = ()=>{
    console.log(`currentTes before : ${currentTest}`);
    currentTest++;
    console.log(`currentTes actual : ${currentTest}`);
    currentWordProposed = [];
    currentWordProposed = generatePosition(wordToGuess, true);
}

const addStatutForNewProp = () => {
    currentWordProposed.forEach((propLetter, index) => {
        const correctLetter = wordToGuessPosition[index];

        if (propLetter.value === correctLetter.value) {
            propLetter.statut = 2; // 2 : correct position
        } else if (
            wordToGuessPosition.some(
                (letter) => letter.value === propLetter.value
            )
        ) {
            propLetter.statut = 1; // 1 : bad position
        } else {
            propLetter.statut = 0; // 0 : incorrect letter
        }
    });

    console.log(`addStatutForNewProp`);
    console.table(currentWordProposed);
    return currentWordProposed;
};

const isGoodProp =()=> {
    return currentWordProposed.every(obj => obj.statut === 2);
}

//add function to activate enter
const checkConditionValidation= () =>{

    console.log(`checkConditionValidation`);
    const isFull = currentWordProposed.every(obj => obj.value !== ' ');

    if (isFull){
        addStatutForNewProp()
        renderWordBlocks('container_word', currentLettersKeyboards);
        applyStatusClassesToLastBlockLetters(currentWordProposed);
        saveNewProposition(currentWordProposed);
        const result = isGoodProp();
        console.log(result);

        if (isGoodProp() === false){
            newCycleProp();
            alert(`Nop Try Again you can, you have again ${MAX_TEST - currentTest} test`);
        } else{
            return alert(`Well done you have find good word ${wordToGuess} en ${currentTest +1} essai !`);
        }

    }

};

//add function to stock data listen keyboard
const stockLettersProposed = (letter) =>{
    console.log('currentLetter in stockLettersProposed ' + letter);
    if (regexLettersFrench.test(letter)){
        const emptyIndex = currentWordProposed.findIndex(obj => obj.value === ' ');

        if (emptyIndex !== -1) {
            currentWordProposed[emptyIndex] = {
                ...currentWordProposed[emptyIndex],
                value: letter,
            };
            console.log('currentWordProposed');
            console.table(currentWordProposed);
        }

    }
    updateRender('container_current_world', currentWordProposed);
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
            console.log(`cond codeKeyLetter`);
        }

        if (currentTest !== MAX_TEST){
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
    // console.log(`wordToGuess init : ${wordToGuess}`);
    wordToGuessPosition = generatePosition(wordToGuess);
    // console.log(`init wordToGuess init : ${wordToGuess}`);
    // console.table(wordToGuessPosition);
    generateTabFortTest();
    currentWordProposed = generatePosition(wordToGuess, true);
    // console.table(currentWordProposed);
    // renderAllWordKeyboard(currentLettersKeyboards);
    // renderWordBlocks('container_current_world', currentWordProposed);
    listenKeyboard();
    renderWordBlocks('container_current_world', currentWordProposed);
};

initApp().then(res => res);

//add function to calculate tests
const getTestsRemaining = () =>{
    // console.log( `recept decremente test : ${MAX_TEST}`);
    // return (MAX_TEST < 0 ) ? MAX_TEST -= (MAX_TEST -1)  : 0;
};

//add function toDisplay test with wordGuest length * number test

//display letter in div
// ---
//add function to create div in container_word
const renderWordBlocks = (containerID, wordArray) => {

    console.log(`containerID : ${containerID} and ${wordArray}`);
    console.table(wordArray);
    const container = document.getElementById(`${containerID}`);

    if (!container) {
        console.error(`Element with ID '${containerID}' not found.`);
        return;
    }

    const wordContainer = document.createElement('div');
    wordContainer.classList.add('block_container');

    wordArray.forEach((letterObj) => {
        const letterBlock = document.createElement('div');
        letterBlock.classList.add('block_letter');

        // if (letterObj.value !== ' ') {
            letterBlock.textContent = letterObj.value;
        // }

        wordContainer.appendChild(letterBlock);
    });

    container.appendChild(wordContainer);
}

const renderAllWordKeyboard = (element) =>{
    for (const letters of element ){
        for (const letter of letters ){
            //         addTbody(`${el}`,  element[el]);
            console.log(`letters`);
            console.table(letters);
            renderWordBlocks('container_world', letters);
        }
    }
};

const updateRender = (containerID, wordArray) => {
    console.log(`updateRender`);
    const container = document.getElementById(`${containerID}`);
    if (!container) {
        console.error(`updateRender - Aucun élément trouvé avec l'ID '${containerID}'`);
        return;
    }

    const letterBlocks = container.querySelectorAll('.block_letter');

    if (letterBlocks.length !== wordArray.length) {
        console.warn('updateRender - The number of .block_letter elements does not match the wordArray.');
    }

    letterBlocks.forEach((letterBlock, index) => {
        const letterObj = wordArray[index];
        if (letterObj && letterObj.value !== ' ') {
            letterBlock.textContent = letterObj.value;
        } else {
            letterBlock.textContent = '';
        }
    });
}

function applyStatusClassesToLastBlockLetters(wordArray) {
    const containers = document.querySelectorAll('.block_container');
    if (containers.length === 0) return;

    const lastContainer = containers[containers.length - 1];

    const letterBlocks = lastContainer.querySelectorAll('.block_letter');

    letterBlocks.forEach((block, index) => {
        const statut = wordArray[index]?.statut;

        block.classList.remove('good', 'bad');

        if (statut === 2) {
            block.classList.add('good');
        } else if (statut === 1) {
            block.classList.add('bad');
        }
    });
}


//add function to give color to letter//

//add function to check position of letter to compare word chose
            //si good position  function to give color to letter -> green
            // si good letter function to give color to letter -> jaune
// ---