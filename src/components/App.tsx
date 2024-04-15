import PokemonList from "./PokemonList";
import PokemonDetails from "./PokemonDetails";
import { Routes, Route, BrowserRouter} from "react-router-dom";
import { useState } from 'react';
import Search from "./Search";

function Footer() {
  return (
    <table style={{ marginTop: "2em" }}>
      <tr>
        <td>
          <a href="https://pokenode-ts.vercel.app/">Doc API Pokemon</a>
        </td>
        <td>
          <a href="https://www.xplortechnologies.com/fr/travailler-chez-nous">Xplor Technologies</a>
        </td>
      </tr>
      <tr>
        <td colSpan={999}>
          © 1998 Pokémon.{" "}
          <a href="https://t.ly/uBmFu" rel="copyright">
            ©
          </a>{" "}
          1995–2023 Nintendo/Creatures Inc./GAME FREAK inc. Pokémon
        </td>
      </tr>
    </table>
  );
}

function App() {

  const [search, setSearch] = useState('');

  const handleSearch = (name: string) => {
    setSearch(name);
  }

  return (
    <>
      <img src="/src/assets/logo.png" width="800" />
      <h1 className="rainbow">Bienvenue sur le site des amis des pokemons</h1>
      <h5 className="blink">⭐ Yay ! ⭐</h5>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<><Search onSearch={handleSearch}/><PokemonList search={search}/></>} />
          <Route path="/pokemon/:id" element={<PokemonDetails />} />
        </Routes>
      </BrowserRouter>
      <br />
      <img src="/src/assets/pokedex.png" />
      <Footer />
    </>
  );
}

export default App;
