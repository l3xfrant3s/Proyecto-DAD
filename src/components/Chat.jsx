import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {React, useState} from 'react'
import axios from "axios";
import { ChatContainer, MessageList, Message, MainContainer, MessageInput} from '@chatscope/chat-ui-kit-react';

export const Chat = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "¡Hola! ¿En qué puedo ayudarte?" },
  ]);
  const [userInput, setUserInput] = useState("");

  const context = "Tu tarea principal es ayudar a clientes a escoger un ordenador o portátil que se ajuste a sus necesidades, si la pregunta se sale de este propósito, debes rechazarla, siendo las únicas excepciones que te saluden o pregunten sobre tus capacidades; debes ser más o menos conciso pero cordial y amigable. La pregunta viene después de los dos puntos: ";

  // Función para llamar a la API de Gemini
  const callGeminiAPI = async (userMessage) => {
    const apiKey = "AIzaSyDUkMu1fnBh62ySNQa4SyFZYxbYfoPkwcs"; // Reemplaza con tu API Key
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
    
    try {
      const response = await axios.post(
        `${url}?key=${apiKey}`,
        {
          contents: [
            {
              parts: [{ text: `${context} ${userMessage}` }], // Estructura del payload según la API
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Respuesta completa de la API:", response.data); // Para depuración

      // Extraer la respuesta generada por la API

      console.log(response.data?.candidates?.[0]?.content?.parts?.[0]?.text);
      return (
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Lo siento, no tengo una respuesta en este momento."
      );
    } catch (error) {
      console.error(
        "Error al llamar a la API de Gemini:",
        error.response?.data || error.message
      );
      return "Hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.";
    }
  };

  // Manejo del envío de mensajes
  const handleSendMessage = async () => {
    if (userInput.trim() === "") return;

    // Agregar mensaje del usuario
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: userInput },
    ]);

    // Mostrar mensaje de "procesando"
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "bot", text: "Estoy procesando tu mensaje..." },
    ]);

    try {
      // Llamar a la API de Gemini
      const botResponse = await callGeminiAPI(userInput);

      // Agregar respuesta del bot
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1), // Eliminar el mensaje "procesando"
        { sender: "bot", text: botResponse },
      ]);
    } catch (error) {
      // Mostrar mensaje de error al usuario
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        { sender: "bot", text: "Hubo un error al procesar tu mensaje." },
      ]);
    }

    setUserInput(""); // Limpiar el input
  };

  return (
    <MainContainer 
    responsive
    style={{
      height: '600px'
    }}>
      <ChatContainer>
        <MessageList autoScrollToBottom>
          {messages.map((message, index) => {
            <div key={index}>
              <Message model={{
                message: message.text,
                sender: message.sender
              }}/>
            </div>
          })}
        </MessageList>
        <MessageInput placeholder="Type message here" attachButton={false} value={userInput} onChange={(textContent) => setUserInput(textContent)} onSend={handleSendMessage}/>
      </ChatContainer>
    </MainContainer>
  );
}