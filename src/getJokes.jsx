import React, { useState } from "react";
import { v1 as uuid } from "uuid";
import axios from "axios";

import setIsLoading from "./setIsLoading.jsx"


export const getJokes = ( numJokesToGet ) => {
    try {
      // load jokes one at a time, adding not-yet-seen jokes
      const [ jokes, setJokes ] = useState([]);
      const [ seenJokes, setSeenJokes ] = useState(new Set());

      while (jokes.length < numJokesToGet) {
        const addtoJokes = async () => {let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        setJokes(jokes => [...jokes, { ...res.data }])

        if (!seenJokes.has(joke.id)) {
            setSeenJokes(seenJokes => [ ...seenJokes, joke.id ])
            setJokes(jokes => { ...joke, votes: 0 })
        } else {
          console.log("duplicate found!");
        }
      }
      this.setState({ jokes, isLoading: false });
    } catch (err) {
      console.error(err);
    }
  }