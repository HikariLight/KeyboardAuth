import React from 'react';
import './About.css';

class About extends React.Component {
    render () {
        return (
            <div>
                <h1 id="title"> About us ! </h1>
                <h2 id="title2"> Reconnaître quelqu'un sur sa manière de taper au clavier. </h2>
                <p id ="paragraph"> Le "Keystroke Dynamics", c'est à dire la dynamique de frappe au clavier, 
                    permet de reconnaître un individu en fonction de ses caractéristiques. 
                    Ainsi, on peut identifier de manière continu un individu. Par exemple, 
                    si on oublie de se déconnecter et que quelqu'un vient sur notre ordinateur, 
                    commence à frapper, alors on reconnaît que ce n'est plus la même personne 
                    et l'application se bloque. <br/> L'objectif du projet est de proposer une interface web, fonctionnant sur clavier, 
                    voire tablette tactile, permettant de différencier l'utilisateur original des 
                    autres, puis éventuellement identifier un individu parmis plusieurs enregistré.</p>
                <h2 id="title2"> Rapport : </h2>
                <h2 id="title2"> Diaporama : </h2>
                <h2 id="title2"> GitHub : https://github.com/HikariLight/KeyboardAuth</h2>
            </div>
        );
    }
}

export default About;