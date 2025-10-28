// src/components/coding/CodeEditor.tsx

import { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Loader2 } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  theme?: 'vs-dark' | 'light';
  height?: string;
}

export const CodeEditor = ({ 
  value, 
  onChange, 
  language,
  theme = 'vs-dark',
  height = '100%'
}: CodeEditorProps) => {
  const editorRef = useRef<any>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    setIsEditorReady(true);
    
    // Focus editor
    editor.focus();
  };

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  // Map language IDs to Monaco language names
  const getMonacoLanguage = (lang: string): string => {
    const languageMap: { [key: string]: string } = {
      'JavaScript': 'javascript',
      'Python': 'python',
      'Java': 'java',
      'C++': 'cpp',
      'C': 'c',
      'C#': 'csharp',
      'TypeScript': 'typescript',
      'Go': 'go',
      'Rust': 'rust',
      'Ruby': 'ruby',
      'PHP': 'php',
      'Swift': 'swift',
      'Kotlin': 'kotlin',
    };
    return languageMap[lang] || 'javascript';
  };

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden border border-border">
      {!isEditorReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-card z-10">
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Loading editor...</span>
          </div>
        </div>
      )}
      <Editor
        height={height}
        language={getMonacoLanguage(language)}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme={theme}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          formatOnPaste: true,
          formatOnType: true,
          bracketPairColorization: {
            enabled: true
          },
          guides: {
            bracketPairs: true,
            indentation: true
          },
        }}
      />
    </div>
  );
};