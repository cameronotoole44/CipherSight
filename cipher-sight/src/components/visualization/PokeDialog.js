import React from 'react';

const PokemonDialog = ({ pokemon, onClose }) => {
    if (!pokemon) return null;


    const types = pokemon.types.map(type =>
        type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)
    ).join(' / ');

    const getStatPercentage = (baseStat) => (baseStat / 255) * 100;

    return (
        <div className="dialog-overlay">
            <div className="dialog-window">
                <div className="dialog-title-bar">
                    <span className="dialog-title">Pokemon Information</span>
                    <button className="dialog-close" onClick={onClose}>×</button>
                </div>
                <div className="dialog-content">
                    <div className="pokemon-header">
                        <img
                            src={pokemon.sprites.front_default}
                            alt={pokemon.name}
                            className="pokemon-sprite"
                        />
                        <div className="pokemon-basic-info">
                            <h2 className="pokemon-name">
                                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                            </h2>
                            <p>#{pokemon.id.toString().padStart(3, '0')}</p>
                            <p className="pokemon-type">{types}</p>
                        </div>
                    </div>

                    <div className="pokemon-stats">
                        <h3>Base Stats:</h3>
                        {pokemon.stats.map(stat => (
                            <div key={stat.stat.name} className="stat-row">
                                <span className="stat-name">
                                    {stat.stat.name.toUpperCase().replace('-', ' ')}:
                                </span>
                                <span className="stat-value">{stat.base_stat}</span>
                                <div className="stat-bar-container">
                                    <div
                                        className="stat-bar"
                                        style={{ width: `${getStatPercentage(stat.base_stat)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pokemon-details">
                        <div className="detail-row">
                            <span>Height:</span>
                            <span>{pokemon.height / 10}m</span>
                        </div>
                        <div className="detail-row">
                            <span>Weight:</span>
                            <span>{pokemon.weight / 10}kg</span>
                        </div>
                        <div className="detail-row">
                            <span>Base Experience:</span>
                            <span>{pokemon.base_experience}</span>
                        </div>
                    </div>

                    <div className="pokemon-abilities">
                        <h3>Abilities:</h3>
                        <ul>
                            {pokemon.abilities.map(ability => (
                                <li key={ability.ability.name}>
                                    {ability.ability.name.charAt(0).toUpperCase() +
                                        ability.ability.name.slice(1).replace('-', ' ')}
                                    {ability.is_hidden && ' (Hidden)'}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default PokemonDialog;
