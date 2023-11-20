// import { UI } from "@/scripts/classes/UI";

interface Options {
  limitNumbers: number;
}

interface MyDOMStringMap {
  [key: string]: string | undefined;
}

export class Calc {
  private $btns: HTMLElement;
  private limitNumbers: number;

  private $primaryScreen: HTMLElement;
  // private $historyScreenContainer: HTMLElement
  private $operationsScreen: HTMLElement;
  // private $lastOperationsScreen: HTMLElement;
  public varResult: string[];
  public varOperationResult: string[];
  private symbolsNumRegex: RegExp;
  private symbolsMathRegex: RegExp;
  // private statusAllOperators: boolean[]
  // private arrAllSymbols: string[]
  public equalResult: string | null | undefined
  public countHistoryResults: number
  private mPlusMemory: number | null
  private countAC: number
  

  constructor(selector: string, options: Options) {
    this.$btns = document.querySelector(selector)!;
    this.limitNumbers = options.limitNumbers

    this.$primaryScreen = document.querySelector("#primary-screen")!;
    // this.$historyScreenContainer = document.querySelector("#operations-screen")!
    // this.$lastOperationsScreen = document.querySelector("#operations-screen span:first-child")!;
    this.$operationsScreen = document.querySelector("#operations-screen")!;
    this.varResult = [];
    this.varOperationResult = [];
    this.equalResult = null
    this.countHistoryResults = 0
    this.symbolsNumRegex = /[0-9.,\-$]/;
    this.symbolsMathRegex = /^[÷×\–+]$/;
    // this.arrAllSymbols = ["+", "–", "×", '÷]
    // this.statusAllOperators = [false, false]
    this.mPlusMemory = null
    this.countAC = 0
  }

  fnLastHistoryScreen(): HTMLElement {
    return document.querySelector("#operations-screen span:last-child")!
  }

  cleraAllScrean() {
    this.fnLastHistoryScreen().innerHTML = '<span></span>';
    this.$primaryScreen.innerText = "";
  }

  clearAll() {
    this.varResult = [];
    this.varOperationResult = [];
    // this.statusAllOperators = [false, false]
    this.countHistoryResults = 0
    this.equalResult = null

    if (!this.varResult[0] && !this.varOperationResult[0]) {
      this.cleraAllScrean();
    }
  }

  onlyOneDot() {
    if (this.varResult[0]) {
      this.varResult[this.varResult.length - 1] = this.varResult[
        this.varResult.length - 1
      ]
        .replace(/[^.\d-]+/g, "")
        .replace(/^([^\.]*\.)|\./g, "$1");
    }
  }

