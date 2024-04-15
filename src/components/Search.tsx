
import { useState } from 'react';

interface SearchProps {
  onSearch: (name: string) => void; 
}

export default function Search({ onSearch }: SearchProps) {

  const [search, setSearch] = useState('');

  return (
    <>
    Rechercher un Pokemon :&nbsp; 
    <input 
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)} 
      onKeyUp={(e) => {
          if (e.key === 'Enter') {
            onSearch(search);
        }
      }}
    />
    </>
  );

}