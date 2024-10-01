import { Editor } from "@tiptap/react";
import {
  Bold,
  Code,
  CodepenIcon,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";

const TipTapMenuBar = ({ editor }: { editor: Editor }) => {
  const isActive = (type, opts = {}) => editor.isActive(type, opts);

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded ${
            isActive("bold")
              ? "bg-gray-200 text-black"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <Bold className="w-5 h-5" />
        </button>
        <span className="ml-2 text-sm hidden sm:inline">Bold</span>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${
            isActive("italic")
              ? "bg-gray-200 text-black"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <Italic className="w-5 h-5" />
        </button>
        <span className="ml-2 text-sm hidden sm:inline">Italic</span>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`p-2 rounded ${
            isActive("strike")
              ? "bg-gray-200 text-black"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <Strikethrough className="w-5 h-5" />
        </button>
        <span className="ml-2 text-sm hidden sm:inline">Strike</span>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={`p-2 rounded ${
            isActive("code")
              ? "bg-gray-200 text-black"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <Code className="w-5 h-5" />
        </button>
        <span className="ml-2 text-sm hidden sm:inline">Code</span>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded ${
            isActive("heading", { level: 1 })
              ? "text-black"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <Heading1 className="w-5 h-5" />
        </button>
        <span className="ml-2 text-sm hidden sm:inline">Heading 1</span>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded ${
            isActive("heading", { level: 2 })
              ? "bg-gray-200 text-black"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <Heading2 className="w-5 h-5" />
        </button>
        <span className="ml-2 text-sm hidden sm:inline">Heading 2</span>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded ${
            isActive("heading", { level: 3 })
              ? "bg-gray-200 text-black"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <Heading3 className="w-5 h-5" />
        </button>
        <span className="ml-2 text-sm hidden sm:inline">Heading 3</span>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${
            isActive("bulletList")
              ? "bg-gray-200 text-black"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <List className="w-5 h-5" />
        </button>
        <span className="ml-2 text-sm hidden sm:inline">Bullet List</span>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded ${
            isActive("orderedList")
              ? "bg-gray-200 text-black"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <ListOrdered className="w-5 h-5" />
        </button>
        <span className="ml-2 text-sm hidden sm:inline">Ordered List</span>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded ${
            isActive("codeBlock")
              ? "bg-gray-200 text-black"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <CodepenIcon className="w-5 h-5" />
        </button>
        <span className="ml-2 text-sm hidden sm:inline">Code Block</span>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded ${
            isActive("blockquote")
              ? "bg-gray-200 text-black"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <Quote className="w-5 h-5" />
        </button>
        <span className="ml-2 text-sm hidden sm:inline">Blockquote</span>
      </div>
      <div className="my-2 border-t border-gray-200"></div>
      <div className="flex items-center">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-2 rounded text-gray-500 hover:bg-gray-100"
        >
          <Undo className="w-5 h-5" />
        </button>
        <span className="ml-2 text-sm hidden sm:inline">Undo</span>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-2 rounded text-gray-500 hover:bg-gray-100"
        >
          <Redo className="w-5 h-5" />
        </button>
        <span className="ml-2 text-sm hidden sm:inline">Redo</span>
      </div>
    </div>
  );
};

export default TipTapMenuBar;