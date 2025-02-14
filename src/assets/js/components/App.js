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
      // new Heart();
      // 使用例
const hearts = [];
document.querySelectorAll('.heart-canvas').forEach((canvas, index) => {
  const width = canvas.getAttribute('data-width') || 300;
  const height = canvas.getAttribute('data-height') || 300;
  hearts.push(new Heart(canvas.id, parseInt(width), parseInt(height)));
});
      new SplitText('.js-split-text', 'char');
    }
  }
}

export default App;