  clickBtns() {
    this.$btns?.addEventListener("click", (event: Event) => {
      
      if (event.target) {
        
        const targetElement = event.target as HTMLButtonElement
        const targetData: MyDOMStringMap = targetElement.dataset;

        if (targetElement.closest(".button")) {

          this.delLastNumber(targetData)

          console.log(this.varOperationResult);
          console.log(this.varOperationResult[this.varOperationResult.length - 1]);
          console.log('this.varResult', this.varResult);
          console.error('this.equalResult', this.equalResult);
          console.error('TYPE this.equalResult', typeof this.equalResult);

          if (targetData.number ) {

            if (this.varResult[0] 
              && this.varResult[this.varResult.length - 1].length >= this.limitNumbers
              && targetData.number !== '-') return //! LIMIT NUMBERS!!!!

            //! Bnts Number
            switch (true) {
              case this.symbolsNumRegex.test(
                this.varResult[this.varResult.length - 1]
              ):
                this.varResult[this.varResult.length - 1] += targetData.number;
                this.varOperationResult[this.varOperationResult.length - 1] += targetData.number;
                break;
              case !this.varResult[0] || this.symbolsMathRegex.test(this.varResult[this.varResult.length - 1]):
                this.varResult.push(targetData.number);
                this.varOperationResult.push(targetData.number);
                break;
            }
            this.onlyOneDot();
            console.warn('this.equalResult', this.equalResult);
          }

          if (targetData.math) {
            
            //! Bnts Math Symbols
            if (this.equalResult &&  !this.varResult[0]) { //! 999 999 + 999 999 = res + ...
              this.varOperationResult.push(this.addSpacesToNumber(this.equalResult));
              this.varResult.push(this.equalResult);
            }
            if (this.symbolsMathRegex.test(this.varResult[this.varResult.length - 1])) {

              this.varResult[this.varResult.length - 1] = targetData.math;
              this.varOperationResult[this.varOperationResult.length - 1] = targetData.math;

            } else if (
              this.symbolsNumRegex.test(this.varResult[this.varResult.length - 1])
            ) {
              this.varResult.push(targetData.math);
              this.varOperationResult.push(targetData.math);
            }
          }
          if (targetData.equal === "=") {
            this.equalLastNum()
          }
          
          this.allFormatNumberForDisplay(targetData)
          this.btnMplus(targetData)
          this.mClear(targetData)
          this.clearScreens(targetData)
          this.mScreenStyles()
          this.renderScreen(targetData);
          this.mRecall(targetData)

          if (!this.varResult[0] && this.equalResult) {
            this.$primaryScreen.innerText = this.addSpacesToNumber(this.equalResult)
          }
          if (this.varResult[0]) {
            this.equalResult = null
          }
          this.errDivisionDero()
          this.scrollDown()
        }
      }
    });
    return this;
  }

  errDivisionDero() {
    const errMessage: string = 'Error'
    if (this.equalResult === 'Infinity') {
      this.equalResult = null
      this.$primaryScreen.innerHTML = errMessage
    }
  }

  updatePrimaryScreen() {
    if (this.varResult) {
      this.$primaryScreen.innerText = this.varResult[this.varResult.length - 1]
    }
  }

  updateOperationsScreen() {
    if (this.varOperationResult[0]) {
      this.$operationsScreen.innerText = this.varOperationResult[this.varOperationResult.length - 1]
    }
  }

  updateAllScreen() {
    this.updatePrimaryScreen()
    this.updateOperationsScreen()
  }

  clearScreens(targetData: MyDOMStringMap) {
    const $bntAC: HTMLElement = document.querySelector('[data-clear="ac"]')!

    if (targetData.clear === "ac") {
      this.countAC += 1
      
      if (this.countAC === 1) {
        console.warn('$bntAC', $bntAC.innerHTML);
        this.varResult.pop()
        this.varOperationResult.pop()
        this.equalResult = null
        this.updatePrimaryScreen()

        if (!this.varOperationResult[0]) {
          this.fnLastHistoryScreen().innerText = ''
        }
        if (!this.varOperationResult[0] && !this.varResult[0] && this.$operationsScreen.innerText !== '') {
          this.countAC += 1
        }
      } 
      if (this.countAC === 2) {
        this.clearAll();
      }
      if (this.countAC >= 3) {
        this.$operationsScreen.innerHTML = '<span></span>';
        this.clearAll();
      }
    } else {
      this.countAC = 0
    }

    if (this.varResult[0] || this.equalResult) {
      $bntAC.innerHTML = 'C'
    } else if (!this.varOperationResult[0] && !this.varResult[0]){
      $bntAC.innerHTML = 'AC'
    }
    console.error('this.countAC =', this.countAC);
  }

  equalLastNum() {
    if (this.varResult.length >= 2 && this.symbolsMathRegex.test(this.varResult[this.varResult.length - 1])) {
      this.varResult.push(this.varResult[this.varResult.length -2])
      this.varOperationResult.push(this.varResult[this.varResult.length -2])
    }
  }

