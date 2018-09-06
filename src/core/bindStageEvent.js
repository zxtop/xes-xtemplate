import * as stagesEvent from '../code/index.js'
export function bindStages(vue,stages){

        stages.map((obj)=>{

            if(obj.sourceId in stagesEvent){

              stagesEvent[obj.sourceId].bind(obj.toObj())(vue,stages)

              }

        })}