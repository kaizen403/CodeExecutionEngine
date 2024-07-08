import React from "react";
import axios from "axios";

interface SaveButtonProps {
  code: string;
  language: string;
}

const SaveButton: React.FC<SaveButtonProps> = ({ code, language }) => {
  const handleSave = async () => {
    const filename = language === "javascript" ? "code.json" : "code.json";
    await axios.post("/api/save", { code, filename });
    alert("Code saved!");
  };

  return <button onClick={handleSave}>Save</button>;
};

export default SaveButton;
