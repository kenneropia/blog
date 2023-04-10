import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function DraftEditor({
  content,
  handleEditorChange,
}: {
  content: EditorState;
  handleEditorChange: (editorState: EditorState) => void;
}) {
  return (
    <div className="border-2">
      <Editor
        editorClassName="h-100"
        editorState={content}
        onEditorStateChange={handleEditorChange}
      />
    </div>
  );
}
