let body = document.querySelector('body'); // le corps
let choices = document.querySelectorAll('#choices div'); // différents choix possibles
let sections = document.querySelectorAll('section'); // les sections (pages)
let avatars = document.querySelectorAll('.avatar .choice-game .perso'); // les deux avatars du début
let play = document.querySelector('.play'); // le bouton play
let menuOption = document.querySelector('.menu'); // le bouton options
let menu = document.querySelector('.rules'); // le menu déroulant
let perso = document.querySelectorAll('div.display-choices .column'); // les perso à afficher lors des duels
let soundButton = document.querySelector('.sound-img');

let selectionSound = new Audio("../sounds/selection-sound-effect.mp3");
let themeSong = new Audio("../sounds/ThemeSong.mp3");
let notificationSound = new Audio("../sounds/notification.mp3");
let cardSound = new Audio("../sounds/cardsound.mp3");
let buttonSound = new Audio("../sounds/stop.mp3");

let indexRandom =(tab)=> Math.floor(Math.random()*tab.length); // index aléatoire
let bot = choices[indexRandom(choices)].id; // choix du bot aléatoire
let choice; // choix possibles
let chosen; // perso choisi
let rounds = 1; // nombres de manches
let colorChoice; // couleur choisi (en fonction de l'avatar)
let avatar; // avatar choisi
let playerScore = 0; // score joueur
let botScore = 0; // score ordi
let persoChosenList = []; // liste des perso choisi pendant la partie

soundButton.classList.add('hidden');
selectionSound.volume = .3;
themeSong.volume = .04;
notificationSound.volume = .1;
cardSound.volume = .8;
buttonSound.volume = .2;
themeSong.loop = 'true';
// themeSong.play();


let logPop = document.querySelector('.img-hidden'); // le logo du début
logPop.classList.replace('img-hidden', 'img-show'); // initialisation non visible

let hide = (index) => sections[index].classList.add('hidden'); // faire disparaitre une section (page)
let reveal = (index) => sections[index].classList.remove('hidden'); // faire apparaitre une section (page)

let next = (index) => { // passer à la section (page) suivante
    hide(index);
    reveal(index+1);
};
let previous = (index) => { // passer à la section page précédente
    hide(index);
    reveal(index-1);
};

reveal(0); // initialisation des sections visibles et caché
for (let n = 1; n < sections.length; n++) {
    hide(n);
};

let verification = (chosen) => { // vérifiaction des victoires, ajout des scores, stockage du perso choisi 
    let win;
    persoChosenList.push(chosen)
    if (chosen === bot){
        win = null;
    } else if (chosen === 'Franklin' && bot === 'Trevor' || chosen === 'Michael' && bot === 'Franklin' || chosen === 'Trevor' && bot === 'Michael'){
        playerScore++;
        win = 1;
    } else {
        botScore++;
        win = 0;
    };
    return win;
};

let avatarChosen = (chosen) => { // active l'avatar choisi et permet l'affichage des couleurs en fonction
    let displayAvatar = document.querySelector('.avatar-fixed');

    colorChoice = chosen;
    console.log(chosen);
    displayAvatar.style.backgroundImage = `url(../img/${chosen}.jpg)`;
    displayAvatar.style.border = 'solid 3px var(--colprim)';
    displayAvatar.style.transform = chosen === 'ballas' ? '' : 'scaleX(-1)';

    let r = document.querySelector(':root');

    if (chosen === 'ballas') {
        r.style.setProperty('--colprim', '#a05bce');
        r.style.setProperty('--colsec', '#76955a');
    } else {
        r.style.setProperty('--colprim', '#76955a');
        r.style.setProperty('--colsec', '#a05bce');
    };
    play.addEventListener('click', ()=> {
        body.style.backgroundImage = 'url(../img/GTA5-PC-4K_06.jpg)';
        next(0);   
    });
};

let displayChoice =(chosen)=>{ // affichage les choix de la manche, ainsi que les gains reçus (animé) 
    let displayPlayer = document.querySelector('.display.chosen');
    let displayBot = document.querySelector('.display.bot');
    let textRound = document.querySelector('.game h2');

    textRound.textContent = rounds === 10 ? `Rounds ${rounds}` : `Rounds 0${rounds}`;
    displayPlayer.style.backgroundImage = `url(../img/${chosen}.jpg)`;
    displayPlayer.style.border = 'solid 5px var(--colprim)';
    displayBot.style.border = 'solid 5px var(--colsec)';
    displayBot.style.backgroundImage = `url(../img/${bot}.jpg)`;

    let resultScore = document.querySelectorAll('.result');
    let resultRound = verification(chosen);
    let playerWin = '';
    let playerLose = '';

    resultScore.forEach((el)=> {
        el.style.color = '';
    })

    switch(resultRound) {
        case null:
            resultScore.forEach((el)=> {
                el.style.color = '#268fff';
            });
            break;
        case 1:
            resultScore[0].style.color = '#2b9813';
            playerWin = '+';
            break;
        case 0:
            resultScore[1].style.color = '#2b9813';
            playerLose = '+';
            break;
    };
    
    resultScore[0].textContent = playerScore === 0 ? '0 $' : `${playerWin}${playerScore},000,000 $`;
    resultScore[1].textContent = botScore === 0 ? '0 $' : `${playerLose}${botScore},000,000 $`;
    
    let animation = document.querySelectorAll('.display-choices .column');
    
    animation[0].classList.add('player-animate-hidden');
    animation[1].classList.add('bot-animate-hidden');
    
    resultScore.forEach((el)=>{
        el.classList.add('score-hidden');
    })

    next(1);

    setTimeout(() => {
        cardSound.play();
        animation[0].classList.replace('player-animate-hidden', 'animate-show');
    }, 500);
    setTimeout(() => {
        cardSound.play();
        animation[1].classList.replace('bot-animate-hidden', 'animate-show');
    }, 1400);
    setTimeout(() => {
        notificationSound.play();
        resultScore.forEach((el)=> {
            el.classList.replace('score-hidden', 'score-show');
        })
    }, 2000);
    animation[0].classList.remove('animate-show');
    animation[1].classList.remove('animate-show');
    resultScore.forEach((el)=> {
        el.classList.remove('score-show');
    });
};

