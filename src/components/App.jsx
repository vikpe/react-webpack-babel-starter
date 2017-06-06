import React from "react";

// require("!style-loader!css-loader!sass-loader!./App.scss");

import css from "./App.scss";
console.log("css");
console.log(css);

const reactLogo = require('./react_logo.svg');

class App extends React.Component {
    render() {
        return <div className={css.app}>
            <h1>Hello World!</h1>
            <p>Foo to the bar</p>
            <img src={reactLogo}/>
        </div>;
    }
}

export default App;
