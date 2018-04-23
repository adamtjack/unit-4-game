
$(document).ready(function() {

    
    
    //Array of Playable Characters
    let characters = {
        'batman': {
            name: 'batman',
            health: 140,
            attack: 10,
            imageUrl: "assets/images/lego-batman3.png",
            enemyAttackBack: 15
        }, 
        'robin': {
            name: 'robin',
            health: 120,
            attack: 16,
            imageUrl: "assets/images/lego-robin.png",
            enemyAttackBack: 10
        }, 
        'joker': {
            name: 'joker',
            health: 180,
            attack: 10,
            imageUrl: "assets/images/lego-joker.png",
            enemyAttackBack: 20
        }, 
        'catwoman': {
            name: 'catwoman',
            health: 160,
            attack: 7,
            imageUrl: "assets/images/lego-catwoman.png",
            enemyAttackBack: 20
        },
    };
    
    var currSelectedCharacter;
    var currDefender;
    var combatants = [];
    var indexofSelChar;
    var attackResult;
    var turnCounter = 1;
    var killCount = 0;
    
    
    var renderOne = function(character, renderArea, makeChar) {
        
        var charDiv = $("<div class='character' data-name='" + character.name + "'>");
        var charName = $("<div class='character-name'>").text(character.name);
        var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
        var charHealth = $("<div class='character-health'>").text(character.health);
        charDiv.append(charName).append(charImage).append(charHealth);
        $(renderArea).append(charDiv);
        
        if (makeChar == 'enemy') {
          $(charDiv).addClass('enemy');
        } else if (makeChar == 'defender') {
          currDefender = character;
          $(charDiv).addClass('target-enemy');
        }
      };
    
      
      var renderMessage = function(message) {
        var gameMesageSet = $("#gameMessage");
        var newMessage = $("<div>").text(message);
        gameMesageSet.append(newMessage);
    
        if (message == 'clearMessage') {
          gameMesageSet.text('');
        }
      };
    
      var renderCharacters = function(charObj, areaRender) {
        //all characters
        if (areaRender == '#characters-section') {
          $(areaRender).empty();
          for (var key in charObj) {
            if (charObj.hasOwnProperty(key)) {
              renderOne(charObj[key], areaRender, '');
            }
          }
        }
        //player character
        if (areaRender == '#selected-character') {
          $('#selected-character').prepend("Your Character");       
          renderOne(charObj, areaRender, '');
          $('#attack-button').css('visibility', 'visible');
        }
        //combatants
        if (areaRender == '#available-to-attack-section') {
            $('#available-to-attack-section').prepend("Choose Your Next Opponent");      
          for (var i = 0; i < charObj.length; i++) {
    
            renderOne(charObj[i], areaRender, 'enemy');
          }
          
          $(document).on('click', '.enemy', function() {
            //select an enemy
            name = ($(this).data('name'));
            //if area is empty
            if ($('#defender').children().length === 0) {
              renderCharacters(name, '#defender');
              $(this).hide();
              renderMessage("clearMessage");
            }
          });
        }
        //defender appears
        if (areaRender == '#defender') {
          $(areaRender).empty();
          for (var i = 0; i < combatants.length; i++) {
            //add enemy to area
            if (combatants[i].name == charObj) {
              $('#defender').append("Selected opponent")
              renderOne(combatants[i], areaRender, 'defender');
            }
          }
        }
        //defender when attacked
        if (areaRender == 'playerDamage') {
          $('#defender').empty();
          $('#defender').append("Selected opponent")
          renderOne(charObj, '#defender', 'defender');
        }
        //character when attacked
        if (areaRender == 'enemyDamage') {
          $('#selected-character').empty();
          renderOne(charObj, '#selected-character', '');
        }
        //defeated enemy
        if (areaRender == 'enemyDefeated') {
          $('#defender').empty();
          var gameStateMessage = "You have defated " + charObj.name + ", you can choose to fight another enemy.";
          renderMessage(gameStateMessage);
        }
      };
      
      renderCharacters(characters, '#characters-section');
      $(document).on('click', '.character', function() {
        name = $(this).data('name');
        //if no player char has been selected
        if (!currSelectedCharacter) {
          currSelectedCharacter = characters[name];
          for (var key in characters) {
            if (key != name) {
              combatants.push(characters[key]);
            }
          }
          $("#characters-section").hide();
          renderCharacters(currSelectedCharacter, '#selected-character');
          //choose character
          renderCharacters(combatants, '#available-to-attack-section');
        }
      });
    
      
      $("#attack-button").on("click", function() {
        //if enemy available
        if ($('#defender').children().length !== 0) {
          
          var attackMessage = "You attacked " + currDefender.name + " for " + (currSelectedCharacter.attack * turnCounter) + " damage.";
          renderMessage("clearMessage");
          //fight
          currDefender.health = currDefender.health - (currSelectedCharacter.attack * turnCounter);
    
          //if you win
          if (currDefender.health > 0) {
            
            renderCharacters(currDefender, 'playerDamage');
            
            var counterAttackMessage = currDefender.name + " attacked youfor " + currDefender.enemyAttackBack + " damage.";
            renderMessage(attackMessage);
            renderMessage(counterAttackMessage);
    
            currSelectedCharacter.health = currSelectedCharacter.health - currDefender.enemyAttackBack;
            renderCharacters(currSelectedCharacter, 'enemyDamage');
            if (currSelectedCharacter.health <= 0) {
              renderMessage("clearMessage");
              restartGame("OH NO, you lost! GAME OVER!!!");
              $("#attack-button").unbind("click");
            }
          } else {
            renderCharacters(currDefender, 'enemyDefeated');
            killCount++;
            if (killCount >= 3) {
              renderMessage("clearMessage");
              restartGame("You defeated all characters!!!! GAME OVER!!!");
              
    
            }
          }
          turnCounter++;
        } else {
          renderMessage("clearMessage");
          renderMessage("No enemy here.");
        }
      });
    
    //Restarts the game - renders a reset button
      var restartGame = function(inputEndGame) {
        //When 'Restart' button is clicked, reload the page.
        var restart = $('<button class="btn">Restart</button>').click(function() {
          location.reload();
        });
        var gameState = $("<div>").text(inputEndGame);
        $("#gameMessage").append(gameState);
        $("#gameMessage").append(restart);
      };
    
    });