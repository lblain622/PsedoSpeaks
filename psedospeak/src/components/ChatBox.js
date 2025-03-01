'use client';

import { useState } from 'react';

export default function ChatBox() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data.message || 'Respuesta no disponible');
      } else {
        setResponse(data.error || 'Ocurrió un error');
      }
    } catch (error) {
      console.error('Error:', error);
      setResponse('Ocurrió un error al procesar la solicitud.');
    }
  };

  return (
    <div>
      <h1>Chat con Gemini</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write something..."
        />
        <button type="submit">Send</button>
      </form>
      <div>
        <h2>Answer:</h2>
        <p>{response}</p>
      </div>
    </div>
  );
}