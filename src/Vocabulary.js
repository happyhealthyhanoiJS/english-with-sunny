import React, { useState } from 'react';
import './Vocabulary.css';

const cards = [
  {
    word: 'give up',
    type: 'Phrasal Verb',
    meaning: 'To stop trying; to quit',
    korean: '포기하다',
    example: "Don't give up on your dream of speaking like a native!",
  },
  {
    word: 'figure out',
    type: 'Phrasal Verb',
    meaning: 'To understand or find a solution',
    korean: '알아내다, 이해하다',
    example: 'It took me a while to figure out how to use this app.',
  },
  {
    word: 'run into',
    type: 'Phrasal Verb',
    meaning: 'To meet someone unexpectedly',
    korean: '우연히 만나다',
    example: 'I ran into my old friend at the supermarket yesterday.',
  },
  {
    word: 'bring up',
    type: 'Phrasal Verb',
    meaning: 'To mention a topic in conversation',
    korean: '꺼내다, 언급하다',
    example: 'She brought up an interesting point during the meeting.',
  },
  {
    word: 'look into',
    type: 'Phrasal Verb',
    meaning: 'To investigate or research something',
    korean: '조사하다',
    example: "I'll look into the best restaurants in the area.",
  },
  {
    word: 'it\'s raining cats and dogs',
    type: 'Idiom',
    meaning: 'It is raining very heavily',
    korean: '비가 엄청나게 쏟아지다',
    example: "Take an umbrella — it's raining cats and dogs outside!",
  },
  {
    word: 'under the weather',
    type: 'Idiom',
    meaning: 'Feeling sick or unwell',
    korean: '몸이 좋지 않다',
    example: "I'm feeling a bit under the weather today, so I'll stay home.",
  },
  {
    word: 'bite the bullet',
    type: 'Idiom',
    meaning: 'To endure something painful or difficult',
    korean: '이를 악물고 견디다',
    example: 'I bit the bullet and finally went to the dentist.',
  },
];

export default function Vocabulary({ onBack }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const [learning, setLearning] = useState([]);

  const card = cards[index];
  const total = cards.length;

  function next() {
    setIndex((i) => (i + 1) % total);
    setFlipped(false);
  }

  function prev() {
    setIndex((i) => (i - 1 + total) % total);
    setFlipped(false);
  }

  function markKnown() {
    setKnown([...known, index]);
    next();
  }

  function markLearning() {
    setLearning([...learning, index]);
    next();
  }

  return (
    <div className="vocab-page">
      <button className="back-btn" onClick={onBack}>← Back</button>

      <div className="vocab-header">
        <h2>📚 Vocabulary</h2>
        <span className="progress">{index + 1} / {total}</span>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <span className="card-type">{card.type}</span>
            <h1 className="card-word">{card.word}</h1>
            <p className="tap-hint">Tap to reveal meaning</p>
          </div>
          <div className="flashcard-back">
            <span className="card-type">{card.type}</span>
            <h2 className="card-meaning">{card.meaning}</h2>
            <p className="card-korean">{card.korean}</p>
            <div className="card-example">
              <span className="example-label">Example</span>
              <p>"{card.example}"</p>
            </div>
          </div>
        </div>
      </div>

      <div className="nav-buttons">
        <button className="nav-btn" onClick={prev}>← Prev</button>
        <button className="nav-btn" onClick={next}>Next →</button>
      </div>

      {flipped && (
        <div className="rating-buttons">
          <button className="btn-learning" onClick={markLearning}>Still Learning 🔄</button>
          <button className="btn-known" onClick={markKnown}>Got it! ✓</button>
        </div>
      )}

      <div className="stats">
        <span className="stat known">✓ Got it: {known.length}</span>
        <span className="stat learning">🔄 Learning: {learning.length}</span>
      </div>
    </div>
  );
}
