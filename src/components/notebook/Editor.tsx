"use client";
import React, { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Text from "@tiptap/extension-text";
import { Node, mergeAttributes } from "@tiptap/core";
import { useDebounce } from "@/lib/useDebounce";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { NoteType } from "@/lib/db/schema";
import { useCompletion } from "ai/react";
import { Loader2, Upload, CheckCircle2 } from "lucide-react";

// Custom attachment node to handle file attachments with hidden data for rehydration
const Attachment = Node.create({
  name: "attachment",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      fileName: {
        default: "Untitled",
      },
      createdFileName: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="attachment"]',
        getAttrs: dom => ({
          src: dom.getAttribute("src"),
          fileName: dom.getAttribute("filename"),
          createdFileName: dom.getAttribute("createdfilename"),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'attachment', class: 'attachment p-2 bg-gray-100 rounded-md my-2' }),
      ['a', 
        {
          href: HTMLAttributes.src,
          download: HTMLAttributes.fileName,
          class: 'flex items-center space-x-2 no-underline text-blue-500 hover:no-underline !important hover:text-blue-700',
          style: 'text-decoration: none;',
        },
        ['span', { class: 'attachment-icon' }, '📎'],
        ['span', { class: 'font-medium' }, HTMLAttributes.fileName],
      ],
      ['div', { class: 'text-xs text-gray-500 mt-1' }, `Stored as: ${HTMLAttributes.createdFileName}`],
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div');
      dom.setAttribute('data-type', 'attachment');
      dom.classList.add('attachment', 'p-2', 'bg-gray-100', 'rounded-md', 'my-2');

      const link = document.createElement('a');
      link.href = node.attrs.src;
      link.download = node.attrs.fileName;
      link.classList.add('flex', 'items-center', 'space-x-2', 'text-blue-500', 'hover:text-blue-700');

      const icon = document.createElement('div');
      icon.textContent = '📄';
      icon.classList.add('attachment-icon');

      const fileName = document.createElement('span');
      fileName.textContent = node.attrs.fileName;
      fileName.classList.add('font-medium');

      link.appendChild(icon);
      link.appendChild(fileName);

      const storedAs = document.createElement('div');
      // storedAs.textContent = `Stored as: ${node.attrs.createdFileName}`;      
      storedAs.textContent = `Files will not be accessed or read as of Sept 2024`;
      storedAs.classList.add('text-xs', 'text-gray-500', 'mt-1');

      dom.appendChild(link);
      dom.appendChild(storedAs);

      return {
        dom,
      };
    };
  },
});

type Props = {
  note: NoteType;
  onEditorInit: (editor: any) => void;
  createQuiz: () => void;
};

const Editor: React.FC<Props> = ({ note, onEditorInit, createQuiz }) => {
  const [editorState, setEditorState] = useState(
    note?.editorState || `<h1>${note?.name || "New Note"}</h1>`
  );
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  const [isTabOnCooldown, setIsTabOnCooldown] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const { complete, completion } = useCompletion({
    api: "/api/completion",
  });

  const saveNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/saveNote", {
        noteId: note?.id,
        editorState,
      });
      return response.data;
    },
  });

  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        Tab: () => {
          if (isTabOnCooldown) return true;
          console.log("Shortcut triggered");
          const prompt = this.editor.getText().split(" ").slice(-30).join(" ");
          complete(prompt);
          setIsTabOnCooldown(true);
          setTimeout(() => setIsTabOnCooldown(false), 10000); // 10 second cooldown
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit, customText, Attachment],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor) {
      onEditorInit(editor);
    }
  }, [editor, onEditorInit]);

  const lastCompletion = useRef("");

  useEffect(() => {
    if (!completion || !editor) return;
    const diff = completion.slice(lastCompletion.current.length);
    lastCompletion.current = completion;
    editor.commands.insertContent(diff);
  }, [completion, editor]);

  const debouncedEditorState = useDebounce(editorState, 500);
  useEffect(() => {
    if (debouncedEditorState === "") return;
    saveNote.mutate(undefined, {
      onSuccess: (data) => {
        console.log("Note saved successfully:", data);
      },
      onError: (err) => {
        console.error("Error saving note:", err);
      },
    });
  }, [debouncedEditorState]);

  const handleCreateQuiz = async () => {
    setIsCreatingQuiz(true);
    try {
      await createQuiz();
    } finally {
      setIsCreatingQuiz(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    setUploadSuccess(false);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { downloadURL, fileName, createdFileName } = response.data;
      editor.chain().focus().insertContent({
        type: "attachment",
        attrs: { src: downloadURL, fileName: fileName, createdFileName: createdFileName },
      }).run();
      
      console.log('File uploaded:', { fileName, createdFileName, downloadURL });
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);  // Hide success message after 3 seconds
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div
      className="relative"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="w-full mt-4">
        <EditorContent
          editor={editor}
          spellCheck={false}
          className="prose prose-sm max-w-full leading-relaxed"
        />
      </div>
      <div className="absolute top-2 right-2 flex items-center space-x-2">
        {saveNote.isLoading ? (
          <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
        ) : (
          <CheckCircle2 className="h-5 w-5 text-green-500" title="Saved" />
        )}
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="h-5 w-5 text-gray-400" />
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
        </label>
      </div>
      <div className="h-4"></div>
      <span className="text-sm">
        Tip: Press{" "}
        <kbd
          className={`px-2 py-1.5 text-xs font-semibold text-gray-800 ${
            isTabOnCooldown ? "bg-gray-300" : "bg-gray-100"
          } border border-gray-200 rounded-lg transition-colors duration-200`}
        >
          Tab
        </kbd>{" "}
        for AI to autocomplete |{" "}
        <button
          onClick={handleCreateQuiz}
          disabled={isCreatingQuiz}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          {isCreatingQuiz ? (
            <div className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Quiz
            </div>
          ) : (
            "Click to Test your knowledge"
          )}
        </button>
      </span>
      {isUploading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      )}
    </div>
  );
};

export default Editor;
