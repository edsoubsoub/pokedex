import { Pokemon, PokemonSpecies, PokemonType } from "pokenode-ts";
import usePokeApi, { getLocalizedName, resolveResources } from "src/hooks/usePokeApi";
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';

interface PokemonProps {
  pokemon: Pokemon,
  actionMethod?: (pokemon: Pokemon) => void
}

function Pokemon({ pokemon, actionMethod }: PokemonProps) {

  const { data: species } = usePokeApi((api) => api.utility.getResourceByUrl<PokemonSpecies>(pokemon.species.url));

  return species ? (
    <tr>
      <td width="1">
        <img
          src={pokemon.sprites.other?.["official-artwork"].front_default ?? "src/assets/pokeball.png"}
          style={{
            height: "3em",
          }}
        />
      </td>
      <td><Link to={`/pokemon/${pokemon.id}`}>{getLocalizedName(species)}</Link></td>
      {
        actionMethod && <td><button onClick={() => actionMethod(pokemon)}>{actionMethod.name == "addToTeam" ? "+" : "-"}</button></td>
      }
    </tr>
  ) : (
    <tr>
      <td width="1">
        <img
          src={"src/assets/pokeball.png"}
          style={{
            height: "3em",
          }}
        />
      </td>
      <td></td>
    </tr>
  );
}

// async function PokemonDamageTypes(types: string[]) {
//
//   const localizedTypes = await Promise.all(
//     types.map(async url => {
//       const type = usePokeApi((api) => api.utility.getResourceByUrl<PokemonType>(url));
//       return {
//         name: getLocalizedName(type),
//         names: type.names
//       };
//     })
//   );
//
//   return localizedTypes;
// }

interface PokemonTypeProps {
  type: {
    name: string,
    url: string
  };
}

function PokemonType({ type }: PokemonTypeProps) {

  const { data: pokemonType } = usePokeApi((api) => api.utility.getResourceByUrl<PokemonType>(type.url));
  

  if (!pokemonType) return null;
  

  console.log(pokemonType)

  // Malheureusement pas eu le temps de finir l'appel de cette méthode afin d'avoir les noms de types en Francais
  // L'appel de la methode usePokeApi me posais problème sur les hooks

  // PokemonDamageTypes(pokemonType.damage_relations.double_damage_to).then(types => {
  // });

  return pokemonType ? (
    <tr>
      <td width="20">
          {getLocalizedName(pokemonType)}
      </td>
      <td>
        <div>  
          <div style={{ backgroundColor: "grey"}}>
            Fait double dégat sur
          </div>
          <div>
            {pokemonType.damage_relations.double_damage_to.map((type: {name: string}) => type.name).join(", ")}
          </div>
        </div>
        <div>
          <div style={{ backgroundColor: "grey"}}>
            Prend double domage contre
          </div>
          <div>
            {pokemonType.damage_relations.double_damage_from.map((type: {name: string}) => type.name).join(", ")}
          </div>
        </div>
      </td>
    </tr>
  ) : null
}

interface PokemonListProps {
  search: string;
}


export default function PokemonList({ search }: PokemonListProps) {
  
  let pokemons = null;
  const [myTeam, setMyTeam] = useState<Pokemon[]>([]);
  const [typesTeam, setTypesTeam] = useState<object[]>([]);


  useEffect(() => {
    // Get all pokemons types from my team
    setTypesTeam(myTeam.reduce((acc, pokemon) => {
      acc = acc.concat(pokemon.types.map((type) => type.type))
      return acc;
    }, [])
    // Then clean duplicates
    .filter((value, index, array) => 
        index == array.findIndex(item => (item as any).name == (value as any).name)));
  }, [myTeam]);

  function addToTeam(pokemon: Pokemon) {
    // Doesn't allow more than 6 poke in a team
    if (myTeam.length >= 6) return
    // Add the pokemon only if it's not already present in the the team
    myTeam.find(poke => pokemon.id === poke.id) ? null : setMyTeam(myTeam => [...myTeam, pokemon]);
  }

  function delFromTeam(pokemon: Pokemon) {
    // remove the pokemon by filtering the actual team list
    setMyTeam(myTeam => [...myTeam.filter(poke => poke.id !== pokemon.id)]);
  }

  // If search is defined, we use getPokemonByName methode to fetch the result
  if (search) {
    ({ data: pokemons } = usePokeApi((api) => api.pokemon.getPokemonByName(search).then(result => {
      return {results: [result]}
    }
    )));
  }else {
    ({ data: pokemons } = usePokeApi((api) => api.pokemon.listPokemons(0, 10).then(resolveResources<Pokemon>)));
  }

  if (!pokemons) return <div>Chargement ...</div>;

  return (
    <>
    <div style={{marginTop: "10px", marginBottom: "10px"}}>
    <div style={{display: "inline-block", marginRight: "20px"}}>
      <table border={1} style={{ background: "white", color: "blue", width: 400 }}>
        <thead><tr><th colSpan={3}>Pokedex</th></tr></thead>
        <tbody>
          {pokemons.results.map((p) => (
              <Pokemon key={p.id} pokemon={p} actionMethod={addToTeam}/>
          ))}
        </tbody>
      </table>
    </div>
    {myTeam.length &&
    <div style={{display: "inline-block", verticalAlign: "top"}}>
      <table border={1} style={{ background: "white", color: "blue", width: 400 }}>
        <thead><tr><th colSpan={3}>Mon équipe</th></tr></thead>
        <tbody>
          {myTeam.map((p) => (
              <Pokemon key={p.id} pokemon={p} actionMethod={delFromTeam}/>
          ))}
        </tbody>
      </table>
    </div>
    }
    {typesTeam.length &&
    <div style={{display: "inline-block", verticalAlign: "top"}}>
      <table border={1} style={{ background: "white", color: "blue", width: 400 }}>
        <thead><tr><th colSpan={3}>Mes stats</th></tr></thead>
        <tbody>
          {typesTeam.map((t) => (
              <PokemonType key={t.name} type={t} />
          ))}
        </tbody>
      </table>
    </div>
    }
    </div>
    </>
  );
}
