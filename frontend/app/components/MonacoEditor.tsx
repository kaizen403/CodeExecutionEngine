"use client";
import React, { useEffect, useRef, useCallback } from "react";
import * as monaco from "monaco-editor";

interface MonacoEditorProps {
  language: string;
  code: string;
  onChange: (newCode: string) => void;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  language,
  code,
  onChange,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorChange = useCallback(() => {
    if (monacoRef.current) {
      const newCode = monacoRef.current.getValue();
      onChange(newCode);
    }
  }, [onChange]);

  useEffect(() => {
    if (editorRef.current) {
      monacoRef.current = monaco.editor.create(editorRef.current, {
        value: code,
        language: language,
        theme: "vs-dark",
      });

      monacoRef.current.onDidChangeModelContent(handleEditorChange);
    }

    return () => {
      if (monacoRef.current) {
        monacoRef.current.dispose();
      }
    };
  }, [language, handleEditorChange]);

  useEffect(() => {
    if (monacoRef.current && monacoRef.current.getValue() !== code) {
      const model = monaco.editor.createModel(code, language);
      monacoRef.current.setModel(model);
    }
  }, [code, language]);

  return <div ref={editorRef} style={{ height: "400px", width: "100%" }} />;
};

export default MonacoEditor;
