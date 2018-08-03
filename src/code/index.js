import { TweenMax } from 'gsap/TweenMax';
import { ChoiceManager } from 'pixi-question-choice';

export function mainFun() {

  let cm = new ChoiceManager(this);
    let item = this['submit_btn'];
    let position,down,isDown = false;
    item.on("xMousedown", (ev) => {
      position = {x:item.x,y:item.y};
      down = Object.assign({},ev);
      isDown = true
    });
    this.stage.on('xMousemove',(ev)=>{
      if(!isDown) return false;
      let movP = Object.assign({},ev);
      let temp = Object.assign({},{x:movP.point.x-down.point.x,y:movP.point.y-down.point.y});
      item.x = position.x+temp.x;
      item.y = position.y+temp.y;
    })
    this.stage.on("xMouseup", (ev) => {
      this.bgImg.off('xMousemove',null)
      isDown = false
    });

}
