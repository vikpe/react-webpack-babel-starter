import React from 'react';
import 'assets/scss/App.scss';
import AboutPage from 'components/AboutPage';
import WelcomePage from 'components/WelcomePage';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="app">
          <nav>
            <Link to="/">Home</Link> | <Link to="/about">About</Link>
          </nav>
          <hr />
          <Routes>
            <Route exact path="/" element={<WelcomePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
