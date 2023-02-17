

//Does not include Finale, Reunion, or Statistics
const NUM_EPISODES_TRIBES = 6;
const NUM_EPISODES_INDIVIDUAL = 8;
const NUM_CASES = 4;

/**
 * Player class which represents each individual in the game
 */            
class Player {
constructor(name, gender, tribeNumber) {
    this.name = name;
    this.gender = gender;
    this.tribeNumber = tribeNumber;
    this.votedFor = [];
    this.currentVotesRecieved = 0;
    this.individualImmunity = false;
}

get name() {
    return this._name;
}

set name(newName) {
    this._name = newName;
}

get currentVotesRecieved() {
    return this._currentVotesRecieved;
}

set currentVotesRecieved(temp) {
    this._currentVotesRecieved = temp;
}

get individualImmunity() {
    return this._individualImmunity;
}

set individualImmunity(imm) {
    this._individualImmunity = imm;
}
}
/**
 * PlayerList class which represents a list of players (eliminated or still in the game)
 */
class PlayerList {
    constructor(numPLayers) {
        this.numPLayers = numPLayers;
        let playerArr = new Array(numPLayers);
        for (let i = 0; i < numPLayers; ++i){
            playerArr[i] = new Player();
            playerArr[i].Player.index = i;
        }
    }

    get playerArr() {
        return this.playerArr;
    }

    set playerArr(newPlayerArr) {
        this.playerArr = playerArr;
    }
}

/**
 * class for the tribes each player is in
 */
class Tribe {
    constructor(playerArr, name) {
        this.curTribe = playerArr;
        this.statusList = [];
        this.name = name;
        this.elimString = "";
    }

    static TribeInstance(playerArr) {
        return new Tribe(playerArr, ' ');
    }

    get name() {
        return this._name;
    }

    set name(newName) {
        this._name = newName;
    }

    get curTribe() {
        return this._curTribe;
    }

    set curTribe(newTribe) {
        this._curTribe = newTribe;
    }

    get elimString() {
        return this._elimString;
    }

    set elimString(newString) {
        this._elimString = newString;
    }
}


/**
 * A list of every Episode To store data of so that I can recap at the end
 */
class Episode {
    constructor(tribelist) {
        //is in episodes because it will keep track of the number of tribes in each episode
        this.tribelist = tribelist;
    }

    get tribelist() {
        return this._tribelist;
    }

    set tribelist(newTribes) {
        this._tribelist = newTribes;
    }

    get immWinString() {
        return this._immWinString;
    }

    set immWinString(newString) {
        this._immWinString = newString;
    }
}

/**
 * class that encompasses the whole game
 */
class Game {
    constructor(episodes) {
        //players = new PlayerList;
        this.episodes = episodes;
    }

    get episodes() {
        return this._episodes;
    }

    set episodes(newEpisodes) {
        this._episodes = newEpisodes;
    }
}

/**
 * main function for season 1
 */
function main() {
    
    let player0 = new Player("BB", "male", 1);
    let player1 = new Player("Colleen", "female", 1);
    let player2 = new Player("Gervase", "male", 1);
    let player3 = new Player("Greg", "male", 1);
    let player4 = new Player("Gretchen", "female", 1);
    let player5 = new Player("Jenna", "female", 1);
    let player6 = new Player("Joel", "male", 1);
    let player7 = new Player("Ramona", "female", 1);

    let player8 = new Player("Dirk", "male", 2);
    let player9 = new Player("Kelly", "female", 2);
    let player10 = new Player("Richard", "male", 2);
    let player11 = new Player("Rudy", "male", 2);
    let player12 = new Player("Sean", "male", 2);
    let player13 = new Player("Sonja", "female", 2);
    let player14 = new Player("Stacey", "female", 2);
    let player15 = new Player("Susan", "female", 2); 


    //gives the players their index
    let players2 = [player0, player1, player2, player3, player4, player5, player6, player7];
    let players3 = [player8, player9, player10, player11, player12, player13, player14, player15];

    let tribe1 = new Tribe(players2, "Pagong");
    let tribe2 = new Tribe(players3, "Tagi");

    let tribes1 = [tribe1, tribe2];

    let episodeList = [];

    for (let i = 0; i < NUM_EPISODES_TRIBES; ++i) {
        
        episodeList.push(new Episode(tribes1));
        episodeList[i] = episodeRunTribe(episodeList[i]);
        tribes1 = _.cloneDeep(tribes1);
    }
    let mergeName = "Rattana";
    let mergeTribe1 = [merge(tribes1, mergeName)];
    for (let i = NUM_EPISODES_TRIBES; i < NUM_EPISODES_INDIVIDUAL + NUM_EPISODES_TRIBES; ++i) {
        episodeList.push(new Episode(mergeTribe1));
        episodeList[i] = episodeRunIndividual(episodeList[i]);
        mergeTribe1 = _.cloneDeep(mergeTribe1);
    }
     
    episodeList.push(new Episode(mergeTribe1));
    console.log(NUM_EPISODES_INDIVIDUAL + NUM_EPISODES_TRIBES);
    episodeList[NUM_EPISODES_INDIVIDUAL + NUM_EPISODES_TRIBES] = finalTribalCouncil(episodeList[NUM_EPISODES_INDIVIDUAL + NUM_EPISODES_TRIBES]);
    
    return new Game(episodeList);
}

