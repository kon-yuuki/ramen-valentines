'use strict';
import SplitText from './SplitText';
import Top from './Top';
import Heart from './Heart';

class App {
  constructor() {}

  render() {
    let winW = innerWidth;

    if (winW > 1023) {
      new Top();
      new Heart();
      new SplitText('.js-split-text', 'char');
    }
  }
}

export default App;
