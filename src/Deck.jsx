import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from "./Card";
import "./Deck.css"

const Deck = () => {
  const deckId = useRef();
  const [drawnCards, setDrawnCards] = useState([]);
  const [cardsRemaining, setCardsRemaining] = useState(52);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    const fetchNewDeck = async () => {
      try {
        const res = await axios.get("https://deckofcardsapi.com/api/deck/new/");
        deckId.current = res.data.deck_id;
      } catch (error) {
        console.error("Error creating new deck:", error);
      }
    };

    fetchNewDeck();
  }, []);

  const drawCard = () => {
    setCardsRemaining(cardsRemaining - 1);
  };

  useEffect(() => {
    const addCard = async () => {
      try {
        const res = await axios.get(
          `https://deckofcardsapi.com/api/deck/${deckId.current}/draw/?count=1`
        );
        const newCard = res.data.cards[0];
        if (!newCard) throw new Error("No cards remaining!");
        newCard.rotation = `rotate(${Math.floor(Math.random()*361)}deg)`;
        setDrawnCards((prevDrawn) => [...prevDrawn, newCard]); 
      } catch (error) {
        console.error("Error drawing card:", error);
        alert("Error: No cards remaining!");
      }
    };

    if (cardsRemaining !== 52) addCard();
  }, [cardsRemaining]);

  const shuffleDeck = () => {
    if (isShuffling) return;
    setIsShuffling(true);
  }

  useEffect(() => {
    const shuffleCards = async () => {
      try {
        const res = await axios.get(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`);
        deckId.current = res.data.deck_id;
        setDrawnCards([]);
        setCardsRemaining(52);
      } catch (error) {
        console.error("Error shuffling deck:", error);
      }
    };

    if (isShuffling) {
      shuffleCards();
      setIsShuffling(false);
    }
  })

  return (
    <>
      {cardsRemaining >= 0 && <button onClick={drawCard}>Give me a card!</button>}
      <button onClick={shuffleDeck}>Shuffle</button>
      <div>
      {!isShuffling && drawnCards && drawnCards.map(({ code, image, rotation }) => <Card key={code} image={image} rotation={rotation}/>)}
      </div>
    </>
  );
};

export default Deck;