/**
 * calculates the variables and scenarios that take place over the course of one episode
 * Each stopping point will have its own function for clarity
 */
function episodeRunTribe(episode) {
    let losingIndex = -1;
    for (let i = 0; i < episode.tribelist.length; ++i) {
        episode.tribelist[i].statusList = [];
        episode.tribelist[i].statusList[0] = (getStatus(episode.tribelist[i]));
    }
    //sets losing index to the index of the losing tribe in tribelist                
    let tribeChallengeResults = immunityChallengeTribe(episode.tribelist);
    losingIndex = tribeChallengeResults[0];
    episode.immWinString = tribeChallengeResults[1];
    
    for (let i = 0; i < episode.tribelist.length; ++i) {
        episode.tribelist[i].statusList[1] = (getStatus(episode.tribelist[i]));
    }

    //An array of who votes for who
    let theVotesArr = tribalCouncil(episode.tribelist[losingIndex], -1);

    theVotes(theVotesArr, episode.tribelist[losingIndex]);

    return episode;
}

/**
 * Similar to above just for individual only
 */
function episodeRunIndividual(episode) {
    let mergeTribe = episode.tribelist[0];
    
    let indChallengeResults = immunityChallengeIndividual(mergeTribe);
    let immunityIndex = indChallengeResults[0];
    episode.immWinString = indChallengeResults[1];
    
    let theVotesArr = tribalCouncil(mergeTribe, immunityIndex);
    theVotes(theVotesArr, mergeTribe);
    
    //FIXME THIS RETURNS A NEW EPISODE AND IT SHOULD NOT
    let mergeTribeList = [mergeTribe];
    return new Episode(mergeTribeList);
}


/**
 * The losing tribe goes here
 * @param {*} tribe - the tribe that lost
 */
