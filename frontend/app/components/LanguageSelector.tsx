import React from "react";

interface LanguageSelectorProps {
  language: string;
  onSelect: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  onSelect,
}) => {
  return (
    <select value={language} onChange={(e) => onSelect(e.target.value)}>
      <option value="nodejs">Node.js</option>
      <option value="python">Python</option>
    </select>
  );
};

export default LanguageSelector;
