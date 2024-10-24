import { KeyboardEvent, memo, useState } from "react";

type EditableSpanPropsType = {
  editableText: string;
  setEditableText: (text: string) => void;
};
export const EditableSpan: React.FC<EditableSpanPropsType> = memo(
  ({ editableText, setEditableText }: EditableSpanPropsType) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editText, setEditText] = useState(editableText);
    const onKeyPressHandler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setEditMode(false);
        setEditableText(editText);
      } else if (e.key === "Escape") {
        setEditMode(false);
      }
    };
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "10px",
          marginRight: "5px",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        {editMode ? (
          <input
            autoFocus
            type='text'
            value={editText}
            onChange={(e) => setEditText(e.currentTarget.value)}
            onKeyUp={(e) => {
              onKeyPressHandler(e);
            }}
            onBlur={() => {
              setEditMode(false);
              setEditText(editableText);
            }}
          />
        ) : (
          <span onDoubleClick={() => setEditMode(true)}>{editableText}</span>
        )}
      </div>
    );
  }
);
