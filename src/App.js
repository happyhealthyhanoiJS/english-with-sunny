import React, { useState } from 'react';
import './App.css';
import Vocabulary from './Vocabulary';
import MyNotes from './MyNotes';

const modules = [
  { id: 'vocabulary', icon: '📚', title: 'Vocabulary', description: 'Flashcards for new words' },
  { id: 'grammar', icon: '✏️', title: 'Grammar', description: 'Articles, prepositions & more' },
  { id: 'phrasal', icon: '🔗', title: 'Phrasal Verbs', description: 'Give up, run into, figure out...' },
  { id: 'idioms', icon: '💬', title: 'Idioms', description: 'Natural English expressions' },
  { id: 'email', icon: '📧', title: 'Business Email', description: 'Professional writing skills' },
  { id: 'reading', icon: '📖', title: 'Reading', description: 'Comprehension practice' },
  { id: 'conversation', icon: '🗣️', title: 'Conversation', description: 'AI-powered speaking practice' },
  { id: 'notes', icon: '📝', title: 'My Notes', description: 'Upload your own expressions' },
];

function Home({ onSelect }) {
  return (
    <div className="home">
      <div className="header">
        <h1>English with Sunny</h1>
        <p>Your personal English learning companion</p>
      </div>
      <div className="grid">
        {modules.map(m => (
          <button key={m.id} className="card" onClick={() => onSelect(m.id)}>
            <span className="card-icon">{m.icon}</span>
            <h2>{m.title}</h2>
            <p>{m.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function ComingSoon({ module, onBack }) {
  const m = modules.find(x => x.id === module);
  return (
    <div className="coming-soon">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <div className="coming-soon-content">
        <span className="big-icon">{m.icon}</span>
        <h2>{m.title}</h2>
        <p>This module is coming soon!</p>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('home');

  return (
    <div className="app">
      {page === 'home' && <Home onSelect={setPage} />}
      {page === 'vocabulary' && <Vocabulary onBack={() => setPage('home')} />}
      {page === 'notes' && <MyNotes onBack={() => setPage('home')} />}
      {page !== 'home' && page !== 'vocabulary' && page !== 'notes' && <ComingSoon module={page} onBack={() => setPage('home')} />}
    </div>
  );
}
