'use client';

import s from './TipTapEditor.module.scss';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useCallback } from 'react';
import { FaBold, FaItalic, FaLink, FaListOl } from 'react-icons/fa';
import { Markdown } from 'tiptap-markdown';

const MenuBar = ({ editor }: { editor: Editor | null }) => {
	const setLink = useCallback(() => {
		if (!editor) return;
		const previousUrl = editor.getAttributes('link').href;
		const url = window.prompt('URL', previousUrl);

		// cancelled
		if (url === null) {
			return;
		}

		// empty
		if (url === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();
			return;
		}

		// update link
		editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
	}, [editor]);

	if (!editor) {
		return null;
	}

	return (
		<div className={s.menuBar}>
			<button
				type='button'
				onClick={() => editor.chain().focus().toggleBold().run()}
				disabled={!editor.can().chain().focus().toggleBold().run()}
				className={editor.isActive('bold') ? s.isActive : ''}
				aria-label='Bold'
			>
				<FaBold />
			</button>
			<button
				type='button'
				onClick={() => editor.chain().focus().toggleItalic().run()}
				disabled={!editor.can().chain().focus().toggleItalic().run()}
				className={editor.isActive('italic') ? s.isActive : ''}
				aria-label='Italic'
			>
				<FaItalic />
			</button>
			<button
				type='button'
				onClick={setLink}
				className={editor.isActive('link') ? s.isActive : ''}
				aria-label='Link'
			>
				<FaLink />
			</button>
			<button
				type='button'
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				className={editor.isActive('orderedList') ? s.isActive : ''}
				aria-label='Ordered List'
			>
				<FaListOl />
			</button>
		</div>
	);
};

type TipTapEditorProps = {
	initialValue?: string;
	onChange: (value: string) => void;
};

export default function TipTapEditor({ initialValue = '', onChange }: TipTapEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				// Disable heading as it's not requested and requires specific handling if needed
				heading: false,
				// Keep other StarterKit defaults like paragraph, bold, italic, list items etc.
				// Ensure orderedList is enabled (it is by default in StarterKit)
			}),
			Link.configure({
				openOnClick: false, // Don't open links when clicking in the editor
				autolink: true, // Automatically detect links
			}),
			Markdown.configure({
				// Enables the use of the Markdown shortcuts
				breaks: true,
			}),
		],
		content: initialValue,
		onUpdate: ({ editor }) => {
			onChange(editor.storage.markdown.getMarkdown()); // Pass HTML content up
		},
		editorProps: {
			attributes: {
				class: s.editorInput, // Add class for styling the editable area
			},
		},
	});

	return (
		<div className={s.editorWrapper}>
			<MenuBar editor={editor} />
			<EditorContent editor={editor} className={s.content} />
		</div>
	);
}