let nextRound = ()=> { // si il reste des manches il relance, sinon il calcul les résultats et affiche la fin
    rounds++;
    if (rounds > 10) {
        let messageResult;
        if (playerScore === botScore){
            messageResult = 'Égalité !';
            body.style.backgroundImage = 'url(../img/egalite.png)';
        } else if (playerScore > botScore) {
            messageResult = 'Vous avez gagné !';
            body.style.backgroundImage = 'url(../img/victoire.png)';
        } else {
            messageResult = 'Vous avez perdu !';
            body.style.backgroundImage = 'url(../img/defaite.png)';
        };

        let results = document.querySelectorAll('.result-final');
        results[0].textContent = messageResult;
        results[1].textContent = playerScore === 0 ? '0 $' : `${playerScore},000,000 $`;
        results[1].style.color = 'var(--colprim)';
        results[2].textContent = botScore === 0 ? '0 $' : `${botScore},000,000 $`;
        results[2].style.color = 'var(--colsec)';
        next(2);

        let verif = true;
        persoChosenList.forEach((el)=> {
            if (el !== persoChosenList[0]) {
                console.log('erreur');
                verif = false;
            };
        });
        if (verif === true) {
            document.querySelector('.easter-egg').textContent = `Vous êtes un fan de ${persoChosenList[0]}`;
        };

    } else {
        bot = choices[indexRandom(choices)].id;
        previous(2);
    };
};

let replay = () => { // option de rejouer, reset des données
    playerScore = 0;
    botScore = 0;
    rounds = 1;
    persoChosenList = [];
    sections.forEach((el)=> {
        el.classList.add('hidden');
    })
    body.style.backgroundImage = `url(../img/HomeWallpaper.jpg)`;
    reveal(0);
};

let allPerso = document.querySelectorAll('.perso');
allPerso.forEach((el)=> {
    el.addEventListener('mouseover', ()=> selectionSound.play());
});
let allButton = document.querySelectorAll('.button');
allButton.forEach((el)=> {
    el.addEventListener('click', ()=> buttonSound.play());
});

let buttonNext = document.querySelector('.game .next'); // événement bouton suivant
buttonNext.addEventListener('click', nextRound);

choices.forEach(el=>{
    el.addEventListener('click', ()=> displayChoice(el.id)); // événement selection des choix
});

avatars.forEach(el=>{
    el.addEventListener('click', ()=> avatarChosen(el.id)); // événement selection des avatars
});

let buttonReplay = document.querySelector('.end .replay'); // événement bouton replay
buttonReplay.addEventListener('click', replay);
let buttonLeave = document.querySelector('.rules .button'); // événement bouton quitter
buttonLeave.addEventListener('click',()=>{
    replay();
    menu.classList.replace('nav-open', 'nav-close');
    isOpen = false;
    perso.forEach((el)=> {
        el.classList.remove('hide-behind-menu');
    });
    logPop.classList.remove('hide-behind-menu');
    soundButton.classList.add('hidden');
});

let isPlaying = false;

soundButton.addEventListener('click', ()=> {
    switch(isPlaying) {
        case true:
            themeSong.pause();
            soundButton.src = 'assets/img/mute.png';
            isPlaying = false;
            break;
        case false:
            themeSong.play();
            soundButton.src = 'assets/img/speaker-filled-audio-tool.png';
            isPlaying = true;
            break;
    };
});

let isOpen = false;

menuOption.addEventListener('click', ()=>{
    switch(isOpen){
        case false:
            menu.classList.replace('nav-close', 'nav-open');
            isOpen = true
            perso.forEach((el)=> {
                el.classList.add('hide-behind-menu');
            })
            logPop.classList.add('hide-behind-menu')
            setTimeout(() => {
                soundButton.classList.remove('hidden');
            }, 500);
            break;
        case true:
            menu.classList.replace('nav-open', 'nav-close');
            isOpen = false;
            perso.forEach((el)=> {
                el.classList.remove('hide-behind-menu');
            });
            logPop.classList.remove('hide-behind-menu')
            soundButton.classList.add('hidden');
            break;
    }; 
});







