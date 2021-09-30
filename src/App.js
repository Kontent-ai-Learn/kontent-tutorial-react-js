import React from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
// You'll add these two Article components in a moment
import ArticleListing from "./ArticleListing";
import ArticleView from "./ArticleView";
import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className='App'>
      <header className='App-header' style={{borderRadius: 10}}>

        <h1 className='App-title'>Our blog</h1>
        <img src={logo} alt="logo" className="logo" />
      </header>
      {/* Specifies components to handle specific routes */}
      <Router>
        <div>
          {/* This line specifies that if the browser URL matches /,
          the ArticleListing component should be rendered in this place. */}
          <Route exact path='/' component={ArticleListing} />
          {/* Paths can contain parameters, for example, path="/post/:slug",
          which are delivered to the target component through react props. */}
          <Route path='/post/:slug' component={ArticleView} />
        </div>
      </Router>
    </div>
  );
}

export default App;