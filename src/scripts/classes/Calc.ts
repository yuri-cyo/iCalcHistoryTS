import { UI } from "@/scripts/classes/UI";

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
  varResult: string[];
  varOperationResult: string[];
  private symbolsNumRegex: RegExp;
  private symbolsMathRegex: RegExp;

  private varOperationBracketsResult: string[];
  private isBrackets: string;
  private lastBracketsOnIdx: number;
  private lastBracketsOffIdx: number;
  private statusAllOperators: boolean[]
  private arrAllSymbols: string[]
  private equalResult: string | null | undefined

  countHistoryResults: number
  

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
    this.symbolsMathRegex = /^[:×\–+]$/;
    this.arrAllSymbols = ["+", "–", "×", ":"]

    this.varOperationBracketsResult = []
    this.isBrackets = ''
    this.lastBracketsOnIdx = 0
    this.lastBracketsOffIdx = 0
    this.statusAllOperators = [false, false]
  }

  cleraAllScrean() {
    // this.$operationsScreen.innerHTML = '<span class="history"></span>';
    this.$operationsScreen.innerHTML = '<span></span>';
    this.$primaryScreen.innerText = "";
  }

  clearAll() {
    this.varResult = [];
    this.varOperationResult = [];
    this.varOperationBracketsResult = []
    this.statusAllOperators = [false, false]
    this.countHistoryResults = 0

    if (!this.varResult[0] && !this.varOperationResult[0]) {
      this.cleraAllScrean();
    }
  }

  onlyOneDot() {
    if (this.varResult[0]) {
      this.varResult[this.varResult.length - 1] = this.varResult[
        this.varResult.length - 1
      ]
        // .replace(/-[^.\d]+/g, "")
        .replace(/[^.\d-]+/g, "")
        .replace(/^([^\.]*\.)|\./g, "$1");
    }
  }

  clickBtns() {
    
    // const ui = new UI()
    // ui.btnsTouchNumbers()
    // this.btnsTouchNumbers();
    this.$btns?.addEventListener("click", (event: Event) => {
      
      if (event.target) {
        
        // const target = event.target as HTMLButtonElement;
        // const dataEqual: string | undefined = target.dataset.equal
        
        const targetElement = event.target as HTMLButtonElement
        
        

        
        const targetData: MyDOMStringMap = targetElement.dataset;

        // if (targetData.equal === '=' || !this.varOperationResult[0]) {
        //   // this.$historyScreenContainer.insertAdjacentHTML("afterend", '<span><span/>')
        //   // this.$operationsScreen.insertAdjacentHTML("afterend", '<span><span/>')
        //   this.$historyScreenContainer.appendChild(document.createElement("span"))
        //   // console.error('!this.varOperationResult[0]', this.varOperationResult.length);
        // }

        if (targetElement.closest(".button")) {

          this.delLastNumber(targetData)

          

          console.log(this.varOperationResult);
          console.log(this.varOperationResult[this.varOperationResult.length - 1]);
          console.log('this.varResult', this.varResult);
          console.error('this.equalResult', this.equalResult);
          console.error('TYPE this.equalResult', typeof this.equalResult);
          // console.error('this.mathOperations()', this.mathOperations());
          // console.error('TYPE this.mathOperations()', typeof this.mathOperations());

          if (targetData.number) {

            // this.equalResult = null //! -----====----

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
            if (this.equalResult &&  !this.varResult[0]) {
              this.varOperationResult.push(this.equalResult);
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
          if (targetData.clear === "ac") {
            this.clearAll();
          }
          
          
         
          if (targetData.equal === "=") {
            if (this.varResult.length >= 3 && this.symbolsNumRegex.test(this.varResult[this.varResult.length - 1])) {
              
                // console.log('this.mathOperations()', this.mathOperations());
                // console.log(typeof this.mathOperations());
              // console.log('this.varResult', this.varResult);
              // console.log('this.varOperationResult', this.varOperationResult);
              
              // // this.$primaryScreen.innerHTML = this.mathOperations() + ''
              // this.mathOperations()



              
            }
            
            
            // this.varResult = this.varOperationResult
            this.equalLastNum()
            // if (lastBracket === '(' && targetData.equal === "=" &&  /\d/.test(this.varOperationResult[this.varOperationResult.length - 1])) {
            //   debugger
            //   console.warn('this.varOperationResult', this.varOperationResult);
            //   this.varOperationResult[this.varOperationResult.length - 1] = this.varOperationResult[this.varOperationResult.length - 1].replace(/$/, ')').replace(/\)\)$/, ')')
            //   console.log('this.varOperationResult', this.varOperationResult);
            // }
          }

          
          // this.preLastHistoryLine(event.target)
          
          
          // this.mathOperations(event)
          
          this.allFormatNumberForDisplay(targetData)
          // if (targetData.equal === "=") debugger
          
          
          this.renderScreen(targetData);
          this.scrollDown()
        }
      }
    });
    return this;
  }

  equalLastNum() {
    if (this.varResult.length >= 2 && this.symbolsMathRegex.test(this.varResult[this.varResult.length - 1])) {
      // // console.error('this.varResult[this.varResult.length - 1]', this.varResult[this.varResult.length - 1]);
      // this.varResult.push(this.varResult[this.varResult.length -1])
      this.varResult.push(this.varResult[this.varResult.length -2])
      this.varOperationResult.push(this.varResult[this.varResult.length -2])
      // this.mathOperations()
    }
  }

  addingBrackets(targetData: MyDOMStringMap) { //! =======================================================================!!!!!!!!!!!
    let lastBracket: string = ''

    let status: boolean | undefined

    let statusAllOperators = [false, false]
    this.varOperationResult.forEach((item, idx) => {
      this.varOperationResult[idx] = item.replace(/\(+|\)+/, '') //! Del All Bracket ( )!
      

        if (['×', ':'].includes(item)) {
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
      
        if (['×', ':'].includes(item)) {
          if (!this.varOperationResult[idx - 2] || ['+', '–'].includes(this.varOperationResult[idx - 2])) {
            this.varOperationResult[idx - 1] = this.varOperationResult[idx - 1].replace(/^/, '(')
            lastBracket = '('
            console.error('item = ', item );
            console.log('status = ', status );
          }
        } 
        if (['+', '–'].includes(item) && lastBracket === '(') {
          if (!this.varOperationResult[idx - 2] || ['×', ':'].includes(this.varOperationResult[idx - 2])) {
            this.varOperationResult[idx - 1] = this.varOperationResult[idx - 1].replace(/$/, ')').replace(/\)\)$/, ')')
            lastBracket = ')'
            console.error('item = ', item );
            console.log('status = ', status );
          }
        } 
        // if (lastBracket === '(' && targetData.equal === '=') {
        //   this.varOperationResult[this.varOperationResult.length - 1] = this.varOperationResult[this.varOperationResult.length - 1].replace(/$/, ')').replace(/\)\)$/, ')')
        //   console.log('this.varOperationResult', this.varOperationResult);
        // }
      })
    }
  }

  closeBracket(targetData: DOMStringMap) {
    let lastBracket = ''
    let lastBracketsIdx: number
    this.varOperationResult.forEach((item, idx) => {
      if (/\(/.test(item)) {
        lastBracket = '('
        lastBracketsIdx = idx
      } else if (/\)/.test(item)) {
        lastBracket = ')'
        lastBracketsIdx = idx
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
      
      this.varResult[this.varResult.length - 1] = this.varResult[this.varResult.length - 1].slice(0, -1);
      // this.varOperationResult[this.varOperationResult.length - 1] = this.varOperationResult[this.varOperationResult.length - 1].slice(0, -1);
      if (this.varResult[this.varResult.length - 1] === '') {
        this.varResult.pop()
        this.varOperationResult.pop()
        if (this.arrAllSymbols.includes(this.varResult[this.varResult.length - 1])) {
          this.varResult.pop()
          this.varOperationResult.pop()
        }
        if (!this.varResult[0]) {
          this.varOperationResult = []
          this.$operationsScreen.innerHTML = '<span></span>'
        }
      }
      // if (this.varOperationResult[this.varOperationResult.length - 1] === '') {
      //   this.varOperationResult.pop()
      //   if (this.arrAllSymbols.includes(this.varOperationResult[this.varOperationResult.length - 1])) {
      //     this.varOperationResult.pop()
      //   }
      // }
      if (!this.varResult[0]) {

      }
      // this.varResult = this.varResult.slice(0, -1);
    }
  }

  allFormatNumberForDisplay(targetData: DOMStringMap) {
    this.numNegative(this.varResult)
    this.numNegative(this.varOperationResult)
    this.zeroDot(targetData, this.varResult)
    this.zeroDot(targetData, this.varOperationResult)
    this.addingBrackets(targetData)
    // this.delLastNumber(targetData)
    

    // this.addingBrackets()
    // this.addingBrackets1()
    // this.addingBrackets2()
    // this.addingBrackets3(targetData)
  }

  mathOperations() {
    function calculate(inputArray: string[]): number | null {
      const operators: string[] = [];
      const numbers: number[] = [];
      const operatorPrecedence: { [key: string]: number } = {
        '+': 1,
        '–': 1,
        '×': 2,
        ':': 2,
      };
    
      for (const item of inputArray) {
        if (!isNaN(Number(item))) {
          numbers.push(Number(item));
        } else if (['+', '–', '×', ':'].includes(item)) {
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
        case ':':
          if (b === 0) {
            // console.error('Ділення на нуль');
            return NaN; // Обробка помилки, якщо відбувається ділення на нуль
          }
          return a / b;
        default:
          return NaN; // Обробка помилки, якщо оператор невірний (це не повинно траплятися)
      }
    }
    
    // const inputArray = ['1', '+', '2', '*', '3'];
    const result = calculate(this.varResult);
    // const resultFixed = toFixed(result)

    if (!isNaN(result!)) {
      let resultFixed = result!.toFixed(this.symbolsToDot(result!))
      // - this.symbolsToDot(result!)
        .replace(/0+$/, '').replace(/\.$/, '')
      this.equalResult = resultFixed
      console.warn('this.equalResult', this.equalResult);
      return resultFixed
    } else {
      console.error('Помилка обчислення');
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
    // 2222 // 4 - 0 && 0 - 4
    // 0.22 // 1 - 2 && 2 - 1

  }

  fnLastHistoryScreen(): HTMLElement {
    return document.querySelector("#operations-screen span:last-child")!
  }
  
  renderScreen(targetData: MyDOMStringMap) {

    // this.delLastNumber(targetData)

    if (this.symbolsNumRegex.test(this.varResult[this.varResult.length - 1])) {

      this.varOperationResult[this.varOperationResult.length - 1] = this.addSpacesToNumber(this.varResult[this.varResult.length - 1]);
      
      //!=====================================
      
      this.closeBracket(targetData)
      
      //!=====================================
      
      this.$primaryScreen.innerHTML = this.addSpacesToNumber(this.varResult[this.varResult.length - 1]);
    } else if (!this.varResult[0]) {
      // $historyScreenContainer.innerText = "0";
      this.$primaryScreen.innerText = "0";
    }
    
    

    if (this.varOperationResult[0])
    // this.fnLastHistoryScreen().innerHTML = this.varOperationResult.join("&nbsp<wbr>"); //! === !!!!
    this.fnLastHistoryScreen().innerHTML = this.varOperationResult.join("&nbsp<wbr>");
  //!======
  if (targetData.equal === '=' 
  && this.varResult.length >= 3 
  && this.symbolsNumRegex.test(this.varResult[this.varResult.length - 1])
  && this.varResult) {
    this.countHistoryResults += 1
    // this.$operationsScreen.appendChild(document.createElement("span"))
    // console.warn('=====================================');
    // console.warn('this.varResult', this.varResult);
    // <span class="equal-line"></span> //!
    this.mathOperations()
    this.$operationsScreen.insertAdjacentHTML('beforeend', 
    `
    <span class="res-equal res-equal-line">${this.addSpacesToNumber(this.equalResult)}</span>
    `)
    this.$operationsScreen.insertAdjacentHTML('beforeend', 
    `
    <span class="history">
    </span>`)
    this.$primaryScreen.innerText = this.addSpacesToNumber(this.equalResult)

    this.scrollDown()

    this.varResult = [];
    // this.varResult.push(this.addSpacesToNumber(this.mathOperations()))
    this.varOperationResult = [];
  }
  //! =======
  // if (targetData.equal === '=') {
    //   this.$operationsScreen.insertAdjacentHTML('beforeend', 
    //   `
    //   <div class="historyAndEqual">
    //       <span class="history"></span>
		// 			<span class="qual"></span>
    //   </div>
      
    //   `)
    
    // //   
    // }
    this.preLastHistoryLine()
  }

  scrollDown() {
    this.$operationsScreen.scrollTo(0, document.body.scrollHeight)
    // this.$lastOperationsScreen.scrollIntoView({ behavior: 'smooth' })
    // console.log('this.$lastOperationsScreen', this.$lastOperationsScreen);
  }
  
  // qweqweqwe(): NodeListOf<Element> {
    //   const allHistory: NodeListOf<Element> = document.querySelectorAll("#operations-screen span");
    //   return allHistory
    // }
    
    preLastHistoryLine() {
      const allHistory: NodeListOf<Element> = document.querySelectorAll("#operations-screen span");
      const allH: Element = document.querySelector(".history")!;
      
      // // console.error('element111111111111111111111', allHistory[allHistory.length - 1]);
      // // // console.error('allHistory[allHistory.length - 1]', allHistory[allHistory.length - 1]);
      
      // if(allHistory[allHistory.length - 1].contains('resEqual')) {
        //   allHistory[allHistory.length - 2].classList.add('equal-line')
        // }
    allHistory.forEach((item, index) => {
      // console.error('item', item);
      if (item.classList.contains('res-equal')) {
        // console.error('============123123========');
        allHistory[index - 1].classList.add('equal-line')
      }
    })
    //   //   && allHistory[1]
    //   //   && targetElement.equal === '=' ) {
    //   //     // console.error('preLastHistoryLine');
    //   //   // item.classList.add("history")

    //   // allH.classList.add("history")

    //   if (index % 2 === 1) {
    //     item.classList.add("history"); // Додаємо клас до непарного елемента
    //   }
    //   // if(allHistory.length >=2) {
    //   //   allHistory[index - 2].classList.add("history"); 

    //   // }


    //   // allHistory[allHistory.length - 1].classList.remove("history")

    // });
    // allHistory.forEach((element: Element, idx: number) => {
    //   // if(allHistory.length >= 2) {
    //     if (element.classList.contains('resEqual')) {
    //       // console.error('contains(resEqual)', allHistory[idx - 1]);
    //       // allHistory[allHistory - 1].styles.color = 'red'
    //       allHistory[idx - 1].classList.remove('history')
    //       // element.classList.remove('history')
    //       if(allHistory[0]) {
    //         allHistory[0].classList.remove('history')
    //       }
    //     }
      // }
      // if (allHistory[allHistory.length - 1]) {
      // }
      
    // // console.error('element', allHistory);
    
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
      // if (num[num.length - 1]) {}
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
