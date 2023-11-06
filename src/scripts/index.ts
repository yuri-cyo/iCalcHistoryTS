import { Calc } from "@/scripts/classes/Calc";
import { UI } from "@/scripts/classes/UI";

// ! ==================== UI ==========

const ui = new UI({
  btn: '[data-equal]',
  btnsContainer: '#buttonsCalc',
  container: '.calc',
  screenContainer: '.calc__screen',
  primaryScreen: '#primary-screen',
});
ui
.autoBorderRadiusInCalc()

// ! ==================== Calc ==========

const calc = new Calc("#buttonsCalc", {
  limitNumbers: 13
});
calc
.clickBtns()



const buttonsCalc: HTMLElement = document.querySelector('#buttonsCalc')!
buttonsCalc.addEventListener('click', () => {
  ui
  .adaptiveFSScreen()
  // console.warn('calc.varResult', calc.varResult);
  // console.warn('calc.varOperationResult', calc.varOperationResult);
  // console.warn('calc.lastNumInResult()', calc.lastNumInResult());
  
})