  addingBrackets() {
    let lastBracket: string = ''

    let status: boolean | undefined

    let statusAllOperators = [false, false]
    this.varOperationResult.forEach((item, idx) => {
      this.varOperationResult[idx] = item.replace(/\(+|\)+/, '') //! Del All Bracket ( )!
      

        if (['×', '÷'].includes(item)) {
          statusAllOperators[0] = true
          console.log('statusAllOperators[0] = ', statusAllOperators[0]);
        } 
        if (['+', '–'].includes(item) ) {
          statusAllOperators[1] = true
          console.log('statusAllOperators[1] = ', statusAllOperators[1]);
        } 
        if (statusAllOperators[0] === true && statusAllOperators[1] === true) status = true
        console.log('status = ', status );
    })

    if (status) {
      this.varOperationResult.forEach((item, idx) => {
      
        if (['×', '÷'].includes(item)) {
          if (!this.varOperationResult[idx - 2] || ['+', '–'].includes(this.varOperationResult[idx - 2])) {
            this.varOperationResult[idx - 1] = this.varOperationResult[idx - 1].replace(/^/, '(')
            lastBracket = '('
            console.error('item = ', item );
            console.log('status = ', status );
          }
        } 
        if (['+', '–'].includes(item) && lastBracket === '(') {
          if (!this.varOperationResult[idx - 2] || ['×', '÷'].includes(this.varOperationResult[idx - 2])) {
            this.varOperationResult[idx - 1] = this.varOperationResult[idx - 1].replace(/$/, ')').replace(/\)\)$/, ')')
            lastBracket = ')'
            console.error('item = ', item );
            console.log('status = ', status );
          }
        } 
      })
    }
  }

  closeBracket(targetData: DOMStringMap) {
    let lastBracket = ''
    this.varOperationResult.forEach((item, idx) => {
      if (/\(/.test(item)) {
        lastBracket = '('
      } else if (/\)/.test(item)) {
        lastBracket = ')'
      }
      
      if (lastBracket === '(' && targetData.equal === '=' && idx === this.varOperationResult.length - 1) {
        this.varOperationResult[this.varOperationResult.length - 1] = this.varOperationResult[this.varOperationResult.length - 1].replace(/$/, ')').replace(/\)\)$/, ')')
        console.log('this.varOperationResult', this.varOperationResult);
      }
    })
  }

  delLastNumber(targetData: DOMStringMap) {
    if (targetData.clearone === 'c' && this.varResult[0]) {
      console.log('BTN C-One');
      console.log('this.varOperationResult', this.varOperationResult);
      
      this.varResult[this.varResult.length - 1] = this.varResult[this.varResult.length - 1].slice(0, -1).replace(/-$/, '')

      if (this.varResult[this.varResult.length - 1] === '') {
        this.varResult.pop()
        this.varOperationResult.pop()
  
        if (!this.varResult[0]) {
          this.varOperationResult = []
          this.fnLastHistoryScreen().innerHTML = '<span></span>'
        }
      }
    }
  }

  allFormatNumberForDisplay(targetData: DOMStringMap) {
    this.numNegative(this.varResult)
    this.numNegative(this.varOperationResult)
    this.zeroDot(targetData, this.varResult)
    this.zeroDot(targetData, this.varOperationResult)
    this.addingBrackets()
  }

  mathOperations() {
    function calculate(inputArray: string[]): number | null {
      const operators: string[] = [];
      const numbers: number[] = [];
      const operatorPrecedence: { [key: string]: number } = {
        '+': 1,
        '–': 1,
        '×': 2,
        '÷': 2,
      };
    
      for (const item of inputArray) {
        if (!isNaN(Number(item))) {
          numbers.push(Number(item));
        } else if (['+', '–', '×', '÷'].includes(item)) {
          while (operators.length > 0 
            && operatorPrecedence[operators[operators.length - 1]] >= operatorPrecedence[item]) {
            const operator = operators.pop() as string;
            const b = numbers.pop() as number;
            const a = numbers.pop() as number;
            numbers.push(performOperation(a, b, operator));
          }
          operators.push(item);
        } else {
          // console.error(`Невідомий оператор: ${item}`);
          return null; // Обробка помилки, якщо зустрінете невідомий оператор
        }
      }
    
      while (operators.length > 0) {
        const operator = operators.pop() as string;
        const b = numbers.pop() as number;
        const a = numbers.pop() as number;
        numbers.push(performOperation(a, b, operator));
      }
    
      if (numbers.length !== 1) {
        // console.error('Некоректний формат виразу');
        return null; // Обробка помилки, якщо вираз має неправильний формат
      }
    
      return numbers[0];
    }
    
    function performOperation(a: number, b: number, operator: string): number {
      switch (operator) {
        // /^[:×\–+]$/;
        case '+':
          return a + b;
        case '–':
          return a - b;
        case '×':
          return a * b;
        case '÷':
          if (b === 0) {
            // console.error('Ділення на нуль');
            // return NaN; // Обробка помилки, якщо відбувається ділення на нуль
          }
          return a / b;
        default:
          return NaN; // Обробка помилки, якщо оператор невірний (це не повинно траплятися)
      }
    }
    
    const result = calculate(this.varResult);

    if (!isNaN(result!)) {
      let resultFixed = this.fnToFixed(result!) + ''
      this.equalResult = resultFixed
      console.warn('this.equalResult', this.equalResult);
      console.warn('typeof this.equalResult', typeof this.equalResult);
      return resultFixed
    } else {
      console.error('Помилка обчислення');
    }
    
  }

  fnToFixed(num: number): number | undefined{
    if (num) {
      let result: number = +num.toFixed(this.limitNumbers)
        .replace(/\.$/, '')
        .replace(/0+$/, '')
        
      result = +result.toPrecision(this.limitNumbers - 3)
        .replace(/0+$/, '')
        .replace(/[\.,]$/, '')
        .replace(/0+$/, '')
        
      return result
    }
  }

  symbolsToDot(number: number | string) {
    const numberString = number.toString(); // Перетворюємо число у рядок
    const parts = numberString.split('.');   // Розбиваємо рядок за допомогою крапки

    if (parts.length === 2) {
      const integerPart = parts[0];         // Отримуємо цілу частину числа
      const lengthWithDecimal = integerPart.length + 1; // Довжина з крапкою
      // // console.log(lengthWithDecimal);      // Виводимо результат (наприклад, 2)
      if (lengthWithDecimal < this.limitNumbers) {
        return this.limitNumbers - lengthWithDecimal 
      }
    } else {
      // console.log('Число не має десяткової частини з крапкою.');
      return this.limitNumbers
    }
  }

  renderScreen(targetData: MyDOMStringMap) {
    if (this.varOperationResult[0]) {
      this.$primaryScreen.innerHTML = this.addSpacesToNumber(this.varResult[this.varResult.length - 1]);
    }
    
    if (this.symbolsNumRegex.test(this.varResult[this.varResult.length - 1])) {

      this.varOperationResult[this.varOperationResult.length - 1] = this.addSpacesToNumber(this.varResult[this.varResult.length - 1]);
      
      //!=====================================
      
      this.closeBracket(targetData)
      
      //!=====================================

    } else if (!this.varResult[0]) {
      this.$primaryScreen.innerText = "0";
    }
    
    if (this.varOperationResult[0])
    this.fnLastHistoryScreen().innerHTML = this.varOperationResult.join(" ").replace(/(\d)\s+(\d)/g, '$1&nbsp;$2');
    //!======
    if (targetData.equal === '=') {
      this.renderActionEqualBtn()
    }
      this.preLastHistoryLine()
  }

  renderActionEqualBtn() {
    if (this.varResult.length >= 3 
    && this.symbolsNumRegex.test(this.varResult[this.varResult.length - 1])
    && this.varResult) {
      this.countHistoryResults += 1

      this.mathOperations()
      if (this.equalResult === 'Infinity') {

        this.$operationsScreen.insertAdjacentHTML('beforeend', 
        `
        <span class="res-equal res-equal-line">${'Error'}</span>
        `)
      } else {
        this.$operationsScreen.insertAdjacentHTML('beforeend', 
      `
      <span class="res-equal res-equal-line">${this.addSpacesToNumber(this.equalResult)}</span>
      `)
      }
      
      this.$operationsScreen.insertAdjacentHTML('beforeend', 
      `
      <span class="history">
      </span>`)
      if (this.equalResult === 'Infinity') {
        this.$primaryScreen.innerText = this.equalResult
      } else {
        this.$primaryScreen.innerText = this.addSpacesToNumber(this.equalResult)

      }
  
      this.scrollDown()
  
      this.varResult = [];
      this.varOperationResult = [];
    }
  }

  scrollDown() {
    this.$operationsScreen.scrollTo(0, document.body.scrollHeight)
  }
  
    preLastHistoryLine() {
      const allHistory: NodeListOf<Element> = document.querySelectorAll("#operations-screen span");
      allHistory.forEach((item, index) => {
        if (item.classList.contains('res-equal')) {
          allHistory[index - 1].classList.add('equal-line')
      }
    })
  }

  clickEqual() {
  const $equalBtn: HTMLElement = document.querySelector('[data-equal="="]')!
    console.error('$equalBtn', $equalBtn);
    $equalBtn.click()
}

  btnMplus(targetData: MyDOMStringMap) {
    const $screenM: HTMLElement = document.querySelector('.calc__m-screen')!
    const time = 0.2
    // $screenM.style.transition = `background-color ${time}s, opacity ${time}s, transform ${time}`;
    // $screenM.style.opacity = '0'
    // // $screenM.style.backgroundColor = ""

    const renderMBtn = ()=> {
      if (this.mPlusMemory) {
        this.mPlusMemory = this.fnToFixed(this.mPlusMemory)!
      }
      console.error('this.mPlusMemory', this.mPlusMemory);
      if (this.mPlusMemory || this.mPlusMemory === 0) {
        $screenM.innerText = this.addSpacesToNumber(`M = ${this.mPlusMemory}`)
        if ($screenM.innerText !== '') {
          $screenM.style.opacity = '1'
        } else {
          $screenM.style.opacity = '0'
        }
        $screenM.style.transition = `background-color ${time}s, opacity ${time}s, transform ${time}`;
        $screenM.style.transform = 'scale(1.1)'
        setTimeout(function () {
          $screenM.style.backgroundColor = "";
          $screenM.style.transform = 'scale(1)'
        }, time * 1000);
      }
    }

    const btnsmOperations = ()=> {
      if (targetData.m === 'm+') {
        if (this.varResult.length >= 2 && !this.equalResult) {
          this.clickEqual()
          this.mPlusMemory = this.mPlusMemory! + Number(this.equalResult)
        } else if (this.varResult.length === 1 && !this.equalResult) {
          this.mPlusMemory = this.mPlusMemory! + Number(this.varResult[this.varResult.length - 1])
        } else if (this.equalResult) {
          this.mPlusMemory = this.mPlusMemory! + Number(this.equalResult)
        }
        renderMBtn()
      }
      if (targetData.m === 'm-') {
        if (this.varResult.length >= 2 && !this.equalResult) {
          this.clickEqual()
          this.mPlusMemory = this.mPlusMemory! - Number(this.equalResult)
        } else if (this.varResult.length === 1 && !this.equalResult) {
          this.mPlusMemory = this.mPlusMemory! - Number(this.varResult[this.varResult.length - 1])
        } else if (this.equalResult) {
          this.mPlusMemory = this.mPlusMemory! - Number(this.equalResult)
        }
        renderMBtn()
      }
    }
    btnsmOperations()
  }

  mClear(targetData: MyDOMStringMap) {
    const $screenM: HTMLElement = document.querySelector('.calc__m-screen')!
    if (targetData.m === 'mc') {
      this.mPlusMemory = null
      if (this.mPlusMemory === null || this.mPlusMemory === '') {
        const time = 0.2
        $screenM.style.transition = `background-color ${time}s, opacity ${time}s, transform 0.2s`;
        $screenM.style.transform = 'scale(1.1)'
        setTimeout(() => {
          $screenM.style.opacity = '0';
          $screenM.style.transform = 'scale(1)'
        }, 250);
        // $screenM.addEventListener('transitionend', ()=> {
        // })
        setTimeout(() => {
          $screenM.innerText = ''
          $screenM.style.transform = 'scale(1)'
          
        }, time + 100 * 1000);
      }
    }
  }

  mRecall(targetData: MyDOMStringMap) {
    if (targetData.m === 'mr' && this.mPlusMemory) {
      if (this.symbolsNumRegex.test(this.varResult[this.varResult.length - 1]) && this.varResult[0]) {
        this.varResult.pop()
        this.varOperationResult.pop()

        this.varResult.push(this.mPlusMemory+'')
        this.varOperationResult.push(this.mPlusMemory+'')
      } else if (this.symbolsMathRegex.test(this.varResult[this.varResult.length - 1]) && this.varResult[0]) {
        this.varResult.push(this.mPlusMemory+'')
        this.varOperationResult.push(this.mPlusMemory+'')
      } else if (!this.varResult[0]) {
        this.varResult.push(this.mPlusMemory+'')
        this.varOperationResult.push(this.mPlusMemory+'')
      }
    }
    this.renderScreen(targetData)
  }

  mScreenStyles() {
    const mClass = 'm-sceen-on'

    const $screenM: HTMLElement = document.querySelector('.calc__m-screen')!

    if ($screenM.textContent !== '') {
      $screenM.classList.add(mClass)
    } else if ($screenM.textContent === '') {
      $screenM.classList.remove(mClass)
    }
  }

 

  lastNumInResult(): string {
    let res: string = "";

    if (this.symbolsNumRegex.test(this.varResult[this.varResult.length - 1])) {
      res = this.varResult[this.varResult.length - 1];
    }
    return res;
  }

  lastIndex(arr: []): string {
    return arr[arr.length - 1];
  }

  zeroDot(targetData: MyDOMStringMap, num: string[]) {
    if (num[0]) {
      if (num[num.length - 1] === '.' 
        || num[num.length - 1] === ',') {
        num[num.length - 1] = '0' + num[num.length - 1]
      } else if (num[num.length - 1] === '00') {
        num[num.length - 1] = '0'
      }
      num[num.length - 1] = num[num.length - 1].replace(/^0([1-9])/, '$1').replace(/^-0([1-9])/, '-$1')
    }
    if (/[\.\,]$/.test(num[num.length - 2])) {
      num[num.length - 2] = num[num.length - 2].replace(/[\.\,]$/, '')
      this.$primaryScreen.innerHTML = this.addSpacesToNumber(this.varResult[this.varResult.length - 2]);
    }
    if (/[\.\,]$/.test(num[num.length - 1]) && targetData.equal === '=') {
      num[num.length - 1] = num[num.length - 1].replace(/[\.\,]$/, '')
    }
  }

  numNegative(num: string[]) {
    if (num[0] && /-$/.test(num[num.length - 1])) {
      num[num.length - 1] = num[num.length - 1].replace(/-$/, '')
      // .replace(/^/, '-')
      num[num.length - 1] = '-' + num[num.length - 1]
      if (num[num.length - 1] === '-') {
        num[num.length - 1] = num[num.length - 1] + '0'
      }
    }
    if (num[0] && /^-\-+/.test(num[num.length - 1])) {
      num[num.length - 1] = num[num.length - 1].replace(/-+/, '')
    }
  }

  addSpacesToNumber(nubmerStr: any) {
    let [integerPart, decimalPart] = nubmerStr.split(".");
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " "); //! ставить пробіли "1 234 000.5678"
    integerPart = integerPart.replace(/^[.,]/, '0$&')
    let formattedStr = decimalPart
    ? `${integerPart},${decimalPart}`
    : integerPart;
    if (this.lastIndex(nubmerStr.toString()) === "." 
    || this.lastIndex(nubmerStr.toString()) === ",") {
      formattedStr += ",";
    }
    return formattedStr;
  }
}
