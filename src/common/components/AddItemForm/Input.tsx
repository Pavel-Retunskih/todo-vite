import React from "react";
import { ChangeEvent, useState } from "react";

type InputPropsType = {
  addItem: (title: string) => void;
};
export const Input = React.memo(function Input({ addItem }: InputPropsType) {
  const [text, setText] = useState<string>("");

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.currentTarget.value);
  };

  const onSubmitHandler = (title: string) => {
    addItem(title);
    setText("");
  };
  return (
    <div style={{ marginBottom: "15px" }}>
      <input type='text' value={text} onChange={(e) => onChangeHandler(e)} />
      <button onClick={() => onSubmitHandler(text)}>+</button>
    </div>
  );
});
