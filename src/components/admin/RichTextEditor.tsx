import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useEffect, useRef, useState } from "react";
import { Bold, Italic, List, ListOrdered, Heading2, Heading3, Link as LinkIcon, Image as ImageIcon, Quote, Undo, Redo } from "lucide-react";
import { uploadToBucket } from "./ImageUploader";
import { toast } from "sonner";

export function RichTextEditor({
  name,
  defaultValue = "",
  bucket = "blogs",
}: {
  name: string;
  defaultValue?: string;
  bucket?: "blogs" | "tours" | "destinations" | "banners";
}) {
  const [html, setHtml] = useState(defaultValue);
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }),
      Image,
    ],
    content: defaultValue,
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[240px] px-4 py-3",
      },
    },
  });

  useEffect(() => () => editor?.destroy(), [editor]);

  if (!editor) return null;

  const Btn = ({ on, active, icon: Icon, label }: any) => (
    <button
      type="button"
      onClick={on}
      title={label}
      className={`p-1.5 rounded hover:bg-accent ${active ? "bg-accent text-primary" : ""}`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  async function pickImage(file: File) {
    try {
      const { url } = await uploadToBucket(file, bucket);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
    }
  }

  return (
    <div className="rounded-md border bg-background">
      <input type="hidden" name={name} value={html} />
      <div className="flex flex-wrap items-center gap-1 border-b p-1.5 bg-muted/30">
        <Btn label="Bold" icon={Bold} active={editor.isActive("bold")} on={() => editor.chain().focus().toggleBold().run()} />
        <Btn label="Italic" icon={Italic} active={editor.isActive("italic")} on={() => editor.chain().focus().toggleItalic().run()} />
        <Btn label="H2" icon={Heading2} active={editor.isActive("heading", { level: 2 })} on={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
        <Btn label="H3" icon={Heading3} active={editor.isActive("heading", { level: 3 })} on={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
        <Btn label="Bulleted" icon={List} active={editor.isActive("bulletList")} on={() => editor.chain().focus().toggleBulletList().run()} />
        <Btn label="Numbered" icon={ListOrdered} active={editor.isActive("orderedList")} on={() => editor.chain().focus().toggleOrderedList().run()} />
        <Btn label="Quote" icon={Quote} active={editor.isActive("blockquote")} on={() => editor.chain().focus().toggleBlockquote().run()} />
        <Btn
          label="Link"
          icon={LinkIcon}
          active={editor.isActive("link")}
          on={() => {
            const prev = editor.getAttributes("link").href ?? "";
            const url = window.prompt("URL", prev);
            if (url === null) return;
            if (url === "") return editor.chain().focus().unsetLink().run();
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
        />
        <Btn label="Image" icon={ImageIcon} on={() => fileRef.current?.click()} />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) pickImage(f);
            e.target.value = "";
          }}
        />
        <div className="ml-auto flex">
          <Btn label="Undo" icon={Undo} on={() => editor.chain().focus().undo().run()} />
          <Btn label="Redo" icon={Redo} on={() => editor.chain().focus().redo().run()} />
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
