require('gsap')

require('pixi-spine')

require('matter-js')

export function mainFun () {
  console.log(PIXI.spine)
  this['test_option1'].on('xMouseover', (e) => {
    TweenMax.to(this['test_option1'].scale, 0.5, {x: 1.2, y: 1.2})
  })
  this['test_option1'].on('xMouseout', (e) => {
    console.log('out')
    console.log(e)
    TweenMax.to(this['test_option1'].scale, 0.5, {x: 1, y: 1})
  })

  let item = this['submit_btn']
  let position, down, isDown = false

  item.on('xMousedown', (ev) => {
    position = {x: item.x, y: item.y}
    down = Object.assign({}, ev)
    isDown = true
  })

  this.stage.on('xMousemove', (ev) => {
    if (!isDown) return false
    let movP = Object.assign({}, ev)
    let temp = Object.assign({}, {x: movP.point.x - down.point.x, y: movP.point.y - down.point.y})
    item.x = position.x + temp.x
    item.y = position.y + temp.y
  })
  this.stage.on('xMouseup', (ev) => {
    this.bgImg.off('xMousemove', null)
    isDown = false
  })

}
