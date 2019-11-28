import React, { useState, useEffect } from 'react';

const Todo = ({ text, done, onClick }) => (
	<div className={`td ${done ? 'td-done' : 'td-todo'}`} onClick={onClick}>
		{text}
	</div>
);

const TodoArea = () => {
	const [todos, setTodos] = useState([]);
	const [newTodo, setNewTodo] = useState('');

	useEffect(() => {
		const loadedTodos = window.localStorage.getItem('todos');
		if (!loadedTodos) return;

		setTodos(JSON.parse(loadedTodos));
	}, []);

	useEffect(() => {
		window.localStorage.setItem('todos', JSON.stringify(todos));
	}, [todos]);

	const toggleTodo = text => {
		const thisTodo = todos.filter(t => t.text === text);
		const otherTodos = todos.filter(t => t.text !== text);

		thisTodo[0].done = !thisTodo[0].done;

		if (thisTodo[0].done) {
			setTodos(otherTodos.concat(thisTodo));
		} else {
			setTodos(thisTodo.concat(otherTodos));
		}
	};

	const clearFinishedTodos = () => {
		setTodos(todos => todos.filter(t => !t.done));
	};

	const clearAllTodos = () => {
		setTodos([]);
	};

	const handleSubmit = event => {
		event.preventDefault();

		if (newTodo.length < 1) return;

		setTodos(todos => [{ text: newTodo, done: false }].concat(todos));
		setNewTodo('');
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<input
					autoCorrect='off'
					type='text'
					placeholder='todo'
					value={newTodo}
					onChange={e => setNewTodo(e.target.value)}
				/>
			</form>
			<section className='todos'>
				{todos.map(todo => (
					<Todo
						key={todo.text}
						{...todo}
						onClick={() => toggleTodo(todo.text)}
					/>
				))}
			</section>
			<div className='todo-controls'>
				<div className='clear-todos' onClick={clearFinishedTodos}>
					clear done
				</div>
				<div className='clear-todos' onClick={clearAllTodos}>
					clear all
				</div>
			</div>
		</>
	);
};

export default TodoArea;
