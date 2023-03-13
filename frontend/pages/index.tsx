import React from "react";
import styles from "../styles/Home.module.css";

interface Result {
  _id: string;
  _source: {
    book: {
      name: string;
      abbreviation: string;
    };
    content: string;
    character_count: string;
    chapter_number: string;
    verse_number: string;
    word_count: string;
  }
}

export default function Home() {
  const [query, setQuery] = React.useState("");
  const [recentSearches, setRecentSearches] = React.useState<string[]>([])
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [results, setResults] = React.useState<Result[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResults([]);
    setQuery(event.target.value);
  }

  const handleSearch = async (event: React.FormEvent, searchQuery?: string) => {
    event.preventDefault();
    const abort = new AbortController();

    setRecentSearches(prev => [...new Set([query, ...prev].filter(Boolean))].slice(0,3));
    setQuery("");

    const request = await fetch(`/api/v1/bible?query=${searchQuery ?? query}`, {
      signal: abort.signal
    });

    if (request.ok) {
      const response = await request.json();
      setResults(response.data);
    } else {
      setResults([]);
    }
  }

  React.useEffect(() => {
    const abort = new AbortController();

    const timer = setTimeout(async () => {
      const request = await fetch(`/api/v1/bible/suggestion?query=${query}`, {
        signal: abort.signal
      });

      if (request.ok) {
        const response = await request.json();
        setSuggestions(response.data);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      abort.abort();
    }
  }, [query]);

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSearch}>
        <input 
          className={styles.input}
          onChange={handleChange}
          value={query}
        />
        <button className={styles.button}>
          Search
        </button>
      </form>
      <div>
        {!query.length && (
          <div>
            <h3>Recent Searches</h3>
            {recentSearches.map(item => (
              <button 
                className={styles.suggestion}
                key={item}
                onClick={(event) => {
                  setQuery(item);
                  handleSearch(event, item);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        )}
        {!!query.length && suggestions && (
          <div>
            <h3>Suggestions</h3>
            {suggestions.map(item => (
              <button 
                className={styles.suggestion}
                key={item}
                onClick={(event) => {
                  setQuery(item);
                  handleSearch(event, item);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
      {!!results.length && (
        <div>
          <h2>Results</h2>
          {results.map(item => (
            <div key={item._id}>
              <h3>{item._source.book.abbreviation} {item._source.chapter_number}:{item._source.verse_number}</h3>
              <p>{item._source.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
