import { Link, useParams } from 'react-router-dom';
import usePokeApi from "src/hooks/usePokeApi";


export default function PokemonDetails() {

  const { id } = useParams(); // get id from router params
  
  if (!id) return null;

  const { data: pokemon } = usePokeApi((api) => api.pokemon.getPokemonById(parseInt(id)));

  if (!pokemon) return <div>Chargement ...</div>;

  return (
    <>
    <div>
      <Link to="/">Retour à la liste</Link>
      <h1>{pokemon.name}</h1>
      <h2>Detail du Pokemon :</h2>
      <table>
        <tbody>
          <tr><td>Expérience</td><td>{pokemon.base_experience}</td></tr>
          <tr><td>Hauteur</td><td>{pokemon.height}</td></tr>
          <tr><td>Poids</td><td>{pokemon.weight}</td></tr>
        </tbody>
      </table>
      <h2>Abilitées: </h2>
      <table>
        <tbody>
        {pokemon.abilities.map((p) => (
             <tr key={p.ability.name}><td>{p.ability.name}</td></tr>
        ))}
        </tbody>
      </table>
    </div>
    </>
  );
}
