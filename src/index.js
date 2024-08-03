import React, { useState } from "react";
import ReactDOM from "react-dom/client";
//import "./index.css";
//import App from "./App";
import App from "./App v4";
import StareRating from "./StareRating";
/* function Test() {
  const [movieReating, setmovieReating] = useState();
  return (
    <div>
      <StareRating onsetReat={setmovieReating} />
      <p>this movie hse reated {movieReating} rate</p>
    </div>
  );
} */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App v3 />
    {/*<StareRating
      maxRating={"5"}
      massega={["tirrva", "bad", "ok", "good", "amizing"]}
    />
    <Test />
    <StareRating maxRating={10} color="red" size={100} defultRating={3} />*/}
  </React.StrictMode>
);
