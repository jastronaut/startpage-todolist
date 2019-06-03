import {React, ReactComponent} from 'react';
import './App.css';
import './Tabs.css';
import ReactDOM from 'react-dom';
import './index.css';
import StartPage from './App';
import * as serviceWorker from './serviceWorker';
// import Bulma from 'bulma';

function Tabs() {
	return (
        <section>
            <a href='#'>time</a>
            <a href='#'>todo</a>
        </section>
	);
}

function App() {
	let d = new Date();
	return (
	<section>
		<h1 className='clock'>{d.getHours() % 12}:{ d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()} <span className='ampm'>{d.getHours() > 12 ? 'PM' : 'AM'}</span></h1>
		<p className="date-str">{d.toDateString()}</p>
		<p className='greeting'>{d.getHours() >= 12 ? (d.getHours() > 4 ? 'Good afteroon.' : 'Good evening') : 'Good morning.'}</p>
	  
	</section>
  );
}

class StartPage extends ReactComponent {
	constructor(props) {
		// super(props);
		console.log("hi");
		this.state = {
			cur: 'time'
		}
	}

	handleClick(i) {
		const current = this.state.cur;
		console.log(`old state: ${current}`);
		this.setState({
			cur : i
		});
		console.log(`old state: ${i}`);
	}

	render() {
		return (
			<section>
				<App />
			</section>
		)
	}
}


ReactDOM.render(<StartPage />, document.getElementById('time'));
// ReactDOM.render(<Tabs />, document.getElementById('tabs'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
