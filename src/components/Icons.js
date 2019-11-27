import React from 'react';
import { BookOpen, Code, Book } from 'react-feather';

export default function Icons() {
	return (
		<div className='icons'>
			<a
				className='ico'
				href='https://developer.mozilla.org/en-US/docs/Web/CSS/Reference#Keyword_index'
				alt='css reference'
			>
				<Code />
			</a>
			<a
				className='ico'
				href='https://news.ycombinator.com'
				alt='hacker news'
			>
				<BookOpen />
			</a>
			<a className='ico' href='http://piazza.com/' alt='piazza'>
				<Book />
			</a>
		</div>
	);
}
