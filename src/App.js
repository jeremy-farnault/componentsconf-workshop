import React, { useEffect, useState, useReducer } from "react";
import { API } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react";

const initialState = {
  coins: [],
  isLoading: true
};

function reducer(state, action) {
  switch (action.type) {
    case "SETCOINS":
      return { ...state, coins: action.coins };
    case "LOADED":
      return { ...state, isLoading: false };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      // const data = await API.get('cryptoapi', '/coins')
      const data = await API.get("cryptoapi", "/coins?limit=5&start=100");
      console.log("data from Lambda REST API: ", data);
      dispatch({ type: "SETCOINS", coins: data.coins });
      dispatch({ type: "LOADED" });
    } catch (err) {
      console.log("error fetching data..", err);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {state.isLoading ? (
        <div>Loading</div>
      ) : (
        <div>
          {state.coins.map((c, i) => (
            <div key={i}>
              <h2>{c.name}</h2>
              <p>{c.price_usd}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default withAuthenticator(App, { includeGreetings: true });
