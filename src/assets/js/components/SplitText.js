'use strict';

//文字列をspan(任意のクラス付与)で分割する
class SplitText {
  constructor(targetClassName, generateClassName) {
    this.els = document.querySelectorAll(targetClassName);

    if (innerWidth < 1023) return;
    if (generateClassName) {
      this.generateClassName = generateClassName;
    }
    if (this.els) {
      this.els.forEach(el => {
        this.chars = el.innerText.trim();
        this.concatStr = '';
        el.innerHTML = this._splitText();
      });
    }
  }

  _splitText() {
    for (let c of this.chars) {
      c = c.replace(' ', '&nbsp;');
      if (this.generateClassName) {
        this.concatStr += `<span class="${this.generateClassName}">${c}</span>`;
      } else {
        this.concatStr += `<span>${c}</span>`;
      }
    }
    return this.concatStr;
  }
}

export default SplitText;
