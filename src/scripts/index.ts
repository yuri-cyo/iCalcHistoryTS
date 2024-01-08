import { Calc } from "@/scripts/classes/Calc";
import { UI } from "@/scripts/classes/UI";

// ! ==================== UI ==========



export const scrollDownScreenHistory = () => {
  return calc.scrollDown()
}

export const varResult = () => {
  return calc.varResult
}

// ! ==================== Calc ==========

const calc = new Calc("#buttonsCalc", {
  limitNumbers: 13
});
calc
.clickBtns()

const ui = new UI({
  btn: '[data-equal]',
  btnsMath: '[data-math]',
  btnsContainer: '#buttonsCalc',
  container: '.calc',
  screenContainer: '.calc__screen',
  primaryScreen: '#primary-screen',
  arrAllSymbols: calc.arrAllSymbols
});
ui
.autoBorderRadiusInCalc()
.adaptiveFSScreen()
.btnsTouch()
ui.activeMathBtns()

const buttonsCalc: HTMLElement = document.querySelector('#buttonsCalc')!
buttonsCalc.addEventListener('click', () => {
  ui
  .adaptiveFSScreen()
  console.warn('calc.varResult', calc.varResult);
  console.warn('calc.varOperationResult', calc.varOperationResult);
  console.warn('calc.equalResult', calc.equalResult);
  console.warn('calc.lastNumInResult()', calc.lastNumInResult());
  console.warn('calc.lastNumInResult()', calc.countHistoryResults);
  
})
