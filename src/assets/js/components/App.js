'use strict';
import SplitText from './SplitText';

class App {
  constructor() {}

  render() {
    let winW = innerWidth;

    if (winW > 1023) {
      new SplitText('.js-split-text', 'char');
    }
  }
}

export default App;
