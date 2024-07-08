"use client";
import React, { useState, useCallback, useEffect } from "react";
import LanguageSelector from "@components/LanguageSelector";
import CodeEditor from "@components/CodeEditor";
import SaveButton from "@components/SaveButton";
import ExecuteButton from "@components/ExecuteButton";
import axios from "axios";

interface FileState {
  [key: string]: string;
}

const Home: React.FC = () => {
  const [language, setLanguage] = useState<string>("nodejs");
  const [files, setFiles] = useState<FileState>({});
  const [output, setOutput] = useState<string>("");
  const [showEditor, setShowEditor] = useState<boolean>(false);

  const handleNext = useCallback(async () => {
    try {
      const response = await axios.get(`/api/template/${language}`);
      setFiles(response.data);
      setShowEditor(true);
    } catch (error) {
      console.error("Error fetching template:", error);
    }
  }, [language]);

  const handleFileChange = useCallback((filename: string, newCode: string) => {
    setFiles((prevFiles) => ({
      ...prevFiles,
      [filename]: newCode,
    }));
  }, []);

  const handleResult = (result: string) => {
    setOutput(result);
  };

  useEffect(() => {
    console.log("Home component state:", {
      language,
      files,
      output,
      showEditor,
    });
  }, [language, files, output, showEditor]);

  return (
    <div>
      {showEditor ? (
        <>
          <LanguageSelector language={language} onSelect={setLanguage} />
          {Object.keys(files).map((filename) => (
            <CodeEditor
              key={filename}
              language={language}
              code={files[filename] || ""}
              onChange={(newCode) => handleFileChange(filename, newCode)}
            />
          ))}
          <SaveButton code={JSON.stringify(files)} language={language} />
          <ExecuteButton
            code={JSON.stringify(files)}
            language={language}
            onResult={handleResult}
          />
          <div>
            <h3>Output:</h3>
            <pre>{output}</pre>
          </div>
        </>
      ) : (
        <>
          <LanguageSelector language={language} onSelect={setLanguage} />
          <button onClick={handleNext}>Next</button>
        </>
      )}
    </div>
  );
};

export default Home;
