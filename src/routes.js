import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

// import ArticleListing from './ArticleListing';
// import ArticleView from './ArticleView';
import App from './App';

const Routes = () => (
    <Router>
        <div>
            <Route path="/" component={App} />
        </div>
    </Router>
);

export default Routes;