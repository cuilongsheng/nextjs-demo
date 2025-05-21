import { useRef } from "react";
import Editor from "@monaco-editor/react";
import { twMerge } from "tailwind-merge";

export type Language =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "html"
  | "css"
  | "json"
  | "markdown";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: Language;
  readOnly?: boolean;
  className?: string;
  height?: string;
  label?: string;
}

export const CodeEditor = ({
  value,
  onChange,
  language = "javascript",
  readOnly = false,
  className,
  height = "300px",
  label,
}: CodeEditorProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditorMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // 配置TypeScript/JavaScript的智能提示
    if (language === "javascript" || language === "typescript") {
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });

      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
      });
    }

    // 聚焦编辑器
    editor.focus();
  };

  return (
    <div className="w-full">
      {label && <div className="mb-2 text-sm font-medium">{label}</div>}
      <div className={twMerge("border rounded-md overflow-hidden", className)}>
        <Editor
          height={height}
          language={language}
          value={value}
          onChange={(val) => onChange?.(val || "")}
          onMount={handleEditorMount}
          options={{
            readOnly,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: "off",
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            parameterHints: { enabled: true },
            snippetSuggestions: "inline",
            wordBasedSuggestions: "allDocuments",
            automaticLayout: true,
            tabSize: 2,
            fontSize: 14,
            fontFamily: "JetBrains Mono, Menlo, Monaco, monospace",
            padding: { top: 12, bottom: 12 },
          }}
          theme="vs-light"
        />
      </div>
    </div>
  );
};
