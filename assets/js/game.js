(() => {
  "use strict";
  let types = ["C", "D", "H", "S"],
    specials = ["A", "J", "Q", "K"];

  let deck = [],
    playerDeck = [],
    computerDeck = [];

  // Creates a new deck
  const createDeck = () => {
    deck = [];
    for (let _type of types) {
      for (let i = 2; i <= 10; i++) {
        deck.push(i + _type);
      }

      for (let _special of specials) {
        deck.push(_special + _type);
      }
    }

    return _.shuffle(deck);
  };

  const reset = () => {
    playerDeck = [];
    computerDeck = [];

    while (playerCards.hasChildNodes()) {
      playerCards.removeChild(playerCards.firstChild);
    }

    while (computerCards.hasChildNodes()) {
      computerCards.removeChild(computerCards.firstChild);
    }

    isComputerTurn = false;
    playerPoints = 0;
    computerPoints = 0;
    playerPointsText.innerHTML = playerPoints;
    computerPointsText.innerHTML = computerPoints;

    btnGet.disabled = false;
    btnStop.disabled = false;
  };

  // Get a card
  const getCard = () => {
    if (deck.length === 0) {
      const noCard = "No more cards in deck";
      alert(noCard);
      throw noCard;
    }
    return deck.pop();
  };

  //Get the value of a card
  const getValue = (card) => {
    const cardValue = card.length === 3 ? 10 : card.split("")[0];
    return cardValue === "A"
      ? 11
      : specials.indexOf(cardValue) !== -1
      ? 10
      : cardValue;
  };

  //Computer's turn
  const callComputerLogic = () => {
    let tempCard = getCard();
    computerDeck.push(tempCard);

    let img = createCard(tempCard);

    computerCards.appendChild(img);
    accumulatePoints(false, tempCard);
  };

  const computersTurn = async (minPoints) => {
    if (isComputerTurn) {
      do {
        await sleep(500);
        callComputerLogic();

        if (minPoints > 21) {
          break;
        }
      } while (computerPoints < minPoints && minPoints <= 21);

      setTimeout(() => {
        if (computerPoints === minPoints) {
          alert("No one wins :C");
        } else if (
          minPoints > 21 ||
          (computerPoints > playerPoints && computerPoints <= 21)
        ) {
          alert("Computer Wins");
        } else if (computerPoints >= 21) {
          alert("Player Wins");
        } else if (playerPoints === 21) {
          alert("Player Wins");
        }
      }, 10);
    }
  };

  const sleep = (timeout) =>
    new Promise((resolve) => setTimeout(resolve, timeout));

  const createCard = (tempCard) => {
    let img = document.createElement("img");
    img.className = "card";
    img.src = `assets/cards/${tempCard}.png`;
    return img;
  };

  // DOM
  const btnGet = document.querySelector("#btnGet"),
    btnNew = document.querySelector("#btnNew"),
    btnStop = document.querySelector("#btnStop");

  const playerText = document.querySelector(".player-text"),
    computerText = document.querySelector(".computer-text");

  let playerPointsText = document.querySelector("#player-points"),
    computerPointsText = document.querySelector("#computer-points");

  const playerCards = document.querySelector("#player-cards"),
    computerCards = document.querySelector("#computer-cards");

  let isComputerTurn = false;

  let playerPoints = 0,
    computerPoints = 0;

  const REMARK = "yellow";
  const NORMAL = "white";

  const initialize = () => {
    // createDeck();
    // reset();
    // titleStyle(true);
    btnGet.disabled = true;
    btnStop.disabled = true;
  };

  const titleStyle = (isPlayer) => {
    playerText.style.color = isPlayer ? REMARK : NORMAL;
    computerText.style.color = isPlayer ? NORMAL : REMARK;
  };

  const displayComputerTurn = async () => {
    btnGet.disabled = true;
    btnStop.disabled = true;
    isComputerTurn = true;
    titleStyle(false);
    await computersTurn(playerPoints);
  };

  const accumulatePoints = (isPlayer, tempCard) => {
    if (isPlayer) {
      playerPoints += +getValue(tempCard);
      playerPointsText.innerHTML = playerPoints;
    } else {
      computerPoints += +getValue(tempCard);
      computerPointsText.innerHTML = computerPoints;
    }
  };

  btnNew.addEventListener("click", () => {
    deck = createDeck();
    reset();
    titleStyle(true);
  });

  btnGet.addEventListener("click", async () => {
    if (!isComputerTurn) {
      let tempCard = getCard();

      playerDeck.push(tempCard);

      let img = createCard(tempCard);
      playerCards.appendChild(img);
      accumulatePoints(true, tempCard);

      if (playerPoints > 21) {
        setTimeout(() => {
          alert("Sorry, You Lose!");
        }, 10);
        await displayComputerTurn();
      } else if (playerPoints === 21) {
        setTimeout(() => {
          alert("21, Amazing!");
        }, 10);
        await displayComputerTurn();
      }
    }
  });

  btnStop.addEventListener("click", async () => {
    setTimeout(() => {
      alert("Is computer's turn!");
    }, 10);
    await displayComputerTurn();
  });

  initialize();
})();
