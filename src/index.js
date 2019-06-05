import React from 'react';
import './App.css';
import ReactDOM from 'react-dom';
import './index.css';
import './dropdown.css';
import * as serviceWorker from './serviceWorker';
import { BookOpen, Code, Youtube, Cpu, Book } from 'react-feather';
import request from 'request';

// function Tabs() {
// 	return (
// 		<section>
// 			<a href='#'>time</a>
// 			<a href='#'>todo</a>
// 		</section>
// 	);
// }

function Icon() {
	return (
		<div className='icons'>
			<a className='ico' href='https://developer.mozilla.org/en-US/docs/Web/CSS/Reference#Keyword_index' alt='css reference'><Code /></a>
			<a className='ico' href='https://news.ycombinator.com' alt='hacker news'><BookOpen /></a>
			<a className='ico' href='https://0x00sec.org' alt='0x00sec'><Cpu /></a>
			<a className='ico' href='http://piazza.com/' alt='piazza'><Book /></a>
			<a className='ico' href='https://www.youtube.com/feed/subscriptions'><Youtube /></a>
		</div>
	);
}

function Todo(props) {
	return(
		<div className={props.cname} onClick={props.onClick}>{props.value}</div>
	);
}

class TodoArea extends React.Component {
	render() {
		const todoList = this.props.todoTodos.map((val, index) => (<Todo cname='td td-todo' key={val} value={val} onClick={() => this.props.onClick(val)} />));
		const doneList = this.props.todosDone.map((val, index) => (<Todo cname='td td-done' key={val} value={val} onClick={() => this.props.onClick(val)} />));
		return (
			<section className='todos'>
				{todoList}
				{doneList}
			</section>
			
		);
	}
}

function TimeArea() {
	let d = new Date();
	// creating my own time format so i have control over text colors
	return (
	<section>
		<h1 className='clock'>{d.getHours() === 12 ? 12 : d.getHours() % 12}:{ d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()} <span className='ampm'>{d.getHours() >= 12 ? 'PM' : 'AM'}</span></h1>
		<p className="date-str">{d.toDateString()}</p>
		<p className='greeting'>{d.getHours() >= 12 ? (d.getHours() > 16 ? 'Good evening.' : 'Good afternoon') : 'Good morning.'}</p>
	</section>
	);
}

function Suggestion(props) {
	return (
		<p onClick={props.onClick}>{props.value}</p>
	);
}


class Dropdown extends React.Component {
	render() {
		// render list of dropdown items thru props
		const suggestions = this.props.suggestions.map((val, index) => (<Suggestion key={val} value={val} onClick={() => this.props.onClick(val)} />));

		return (
				<div className='dd-content'>
				{suggestions}
				</div>
		);
	}
}

class StartPage extends React.Component {
	constructor(props) {
		super(props);
		this.storage = window.localStorage;
		this.state = this.loadState();
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleClearDone = this.handleClearDone.bind(this);
		this.handleClearAll = this.handleClearAll.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.handleSearchInput = this.handleSearchInput.bind(this);
		this.onClickSuggestion = this.onClickSuggestion.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	loadState() {
		let st = {
			newTodo: '',
			search: '',
			suggestions: []
		};
		if (this.storage.getItem('todosDone')) {
			st.todosDone = this.storage.getItem('todosDone').split(',');
		} else {
			st.todosDone = [];
		}

		if (this.storage.getItem('todoTodos')) {
			st.todoTodos = this.storage.getItem('todoTodos').split(',');
		} else {
			st.todoTodos = [];
		}
		return st;
	}

	handleClick(i) {
		const todosDone = this.state.todosDone;
		const todoTodos = this.state.todoTodos;

		if (todosDone.indexOf(i) >= 0) { // if this task is already done, mark as undone
			todoTodos.push(i);
			todosDone.splice(todosDone.indexOf(i), 1);
		} else { // if this task has not been done, mark it as done
			todoTodos.splice(todoTodos.indexOf(i), 1);
			todosDone.push(i);	
		}
		this.storage.setItem('todoTodos', todoTodos);
		this.storage.setItem('todosDone', todosDone);
		this.setState({
			todoTodos: todoTodos,
			todosDone: todosDone
		});
	}

	handleInputChange(event) {
		this.setState({newTodo: event.target.value});
	}

	handleSubmit(event) {
		const newTodo = this.state.newTodo;
		const todoTodos = this.state.todoTodos;
		if (todoTodos.indexOf(newTodo) < 0) {
			todoTodos.push(newTodo);
			this.storage.setItem('todoTodos', todoTodos);
			this.setState({
				todoTodos: todoTodos,
			});
		}
		this.setState({newTodo: ''});
		event.preventDefault();
	}

	handleClearDone() {
		this.setState({
			todosDone: []
		});
		this.storage.setItem('todosDone', '');
	}

	handleClearAll() {
		this.setState({
			todosDone: []
		});
		this.storage.setItem('todosDone', '');
		this.setState({
			todoTodos: []
		});
		this.storage.setItem('todoTodos', '');
	}

	handleSearchInput(event) {
		this.setState({
			search: event.target.value
		});

		if (this.state.search === '') {
			this.setState({suggestions: []});
			return;
		}

		// http://api.bing.com/osjson.aspx?query=

		request('http://api.bing.com/osjson.aspx?query=' + encodeURIComponent(event.target.value), {json: true}, (err, res, body) => {
			if (err) {
				return;
			}
			this.setState({suggestions: body[1].slice(0, 5)});
		});

	}

	searchRedirect(search) {
		// i use bing for microsoft rewards points :~)
		window.location.replace("https://www.bing.com/search?q=" + encodeURIComponent(search) + "&adlt=strict");
	}

	onClickSuggestion(i) {
		this.searchRedirect(i);
	}

	handleSearch(event) {
		const search = this.state.search.trim();
		// look for "valid" url and direct to it if entered, otherwise search for query

		// valid url needs: http/s protocol, .com/net/org/edu, no whitespace
		var websiteQuery = RegExp(/http(s{0,1}):\/\/(\S)+\.(com|net|org|edu)\S{0,}$/);
		if (websiteQuery.test(search)) {
			window.location.replace(search);
		} else {
			this.searchRedirect(search);
			
		}
		event.preventDefault();
	}

	handleKeyPress(event) {
		// clear search bar when escape is pressed
		if (event.keyCode === 27) {
			this.setState({search: '', suggestions: []});
		}
	}

	render() {
		return (
			<section>
				<TimeArea />
				
				{/* search bar area */}
				<form onSubmit={this.handleSearch}>
					<div className='dropdown'>
					<input autoCorrect="off" className='search' autoFocus type='text' placeholder='search' value={this.state.search} onChange={this.handleSearchInput} onKeyDown={(event) => this.handleKeyPress(event)} />
					<Dropdown suggestions={this.state.suggestions} onClick={i => this.onClickSuggestion(i)} />
					</div>
				</form>
				
				{/* todolist input area */}
				<form onSubmit={this.handleSubmit}>
					<input autoCorrect="off" type='text' placeholder='todo' value={this.state.newTodo} onChange={this.handleInputChange} />
				</form>

				{/* actual todolist */}
				<TodoArea todoTodos={this.state.todoTodos} todosDone={this.state.todosDone} onClick={i => this.handleClick(i)} />
				<div className='clear-todos' onClick={this.handleClearDone}>clear done</div>
				<div className='clear-todos' onClick={this.handleClearAll}>clear all</div>
				<Icon />
			</section>
		);
	}
}


ReactDOM.render(<StartPage />, document.getElementById('time'));

serviceWorker.unregister();
