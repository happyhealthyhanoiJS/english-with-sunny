import React, { useState } from 'react';
import './MyNotes.css';

const STORAGE_KEY = 'sunny_notes';

function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

const TYPES = ['Phrasal Verb', 'Idiom', 'Vocabulary', 'Expression'];

function exportNotes(notes) {
  const data = JSON.stringify(notes, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'my-english-notes.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importNotes(file, onDone) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) onDone(imported);
      else alert('Invalid file format.');
    } catch {
      alert('Could not read file. Make sure it is a valid notes export.');
    }
  };
  reader.readAsText(file);
}

export default function MyNotes({ onBack }) {
  const [notes, setNotes] = useState(loadNotes);
  const [view, setView] = useState('list'); // 'list' | 'add' | 'flashcard'
  const [flashIndex, setFlashIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const [form, setForm] = useState({
    word: '',
    type: 'Expression',
    meaning: '',
    korean: '',
    example: '',
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleAdd() {
    if (!form.word || !form.meaning) return;
    const updated = [{ ...form, id: Date.now() }, ...notes];
    setNotes(updated);
    saveNotes(updated);
    setForm({ word: '', type: 'Expression', meaning: '', korean: '', example: '' });
    setView('list');
  }

  function handleDelete(id) {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    saveNotes(updated);
  }

  function startFlashcards() {
    setFlashIndex(0);
    setFlipped(false);
    setView('flashcard');
  }

  if (view === 'flashcard') {
    const card = notes[flashIndex];
    return (
      <div className="notes-page">
        <button className="back-btn" onClick={() => setView('list')}>← Back to Notes</button>
        <div className="vocab-header">
          <h2>📝 My Notes</h2>
          <span className="progress">{flashIndex + 1} / {notes.length}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((flashIndex + 1) / notes.length) * 100}%` }} />
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
          <button className="nav-btn" onClick={() => { setFlashIndex(i => (i - 1 + notes.length) % notes.length); setFlipped(false); }}>← Prev</button>
          <button className="nav-btn" onClick={() => { setFlashIndex(i => (i + 1) % notes.length); setFlipped(false); }}>Next →</button>
        </div>
      </div>
    );
  }

  if (view === 'add') {
    return (
      <div className="notes-page">
        <button className="back-btn" onClick={() => setView('list')}>← Back</button>
        <h2 className="section-title">Add New Expression</h2>

        <div className="form">
          <label>Word / Phrase *</label>
          <input
            name="word"
            value={form.word}
            onChange={handleChange}
            placeholder="e.g. bring up, bite the bullet"
          />

          <label>Type</label>
          <select name="type" value={form.type} onChange={handleChange}>
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>

          <label>Meaning *</label>
          <input
            name="meaning"
            value={form.meaning}
            onChange={handleChange}
            placeholder="What does it mean in English?"
          />

          <label>Korean Translation</label>
          <input
            name="korean"
            value={form.korean}
            onChange={handleChange}
            placeholder="한국어 뜻"
          />

          <label>Example Sentence</label>
          <textarea
            name="example"
            value={form.example}
            onChange={handleChange}
            placeholder="Write an example sentence..."
            rows={3}
          />

          <button
            className="btn-add"
            onClick={handleAdd}
            disabled={!form.word || !form.meaning}
          >
            Save Expression
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="notes-page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <div className="notes-header">
        <h2>📝 My Notes</h2>
        <button className="btn-new" onClick={() => setView('add')}>+ Add</button>
      </div>

      <div className="import-export">
        <button className="btn-export" onClick={() => exportNotes(notes)}>⬇ Export Notes</button>
        <label className="btn-import">
          ⬆ Import Notes
          <input
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files[0]) {
                importNotes(e.target.files[0], (imported) => {
                  const merged = [...imported, ...notes].filter(
                    (n, i, arr) => arr.findIndex(x => x.id === n.id) === i
                  );
                  setNotes(merged);
                  saveNotes(merged);
                });
              }
            }}
          />
        </label>
      </div>

      {notes.length === 0 ? (
        <div className="empty-state">
          <span>📋</span>
          <p>No expressions yet!</p>
          <p>Paste expressions from your ChatGPT sessions here.</p>
          <button className="btn-new" onClick={() => setView('add')}>+ Add your first expression</button>
        </div>
      ) : (
        <>
          <button className="btn-flashcard" onClick={startFlashcards}>
            🃏 Practice as Flashcards ({notes.length})
          </button>
          <div className="notes-list">
            {notes.map(note => (
              <div key={note.id} className="note-card">
                <div className="note-top">
                  <div>
                    <span className="note-type">{note.type}</span>
                    <h3 className="note-word">{note.word}</h3>
                  </div>
                  <button className="btn-delete" onClick={() => handleDelete(note.id)}>✕</button>
                </div>
                <p className="note-meaning">{note.meaning}</p>
                {note.korean && <p className="note-korean">{note.korean}</p>}
                {note.example && <p className="note-example">"{note.example}"</p>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
