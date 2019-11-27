import React from 'react';

function Todo(props) {
	return (
		<div className={props.cname} onClick={props.onClick}>
			{props.value}
		</div>
	);
}

export default class TodoArea extends React.Component {
	render() {
		const todoList = this.props.todoTodos.map((val, index) => (
			<Todo
				cname='td td-todo'
				key={val}
				value={val}
				onClick={() => this.props.onClick(val)}
			/>
		));
		const doneList = this.props.todosDone.map((val, index) => (
			<Todo
				cname='td td-done'
				key={val}
				value={val}
				onClick={() => this.props.onClick(val)}
			/>
		));
		return (
			<>
				<section className='todos'>
					{todoList}
					{doneList}
				</section>
				<div className='todo-controls'>
					<div
						className='clear-todos'
						onClick={this.props.clearFinishedTodos}
					>
						clear done
					</div>
					<div
						className='clear-todos'
						onClick={this.props.clearTodos}
					>
						clear all
					</div>
				</div>
			</>
		);
	}
}
