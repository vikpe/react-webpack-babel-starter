import * as React from "react";

require("!style-loader!css-loader!sass-loader!./App.scss");

const reactLogo = require('./react_logo.svg');

const App = () => (
    <div className="app">
        <h1>Hello World!</h1>
        <p>Foo to the bar</p>
        <img src={reactLogo}/>
    </div>
);

export default App;
