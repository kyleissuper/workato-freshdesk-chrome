//console.log(has_localstorage());
import api from './api.js'
import React from "react";
import ReactDOM from "react-DOM";
import Layout from './components/layout.js'

const app = document.createElement("div");
document.querySelector("body").appendChild(app);
const reactApp = ReactDOM.render(<Layout />, app);

const callback = (d) => {
  reactApp.setState(d);
};
api.run(callback);
