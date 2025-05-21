import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';

interface CodeEditorProps {
  code: string;
  language?: 'python' | 'javascript';
  readOnly?: boolean;
  onChange?: (code: string) => void;
  height?: string;
  className?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language = 'python',
  readOnly = false,
  onChange,
  height = '300px',
  className = ''
}) => {
  const [value, setValue] = useState(code);
  
  const handleValueChange = (code: string) => {
    setValue(code);
    onChange && onChange(code);
  };
  
  const highlight = (code: string) => {
    return Prism.highlight(code, Prism.languages[language], language);
  };
  
  return (
    <div 
      className={`font-mono text-sm border border-border rounded-md overflow-hidden ${className}`}
      style={{ height }}
    >
      <Editor
        value={value}
        onValueChange={readOnly ? () => {} : handleValueChange}
        highlight={highlight}
        padding={16}
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          height: '100%',
          backgroundColor: 'var(--color-card-muted)',
          color: 'var(--color-foreground)',
          overflow: 'auto'
        }}
        readOnly={readOnly}
        className="code-editor"
      />
    </div>
  );
};