import React, { useEffect, useState } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */
function JokeList({ numJokesToGet = 5 }) {

  const [ jokes, setJokes ] = useState([]);
  const [ seenJokes, setSeenJokes ] = useState(new Set());
  const [ isLoading, setIsLoading ] = useState(true);
  const [ error, setError ] = useState(null);

  /* at mount, get jokes */
  useEffect(() => {
    if (!isLoading) return;
    fetchJokes();
  }, [isLoading]);

  // Function to fetch jokes
  const fetchJokes = async () => {
    setIsLoading(true);
    setError(null);
    let fetchedJokes = [];
    try {
      while (fetchedJokes.length < numJokesToGet) {
        const res = await axios.get("https://icanhazdadjoke.com", 
          {
            headers: { Accept: "application/json" }
          });
          const joke = res.data

          if (!seenJokes.has(joke.id)) {
            seenJokes.add(joke.id);
            fetchedJokes.push({ ...joke, votes: 0 });
          }
        }
        setJokes(jokes => [ ...fetchedJokes]);
    }
    catch (err) {
      setError(err.message);
      console.error(err);
    }
    setIsLoading(false);
  };

  /* change vote for this id by delta (+1 or -1) */
  const vote = (id, delta) => {
    setJokes(jokes =>
      jokes.map(joke =>
        joke.id === id ? { ...joke, votes: joke.votes + delta } : joke
      )
    );
  };

  // Function to get new jokes (refresh list)
  const generateNewJokes = () => {
    setIsLoading(true); // This will trigger useEffect to refetch jokes.
  };

  if (error) {
    return <p>Error loading jokes: {error}</p>;
  }

  /* render: either loading spinner or list of sorted jokes. */
  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }
  
  // Sorting jokes
  const sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  return (
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={generateNewJokes}>
        Get New Jokes
      </button>
      {sortedJokes.map(joke => (
        <Joke
          text={joke.joke}
          key={joke.id}
          id={joke.id}
          votes={joke.votes}
          vote={vote}
          />
      ))}
    </div>
  );
}

export default JokeList;
