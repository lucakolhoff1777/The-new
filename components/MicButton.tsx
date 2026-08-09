"use client";

import { useRef, useState } from "react";

interface MicButtonProps {
  onTranscript: (text: string) => void;
}

export function MicButton({ onTranscript }: MicButtonProps) {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [unsupported, setUnsupported] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const recognitionRef = useRef<any>(null);

  function stop() {
    recognitionRef.current?.stop();
  }

  function start() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setUnsupported(true);
      return;
    }

    setPermissionDenied(false);
    const recognition = new SpeechRecognition();
    recognition.lang = "de-DE";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          const text = result[0].transcript.trim();
          if (text) onTranscript(text);
        } else {
          interimText += result[0].transcript;
        }
      }
      setInterim(interimText);
    };

    recognition.onerror = (event: any) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setPermissionDenied(true);
      }
      setListening(false);
      setInterim("");
    };

    recognition.onend = () => {
      setListening(false);
      setInterim("");
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  function toggle() {
    if (listening) {
      stop();
    } else {
      start();
    }
  }

  if (unsupported) {
    return (
      <span className="text-xs text-slate-400">
        Diktieren wird von diesem Browser nicht unterstützt (Chrome empfohlen).
      </span>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        className={
          "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors " +
          (listening
            ? "border-red-300 bg-red-50 text-red-700"
            : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50")
        }
      >
        <span
          className={
            "h-2 w-2 rounded-full " + (listening ? "animate-pulse bg-red-500" : "bg-slate-400")
          }
        />
        {listening ? "Aufnahme läuft – antippen zum Stoppen" : "Diktieren"}
      </button>
      {listening && interim && (
        <span className="min-w-0 truncate text-xs italic text-slate-400">{interim}</span>
      )}
      {permissionDenied && (
        <span className="text-xs text-red-600">Mikrofonzugriff wurde nicht erlaubt.</span>
      )}
    </div>
  );
}
