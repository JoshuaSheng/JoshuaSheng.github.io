function deck() {
  let cards = (function() {
    let name = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
    let suit = ["hearts", "diamond", "clubs", "spades"]
    let value = 0
    let cards = []

    for (let i = 0; i < suit.length; i++) {
      for (let j = 0; j < name.length; j++) {
        if (j > 9) {
          value = 10
        }
        else {
          value = j + 1
        }
        cards.push(new card(value, name[j], suit[i]))
      }
    }
    return cards
  })()

  function card(value, name, suit){
    this.value = value;
    this.name = name;
    this.suit = suit;
  }

//gets the deck of cards
  this.getDeck = () => cards;

//shuffles the built-in deck of cards
  this.shuffle = () => {
    let random = 0
    let swap = cards[0]
    for (let i = 0; i < cards.length; i++) {
      random = parseInt(Math.random() * cards.length)
      swap = cards[random]
      cards[random] = cards[i]
      cards[i] = swap
    }
  }
}

let init = new (function() {
  var bank = 100;
  this.getBank = () => bank;
  this.addBank = function(change) {
    bank += change
  };
})

let start_game_dom = document.querySelector(".start-button")
start_game_dom.addEventListener("click", () => {
  new Audio("audio/poker-chips.wav").play();
  let start_screen_dom = document.querySelector("#start-screen")
  start_screen_dom.style.display = "none"
  document.querySelector("#bottombar").innerHTML = "Balance: " + init.getBank()
})

let submit_bet_dom = document.querySelector("#submit-bet")
submit_bet_dom.addEventListener("submit", (e) => {
  e.preventDefault();
  let bet_amount = parseInt(document.querySelector("#bet-amount").value)
  if (bet_amount > init.getBank()) {
    alert("You do not have enough money!")
  }
  else if (bet_amount <= 0) {
    alert("You must bet at least $1")
  }
  else {
    document.querySelector("#bet-screen-container").style.display = "none";
    init.addBank(-bet_amount)
    new game(bet_amount).play()
  }
})

function game(bet) {
  let count = 0;
  let cards;
  let dealer_count = 0;
  let ace_count = 0;
  let dealer_ace_count = 0;
  let bet_inner = bet;


  this.cleardiv = clear_div

  this.play = function() {

    count = 0;
    dealer_count = 0;
    cards = new deck()
    cards.shuffle()
    cards = cards.getDeck()

    
    document.querySelector("#bottombar").innerHTML = "Balance: " + init.getBank()

    clear_div("#player-options");
    clear_div("#message-box");
    clear_div("#player-cards");
    clear_div("#npc-cards");

    setTimeout(() => hit(), 500)

    setTimeout(() => hit(), 1000)

    setTimeout(() => hit("dealer"), 1500)

    setTimeout(() => {
      hit("dealer")
      document.querySelector("#npc-cards").lastChild.classList.add("hidden")
      options(true);
    }, 2000)
  }

  function options(first_turn = false) {
    if (count > 21) {
      end(count, 0);
    }
    else if (count == 21) {
      dealer_turn();
    }
    else {
      let player_options_dom = document.querySelector("#player-options")

      let hit_dom = document.createElement("div")
      hit_dom.classList.add("game-option")
      hit_dom.innerHTML = "Hit"
      hit_dom.addEventListener("click", () => {
        new Audio("audio/button-click.wav").play();
        clear_div("#player-options")
        hit()
        options()
      })
      player_options_dom.appendChild(hit_dom)

      let stand_dom = document.createElement("stand")
      stand_dom.classList.add("game-option")
      stand_dom.innerHTML = "Stand"
      stand_dom.addEventListener("click", () => {
        new Audio("audio/button-click.wav").play();
        clear_div("#player-options")
        dealer_turn()
      })
      player_options_dom.appendChild(stand_dom)

      if (first_turn == true && count >= 9 && count <= 11) {
        let double_dom = document.createElement("double")
        double_dom.classList.add("game-option")
        double_dom.innerHTML = "Double"
        double_dom.addEventListener("click", () => {
          new Audio("audio/button-click.wav").play();
          clear_div("#player-options")
          double()
        })
        player_options_dom.appendChild(double_dom)
      }
    }
  }

  function hit(target="player") {
    if (target == "player") {
        let draw = cards.pop();
        count += draw.value
        if (draw.value == 1) {
          count += 10
          ace_count += 1;
        }
        create_card(draw, "#player-cards")

        if (count > 21 && ace_count > 0) {
          count -= 10
          ace_count -= 1;
        }
      }
    else {
      let draw = cards.pop();
      create_card(draw, "#npc-cards")
      dealer_count += draw.value;
      if (draw.value == 1) {
        dealer_ace_count += 1;
        dealer_count += 10
      }
      if (dealer_count > 21 && dealer_ace_count > 0) {
        dealer_count -= 10
        dealer_ace_count -= 1;
      }
    }
  }

  function double() {
    init.addBank(-1*bet_inner)
    document.querySelector("#bottombar").innerHTML = "Balance: " + init.getBank()
    bet_inner = bet_inner*2
    hit()
    dealer_turn()
  }

  async function dealer_turn() {
    document.querySelector("#npc-cards").lastChild.classList.remove("hidden")
    while (dealer_count < 17) {
      await sleep(500)
      hit("dealer")
    }
    end(count, dealer_count)
  }

  function end(count, dealer_count) {
    console.log(bet_inner)
    clear_div("#player-options");
    let end_message = document.querySelector("#message-box")
    if (count > 21) {
      end_message.innerHTML = "BUST"
    }
    else if (dealer_count > 21) {
      end_message.innerHTML = "Dealer BUST"
      init.addBank(bet_inner*2)
    }
    else if (dealer_count == count) {
      end_message.innerHTML = "Push"
      init.addBank(bet_inner)
    }
    else if (count > dealer_count) {
      end_message.innerHTML = "You Win!"
      init.addBank(bet_inner*2)
    }
    else {
      end_message.innerHTML = "You Lose"
    }

    let bottombar = document.querySelector("#bottombar")
    bottombar.innerHTML = "Balance: " + init.getBank()

    let play_again = document.createElement("div")
    play_again.innerHTML = "Play Again"
    play_again.classList.add("game-option")
    play_again.addEventListener("click", () => {
      new Audio("audio/poker-chips.wav").play();
      document.querySelector("#bet-screen-container").style.display = "block";
    })
    document.querySelector("#player-options").appendChild(play_again)
  }

  function clear_div(query) {
    let div = document.querySelector(query)
    while (div.firstChild) {
      div.removeChild(div.firstChild)
    }
  }

  function create_card(card, location) {
    let card_dom = document.createElement("div")
      card_dom.classList.add("card")
      card_dom.innerHTML = card.name + "<br>" + "&" + card.suit + ";"
      console.log(card_dom)
      document.querySelector(location).appendChild(card_dom)
  }

  function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
  }

}
