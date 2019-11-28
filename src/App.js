import React from 'react';
import './App.css';
import './index.css';

import Todos from './components/Todos';
import Icons from './components/Icons';
import Time from './components/Time';
import Search from './components/Search';

class StartPage extends React.Component {
	render() {
		return (
			<section className='app'>
				<Time />
				<Search />
				<Todos />
				<Icons />
			</section>
		);
	}
}

export default StartPage;
