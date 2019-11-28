import React from 'react';
import './App.css';
import './index.css';
import './dropdown.css';
import { REDDIT_USERNAME } from './secret.js';

import TodoArea from './components/Todos';
import Icons from './components/Icons';
import Time from './components/Time';

function Suggestion(props) {
	return <p onClick={props.onClick}>{props.value}</p>;
}

class Dropdown extends React.Component {
	render() {
		// render list of dropdown items thru props
		const suggestions = this.props.suggestions.map((val, index) => (
			<Suggestion
				key={val}
				value={val}
				onClick={() => this.props.onClick(val)}
			/>
		));

		return <div className='dd-content'>{suggestions}</div>;
	}
}

class StartPage extends React.Component {
	constructor(props) {
		super(props);
		this.storage = window.localStorage;
		this.state = {
			suggestions: [],
			search: '',
		};
		this.handleSearch = this.handleSearch.bind(this);
		this.handleSearchInput = this.handleSearchInput.bind(this);
		this.onClickSuggestion = this.onClickSuggestion.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	async getSuggestions(query) {
		// http://api.bing.com/osjson.aspx?query=
		try {
			const resp = await fetch(
				'https://cors-anywhere.herokuapp.com/http://api.bing.com/osjson.aspx?query=' +
					encodeURIComponent(query),
				{
					method: 'GET',
				}
			);
			const autocompleteSuggestions = await resp.json();
			this.setState({
				suggestions: autocompleteSuggestions[1].slice(0, 5),
			});
		} catch (err) {
			console.log('oops');
		}
	}

	handleSearchInput(event) {
		const query = event.target.value;

		this.setState({
			search: query,
		});

		if (query === '') {
			this.setState({ suggestions: [] });
			return;
		}

		this.getSuggestions(query);
	}

	searchRedirect(search) {
		// i use bing for microsoft rewards points :~)
		window.location.replace(
			'https://www.duckduckgo.com/?q=' + encodeURIComponent(search)
		);
	}

	onClickSuggestion(i) {
		this.searchRedirect(i);
	}

	redirectToShortcuts(query, event) {
		event.preventDefault();
		switch (query) {
			case 'mess':
				window.location.replace('https://www.messenger.com/');
				return;
			case 'redd':
				window.location.replace('https://www.reddit.com/');
				return;
			case 'paper':
				window.location.replace('https://paper.dropbox.com/');
				return;
			case 'news':
				window.location.replace('https://news.ycombinator.com/news');
				return;
			case 'yt':
				window.location.replace(
					'https://invidio.us/feed/subscriptions'
				);
				return;
			case 'feed':
				window.location.replace(
					'https://www.reddit.com/user/' +
						REDDIT_USERNAME +
						'/m/lyfe/'
				);
				return;
			case 'css':
				window.location.replace(
					'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference#Keyword_index'
				);
				return;
			case 'canvas':
				window.location.replace('https://canvas.eee.uci.edu/');
				return;
			case 'mail':
				window.location.replace('https://mail.protonmail.com/login');
				return;
			default:
				break;
		}

		// subreddit lookup
		const redditRE = /^r\/[a-zA-Z0-9]+$/;
		if (redditRE.exec(query)) {
			window.location.replace('https://www.reddit.com/' + query);
			return;
		}
	}

	handleSearch(event) {
		const query = this.state.search.trim();
		event.preventDefault();

		if (query.length < 1) return;

		if (query.charAt(0) === ':') {
			this.redirectToShortcuts(query.substr(1, query.length - 1), event);
			return;
		}

		// look for "valid" url and direct to it if entered, otherwise search for query

		// valid url needs: http/s protocol, .com/net/org/edu, no whitespace
		const websiteRE = /http(s{0,1}):\/\/(\S)+\.(com|net|org|edu)\S{0,}$/;
		if (websiteRE.exec(query)) {
			window.location.replace(query);
		} else {
			this.searchRedirect(query);
		}
	}

	handleKeyPress(event) {
		// clear search bar when escape is pressed
		if (event.keyCode === 27 || event.target.value === '') {
			this.setState({ search: '', suggestions: [] });
		}
	}

	render() {
		return (
			<section className='app'>
				<Time />

				{/* search bar area */}
				<form onSubmit={this.handleSearch}>
					<div className='dropdown'>
						<input
							autoCorrect='off'
							className='search'
							autoFocus
							type='text'
							placeholder='search'
							value={this.state.search}
							onChange={this.handleSearchInput}
							onKeyDown={event => this.handleKeyPress(event)}
						/>
						<Dropdown
							suggestions={this.state.suggestions}
							onClick={i => this.onClickSuggestion(i)}
						/>
					</div>
				</form>

				<TodoArea />
				<Icons />
			</section>
		);
	}
}

export default StartPage;
