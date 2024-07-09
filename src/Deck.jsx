import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from "./Card";
import "./Deck.css"

const Deck = () => {
  const deckId = useRef();
  const [deck, setDeck] = useState([]);
  const [cardsRemaining, setCardsRemaining] = useState(52);

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
        newCard.rotation = `rotate(${Math.floor(Math.random()*361)}deg)`;
        setDeck((prevDeck) => [...prevDeck, newCard]); 
      } catch (error) {
        console.error("Error drawing card:", error);
        alert("Error: no cards remaining!");
      }
    };

    if (cardsRemaining !== 52) addCard();
  }, [cardsRemaining]);

  return (
    <>
      {cardsRemaining >= 0 && <button onClick={drawCard}>Give me a card!</button>}
      <div>
      {deck && deck.map(({ code, image, rotation }) => <Card key={code} image={image} rotation={rotation}/>)}
      </div>
    </>
  );
};

export default Deck;
