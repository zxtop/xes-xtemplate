import { TweenMax } from 'gsap/TweenMax';
import { ChoiceManager } from 'pixi-question-choice';

export function mainFun() {
  console.log(this);
  let cm = new ChoiceManager(this);
  cm.choiceGroup.map(item => {
    item.on("xMousedown", (ev) => {
      TweenMax.set(item, { x: 100, y: 100 });
    });
    item.on("xMouseup", (ev) => {
      TweenMax.set(item, { x: 200, y: 200 });
    });
  });
}