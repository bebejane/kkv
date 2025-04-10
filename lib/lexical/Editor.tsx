import { $getRoot, $getSelection } from 'lexical';
import { useEffect, useState } from 'react';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

const theme = {
	// Theme styling goes here
	//...
};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error) {
	console.error(error);
}

function OnChangePlugin({ onChange }) {
	// Access the editor through the LexicalComposerContext
	const [editor] = useLexicalComposerContext();
	// Wrap our listener in useEffect to handle the teardown and avoid stale references.
	useEffect(() => {
		// most listeners return a teardown function that can be called to clean them up.
		return editor.registerUpdateListener(({ editorState }) => {
			// call onChange here to pass the latest state up to the parent.
			onChange(editorState);
		});
	}, [editor, onChange]);
	return null;
}

export default function Editor() {
	const [editorState, setEditorState] = useState();
	function onChange(editorState) {
		setEditorState(editorState);
	}
	const initialConfig = {
		namespace: 'MyEditor',
		theme,
		onError,
	};

	return (
		<LexicalComposer initialConfig={initialConfig}>
			<RichTextPlugin
				contentEditable={
					<ContentEditable
						aria-placeholder={'Enter some text...'}
						placeholder={<div>Enter some text...</div>}
					/>
				}
				ErrorBoundary={LexicalErrorBoundary}
			/>
			<HistoryPlugin />
			<AutoFocusPlugin />
			<OnChangePlugin onChange={onChange} />
		</LexicalComposer>
	);
}
