import React from 'react';

// --- ESTILOS DE CHAT ---
const chatStyles = {
  // <--- AQUÍ AGREGAMOS LA CAJA FALTANTE
  chatContainer: {
    width: '100%',
    maxWidth: '400px',
    height: '60vh',
    backgroundColor: 'white',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  chatHeader: {
    padding: '15px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0fdfa',
    borderRadius: '16px 16px 0 0',
  },
  chatHeaderName: {
    fontWeight: 'bold',
    color: '#0e7490',
    fontSize: '1.1rem',
  },
  chatMessages: {
    flex: 1,
    padding: '15px',
    overflowY: 'auto',
    backgroundColor: '#fff',
  },
  messageBubble: {
    padding: '10px 15px',
    borderRadius: '12px',
    marginBottom: '10px',
    maxWidth: '80%',
    fontSize: '0.95rem',
    lineHeight: '1.4',
  },
  messageMe: {
    backgroundColor: '#06b6d4',
    color: 'white',
    marginLeft: 'auto',
    borderBottomRightRadius: '2px',
  },
  messageThem: {
    backgroundColor: '#f1f5f9',
    color: '#334155',
    marginRight: 'auto',
    borderBottomLeftRadius: '2px',
  },
  chatInputArea: {
    padding: '10px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    gap: '10px',
    borderRadius: '0 0 16px 16px',
  },
  chatInput: {
    flex: 1,
    padding: '10px',
    borderRadius: '20px',
    border: '1px solid #cbd5e1',
    outline: 'none',
  },
  chatSendBtn: {
    backgroundColor: '#06b6d4',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}; // <--- ESTA LLAVE CIERRA LA CAJA

// --- COMPONENTE CHAT ---
export default function Chat({
  target,
  onClose,
}: {
  target: string | null;
  onClose: () => void;
}) {
  const [chatMessages, setChatMessages] = React.useState([
    { text: `Hola, soy ${target}.`, sender: 'them' },
  ]);
  const [newMessageText, setNewMessageText] = React.useState('');

  const handleSendMessage = () => {
    if (!newMessageText.trim()) return;

    const myMsg = { text: newMessageText, sender: 'me' as const };
    setChatMessages([...chatMessages, myMsg]);
    setNewMessageText('');

    setTimeout(() => {
      const replyMsg = {
        text: '¡Entendido! Gracias por escribirme. Me parece bien el trato.',
        sender: 'them' as const,
      };
      setChatMessages((prev) => [...prev, replyMsg]);
    }, 2000);
  };

  return (
    <div style={chatStyles.chatContainer}>
      <div style={chatStyles.chatHeader}>
        <div>
          <div style={chatStyles.chatHeaderName}>💬 Chat con {target}</div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>En línea</div>
        </div>
        <button
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#64748b',
          }}
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <div style={chatStyles.chatMessages}>
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...chatStyles.messageBubble,
              ...(msg.sender === 'me'
                ? chatStyles.messageMe
                : chatStyles.messageThem),
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div style={chatStyles.chatInputArea}>
        <input
          style={chatStyles.chatInput}
          placeholder="Escribe un mensaje..."
          value={newMessageText}
          onChange={(e) => setNewMessageText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button style={chatStyles.chatSendBtn} onClick={handleSendMessage}>
          ➤
        </button>
      </div>
    </div>
  );
}
