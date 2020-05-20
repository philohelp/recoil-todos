import React, { Component } from 'react';
import { render } from 'react-dom';
import { RecoilRoot } from "recoil";
import Todo from './recoil_todo';
import './style.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: 'React'
    };
  }

  render() {
    return (
      <RecoilRoot>
       <Todo />
      </RecoilRoot>
    );
  }
}

render(<App />, document.getElementById('root'));
