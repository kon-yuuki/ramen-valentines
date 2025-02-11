'use strict';
import SplitText from './SplitText';
import Top from './Top';

class App {
  constructor() {}

  render() {
    let winW = innerWidth;

    if (winW > 1023) {
      new Top();
      new SplitText('.js-split-text', 'char');
    }
  }
}

export default App;
