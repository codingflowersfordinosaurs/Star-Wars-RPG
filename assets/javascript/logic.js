$(document).ready(function() {

  // DEFAULT AREA
  // create an arry of objects; default character list; wil not be the code that i mess with while palying the game; keep it on its own; then when we restart, we use this data to feed inot the html page; has all of the defaults
  var characterList = [
    {
      name: 'kyle katarn',
      health: 120,
      attack: 8,
      counter: 15,
      defaultAttack: 8, // base attack; added on every turn
      pic: "../../images/kyle-katarn.jpeg"
    },
    {
      name: 'lando calrissian',
      health: 100,
      attack: 14,
      counter: 5,
      defaultAttack: 14,
      pic: "../../images/lando.jpeg"
    },
    {
      name: 'ig-88',
      health: 150,
      attack: 8,
      counter: 20,
      defaultAttack: 8,
      pic: "../../images/ig-88.jpeg"
    },
    {
      name: 'Boba Fett',
      health: 180,
      attack: 7,
      counter: 25,
      defaultAttack: 7,
      pic: "../../images/boba-fett.jpeg"
    },
  ];

  // VARIABLE FOR PLAYING THE GAME
  var gameRoster = []; // be the variable to keep track what's happening in the game
  var player = {}; // empty object for player and the computer
  var computer = {}; // hold onto each character's info when we select them; so that player will be in the object
  var playerPicked = false; // setting some flags; when a selected a player and the computer too
  var computerPicked = false;
  var gameRunning = false; // game running flag; turn off the buttons; don't want the characters to keep playing

  // NEW/RESET FUNCTION
  function newGame() {
    gameRoster = [...characterList]; // grab character list with this spread operator --> and spread it across a new array; meaning is: in js you ajave 2 diff types of data --> primitive data types(strings, boolean, integers); works with arrays and objects: it says let's take the contents of this array/ogject and let's make a new array/object; they create an entire new piece of info from it
    console.log(characterList);
    player = {}; // zero out player
    computer = {}; // zero out computer
    gameRunning = true;
    playerPicked = false;
    computerPicked = false;

    $("#character-grid").hide();
    printCharacters(gameRoster);
  }

  // PRINT CHARACTER LIST
  function printCharacters(characterArray) { // taking character array as an argument
    $("#character-list").empty(); // take that div and empty it out; make sure not picking same character over and over again

    // check to see if the character array.length is zero
    if(characterArray.length === 0) {
      $("#character-list").text("No characters left");
      return false; // return false --> that way won't try to print anything
    }

    // useing a forEach loop --> an array method; only works on arrays; for each element in the array, lets run a function
    characterArray.forEach(function(characterInfo, i) { // it's like a for loop but it's really specific to arrays; at each iteration it's going to run this function (characterInfo) and there is the iterator 'i'
    // saying: for each character in characterArray... 
    // characterInfo represent what the character is at that iteration of the loop
        // Character Div
        // for each character we will create a character and addClass
        var character = $("<div class='character'>");
        // give character a background css property
        character.css({"background-image": "url(" + characterInfo.pic + ")"}).attr({"data-id": i});
        
        // need to create a div that will hold on to the statuses
        var charStats = $("<div>");
        charStats.addClass("character-stats").html(`<h4>${characterInfo.name}</h4>HP: ${characterInfo.health} <br>Attack: ${characterInfo.attack}<br>Counter: ${characterInfo.counter}`).appendTo(character);
        // template literals; wrap a string in back ticks, can write any valid code you want (not compatible with internet explorere); 

        $("#character-list").append(character)

    })
  }

  // ADD PLAYER TO ACTIVE GAME AREA
  // function that takes in 4 diff arguments,
  function activatePlayer(playerInfo, playerPosition, playerStats, playerTitle) {
    console.log(playerInfo, playerPosition);

    $(playerPosition).css({
      "background-image": "url(" + playerInfo.pic + ")"
    });

    // print out player stats while using template literals
    $(playerStats)
      .html(`<h4>${playerInfo.name} - ${playerTitle}</h4>HP: ${playerInfo.health}<br>Attack: ${playerInfo.attack}<br>Counter: ${playerInfo.counter}`)
      .removeClass("defeated");
  }

  // SELECT A CHARACTER
  // make an event listener; bound it to the document, specifically to anything with the class of character
  $(document).on("click", ".character", function() {
    // get character id so we can pull it out of the gameRoster array by its index
    var playerId = $(this).attr("data-id");

    // if you click on a character, 
    if (!playerPicked && gameRunning) {
      playerPicked = true;
      player = {...gameRoster[playerId]}; // by using spread operator, have playerId, reps index of gameRoster, grab the player by index in gameRoster;
      $("#character-grid").show(); // show the character grid bc we're about to show a character to it
      gameRoster.splice(playerId, 1); // splice; first arg is what index to we start at and then how many from that index should we be concerned with;
      printCharacters(gameRoster);
      activatePlayer(player, "#player", "#player-stats", "Attacker"); // send all this infor to a diff function activatePlayer; send id of div where info will go
    } 
    else if (!computerPicked && gameRunning) {
      computerPicked = true;
      computer = {...gameRoster[playerId]};
      gameRoster.splice(playerId, 1);
      printCharacters(gameRoster);
      activatePlayer(computer, "#computer", "#computer-stats", "Defender");
    } 
    else {
      console.log("Both players are active");
    }
  });

  function attack() {
    // Player Attacks CPU
    computer.health -= player.attack;
    // Player's attack increases
    player.attack += player.defaultAttack;

    // check to see if defender has lost
    if (computer.health <=0) {
      computerPicked = false; // reopening that click event to add a anew defender
      $("#computer-stats").html(`<h3>DEFEATED!</h3><h4>${computer.name} - Defender</h4>HP: ${computer.health} <br>Attack: ${computer.attack} <br>Counter: ${computer.counter}`).addClass("defeated");

      // check to see if any more characters are left
      if (gameRoster.length === 0) {
        gameRunning = false;
      }
      return false;
    }

    // CPU Attacks Player
    player.health -= computer.counter;

    $("#player-stats").html(`<h4>${player.name} - Attacker</h4>HP: ${player.health} <br>Attack: ${player.attack}<br>Counter: ${player.counter}`);

    $("#computer-stats").html(`<h4>${computer.name} - Attacker</h4>HP: ${computer.health} <br>Attack: ${computer.attack}<br>Counter: ${computer.counter}`);

    if (player.health <= 0) {
      playerPicked = false;
      computerPicked = false;
      gameRunning = false;
      $("#player-stats").html(`<h3>DEFEATED!</h3><h4>${player.name} - Defender</h4>HP: ${player.health} <br>Attack: ${player.attack} <br>Counter: ${player.counter}`).addClass("defeated");    
    }
  }

  // NEW GAME BUTTON
  $("#new-game").on("click", newGame);

  // ATTACK BUTTON
  $("#attack").on("click", function() {
    // on click we're going to run this function
    if (playerPicked && computerPicked && gameRunning) {
      attack();
    } 
    else {
      console.log('You need to pick a player');
    }
  });

  newGame();

});

