import React from 'react';
import '!style-loader!css-loader!sass-loader!./../assets/scss/App.scss';
import reactLogo from './../assets/img/react_logo.svg';

class App extends React.PureComponent {
  render() {
    return (
        <div className="app">
          <h1>Hello World!</h1>
          <p>Foo to the bar</p>
          <img src={reactLogo} height="480"/>
        </div>
    );
  }
}

export default App;
