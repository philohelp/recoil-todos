import React, { useState } from "react";
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
const { uuid } = require("uuidv4");

export default () => {
  const todoListState = atom({
    key: "todoListState",
    default: [],
  });

  const todoListFilterState = atom({
    key: "todoListFilterState",
    default: "Show All",
  });

  const filteredTodoListState = selector({
    key: "filteredTodoListState",
    get: ({ get }) => {
      const filter = get(todoListFilterState);
      const list = get(todoListState);

      switch (filter) {
        case "Show Completed":
          return list.filter((item) => item.isComplete);
        case "Show Uncompleted":
          return list.filter((item) => !item.isComplete);
        default:
          return list;
      }
    },
  });

  const todoListStatsState = selector({
    key: "todoListStatsState",
    get: ({ get }) => {
      const todoList = get(filteredTodoListState);
      const totalNum = todoList.length;
      const totalCompletedNum = todoList.filter((item) => item.isComplete)
        .length;
      const totalUncompletedNum = totalNum - totalCompletedNum;
      const percentCompleted =
        totalNum === 0 ? 0 : totalCompletedNum / totalNum;

      return {
        totalNum,
        totalCompletedNum,
        totalUncompletedNum,
        percentCompleted,
      };
    },
  });

  const todoList = useRecoilValue(filteredTodoListState);

  return (
    <div style={{ margin: 50, maxWidth: 600 }}>
      <div style={{ marginBottom: 10 }}>
        <TodoListFilters />
      </div>
      <div style={{ marginBottom: 10 }}>
        <TodoItemCreator />
      </div>

      {todoList.map((todoItem) => (
        <div key={todoItem.id}>
          <TodoItem item={todoItem} />
        </div>
      ))}
      <div style={{ marginTop: 50 }}>
        <TodoListStats />
      </div>
    </div>
  );

  function TodoItemCreator() {
    const [inputValue, setinputValue] = useState("");
    const setTodoList = useSetRecoilState(todoListState);

    const addItem = () => {
      setTodoList((oldTodoList) => [
        ...oldTodoList,
        {
          id: uuid(),
          text: inputValue,
          isComplete: false,
        },
      ]);
    };

    const onChange = ({ target: { value } }) => {
      setinputValue(value);
    };

    return (
      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={inputValue}
          onChange={onChange}
        />
        <button onClick={addItem}>
          Add
        </button>
      </div>
    );
  }

  function TodoItem({ item }) {
    const [todoList, setTodoList] = useRecoilState(todoListState);
    const index = todoList.findIndex((listItem) => listItem === item);

    const editItemText = ({ target: { value } }) => {
      const newList = replaceItemAtIndex(todoList, index, {
        ...item,
        text: value,
      });

      setTodoList(newList);
    };

    const toggleItemCompletion = () => {
      const newList = replaceItemAtIndex(todoList, index, {
        ...item,
        isComplete: !item.isComplete,
      });

      setTodoList(newList);
    };

    const deleteItem = () => {
      const newList = removeItemAtIndex(todoList, index);

      setTodoList(newList);
    };

    return (
      <div style={{ display: "flex" }}>
        <div>
          <input
            type="checkbox"
            checked={item.isComplete}
            onChange={toggleItemCompletion}
          />
          <input type="text" value={item.text} onChange={editItemText} />
          <button onClick={deleteItem}>X</button>
        </div>
      </div>
    );
  }

  function TodoListFilters() {
    const [filter, setFilter] = useRecoilState(todoListFilterState);

    const updateFilter = ({ target: { value } }) => {
      setFilter(value);
    };

    return (
      <>
        <select value={filter} onChange={updateFilter}>
          <option value="Show All">All</option>
          <option value="Show Completed">Completed</option>
          <option value="Show Uncompleted">Uncompleted</option>
        </select>
      </>
    );
  }

  function TodoListStats() {
    const {
      totalNum,
      totalCompletedNum,
      totalUncompletedNum,
      percentCompleted,
    } = useRecoilValue(todoListStatsState);

    const formattedPercentCompleted = Math.round(percentCompleted * 100);

    return (
      <ul>
        <li>Total items: {totalNum}</li>
        <li>Items completed: {totalCompletedNum}</li>
        <li>Items not completed: {totalUncompletedNum}</li>
        <li>Percent completed: {formattedPercentCompleted}</li>
      </ul>
    );
  }

  function replaceItemAtIndex(arr, index, newValue) {
    // Si index = 3, renvoie la partie jusqu'à 3, le nouvel item, la partie après 3+1 => 4
    return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
  }

  function removeItemAtIndex(arr, index) {
    // renvoie la partie avant et la partie après.
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
  }
};
