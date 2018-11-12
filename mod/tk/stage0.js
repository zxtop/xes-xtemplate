import { TweenMax, TimelineMax } from 'gsap/TweenMax';
require("xes-submit")
export function stage0 (vue,stages) {
//更改vue.stageObj可以切换舞台
//this.stage是当前舞台
//当前所有舞台数组stages

let keyboard = new XPIXI.KeyboardManager(this);
let fillVacancy = new XPIXI.Blankmangers(this);
let answer = new XPIXI.AnswerInfo(this);

let inputValue=[];
let checkValue=[];
let answerValue=[];
let isRightArr=[];
console.log(this);
console.log(fillVacancy)
let itemAnimate = new TimelineMax();
let submitBtn = this['submit_btn'];

// console.log(submitBtn)
let inputArr = [], fillIndex = -1;



// 键盘

keyboard._initkeyboard.map(function(item,index) {
    let isDown =false;
    item.on('xClick',(ev)=>{
        keyboard.addkeyboard(item._text)
        if(fillIndex == -1) return false;
        var fillBlankIndex = fillVacancy._textGroup[fillIndex]
        // var fillBlankIndex = document.getElementById('fillBlank'+fillIndex);
        var value = fillBlankIndex.text;

        if(keyboard._valuestring == 'back') {
            fillBlankIndex.text = value.substring(0, value.length - 1);
            return false;
        }else if (keyboard._valuestring == 'del') {
            fillBlankIndex.text = '';
            return false;
        }
        // console.log(fillBlankIndex.text.length)
        if(fillBlankIndex.text.length >=(fillVacancy.getMax()) ) return false;

        fillBlankIndex.text = fillVacancy.Trim(value + keyboard._valuestring);

    })

    item.on('xMousedown',(ev)=>{
        item.anchor.set(0.5,0.5);
        if(!isDown){
            item.x+=item.width/2;
            item.y+=item.height/2;
            isDown=true;
        }
        item.scale.x=0.9;
        item.scale.y=0.9;
    })
    item.on('xMouseup',(ev)=>{
        item.scale.x=1;
        item.scale.y=1;
    })
    item.on('xMousemove',(ev)=>{
        item.cursor="pointer";
    })
    item.on('xMouseout',(ev)=>{
        item.scale.x=1;
        item.scale.y=1;
    })
})


fillVacancy._blankGroup.map(function(items,ids){
    items.on('xClick',(ev)=>{
        // console.log(items.children[0].text)
        items.children[0].text = '';
        items.children[0].text = keyboard.valuestring;
        // console.log(keyboard.valuestring);
        for(const index in fillVacancy._blankGroup){
            fillVacancy._blankGroup[index].changeTexture('default');
        }
        fillIndex = ids;
        fillVacancy._blankGroup[fillIndex].changeTexture('click');
    })
})

let position,down,isDown = false;
let submitObj={};

submitObj={width:submitBtn.width,height:submitBtn.height,x:submitBtn.x,y:submitBtn.y};   


submitBtn.interactive = true;
submitBtn.on("xMouseover", (ev) => {
    //console.log(124);
    submitBtn.anchor.set(.5,.5);
    submitBtn.x = submitObj.x + submitObj.width/2;
    submitBtn.y = submitObj.y + submitObj.height/2;
    itemAnimate.to(submitBtn,0,{width:submitObj.width*1.05,height:submitObj.height*1.05});  
})
submitBtn.on("xMouseout", (e) => {
    itemAnimate.to(submitBtn,0,{width:submitObj.width,height:submitObj.height}); 
})
submitBtn.on("xMousedown", (ev) => {
    itemAnimate.to(submitBtn,0,{width:submitObj.width,height:submitObj.height}); 
    position = {x:submitBtn.x,y:submitBtn.y};
    down = Object.assign({},ev);
    isDown = true;
    
    //输入框
    fillVacancy._textGroup.map(function(item,index){
        inputArr.push(item.text);
    })
    console.log(inputArr)

    inputArr.map(function(item,index){
        // console.log(item.value,index)
        if(item.value===fillVacancy._rightGroup[index]){
            isRightArr.push(1)
        }else{
            isRightArr.push(0)
        }
        inputValue.push({id:index,value:item.value})
        fillVacancy.addCheckedItem(item.value)
    })

    fillVacancy._rightGroup.map(function(item,index){
        answerValue.push({id:index,value:item})
    })

    
    if(fillVacancy.isAllRightItemsChecked()){
       answer.success(inputValue,answerValue,1,1,0,isRightArr)
       console.log("sss")
    }else{
       answer.fail(inputValue,answerValue,1,0,1,isRightArr)
        console.log("ffff")
        // answer.fail([{id:"0",value:"10"}],[{id:"0",value:"10"}],2,1,0,0);
        // answer.success([{id:"0",value:"10"}],[{id:"0",value:"10"}],2,1,0,1);
        // console.log(answer)
    }
        // console.log(vue.$store)
    vue.$store.dispatch("pushToPostArr",answer);
    vue.$store.dispatch("postAnswer");
    console.log("success");
    
});
}
