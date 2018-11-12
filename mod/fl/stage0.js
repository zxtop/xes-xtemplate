import { TweenMax,TimelineMax } from 'gsap/TweenMax';
export function stage0 (vue,stages) {
//更改vue.stageObj可以切换舞台
//this.stage是当前舞台
//当前所有舞台数组stages
let cm = new XPIXI.ClassificationManager(this);
let answer =  new XPIXI.AnswerInfo(this);
// let itemArr = [this['item1'],this['item2'],this['item3'],this['item4']];
let down,position = [];
let isDown = false;
let _width,_height,_itemIndex;
let _target = null;
let itemAnimate = new TimelineMax();
let itemArr = cm._items;
let submitFlag = false;
var arr = [];
var resultArr = [];
// console.log(cm);
// console.log(cm._classes);


itemArr.map((item,index)=>{
  let scaleFlag = false;
  position[index] = {x:item.x,y:item.y};


  item.on("xMouseover",(ev)=>{
    if(scaleFlag) return false;
    //改变放大中心点
    item.anchor.set(.5,.5);
    //重新定位改变其定位点 修改值为其宽高的1/2
    _width = item._width;
    _height = item._height;
    item.x = position[index].x+_width/2;
    item.y = position[index].y+_height/2;
    //放大1.05倍
    itemAnimate.to(item,0,{width:item._width*1.15,height:item._height*1.15,onComplete:()=>{scaleFlag = true;}});

  })


  item.on("xMousedown",(ev)=>{
    cm._items.forEach(opt => {
      if(opt.name != item.name){
        opt.interactive = false;
      }
    });
    _target = item;
    _itemIndex = index;
    down = Object.assign({},ev);
    isDown = true
    itemAnimate.to(item,0.1,{alpha:.7});
  })
  

  this.stage.on("xMousemove",(ev)=>{
    if(!isDown) return false;
    
    this.stage.setChildIndex(item,this.stage.children.length-1);

    let movP = Object.assign({},ev);
    let temp = Object.assign({},{x:movP.point.x-down.point.x,y:movP.point.y-down.point.y});

    _target.x = position[_itemIndex].x+temp.x+_width/2;//移动定位
    _target.y = position[_itemIndex].y+temp.y+_width/2;
    // console.log(_target.x,_target.y)
  })

  item.on("xMouseup",(ev)=>{
    let classPosArr = [];
    for(let i=0;i<cm._classes.length;i++){
      var curX = cm._classes[i].x;
      var curY = cm._classes[i].y;
      var curW =
        parseFloat(cm._classes[i].width) + parseFloat(curX);
      var curH =
        parseFloat(cm._classes[i].height) + parseFloat(curY);
        classPosArr.push({ top: curY, left: curX, width: curW, height: curH });
    }

    var temW = item.width/2;
    var temH = item.height/2;
    
    //通过判断碰撞得出放入的是那个容器
    // console.log(classPosArr)
    // console.log("item.x",item.x,"parseFloat(classPosArr[j].left) - temW",parseFloat(classPosArr[0].left) - temW)
    // console.log("item.x",item.x,"parseFloat(classPosArr[j].left) - temW",parseFloat(classPosArr[0].width) - temW)

    for (var j = 0; j < classPosArr.length; j++) {
        if(
            ((item.x-(item._width*1.15-item._width))+item._width)<parseFloat(classPosArr[j].left)||
            (item.x-(item._width*1.15-item._width))>parseFloat(classPosArr[j].width)||
            ((item.y-(item._height*1.15-item._height))+item._height)<parseFloat(classPosArr[j].top)||
            (item.y-(item._height*1.15-item._height))>parseFloat(classPosArr[j].height)
        ){
            //没碰上
            if(j == classPosArr.length-1){//碰撞失败最后做处理
                itemAnimate.to(item,0.5,{x:position[index].x+_width/2,y:position[index].y+_height/2,width:_width,height:_height,alpha:1,onComplete:()=>{scaleFlag = false;}});
            }

        }else{
            
    //   if (//判断碰撞条件
    //     (item.x-(item._width*1.15-item._width)) > parseFloat(classPosArr[j].left) - temW &&
    //     (item.x-(item._width*1.15-item._width)) < parseFloat(classPosArr[j].width) - temW && 
    //     (item.y-(item._height*1.15-item._height)) > parseFloat(classPosArr[j].top) - temH &&
    //     (item.y-(item._height*1.15-item._height)) < parseFloat(classPosArr[j].height) - temH
    //   ) {
        // console.log("ssss")
        // if(!cm._classes[j].isAllItemsAdded()){
          if(cm._classes[j].canPutItem(item)){//如果元素能被置入
            cm._classes[j].addItem(item);
            //计算容器的子元素个数
            var insideItemNum = cm._classes[j].insideItems.length;
            for(let n=0;n<insideItemNum;n++){
              // cm._classes[j].insideItems[n].x = classPosArr[j].left + (cm._classes[j].width*(n+1)/(insideItemNum+1) - cm._classes[j].insideItems[n].width/2);
              // cm._classes[j].insideItems[n].y = classPosArr[j].top + (cm._classes[j].height - cm._classes[j].insideItems[n].height)/3;
              itemAnimate.to(cm._classes[j].insideItems[n],.2,{x:classPosArr[j].left + _width/2+(cm._classes[j].width*(n+1)/(insideItemNum+1) - cm._classes[j].insideItems[n].width/2),y:classPosArr[j].top +_height/2+ (cm._classes[j].height - cm._classes[j].insideItems[n].height)/3});
            }
            // itemAnimate.to( cm._classes[j],.1,{alpha:.8});
            itemAnimate.to(item,.1,{alpha:1,width:_width,height:_height}).to(item,.2,{width:_width*1.2,height:_height*1.2}).to(item,.1,{width:_width,height:_height,onComplete:()=>{scaleFlag = false;}});

            //解除事件绑定
            item.off('xMousedown',null);
            item.off('xMousemove',null);
            item.off('xMouseup',null);
            item.off('xMouseover',null);
            item.off('xMouseout',null);
            cm._items.forEach(itemOpt => {
              itemOpt.interactive = true;
            });
            if(cm._classes[j].isAllItemsAdded()){
                for(var i = 0;i<cm._classes[j].totalItems.length;i++){
                    arr.push(cm._classes[j].totalItems[i].name)
                }
                resultArr.push(arr);
                arr = [];
                if(resultArr.length == classPosArr.length){
                    // answer.isRight = [];
                    answer.success([{id:'0',value:'10'}],[{id:'0',value:'10'}],2,1,0,[1]);
                    vue.$store.dispatch('pushToPostArr',answer);
                    vue.$store.dispatch('postAnswer');
                }
              }
            isDown = false;
            // itemAnimate.to( cm._classes[j],.1,{alpha:1});
            return;

          }else{//不能放入或者放入错误   移回原位
            // itemAnimate.to( cm._classes[j],.1,{alpha:1});
            itemAnimate.to(item,0.5,{x:position[index].x+_width/2,y:position[index].y+_height/2,width:_width,height:_height,alpha:1,onComplete:()=>{scaleFlag = false;}});
          }
      }
    }
    cm._items.forEach(item => {
      item.interactive = true;
    });
    this.bgImg.off('xMousemove',null)//解除绑定
    isDown = false
  })
  item.on("xMouseout",(ev)=>{
    if(!scaleFlag) return false;
    itemAnimate.to(item,0.1,{width:_width,height:_height,onComplete:()=>{scaleFlag = false;}});
  })
})
}

