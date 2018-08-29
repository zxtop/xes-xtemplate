export function stage0 (vue,stages) {
//更改vue.stageObj可以切换舞台
//this.stage是当前舞台
//当前所有舞台数组stages
  let arr = new XPIXI.ChoiceManager(this).choiceGroup;
  console.log(arr);
  this["submit_btn"].on("xClick",()=>{
  vue.stageObj = XPIXI.nextPreBtn.nextStage(this.stage,stages);
  });

  arr.map((obj)=>{
    console.log(obj);
    obj.on("xClick",()=>{
      console.log("jijijijijijijijiiji")
    })
  });

}
