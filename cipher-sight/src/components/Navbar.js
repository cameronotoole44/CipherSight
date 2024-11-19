import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PokemonDialog from '../components/visualization/PokeDialog';
import HomeIcon from '../assets/home.png';
import PcIcon from '../assets/computer.png'
import CatIcon from '../assets/black-cat.png';
import AlienIcon from '../assets/alien.png';
import AlgorithmIcon from '../assets/algorithm.png';

const StartMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [pokemonData, setPokemonData] = useState(null);

    const toggleMenu = () => setIsOpen(!isOpen);

    const fetchRandomCat = async () => {
        try {
            const response = await fetch('https://api.thecatapi.com/v1/images/search');
            const data = await response.json();
            window.open(data[0].url, '_blank');
        } catch (error) {
            console.error('Error fetching cat:', error);
        }
    };

    const fetchRandomPokemon = async () => {
        try {
            const randomId = Math.floor(Math.random() * 151) + 1;
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
            const data = await response.json();
            setPokemonData(data);
        } catch (error) {
            console.error('Error fetching Pokemon:', error);
        }
    };

    return (
        <div className="start-menu-container">
            <button
                onClick={toggleMenu}
                className={`start-button ${isOpen ? 'active' : ''}`}
            > <img src={PcIcon} alt="computer" className="menu-icon" />
                Start
            </button>

            {isOpen && (
                <div className="start-menu">
                    <div className="start-menu-sidebar">
                        <span className="windows-text">Cipher Sight 24</span>
                    </div>

                    <ul className="start-menu-items">
                        <li>
                            <Link to="/" className="menu-item" onClick={toggleMenu}>
                                <img src={HomeIcon} alt="Home" className="menu-icon" />
                                <span>Home</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/algorithm" className="menu-item" onClick={toggleMenu}>
                                <img src={AlgorithmIcon} alt="Algorithms" className="menu-icon" />
                                <span>Algorithms</span>
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={async () => {
                                    await fetchRandomCat();
                                    toggleMenu();
                                }}
                                className="menu-item"
                            >
                                <img src={CatIcon} alt="Random Cat" className="menu-icon" />
                                <span>Cat Time</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={async () => {
                                    await fetchRandomPokemon();
                                    toggleMenu();
                                }}
                                className="menu-item"
                            >
                                <img src={AlienIcon} alt="Random Pokemon" className="menu-icon" />
                                <span>Pokemon</span>
                            </button>
                        </li>
                    </ul>
                </div>
            )}

            {pokemonData && (
                <PokemonDialog
                    pokemon={pokemonData}
                    onClose={() => setPokemonData(null)}
                />
            )}
        </div>
    );
};

const Navbar = () => {
    const [time, setTime] = useState('');

    React.useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }));
        };

        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="navbar-title">
                        Visualizer
                    </div>
                </div>
            </nav>
            <div className="taskbar">
                <StartMenu />
                <div className="taskbar-title">
                    Algorithm Visualizer
                </div>
                <div className="taskbar-time">
                    {time}
                </div>
            </div>
        </>
    )
};

export default Navbar;