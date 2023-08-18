import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, changeTodo, fetchTodo, removeTodo } from "./features/todosSlice";
import { AppDispatch, RootState } from "./app/store";
import './index.css';


function App() {
  const todos = useSelector((state: RootState) => state.todos)

  const dispatch = useDispatch<AppDispatch>();

  const [text, setText] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setText(e.target.value)
  }

  const handleRemove = (id: string) => {
    dispatch(removeTodo(id))
  }

  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (text.trim()) {
      dispatch(addTodo(text))
    }
    setText('')
  };

  const handleCheckbox = (id: string, completed: boolean): void => {
    dispatch(changeTodo({id, completed}))
  }

  useEffect(() => {
    dispatch(fetchTodo());
  }, [])


  return (
    <div className="app">
      <div className="todos-form">
        <h1 className="todo-title">Todo</h1>
        <form className="todo-form" onSubmit={handleAddTodo}>
          <input className="todo-input" type='text' value={text} onChange={handleChange}/>
          <button className="add-button" type='submit'>add</button>
        </form>
        <ul className="todo-list">
          {todos.map((todo, index) => {
              if(todo.loading) {
                return <span className="todo-item">...</span>
              }
                return (
                  <li className="todo-item" key={todo._id}>
                    <input 
                      onChange={() => handleCheckbox(todo._id, todo.completed)}
                      type="checkbox"
                      checked={todo.completed} />
                    <span className="todo-number">{index + 1}</span>
                    <span className={todo.completed ? "checkOff checkOn" : "checkOff"}>{todo.text}</span>
                    <button className="remove-button" onClick={() => handleRemove(todo._id)}>x</button>
                  </li>
                );
        })}
      </ul>
      </div>
  </div>
  );
}

export default App
