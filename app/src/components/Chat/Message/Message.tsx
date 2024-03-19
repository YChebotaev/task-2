import { observer } from "mobx-react-lite";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { type SerializedEditorState } from "lexical";
import { DirectMessage as DirectMessageStore } from "../../../stores/DirectMessage";
import { Root } from "./styled";
import { useUser } from "../../UserProvider";

export const Message = observer(
  ({ message }: { message: DirectMessageStore }) => {
    const user = useUser();

    return (
      <Root $ltr={user.id === message.authorId}>
        <LexicalComposer
          initialConfig={{
            namespace: "comment-content",
            editable: false,
            editorState(editor) {
              const state = editor.parseEditorState(
                message.content as SerializedEditorState,
              );

              editor.setEditorState(state);
            },
            onError(e) {
              console.error(e);
            },
          }}
        >
          <RichTextPlugin
            placeholder={null}
            contentEditable={<ContentEditable />}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </LexicalComposer>
      </Root>
    );
  },
);
