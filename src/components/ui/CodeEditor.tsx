import { useRef } from "react";
import Editor, { type OnChange } from "@monaco-editor/react";
import { twMerge } from "tailwind-merge";

export type Language =
  | "python"
  | "javascript"
  | "java"
  | "solidity"
  | "rust"
  | "go"
  | "typescript"
  | "markdown";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: Language;
  readOnly?: boolean;
  className?: string;
}

export const CodeEditor = ({
  value,
  onChange,
  language = "javascript",
  readOnly = false,
  className,
}: CodeEditorProps) => {
  const editorRef = useRef<unknown>(null);

  const handleEditorDidMount = (editor: unknown) => {
    editorRef.current = editor;
  };

  const handleChange: OnChange = (value) => {
    onChange?.(value || "");
  };

  return (
    <div
      className={twMerge(
        "h-[300px] border border-gray-300 rounded-lg overflow-hidden",
        className
      )}
    >
      <Editor
        height="100%"
        defaultLanguage={language}
        value={value}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        theme="vs-light"
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: "on",
          roundedSelection: false,
          scrollbar: {
            vertical: "visible",
            horizontal: "visible",
          },
          automaticLayout: true,
          wordWrap: "on",
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 3,
          glyphMargin: false,
          folding: true,
          lineHeight: 24,
          padding: { top: 16, bottom: 16 },
          renderLineHighlight: "all",
          renderWhitespace: "selection",
          contextmenu: true,
          quickSuggestions: true,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: "on",
          tabSize: 2,
          insertSpaces: true,
          detectIndentation: true,
          trimAutoWhitespace: true,
          bracketPairColorization: {
            enabled: true,
          },
          guides: {
            bracketPairs: true,
            indentation: true,
            highlightActiveIndentation: true,
          },
        }}
      />
    </div>
  );
};
