import {TweenLite} from 'gsap'
export function mainFun () {
  console.log(this)
  console.log(TweenLite)
  this['test_option'].on('xClick',(ev)=>{
    console.log('322132132',ev)
  })
}