function tribalCouncil(tribe, immunityIndex) {
    let tie = false;           //variable to keep track of a tie or not
    let maxVotes = 0;          //tracks the highest votes recieved
    let maxVotesArr = []; //tracks the indexes of the most voted for
    let eliminatedIndex = -1;  //The index of who is voted out
    let theVotes = [];         //An array of two indexes, the first is who cast the vote, the second is who recieved the vote
    
    //runs through each player to see what they are going to do
    //If there are only three people left and someone is immune
    if (immunityIndex != -1 && tribe.curTribe.length === 3) {
        let randIndex = Math.floor(Math.random()*tribe.curTribe.length);
        let curVote = tribe.curTribe[randIndex];
        while (curVote === tribe.curTribe[immunityIndex]){
            randIndex = Math.floor(Math.random()*tribe.curTribe.length); //Changes Index
            curVote = tribe.curTribe[randIndex];  //Changes current vote, then goes back to check
        }
        tribe.curTribe[immunityIndex].currentVoteCast = curVote; //assigns the current vote to the players currentVoteCast
        
        tribe.curTribe[immunityIndex].votedFor.push(curVote);    //Places the vote in the array keeping track of all votes
        tribe.curTribe[randIndex].currentVotesRecieved++;    //adds a vote to the recievers end
        theVotes.push([immunityIndex, randIndex]);

        maxVotes = tribe.curTribe[randIndex].currentVotesRecieved;
        maxVotesArr.push(tribe.curTribe[randIndex]);
    }
    else {
        for (let i = 0; i < tribe.curTribe.length; ++i) {
            let randIndex = Math.floor(Math.random()*tribe.curTribe.length); //Index within the size of the array
            
            let curVote = tribe.curTribe[randIndex]; //curVote is the person who the current player is voting for
            //while the current vote is for the person casting the vote, the vote need to change
            
            while (curVote === tribe.curTribe[i] || tribe.curTribe[randIndex].individualImmunity){
                randIndex = Math.floor(Math.random()*tribe.curTribe.length); //Changes Index
                curVote = tribe.curTribe[randIndex];  //Changes current vote, then goes back to check
            }
            tribe.curTribe[i].currentVoteCast = curVote; //assigns the current vote to the players currentVoteCast
            
            tribe.curTribe[i].votedFor.push(curVote);    //Places the vote in the array keeping track of all votes
            tribe.curTribe[randIndex].currentVotesRecieved++;    //adds a vote to the recievers end
            theVotes.push([i, randIndex]);

            //Checks for the person who has recieved the highest number of votes
            if (maxVotesArr === [] || tribe.curTribe[randIndex].currentVotesRecieved > maxVotes) {
                maxVotes = tribe.curTribe[randIndex].currentVotesRecieved;
                maxVotesArr = [];
                maxVotesArr.push(tribe.curTribe[randIndex]);
                tie = false;
            } else if(tribe.curTribe[randIndex].currentVotesRecieved === maxVotes) { //if max votes are equal the the index is added to the list
                tie = true;
                maxVotesArr.push(tribe.curTribe[randIndex]);
            } 
        }
    }
    
    //FIXME - right now it just output the first one in the list
    for (let i = 0; i < tribe.curTribe.length; ++i) {
        if (tribe.curTribe[i] === maxVotesArr[0]) {
            eliminatedIndex = i;
        }
    }
    let x = -1;
    if (tie && x === 0) {
        elminatedIndex = tieBreaker(tribe, maxVotesArr)
    }

    for (let i = 0; i < tribe.curTribe.length; ++i) {
        //console.log(tribe.curTribe[i].name);
    }

    if (immunityIndex != -1) {
        tribe.curTribe[immunityIndex].individualImmunity = false;
    }
    
    
    tribe.elimString = tribe.curTribe[eliminatedIndex].name + ", the tribe has spoken";
    return [theVotes, maxVotesArr, eliminatedIndex];
}

/**
 * 
 */
function tieBreaker(tribe, maxVotesArr) {
    for (let i = 0; i < tribe.curTribe.length; ++i) {
        //Include part of adding to total votes recieved later
        tribe.curTribe[i].currentVotesRecieved = 0;
    }
    /*
    for (let i = 0; i < tribe.curTribe.length; ++i) {
        let isTied = false; //Assumes the player at index i is not in a tie
        for (let j = 0; j < maxVotesIndexArr.length; ++j) {
            if (i === j) { //Person at index i is part of the tie
            isTied = true;
            }
        }
        if (!isTied) {
                switch (tribe.curTribe[i].curVote){
                    case tribe.curTribe[maxVotesIndexArr[0]]: 

                }
        }
    }
    */
    let nonTiedPlayers = [];
    for (let i = 0; i < tribe.curTribe.length; ++i) {
        if (!maxVotesArr.includes(tribe.curTribe[i], start)) {
            if (maxVotesArr.includes(tribe.curTribe[i].votedFor[votedFor.length - 1], start)) { //Checks the latest vote
                let playerRecievingTheVote = tribe.curTribe[i].votedFor[votedFor.length - 1].
                playerRecievingTheVote.currentVotesRecieved++;
                tribe.curTribe[i].votedFor.push(playerRecievingTheVote);
            } 
            nonTiedPlayers.push(tribe.curTribe[i]);
        }
    }

    for (let i = 0; i < nonTiedPlayers.length; ++i) {
        if (maxVotesIndexArr.includes(nonTiedPlayers.votedFor[votedFor.length - 1], start)) {

        }
    }
}

