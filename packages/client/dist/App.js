import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import './App.css';
function App() {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch('http://localhost:4000/api/todos')
            .then(response => response.json())
            .then(data => {
            setTodos(data);
            setLoading(false);
        })
            .catch(error => {
            console.error('할 일을 가져오는 중 오류 발생:', error);
            setLoading(false);
        });
    }, []);
    return (_jsxs("div", { className: "container", children: [_jsx("h1", { children: "React + Express \uBAA8\uB178\uB808\uD3EC \uC571" }), loading ? (_jsx("p", { children: "\uB85C\uB529 \uC911..." })) : (_jsx("ul", { className: "todo-list", children: todos.map(todo => (_jsx("li", { className: todo.completed ? 'completed' : '', children: todo.title }, todo.id))) }))] }));
}
export default App;
