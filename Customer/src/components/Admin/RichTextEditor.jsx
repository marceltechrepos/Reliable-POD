import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useEffect, useState } from "react";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    List,
    ListOrdered,
    Code,
    Image as ImageIcon,
    Link as LinkIcon,
    Undo,
    Redo,
} from "lucide-react";
// import { useState, useEffect } from "react";


const btn =
    "px-2 py-1 rounded hover:bg-gray-300 transition text-sm font-semibold text-gray-700";

const activeBtn =
    "px-2 py-1 rounded bg-gray-400 text-gray-700 text-sm font-semibold";


const RichTextEditor = ({ value, onChange }) => {
    const [linkModal, setLinkModal] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [urlInput, setUrlInput] = useState("");

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: true,
                orderedList: true,
                listItem: true,
            }),
            Underline,
            Link,
            Image,
        ],

        content: value || "",
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (!editor) return;
        if (value !== editor.getHTML()) {
            editor.commands.setContent(value || "");
        }
    }, [value, editor]);

    if (!editor) return null;

    return (
        <div className="border rounded-md overflow-hidden bg-white">

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 px-2 py-1 bg-gray-200 ">

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive("bold") ? activeBtn : btn}
                    title="Bold"
                >
                    <Bold size={16} />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive("italic") ? activeBtn : btn}
                    title="Italic"
                >
                    <Italic size={16} />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={editor.isActive("underline") ? activeBtn : btn}
                    title="Underline"
                >
                    <UnderlineIcon size={16} />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={editor.isActive("strike") ? activeBtn : btn}
                    title="Strike"
                >
                    <Strikethrough size={16} />
                </button>

                <span className="mx-1 h-4 w-[1px] bg-black/20" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={
                        editor.isActive("bulletList")
                            ? "p-2 rounded bg-gray-400 text-gray-700"
                            : "p-2 rounded hover:bg-gray-300 text-gray-700"
                    }
                    title="Bullet list"
                >
                    <List size={16} />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={
                        editor.isActive("orderedList")
                            ? "p-2 rounded bg-gray-400 text-gray-700"
                            : "p-2 rounded hover:bg-gray-300 text-gray-700"
                    }
                    title="Numbered list"
                >
                    <ListOrdered size={16} />
                </button>

                <span className="mx-1 h-4 w-[1px] bg-black/20" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={editor.isActive("codeBlock") ? activeBtn : btn}
                    title="Code block"
                >
                    <Code size={16} />
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setUrlInput("");
                        setImageModal(true);
                    }}
                    className={btn}
                    title="Image"
                >
                    <ImageIcon size={16} />
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setUrlInput("");
                        setLinkModal(true);
                    }}

                    className={editor.isActive("link") ? activeBtn : btn}
                    title="Link"
                >
                    <LinkIcon size={16} />
                </button>

                <span className="mx-1 h-4 w-[1px] bg-black/20" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    className={btn}
                    title="Undo"
                >
                    <Undo size={16} />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    className={btn}
                    title="Redo"
                >
                    <Redo size={16} />
                </button>

            </div>

            {/* Editor */}
            <EditorContent
                editor={editor}
                className="
    min-h-[180px]
    px-3 py-2
    text-sm

    focus:outline-none

    [&_[contenteditable='true']]:outline-none
    [&_[contenteditable='true']:focus]:outline-none

    [&_ul]:list-disc
    [&_ul]:pl-6

    [&_ol]:list-decimal
    [&_ol]:pl-6

    [&_li]:mb-1
  "
            />


            {linkModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg w-[360px] p-4">
                        <h3 className="text-sm font-semibold mb-3">Insert link</h3>

                        <input
                            type="url"
                            placeholder="https://example.com"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setLinkModal(false)}
                                className="px-3 py-1 text-sm rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => {
                                    if (!urlInput.trim()) return;
                                    editor.chain().focus().setLink({ href: urlInput }).run();
                                    setLinkModal(false);
                                }}
                                className="px-3 py-1 text-sm rounded bg-gray-800 text-white hover:bg-gray-700"
                            >
                                Insert
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {imageModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg w-[360px] p-4">
                        <h3 className="text-sm font-semibold mb-3">Insert image</h3>

                        <input
                            type="url"
                            placeholder="https://image-url.com/image.jpg"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setImageModal(false)}
                                className="px-3 py-1 text-sm rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => {
                                    if (!urlInput.trim()) return;
                                    editor.chain().focus().setImage({ src: urlInput }).run();
                                    setImageModal(false);
                                }}
                                className="px-3 py-1 text-sm rounded bg-gray-800 text-white hover:bg-gray-700"
                            >
                                Insert
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default RichTextEditor;
