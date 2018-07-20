export function mainFun () {
console.log(this)

  this.bgImg.on("xClick",(ev)=>{
    console.log(ev);
  });


  this.bgImg.on("xDbclick",(ev)=>{
    console.log(ev);
  });


}
