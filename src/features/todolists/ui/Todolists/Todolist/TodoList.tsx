import { memo, useEffect, useCallback } from "react";
import { setAppStatus } from "../../../../../app/model/appReducer";
import { Input } from "../../../../../common/components/AddItemForm/Input";
import { EditableSpan } from "../../../../../common/components/EditableSpan/EditableSpan";
import { TaskStatus } from "../../../../../common/enums/enums";
import {
  useAppSelector,
  useAppDispatch,
} from "../../../../../common/hooks/hooks";
import { DomainTodolist, FiltersType } from "../../../../../common/types/types";
import { TaskType } from "../../../api/todoApi";
import { tasksThunks } from "../../../model/tasksReducer";
import {
  todolistsThunks,
  changeTodoListFilterAC,
} from "../../../model/todoListsReducer";
import { Task } from "./Tasks/Task/Task";

type TodoListProps = {
  todolist: DomainTodolist;
};

export const TodoList: React.FC<TodoListProps> = memo(function TodoList({
  todolist,
}) {
  const { id, title, filter } = todolist;
  const tasks = useAppSelector((store) => store.tasks[id]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(tasksThunks.fetchTasks(id));
    dispatch(setAppStatus({ status: "succeeded" }));
  }, [dispatch]);

  const removeTodo = (todoId: string) => {
    dispatch(todolistsThunks.removeTodolist(todoId));
  };

  const editTodo = useCallback((newTitle: string) => {
    dispatch(todolistsThunks.changeTodoListTitle({ todolistId: id, newTitle }));
  }, []);
  const toggleTodoFilter = useCallback(
    (todolistId: string, filter: FiltersType) => {
      dispatch(changeTodoListFilterAC({ todolistId, filter }));
    },
    []
  );

  const addTask = useCallback((title: string) => {
    dispatch(tasksThunks.addTask({ todolistId: id, title }));
  }, []);

  const removeTask = useCallback((taskId: string) => {
    dispatch(tasksThunks.removeTask({ todolistId: id, taskId }));
  }, []);

  const editTask = useCallback((taskId: string, newTitle: string) => {
    dispatch(
      tasksThunks.updateTask({
        todolistId: id,
        taskId,
        taskRequestModel: { title: newTitle },
      })
    );
  }, []);
  const toggleTaskStatus = useCallback(
    (taskId: string, newStatus: TaskStatus) => {
      dispatch(
        tasksThunks.updateTask({
          todolistId: id,
          taskId,
          taskRequestModel: { status: newStatus },
        })
      );
    },
    []
  );

  function getFilteredTasks(filter: FiltersType) {
    switch (filter) {
      case "all":
        return tasks;
      case "completed":
        return tasks.filter((task: TaskType) => task.status === 2);
      case "current":
        return tasks.filter((task: TaskType) => task.status === 0);
    }
  }

  const filteredTasks = getFilteredTasks(filter);

  return (
    <div className='border border-blue-300 min-w[200px] min-h-52'>
      <div>
        <EditableSpan editableText={title} setEditableText={editTodo} />
        <button onClick={() => removeTodo(id)}>x</button>
      </div>
      <Input addItem={addTask} />
      {filteredTasks?.length === 0 ? (
        <span>No tasks</span>
      ) : (
        filteredTasks?.map((task: TaskType) => (
          <Task
            key={task.id}
            removeTask={removeTask}
            task={task}
            toggleTaskStatusCallBack={toggleTaskStatus}
            changeTaskTitleCallBack={editTask}
          />
        ))
      )}

      <div>
        <button onClick={() => toggleTodoFilter(id, "all")}>All</button>
        <button onClick={() => toggleTodoFilter(id, "completed")}>
          Completed
        </button>
        <button onClick={() => toggleTodoFilter(id, "current")}>Current</button>
      </div>
    </div>
  );
});
