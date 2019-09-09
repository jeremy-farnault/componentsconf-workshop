import React, { useEffect, useState, useReducer } from "react";
import { API, Auth } from "aws-amplify";
import { withAuthenticator, S3Album } from "aws-amplify-react";
import { Storage, Analytics } from "aws-amplify";

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
  const [name, setName] = useState("");
  const [imageUrl, updateImage] = useState("");

  async function fetchImage() {
    const imagePath = await Storage.get("face.png");
    updateImage(imagePath);
  }

  useEffect(() => {
    getData();
  }, []);

  const getUser = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setName(user.username)
    } catch (err) {
      console.log("error getting user: ", err);
    }
  };
  getUser();

  const recordEvent = () => {
    Analytics.record({
      name: "My test event",
      attributes: {
        username: name
      }
    });
  };

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

  async function addToStorage() {
    await Storage.put(
      "javascript/MyReactComponent.js",
      `
    import React from 'react'
    const App = () => (
      <p>Hello World</p>
    )
    export default App
  `
    );
    console.log("data stored in S3!");
  }

  async function storeImage(e) {
    const file = e.target.files[0];
    await Storage.put("face.png", file);
    console.log("image successfully stored!");
  }

  return (
    <>
      <button onClick={recordEvent}>Record Event</button>
      <button onClick={addToStorage}>Add To Storage</button>
      <input type="file" accept="image" onChange={e => storeImage(e)} />
      <div>
        <img src={imageUrl} />
        <button onClick={fetchImage}>Fetch Image</button>
      </div>
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
      {/*<div>*/}
      {/*  <S3Album path={""} picker />*/}
      {/*</div>*/}
    </>
  );
}

export default withAuthenticator(App, { includeGreetings: true });
