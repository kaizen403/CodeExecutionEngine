"use client";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";

// Dynamically import CodeMirror to ensure it is only loaded on the client side
const CodeMirrorEditor = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
});
interface CodeEditorProps {
  language: string;
  code: string;
  onChange: (newCode: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  code,
  onChange,
}) => {
  useEffect(() => {
    console.log("CodeEditor props:", { language, code, onChange });
  }, [language, code, onChange]);

  return (
    <div className="code-editor-container">
      <CodeMirrorEditor
        value={code || ""}
        height="400px"
        extensions={[language === "nodejs" ? javascript() : python()]}
        onChange={(value, viewUpdate) => {
          onChange(value);
        }}
      />
    </div>
  );
};

export default CodeEditor;
