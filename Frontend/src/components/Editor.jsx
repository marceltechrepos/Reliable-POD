import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Box } from "@mui/material";

export default function Editor() {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML(); // text + image
      console.log(html);
    },
  });

  return (
    <Box border="1px solid #ddd" p={2}>
      <EditorContent editor={editor} />
    </Box>
  );
}