/**
 * 
 */ 

function getStatus(tribe) {
    let numStatus = Math.floor(Math.random() * tribe.curTribe.length);
    let usedPlayer = [];
    let statusArray = [];

    for (let i = 0; i < numStatus; ++i) {
        let randEvent = Math.floor(Math.random() * NUM_CASES);
        let randPlayer = Math.floor(Math.random() * tribe.curTribe.length);
        
        
        if (!usedPlayer.includes(randPlayer)) {
            usedPlayer.push(randPlayer);
            switch(randEvent) {
                case 0:
                    statusArray.push(tribe.curTribe[randPlayer].name + " struggles helping with fireword");
                    break;
                case 1:
                    statusArray.push(tribe.curTribe[randPlayer].name + " is proving to be a good leader for the tribe");
                    break;
                case 2: 
                    statusArray.push(tribe.curTribe[randPlayer].name + " is considering quitting due to the weather");
                    break;
                case 3: 
                    statusArray.push(tribe.curTribe[randPlayer].name + " remains in  good spirits about the game");
                    break;
            }
        }
    }
    return statusArray;
}

function immunityChallengeTribe(tribes) {
    let losingIndex = Math.floor(Math.random() * tribes.length);
    let winningTribeStr = "";
    for (let i = 0; i < tribes.length; ++i) {
        if (i != losingIndex) {
            winningTribeStr = (tribes[i].name + " wins immunity")
        }
    }
    return [losingIndex, winningTribeStr];
}

function immunityChallengeIndividual(tribe) {
    let winningIndex = Math.floor(Math.random() * tribe.curTribe.length);
    tribe.curTribe[winningIndex].individualImmunity = true;
    let winningIndStr = (tribe.curTribe[winningIndex].name + " wins immunity!");
    console.log(winningIndStr);
    return [winningIndex, winningIndStr];
}

function merge(tribes, name) {
    let merged = [];

    for(let i = 0; i < tribes.length; ++i) {
        merged = merged.concat(tribes[i].curTribe);
    }

    merged.sort(function(a, b) {
        var textA = a.name.toLowerCase();
        var textB = b.name.toLowerCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    

    return new Tribe(merged, name);
}

function finalTribalCouncil(episode) {
    let tribe = episode.tribelist[0];
    let votes = Math.floor(Math.random() * 7);
    let losingVotes = 7 - votes;
    if (votes < losingVotes) {
        let a = votes;
        votes = losingVotes;
        losingVotes = a;
    }
    winDex = Math.floor(Math.random() * 2);
    losDex = (winDex + 1) % 2;
    let winningString = ("By a vote of " + votes + " - " + losingVotes + ", "  + tribe.curTribe[winDex].name + ", you are the sole survivor");
    episode.tribelist[0].elimString = winningString;
    episode.tribelist[0].curTribe.splice(losDex, 1);
    return episode;
}

function theVotes(theVotesArr, tribe) {
    for (let i = 0; i < theVotesArr[0].length; ++i) {
        //console.log(tribe.curTribe[theVotesArr[0][i][0]].name + " voted for " + tribe.curTribe[theVotesArr[0][i][1]].name);
    }
    tribe.curTribe.splice(theVotesArr[2], 1);
}

let player0 = new Player("BB", "male", 1);
let player1 = new Player("Colleen", "female", 1);
let player2 = new Player("Gervase", "male", 1);
let player3 = new Player("Greg", "male", 1);
let player4 = new Player("Gretchen", "female", 1);
let player5 = new Player("Jenna", "female", 1);
let player6 = new Player("Joel", "male", 1);
let player7 = new Player("Ramona", "female", 1);
let players1 = [player0, player1, player2, player3, player4, player5, player6, player7];
let tribe1 = new Tribe(players1, "Pagong");


let result = main();

console.log(result);
console.log(result.episodes[5].immWinString);

//document.getElementById("demo").innerHTML = temp.episodes[0].tribelist[0].statusList;
document.getElementById("start").innerHTML = "Start Simulator";

document.getElementById("imm-win-tribe-ep1").innerHTML = result.episodes[0].immWinString;