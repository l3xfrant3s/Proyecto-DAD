import 'regenerator-runtime';
import React, {useState, useEffect} from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

export const SpeechRecog = () => {

  const [transcriptText, setTranscriptText] = useState("");
  const [inputText, setInputText] = useState("");

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    setInputText(transcript);
  }, [transcript]);

  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  const handleStartListening = () => {
    resetTranscript()
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleSendText = (e) => {
    e.preventDefault();
    setTranscriptText(inputText);
  }

  return (
    <div id="recog">
      <div id="botonesRecog">
        <button onClick={handleSendText} disabled={!browserSupportsSpeechRecognition || listening}>Enviar</button>
        <button onClick={!listening? handleStartListening : handleStopListening} disabled={!browserSupportsSpeechRecognition}>{!listening?"🎤":"🔴"}</button>
      </div>
      <textarea value={inputText} onChange={handleChange} placeholder={browserSupportsSpeechRecognition? "Lo que sea, sin miedo": "Buscador no soportado"} disabled={!browserSupportsSpeechRecognition}/>
      <p>Lo que enviastes es:</p>
      <p>{transcriptText}</p>
    </div>
  );
}