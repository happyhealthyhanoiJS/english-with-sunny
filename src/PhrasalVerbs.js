import React, { useState } from 'react';
import './Vocabulary.css';

const STORAGE_KEY = 'sunny_notes';

function loadPhrasalVerbs() {
  try {
    const notes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    return notes.filter(n => n.type === 'Phrasal Verb');
  } catch {
    return [];
  }
}

export default function PhrasalVerbs({ onBack }) {
  const cards = loadPhrasalVerbs();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const [learning, setLearning] = useState([]);

  if (cards.length === 0) {
    return (
      <div className="vocab-page">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div style={{ textAlign: 'center', marginTop: 80 }}>
          <span style={{ fontSize: '4rem' }}>🔗</span>
          <h2 style={{ margin: '16px 0 8px' }}>No Phrasal Verbs yet!</h2>
          <p style={{ color: '#718096' }}>Go to My Notes and import the all-notes-fixed.json file to get 100+ phrasal verbs.</p>
        </div>
      </div>
    );
  }

  const card = cards[index];
  const total = cards.length;

  function next() { setIndex(i => (i + 1) % total); setFlipped(false); }
  function prev() { setIndex(i => (i - 1 + total) % total); setFlipped(false); }
  function markKnown() { setKnown([...known, index]); next(); }
  function markLearning() { setLearning([...learning, index]); next(); }

  return (
    <div className="vocab-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <div className="vocab-header">
        <h2>🔗 Phrasal Verbs</h2>
        <span className="progress">{index + 1} / {total}</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>
      <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <span className="card-type">Phrasal Verb</span>
            <h1 className="card-word">{card.word}</h1>
            <p className="tap-hint">Tap to reveal meaning</p>
          </div>
          <div className="flashcard-back">
            <span className="card-type">Phrasal Verb</span>
            <h2 className="card-meaning">{card.meaning}</h2>
            {card.korean && <p className="card-korean">{card.korean}</p>}
            {card.example && (
              <div className="card-example">
                <span className="example-label">Example</span>
                <p>"{card.example}"</p>
              </div>
            )}
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
