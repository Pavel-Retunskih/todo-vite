import { ChangeEvent, memo } from "react";

import { TaskType } from "../../../../../api/todoApi";
import { EditableSpan } from "../../../../../../../common/components/EditableSpan/EditableSpan";
import { TaskStatus } from "../../../../../../../common/enums/enums";

type TaskPropsType = {
  task: TaskType;
  toggleTaskStatusCallBack: (taskId: string, newStatus: TaskStatus) => void;
  changeTaskTitleCallBack: (taskId: string, newTittle: string) => void;
  removeTask: (taskId: string) => void;
};
export const Task = memo(
  ({
    task,
    toggleTaskStatusCallBack,
    changeTaskTitleCallBack,
    removeTask,
  }: TaskPropsType) => {
    const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
      let newStatus = e.currentTarget.checked;
      toggleTaskStatusCallBack(
        task.id,
        newStatus ? TaskStatus.Completed : TaskStatus.New
      );
    };

    const changeTaskTitleHandler = (newTitle: string) => {
      changeTaskTitleCallBack(task.id, newTitle);
    };
    return (
      <div style={{ marginBottom: "5px" }}>
        <input
          type='checkbox'
          checked={task.status === 2}
          onChange={(e) => changeTaskStatusHandler(e)}
        />
        <EditableSpan
          editableText={task.title}
          setEditableText={changeTaskTitleHandler}
        />
        <button
          onClick={() => {
            removeTask(task.id);
          }}
        >
          x
        </button>
      </div>
    );
  }
);
