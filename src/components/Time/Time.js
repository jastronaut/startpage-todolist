import React from 'react';
import './style.css';

export default class Time extends React.Component {
	constructor(props) {
		super(props);
		const { hours, minutes, amPM, greeting } = this.cr8D8();
		this.state = {
			hours: hours,
			minutes: minutes,
			amPM: amPM,
			greeting: greeting,
		};

		const d = new Date();
		this.dateStr = d.toDateString();

		this.upd8();
	}

	cr8D8() {
		const d = new Date();
		const baseHours = d.getHours();
		const mins =
			d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
		const hours = baseHours === 12 ? 12 : baseHours % 12;
		const amPM = baseHours >= 12 ? 'PM' : 'AM';
		const greeting =
			baseHours >= 12
				? baseHours > 16
					? 'Good evening.'
					: 'Good afternoon'
				: 'Good morning.';
		return {
			hours: hours,
			minutes: mins,
			amPM: amPM,
			greeting: greeting,
		};
	}

	upd8() {
		setInterval(() => {
			const { hours, minutes, amPM, greeting } = this.cr8D8();

			this.setState({
				minutes: minutes,
				hours: hours,
				amPM: amPM,
				greeting: greeting,
			});
		}, 6000);
	}

	render() {
		return (
			<section className='time-area'>
				<h1 className='clock'>
					{this.state.hours}:{this.state.minutes}{' '}
					<span className='ampm'>{this.state.amPM}</span>
				</h1>
				<p className='date-str'>{this.dateStr}</p>
				<p className='greeting'>{this.state.greeting}</p>
			</section>
		);
	}
}
