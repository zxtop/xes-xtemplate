import { TweenMax, TimelineMax,TweenLite } from 'gsap/TweenMax';
require("xes-submit")
export function stage0(vue, stages) {
//更改vue.stageObj可以切换舞台
//this.stage是当前舞台
//当前所有舞台数组stages


  for(let obj in this){
    if(this[obj].toJson().conName === "AnimatedSprite"){
      let target = this[obj];
      let num=0;
      if(target.autoPlay){
        target.play();
        target.onLoop = ()=>{
          num++;
          if(target.oncePlay){
            target.gotoAndStop(0)
          }else if(target.playNum&&target.playNum<=num){
            target.gotoAndStop(0)
          }
        };
      }else{
        target.on("xClick",()=>{
            if(target.playing){
              target.stop()
            }else{
              target.play();
              target.onLoop = ()=>{
                if(target.oncePlay){
                  target.gotoAndStop(0)
                }
              };
            }
        })
      }
    }
  }

  let btn = new XPIXI.SubjectManagers(vue,this, stages)
  let cm = new XPIXI.ChoiceManager(this);
  // let item = this.stage.children[4];
  let self = this;
  let optionArr = cm.choiceGroup;
  let _width,_height,optionPos=[],optionStyle=[],rightStyle=[];
  let scaleFlag = [];
  let flag = true, time = 5;
  let itemAnimate = new TimelineMax();

  //隐藏child 元素 
  // console.log(cm.choiceGroup);
  for (const childID in cm.choiceGroup) {
    // console.log(stage.children[0].conName);
    if(cm.choiceGroup[childID].children.length > 0){
      cm.choiceGroup[childID].children[0].alpha = 0;
    }
  }

  optionArr.map(function( items, index){
    scaleFlag[index] = false;
    optionPos[index] = {x:items.x,y:items.y};
    optionStyle[index] = {width:items._width,height:items._height};

    if(items.children.length > 0){
      rightStyle[index] = {width:items.children[0]._width,height:items.children[0]._height}
    }

    items.on("xMouseover", (e) => {
      if (scaleFlag[index]) return false;
      if(!flag) return false;
      if (cm.checkedGroup[0] != items){
        itemAnimate.to(items,0,{width:optionStyle[index].width*1.05,height:optionStyle[index].height*1.05,onComplete:()=>{scaleFlag[index] = true;}});
      }
    })

    items.on("xMouseout", (e) => {
      itemAnimate.to(items,0,{width:optionStyle[index].width,height:optionStyle[index].height,onComplete:()=>{scaleFlag[index] = false;}});
    })
    items.on("xClick", (ev) => {
    
      // if(cm.isItemChecked(items)){
      //   return false;
      // }else {
    
      if(!flag) return false;
      if(cm.chosemore()){
        // TweenMax.to(items.children[0], 0.05, {scale:0.3})
        items.children[0].alpha = 1;
        cm.addCheckedItem(items);

      }else{
        if(cm.checkedGroup.length === 0){
          cm.addCheckedItem(items);
          if(cm.isAllRightItemsChecked()){
            // document.getElementById('right').play();
            TweenLite.to(items.children[0],0,{width:rightStyle[index].width*0.3,height:rightStyle[index].height*0.3,onComplete:function(){items.children[0].alpha = 1;}})
            TweenLite.to(items.children[0],0.2,{width:rightStyle[index].width*1.08,height:rightStyle[index].height*1.08})
            TweenLite.to(items.children[0],0.05,{width:rightStyle[index].width*1,height:rightStyle[index].height*1})
            flag = false;

            let answer = new XPIXI.AnswerInfo(self);
            if(cm.isAllRightItemsChecked()){
              answer.success([{'id':'0','value':'B'}],[{'id':'0','value':'B'}],0,1,[0]);
            }else{
              answer.fail([{'id':'0','value':'A'}],[{'id':'0','value':'B'}],0,0,[1]);
            }
            vue.$store.dispatch("pushToPostArr",answer);
            vue.$store.dispatch("postAnswer");

          }else{
            TweenMax.from(items, 0.05, {
              x:"+=40px",
              x:"-=40px",
              repeat:3,
              repeatDelay:0
            })
          }
        }else{
          cm.checkedGroup[0].children[0].alpha = 0;
          cm.removeCheckedItem(cm.checkedGroup[0]);
          cm.addCheckedItem(items);
          if(cm.isAllRightItemsChecked()){
            TweenLite.to(items.children[0],0,{width:rightStyle[index].width*0.3,height:rightStyle[index].height*0.3,onComplete:function(){items.children[0].alpha = 1;}})
            TweenLite.to(items.children[0],0.2,{width:rightStyle[index].width*1.08,height:rightStyle[index].height*1.08})
            TweenLite.to(items.children[0],0.05,{width:rightStyle[index].width*1,height:rightStyle[index].height*1})
            flag = false;
            let answer = new XPIXI.AnswerInfo(self);
            answer._isRight = [];
            if(cm.isAllRightItemsChecked()){
              answer.success([{'id':0,'value':'B'}],[{'id':0,'value':'B'}],0,1,0,[1]);
            }else{
              answer.fail([{'id':0,'value':'A'}],[{'id':0,'value':'B'}],0,0,1,[0]);
            }
            vue.$store.dispatch("pushToPostArr",answer);
            vue.$store.dispatch("postAnswer");
          }else{
            TweenMax.from(items, 0.05, {
              x:"+=40px",
              x:"-=40px",
              repeat:3,
              repeatDelay:0
            })
          }
          cm.removeCheckedItem(cm.checkedGroup[0]);
        }
      }

    })
  })
  let position,down,isDown = false,submiObj={};

}


