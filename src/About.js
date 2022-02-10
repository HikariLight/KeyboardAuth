import React from 'react';
import './style/About.css';

class About extends React.Component {
    render () {
        return (
            <main>
                <h1> About</h1>
                <h2> Recognizing someone by their typing habits.</h2>
                <h2>Contributors</h2>
                <ul>
                    <li>MERZOUGUI Dhia</li>
                    <li>MERCIER Julien</li>
                </ul>
                <a href="https://github.com/HikariLight/KeyboardAuth">GitHub Repo</a>
            </main>
        );
    }
}

export default About;