import React, { useState, useEffect } from 'react';

import '../dropdown.css';
import { REDDIT_USERNAME } from '../secrets.js';

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

function redirectToShortcuts(query, event) {
	event.preventDefault();
	let url = '';

	// subreddit lookup
	const redditRE = /^r\/[a-zA-Z0-9]+$/;
	if (redditRE.exec(query)) {
		url = 'https://www.reddit.com/' + query;
	}

	switch (query) {
		case 'mess':
			url = 'https://www.messenger.com/';
			break;
		case 'redd':
			url = 'https://www.reddit.com/';
			break;
		case 'paper':
			url = 'https://paper.dropbox.com/';
			break;
		case 'news':
			url = 'https://news.ycombinator.com/news';
			break;
		case 'yt':
			url = 'https://invidio.us/feed/subscriptions';
			break;
		case 'feed':
			url = 'https://www.reddit.com/user/' + REDDIT_USERNAME + '/m/lyfe/';
			break;
		case 'css':
			url =
				'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference#Keyword_index';
			break;
		case 'canvas':
			url = 'https://canvas.eee.uci.edu/';
			break;
		case 'mail':
			url = 'https://mail.protonmail.com/login';
			break;
		default:
			break;
	}

	window.location.replace(url);
}

const Search = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [suggestions, setSuggestions] = useState([]);

	useEffect(() => {
		if (searchQuery === '' || searchQuery.charAt(0) === ':') {
			setSuggestions([]);
			return;
		}

		const getSuggestions = async () => {
			// http://api.bing.com/osjson.aspx?query=
			try {
				const resp = await fetch(
					'https://cors-anywhere.herokuapp.com/http://api.bing.com/osjson.aspx?query=' +
						encodeURIComponent(searchQuery),
					{
						method: 'GET',
					}
				);
				const autocompleteSuggestions = await resp.json();
				setSuggestions(autocompleteSuggestions[1].slice(0, 5));
			} catch (err) {
				console.log(err);
			}
		};

		getSuggestions();
	}, [searchQuery]);

	const searchRedirect = search => {
		// duckduckgo for privacy :)
		window.location.replace(
			'https://www.duckduckgo.com/?q=' + encodeURIComponent(search)
		);
	};

	const handleSearch = event => {
		const query = searchQuery.trim();
		event.preventDefault();

		if (query.length < 1) return;

		if (query.charAt(0) === ':') {
			redirectToShortcuts(query.substr(1, query.length - 1), event);
			return;
		}

		// look for "valid" url and direct to it if entered, otherwise search for query
		// very random list of tlds
		const websiteRE = /^(http[s{0,1}]:\/\/){0,1}\S+\.(com|net|org|edu|io)\S{0,}$/;
		const result = websiteRE.exec(query.trim());
		if (result) {
			// check if scheme in url and add https if not found
			if (result[1]) window.location.replace(query.trim());
			else window.location.replace('https://' + query.trim());
		} else {
			searchRedirect(query);
		}
	};

	const handleKeyPress = event => {
		// clear search bar when escape is pressed
		if (event.keyCode === 27) {
			setSearchQuery('');
			setSuggestions([]);
		}
	};

	return (
		<form onSubmit={handleSearch}>
			<div className='dropdown'>
				<input
					autoCorrect='off'
					className='search'
					autoFocus
					type='text'
					placeholder='search'
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
					onKeyDown={handleKeyPress}
				/>
				<Dropdown
					suggestions={suggestions}
					onClick={i => searchRedirect(i)}
				/>
			</div>
		</form>
	);
};

export default Search;
