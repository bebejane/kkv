'use client';

import s from './TipTapEditor.module.scss';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useCallback } from 'react';
import { FaBold, FaItalic, FaLink, FaListOl, FaListUl, FaMinus, FaHeading } from 'react-icons/fa';
import { Markdown } from 'tiptap-markdown';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Heading from '@tiptap/extension-heading';

type TipTapEditorProps = {
	initialValue?: string;
	onChange: (value: string) => void;
	controls?: boolean;
};

export default function TipTapEditor({
	initialValue = '',
	onChange,
	controls = true,
}: TipTapEditorProps) {
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
			HorizontalRule.configure({
				HTMLAttributes: {
					class: 'hr',
				},
			}),
			Heading.configure({
				levels: [2],
			}),
		],
		content: initialValue,
		onUpdate: ({ editor }) => {
			onChange(editor.storage.markdown.getMarkdown()); // Pass HTML content up
		},
		immediatelyRender: false,
		editorProps: {
			attributes: {
				class: s.editorInput, // Add class for styling the editable area
			},
		},
	});

	return (
		<div className={s.editor}>
			{controls && <MenuBar editor={editor} />}
			<EditorContent editor={editor} className={s.content} />
		</div>
	);
}

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
		<div className={s.menubar}>
			<button
				type='button'
				data-type='icon'
				onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
				disabled={!editor.can().chain().focus().toggleHeading({ level: 2 }).run()}
				className={editor.isActive('heading') ? s.isActive : ''}
				aria-label='Rubrik'
			>
				<FaHeading />
			</button>
			<button
				type='button'
				data-type='icon'
				onClick={() => editor.chain().focus().toggleBold().run()}
				disabled={!editor.can().chain().focus().toggleBold().run()}
				className={editor.isActive('bold') ? s.isActive : ''}
				aria-label='Fet'
			>
				<FaBold />
			</button>
			<button
				type='button'
				data-type='icon'
				onClick={() => editor.chain().focus().toggleItalic().run()}
				disabled={!editor.can().chain().focus().toggleItalic().run()}
				className={editor.isActive('italic') ? s.isActive : ''}
				aria-label='Kursiv'
			>
				<FaItalic />
			</button>
			<button
				type='button'
				data-type='icon'
				onClick={setLink}
				className={editor.isActive('link') ? s.isActive : ''}
				aria-label='Länk'
			>
				<FaLink />
			</button>
			<button
				type='button'
				data-type='icon'
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				className={editor.isActive('orderedList') ? s.isActive : ''}
				aria-label='Numrerad Lista'
			>
				<FaListOl />
			</button>
			<button
				type='button'
				data-type='icon'
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				className={editor.isActive('bulletList') ? s.isActive : ''}
				aria-label='Punktlista'
			>
				<FaListUl />
			</button>
			<button
				type='button'
				data-type='icon'
				onClick={() => editor.chain().focus().setHorizontalRule().run()}
				className={editor.isActive('horizontalRule') ? s.isActive : ''}
				aria-label='Horisontell linje'
			>
				<FaMinus />
			</button>
		</div>
	);
};
