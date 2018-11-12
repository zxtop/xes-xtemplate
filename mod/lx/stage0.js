import { TweenMax,TweenLite } from 'gsap/TweenMax';
import { Back } from 'gsap';
require('xes-submit');

export function stage0 (vue,stages) {
//更改vue.stageObj可以切换舞台
//this.stage是当前舞台
//当前所有舞台数组stages
let self=this;
//按钮
let answer_s= new XPIXI.AnswerInfo(this);
let cm = new XPIXI.LigatureManager(this);
// console.log(submitBtn);
  let position,stemDown ={} 
  ,answerObject=[],
  itemObject=[],
  stemI=null   //当前正在点哪个
  ,answerI=null;  //当前正在点哪个
  stemDown["length"]=cm._ligatureStem.length;
  let succColor=0x41F20D,errColor=0xFF0000;   //连接失败颜色
  let lineWidth=9;  //线宽
  //let subTime=1000;   //提交时间
  function Alphaitem(index,item){      //用index查找改变其透明度
    
    for(let i=0;i<cm._ligatureStem.length;i++){
      if(i!=index){
        TweenLite.to(cm._ligatureStem[i],0.3,{alpha:1});
    } else{
        TweenLite.to(item,0.3,{alpha:.6});
    }
  }
  }


  function AlphaAnswer(index,answer){
    for(let i=0;i<cm._ligatureAnswer.length;i++){
      if(i!=index){
        TweenLite.to(cm._ligatureAnswer[i],0.3,{alpha:1});
    } else{
        TweenLite.to(answer,0.3,{alpha:.6});
    }
  }
  }

  function graphicLine(graphics,stemI,answerI){
    graphics.moveTo(itemObject[stemI].itemX,itemObject[stemI].itemY);
    graphics.lineTo(answerObject[answerI].answerX,answerObject[answerI].answerY);
    graphics.endFill();
    self.stage.addChild(graphics);
    self.stage.setChildIndex(graphics,1); 
    var myTween=TweenLite.to(graphics,.3,{alpha:0,onComplete:()=>{
        myTween.reverse();
    }});
    console.log(self.stage);
  }
 
  for(let i=0;i<cm._ligatureStem.length;i++){
      let  item = cm._ligatureStem[i];
      let iWidth=item.width;
      let iHeight=item.height;
      position = {x:item.x,y:item.y};  //230  100
      itemObject[i] = Object.assign({},{itemX:position.x+iWidth-18,itemY:position.y+iHeight/2-lineWidth/2+5});   //itemX itemY 要划线的位置点
      //stemDown[i]=true;  
      // stemDown[i]=true;
  }
  for(let i=0;i<cm._ligatureAnswer.length;i++){
      let answer=  cm._ligatureAnswer[i];
      position = {x:answer.x,y:answer.y};
      answerObject[i] = Object.assign({},{answerX:position.x+10,answerY:position.y+answer.height/2-lineWidth/2});
  }
  for(let i=0;i<cm._ligatureStem.length;i++){
    let  item = cm._ligatureStem[i];
    let iWidth=item.width;
    let iHeight=item.height;
    let one=true;
    item.on("xMousemove",(ev)=>{
      //item.interactive=this.interactive;  
      item.cursor="pointer";
      item.anchor.set(0.5,0.5);
      if(one){
      item.x+=item.width/2;
      item.y+=item.height/2;
       one=false;
      }
      TweenLite.to(item,.3,{width:iWidth+52,height:iHeight+6});

    });
    item.on("xMouseout",(ev)=>{
      TweenLite.to(item,.3,{width:iWidth,height:iHeight});
    });
    item.on("xMouseup",(ev)=>{

      stemI=i;
      Alphaitem(stemI,item);
      if(answerI!=null){
        let graphics = new PIXI.Graphics();
        if(!cm._ligatureAnswer[answerI].isAllMatched()){
          console.log("没有都连接");
          // console.log("是否可以连接:"+cm._ligatureAnswer[answerI].addMatch(item));
          if(cm._ligatureAnswer[answerI].addMatch(item)){  //可以连接的话
             console.log("两个可以连接");
             console.log(cm._ligatureAnswer[answerI]);
             //console.log("是不是全部都连接了"+isAllItemsLinked());
             if(item.isAllMatched()){
              item.interactive=false;
             } 
             if(cm._ligatureAnswer[answerI].isAllMatched()){
              cm._ligatureAnswer[answerI].interactive=false;
             } 
             graphics.beginFill(succColor);
             graphics.lineStyle(lineWidth,succColor);
             graphicLine(graphics,stemI,answerI);
             console.log(cm._ligatureAnswer[answerI].isAllMatched());

             if(cm.isAllItemsLinked()){
                answer_s.success([{"id":"0","value":"10"}],[{"id":"0","value":"10"}],2,1,0,[1]);
                vue.$store.dispatch("pushToPostArr",answer_s);
                vue.$store.dispatch("postAnswer");
            }
            } else{
            console.log("两个不可以连接");
            graphics.beginFill(errColor);  
            graphics.lineStyle(lineWidth,errColor);  
            graphicLine(graphics,stemI,answerI);
                TweenLite.to(graphics,.3,{alpha:0,visible:false,delay:.6,onComplete:()=>{
                      self.stage.removeChild(graphics);
                }}); 
          }

        }
          Alphaitem(-1,cm._ligatureStem[stemI]);
          AlphaAnswer(-1,cm._ligatureAnswer[answerI]);
          stemI=null;
          answerI=null;
      }
  
    });
  }

 
  for(let i=0;i<cm._ligatureAnswer.length;i++){
    let answer= cm._ligatureAnswer[i];
    let one=true;
    let aWidth=answer.width;
    let aHeight=answer.height;
    answer.on("xMousemove",(ev)=>{
      answer.cursor="pointer";
      answer.anchor.set(0.5,0.5);
      if(one){
        answer.x+=answer.width/2;
        answer.y+=answer.height/2;
         one=false;
        }
      TweenLite.to(answer,.3,{width:aWidth+24,height:aHeight+14});
   });
   answer.on("xMouseout",(ev)=>{
    TweenLite.to(answer,.3,{width:aWidth,height:aHeight});
   });
      answer.on("xMouseup",(ev)=>{    
        console.log(cm.isAllItemsLinked());
     
      answerI=i; 
      AlphaAnswer(answerI,answer);
      if(stemI!=null){
         console.log("说明已经点过左边");
        let graphics = new PIXI.Graphics();
        if(!cm._ligatureStem[stemI].isAllMatched()){
          console.log("没有都连接");
          if(cm._ligatureStem[stemI].addMatch(answer)){  //可以连接的话
            console.log("两个可以连接");
            if(answer.isAllMatched()){
              answer.interactive=false;
             } 
              if(cm._ligatureStem[stemI].isAllMatched()){
                cm._ligatureStem[stemI].interactive=false;
             } 
            graphics.beginFill(succColor);
            graphics.lineStyle(lineWidth,succColor);
            graphicLine(graphics,stemI,answerI);
            console.log(cm._ligatureStem[stemI].isAllMatched());   
            
            if(cm.isAllItemsLinked()){ 
              setTimeout(()=>{},); 
                answer_s.success([{"id":"0","value":"10"}],[{"id":"0","value":"10"}],2,1,0,[1]);
                vue.$store.dispatch("pushToPostArr",answer_s);
                vue.$store.dispatch("postAnswer");
            }
            
          } else{
              graphics.beginFill(errColor);  
              graphics.lineStyle(lineWidth,errColor);  
              graphicLine(graphics,stemI,answerI);
                TweenLite.to(graphics,.3,{alpha:0,visible:false,delay:.6,onComplete:()=>{
                      self.stage.removeChild(graphics);
                }}); 
          }
   
        }
        Alphaitem(-1,cm._ligatureStem[stemI]);
        AlphaAnswer(-1,cm._ligatureAnswer[answerI]);
        stemI=null;
        answerI=null;
      
      }
  
  //mouseup    
      });
  }
//   let submit=true,   //提交一次
//   btn=self["submit_btn"],
//   one=true,
//    bWidth=btn.width,bHeight=btn.height;
//    console.log(btn);

//    btn.on("xMousemove",(ev)=>{
//     console.log("这里是btn");
//     btn.cursor="pointer";
//     btn.anchor.set(0.5,0.5);
//     if(one){
//     btn.x+=btn.width/2;
//     btn.y+=btn.height/2;
//     one=false;
//    }
  
//   TweenLite.to(btn,.3,{width:bWidth+20,height:bHeight+10});
//   })
 
//   btn.on("xMouseout",(ev)=>{
//     btn.cursor="pointer";
//     TweenLite.to(btn,.3,{width:bWidth,height:bHeight});
//   })
//  btn.on("xMouseup",()=>{
//    let s=0;
//    for(var i=1;i<=stemDown.length;i++){
//       stemDown[i]==false?s++:0;
//    }

//    if(s==4){
//     setTimeout(() =>{
//         //处理结果页数
//        let answer=new XPIXI.answerInfo();
//        answer.success(0,[0],[4],0);
//         if(submit)
//         dataThis.$store.dispatch('pushToPostArr', answer);
//         dataThis.$store.dispatch('postAnswer');
//          submit=false;
//     },subTime)
//    }
// }
// )
}


// WEBPACK FOOTER //
// ./src/code/stage0.js