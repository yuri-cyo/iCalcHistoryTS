export class Calc {
	constructor(selector, options) {
    
		this.arrOperations = ['ac', '%', '/', '*', '-', '+']
		this.$el = document.querySelector(`#${selector}`)
		// this.$btns = document.querySelector('.button')
		this.$digit = document.querySelector('[data-digit]')
    this.numberLimit = options.numberLimit
    //! this.roundingAfterDot() - Повертає розраховану кількість чисел після коми!!!
    // this.originalFontSize$Digit = getComputedStyle(this.$digit).getPropertyValue('font-size')
    this.varDigitStr = ''

    this.$buttonAC = document.querySelector('[data-clear]')
    this.$buttonsMath = document.querySelectorAll('[data-math]')
		
    this.negativeCount = 1
    this.equalCount = 1

		this.numA = ''
		this.symbol = ''
		this.numB = ''
		this.resultAB = ''
    this.returnAorB = ''
    // this.statuslastDot = false
    // this.numberAfterDot = null
    this.statusnoNumBEqualNumA = false

    this.digitCopy = ''
    this.arrDigigt = ['0']
    // console.log('roundingAfterDot()', this.roundingAfterDot());
	}

  digitStyle() {
    
  }

  buttonACContent() {
    if (this.numA !== '' || this.numB !== '') {
      this.$buttonAC.innerHTML = 'C'
    } else if (this.numA === '' || this.numB === ''){
      this.$buttonAC.innerHTML = 'AC'
    }
  }

	buttonAC(){
		if (this.targetDataSet.clear === 'ac') {
      this.clearVars()
      console.warn('AC clear!');
    }
	}

  clearVars() {
    this.$digit.innerHTML = '0'
    this.varDigitStr = '0'
    this.numA = ''
    this.numB = ''
    this.symbol = ''
    this.resultAB = ''
    this.returnAorB = ''
    this.negativeCount = 1 //!
    this.equalCount = 1
    // this.statuslastDot = false
    this.statusnoNumBEqualNumA = false
    this.mathBtnsClearActive()
    // this.arrDigigt = ['0']
  }
  
  clearOneSymbol() {
    if (this.targetDataSet.clearone === 'c' && this.returnAorB !== '') {
      this.mathBtnsClearActive()

      const fnNumAClearOneSymbol = () => {
        // this.digitRender(this.$digit.innerHTML.slice(0, -1))
        this.varDigitStr = this.varDigitStr.slice(0, -1)
        this.numA = this.varDigitStr
        this.returnAorB = this.varDigitStr
      }
      const fnNumBClearOneSymbol = () => {
        // this.digitRender(this.$digit.innerHTML.slice(0, -1))
        this.varDigitStr = this.varDigitStr.slice(0, -1)
        this.numB = this.varDigitStr
        this.returnAorB = this.varDigitStr
      }
      
      if (
        this.symbol === '' && 
        this.numB === '') {
          // if (this.lastIndex(this.varDigitStr) === '.') {
          //   // this.statuslastDot = false
          //   // this.digitRender(this.$digit.innerHTML.slice(0, -1))
          //   this.varDigitStr = this.varDigitStr.slice(0, -1)
          //   // this.numberAfterDot = null
          //   this.numB.slice(0, -1)
          //   }   
            fnNumAClearOneSymbol()
          }

          if (this.numA !== ''
          && this.symbol !== '') {
              // if (this.lastIndex(this.varDigitStr) === '.') {
              //   // this.statuslastDot = false
              //   // this.digitRender(this.$digit.innerHTML.slice(0, -1))
              //   this.varDigitStr = this.varDigitStr.slice(0, -1)
              //   // this.numberAfterDot = null
              //   }   
                fnNumBClearOneSymbol()
          }
          if (this.numA === '' || this.numB === '' ) {
            if (this.varDigitStr === '') {
              // this.digitRender('0')
              this.varDigitStr = '0'
            }
          }
            if (this.varDigitStr === '-') {
              // this.digitRender('0')
              this.varDigitStr = '0'
              this.AorB('-0', '=')
              if (this.numA === '-') {
                this.numA = '0'
                this.returnAorB = '0'
              }
              if (this.numB === '-') {
                this.numB = '0'
                this.returnAorB = '0'
              }
            }
    }
  }

  AorB(a, opertion) {    
    if (typeof this.targetDataSet.number === 'string'
        && this.symbol === ''
        && this.numB === '') {
          if (opertion === '=') this.nextNumber(1, a, '=')
          if (opertion === '+') this.nextNumber(1, a, '+')
          this.mathBtnsClearActive()

    }
    if (typeof this.targetDataSet.number === 'string'
        && this.numA !== ''
        && this.symbol !== '') {
          if (opertion === '=') this.nextNumber(2, a, '=')
          if (opertion === '+') this.nextNumber(2, a, '+')
          this.mathBtnsClearActive()
          
    }
  }

  numbersEntryAorB() {
    this.AorB(this.targetDataSet.number, '+')
    console.error('numAB() ' + this.numAB())
    
    // this.statusnoNumBEqualNumA = false
  }

  mathBtnsClearActive() {
        for (let elem of this.$buttonsMath) {
          function removeClassMathActive() {
            elem.classList.remove('button__math-active')
          }
          removeClassMathActive()
        }
  }

  symbolEntry() {
    if (this.equalCount > 1 && typeof this.targetDataSet.math === 'string') this.numB = ''
    if (this.numA !== '' && typeof this.targetDataSet.math === 'string') {
      
      this.equalCount = 1
      this.statusnoNumBEqualNumA = false
			this.symbol = this.targetDataSet.math
        
      this.mathBtnsClearActive()
      this.target.classList.toggle('button__math-active')
      // console.error(this.target.style.color = 'black');

      if (this.lastIndex(this.varDigitStr) === '.') {
        // this.digitRender(this.$digit.innerHTML.replace(/\.$/d, '')) //! Fix last dot!
        this.varDigitStr = this.varDigitStr.replace(/\.$/d, '') //! Fix last dot!
      }
		} else {

    }
  }

  numAB() {
    if (this.symbol === '') {
      return this.numA
    } else {
      return this.numB
    }
  }
  
  returnVarAB(AorB) {
    if (this.numA === this.numAB()) {
      this.numA = AorB
    } else if (this.numB === this.numAB()) {
      this.numB = AorB
    }
  
  }

  nextNumber(x, value, modifier) {
    switch (x) {
      case 1: //! ================================== case 1 ================================

      this.fixMultiZero(this.numA)

      if (x === 1 && modifier === '=') this.numA = value //* при клікі на число додається в змінну numA
      if (x === 1 && modifier === '+') this.numA += value //* при клікі на число додається в змінну numA

      // this.digitRender(this.numA)  //* вивід на табло numA
      this.varDigitStr = this.numA //* вивід на табло numA
      this.fixDots()
      this.returnAorB = this.numA
      break

      case 2: //! ================================== case 2 ================================

      this.fixMultiZero(this.numB)

      if (x === 2 && modifier === '=') this.numB = value //* при клікі на число додається в змінну numA
      if (x === 2 && modifier === '+') this.numB += value //* при клікі на число додається в змінну numA
      
      this.fixDots()
      // this.digitRender(this.numB)
      this.varDigitStr = this.numB
      this.returnAorB = this.numB
      break
    }
  }
  
  fixMultiZero(zeroVar) { 
    if (zeroVar[0] === '0' && zeroVar[1] !== '.') {
      if (this.numA !== '' && this.numB === '') {
        this.numA = this.numA.slice(1)     
      }
      if (this.numB !== '') {
        this.numB = this.numB.slice(1)     
      }
    }
	}

  lastIndex(x) {
    return x[x.length - 1]
  }


  fixDots() {
    // function formDots(AorB) {
    //   return AorB.replace(/-[^.\d]+/g,"").replace( /^([^\.]*\.)|\./g, '$1' )
    // }
    // this.numA = formDots(this.numA)
    // this.numB = formDots(this.numB) //! <-- old code before refactoring\/
    
    this.returnVarAB(this.numAB()  //!refactoring successful!
                    .replace(/-[^.\d]+/g,"")
                    .replace( /^([^\.]*\.)|\./g, '$1' )) 

    // this.digitRender(this.$digit.innerHTML
    //                 .replace(/-[^.\d]+/g,"")
    //                 .replace( /^([^\.]*\.)|\./g, '$1' ))
    this.varDigitStr = this.varDigitStr
                      .replace(/-[^.\d]+/g,"")
                      .replace( /^([^\.]*\.)|\./g, '$1' )

    if (this.lastIndex(this.varDigitStr) === '.' && this.arrOperations.includes(this.targetDataSet.math)) {
      // this.digitRender(this.$digit.innerHTML.replace(/\.$/d, ''))
      this.varDigitStr = this.varDigitStr.replace(/\.$/d, '')
    }
    
  }

  // removeLastDot() {
  //   console.error('this.statuslastDot ' + this.statuslastDot);
  //   if (this.lastIndex(this.numAB()) === '.') {
  //     this.statuslastDot = true
  //     this.AorB(this.numAB().replace(/\.$/d, '') , '=')
  //     // this.digitRender(this.numAB() + '.')
  //     this.varDigitStr = this.numAB() + '.'
  //   }
  //   if (this.statuslastDot === true 
  //       && this.lastIndex(this.numAB()) !== '.'
  //       && this.targetDataSet.number !== '.'
  //       && this.targetDataSet.number !== '-') {
  //         console.error('this.statuslastDot ' + this.statuslastDot);
  //         this.statuslastDot = false
  //         // let this.numberAfterDot = null
  //         this.numberAfterDot = this.lastIndex(this.numAB())
          
  //         this.AorB(this.numAB().replace(/.$/d, '.' + this.numberAfterDot), '=')

  //         if (this.numAB().length === 2 && this.numAB()[0] === '.') {
  //           this.AorB(0 + this.numAB(), '=')
  //         }

  //         console.error('this.statuslastDot + NUM ' + this.statuslastDot);
  //         console.error('this.numberAfterDot + NUM ' + this.numberAfterDot);
  //       }

  //   if (this.numAB() === '' && this.statuslastDot === true) {
  //     // this.$digit.innerHTML = '0.'
  //     this.AorB('0', '=')
  //     // this.digitRender('0.')
  //     this.varDigitStr = '0.'
  //   }
  //   if (typeof this.targetDataSet.math === 'string') {
  //     this.statuslastDot = false
  //   }
  //       // if (this.targetDataSet.number !== '.' && this.statuslastDot === true) {
  //       // }
  // }


  buttonNegative() {
    if (this.lastIndex(this.numAB()) === '-') {
      this.AorB(this.numAB().replace(/-$/g , '').replace(/^/g, '-') , '=')
    }
    if (this.numAB() === '-') {
      this.AorB(this.numAB().replace(/$/g , '0') , '=')
    }
      if (this.numAB()[0] === '-' 
          && this.numAB()[1] === '0'
          && this.numAB()[2] !== '.'
          && typeof this.numAB()[2] === 'string') {
        // console.error('first 3 index ' + this.numAB()[2])
        this.AorB(this.numAB().replace(/^-0/g , '-') , '=')
      }

    
  }
  
  buttonsEqual() {
    if (this.lastIndex(this.numB) === '.') this.numB.replace(/\.$/d, '')

    if (this.numA !== ''
        && this.symbol !==''
        && this.numB !== '') {
      this.equalCount += 1
      console.warn('method =')
      console.error('equalCount = ' + this.equalCount)
      // this.removeLastDot()
      console.error('buttonsEqual() numB ' + this.numB);
      // this.digitRender(this.resultAB)
      this.varDigitStr = this.resultAB
      this.numA = this.resultAB
      // this.mathBtnsClearActive()
    }

	}

  clearAfterEqualPressNum() {
    if (typeof this.targetDataSet.number === 'string' && this.equalCount > 1) {
      let saveNumA = '' 
      saveNumA += this.targetDataSet.number
      this.clearVars()
      this.AorB(saveNumA,'+')
      saveNumA = ''
      console.error('cccccccccccccccccccccccccclearAfterEqualPressNum() this.equalCount ' + this.equalCount)
    }
  }

  equalSymbol() {
    if(this.arrOperations.includes(this.targetDataSet.math)
        && this.numA !== ''
        && this.symbol !== ''
        && this.numB !== '') {
          
      console.error('includes')
      
      this.numA = this.resultAB
      // this.digitRender(this.numA)
      this.varDigitStr = this.numA
      this.numB = ''
    }
  }

  noNumBEqualNumA() {  
    if (this.numA !== ''
        && this.symbol !==''
        && this.numB === ''
        && this.targetDataSet.equal === '=') {
        this.numB = this.numA
        this.mathOperations() 
        this.numA = this.resultAB
        // this.digitRender(this.numA)
        this.varDigitStr = this.numA

        this.resultAB = this.numA
        this.statusnoNumBEqualNumA = true
        this.equalCount += 1
        this.mathBtnsClearActive()
      }
  }
  
  mathOperations() {
    console.warn('this.symbol '+ this.symbol);
    if (this.numA !== '' && this.symbol && this.numB !== '') { 
      switch (this.symbol) {
        case '+':
          this.resultAB = Number(this.numA) + Number(this.numB)
          this.foFixedNumFloat()
          // this.limitResultAB()
          // this.resultAB = parseFloat(this.resultAB).toFixed(10)
          //   .replace(/0+$/g, '').replace(/\.$/g, '')
          break
      case '-':
          this.resultAB = Number(this.numA) - Number(this.numB)
          this.foFixedNumFloat()
          // this.limitResultAB()
          break
      case '*':
        this.resultAB = Number(this.numA) * Number(this.numB)
        this.foFixedNumFloat()
        // this.limitResultAB()
          break
      case '/':
        this.resultAB = Number(this.numA) / Number(this.numB)
        this.foFixedNumFloat()
        // this.limitResultAB()
          break
      }
    }
  }

  limitResultAB() {
    // console.log('resultAB.toString()', this.resultAB.toString().length);
    if (this.varDigitStr.toString().length > this.numberLimit) {
      this.varDigitStr = Number(this.varDigitStr).toExponential(this.roundingAfterDot())
      this.isExponential = true
      // this.resultAB = 'error'
      // if (this.numA === 'error' 
      //     || this.numB === 'error'
      //     || this.numA === NaN
      //     || this.numB === NaN) {
      //   this.clearVars()
      // }
      // console.log('toExponential');
    } else {
      this.isExponential = false
    }
  }

  foFixedNumFloat() {
    let intDigitLength = parseInt(this.varDigitStr) + '';
    intDigitLength = intDigitLength.length
    this.resultdigitLengthFloat = this.varDigitStr.length - intDigitLength
    this.resultdigitLengthFloat = this.resultdigitLengthFloat + ''
    if (this.varDigitStr.includes('.')) this.resultdigitLengthFloat;

    console.error('this.resultdigitLengthFloat ' + this.resultdigitLengthFloat);
    console.error(this.resultdigitLengthFloat);

        // return this.resultAB = parseFloat(this.resultAB).toFixed(6)
        //     .replace(/0+$/g, '').replace(/\.$/g, '')
        return this.resultAB = this.fnToFixed(this.resultAB)
  }

  fnToFixed(num) {
    num = parseFloat(num).toFixed(this.roundingAfterDot())
              .replace(/0+$/g, '').replace(/\.$/g, '')
    return num

    // const scientificNotationRegex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
    // if (scientificNotationRegex.test(num)) {
    //   console.log('Це число в науковому форматі');
    //   num = parseFloat(num).toFixed(100)
    //           .replace(/0+$/g, '').replace(/\.$/g, '')
    //   return num
    // } else {
    //   // console.log('Це не число в науковому форматі');
    //   num = parseFloat(num).toFixed(this.roundingAfterDot())
    //           .replace(/0+$/g, '').replace(/\.$/g, '')
    //   return num
    // }
  }
  
  fixDotWithoutZero() {
    if (this.numA === '.') {
      this.numA = '0.'
      // this.digitRender('0.')
      this.varDigitStr = '0.'
      this.returnAorB = '0.'
    }
    if (this.numB === '.') {
      this.numB = '0.'
      // this.digitRender('0.')
      this.varDigitStr = '0.'
      this.returnAorB = '0.'
    }
  }
  
	// digitRender(numberStr) {
  //   this.$digit.innerHTML = numberStr
	// }

  roundingAfterDot() {
    let returnRound = this.numberLimit - Math.floor(this.varDigitStr).toString().length
    if (returnRound <= 0) {
      returnRound = 1
    }
    return returnRound
  }

  digitRender() {
    const options = {
      // useGrouping: true,
      maximumFractionDigits: 20,
      // maximumFractionDigits: this.roundingAfterDot(),
      minimumFractionDigits: 0
    }
    if (this.varDigitStr.length <= this.numberLimit) {
      let formattedNumber = Number(this.varDigitStr).toLocaleString('uk-UA', options)
      // .replace(',', '.')
      console.log('varDigitStrvarDigitStrvarDigitStr', this.varDigitStr);
      if (this.lastIndex(this.varDigitStr) === '.') {
        // this.$digit.innerHTML = formattedNumber + '.'
        this.$digit.innerHTML = formattedNumber + ','
      } else {
        this.$digit.innerHTML = formattedNumber
      }
    } else if (this.varDigitStr.length > this.numberLimit){ //! Форматує результат в науковий формат (число Ейлера або експоненційний формат)

      this.$digit.innerHTML = Number(this.varDigitStr).toExponential().replace('e+', 'e')
          let originalLength = this.$digit.innerHTML.length
          const regexExToNum = new RegExp(/^([+-]?\d+(\.\d+)?)e([+-]?\d+)$/, 'g')
          let formatEtoN = this.$digit.innerHTML.replace(regexExToNum, '$1').replace(/0+$/g, '')
          // let result = this.numberLimit - Math.floor(Number(this.$digit.innerHTML.replace(/^([+-]?\d+(\.\d+)?)e([+-]?\d+)$/, '$1'))).length
          // console.log('resultresultresult', originalLength, formatEtoN.length, Math.floor(+formatEtoN).toString().length);
          let roundingAfterDotExpon = this.numberLimit - (originalLength - formatEtoN.length + Math.floor(+formatEtoN).toString().length)
          console.log('formatEtoN', formatEtoN);

          this.$digit.innerHTML = Number(this.varDigitStr).toExponential(roundingAfterDotExpon).replace(/\.?0+e/g, 'e').replace('e+', 'e')

          this.exponentialRound = roundingAfterDotExpon //! вивід в консоль в файлі script.js
    }

    // const container = this.$digit.parentNode
    const container = document.querySelector('.calc__screen')
    const paddingLeftСontainer = parseFloat(getComputedStyle(container).paddingLeft);
    const paddingRightСontainer = parseFloat(getComputedStyle(container).paddingRight);
    const widthContainer = container.offsetWidth - paddingLeftСontainer - paddingRightСontainer
    console.log('widthContainer', widthContainer);
    console.log('this.$digit', this.$digit.offsetWidth);
    // console.log('container.offsetWidth', container.offsetWidth - container.paddingLeft - container.paddingRight);
    // const text = document.querySelector('.text');
    // const originalFontSize$Digit = getComputedStyle(this.$digit).getPropertyValue('font-size')
    // console.log('originalFontSize', originalFontSize);
    let fontSize = parseInt(window.getComputedStyle(this.$digit).fontSize);
    
    while (this.$digit.offsetWidth > widthContainer && fontSize >= 48) {
      fontSize -= 1;
      this.$digit.style.fontSize = `${fontSize}px`;
    }
    while (this.$digit.offsetWidth < widthContainer && fontSize <= 87.5) {
      fontSize += 1;
      this.$digit.style.fontSize = `${fontSize}px`;
    }
  
	}

  // returnDigit() {
  //   return this.$digit.innerHTML.replace(/[^0-9,]+/g, '').replace(/,/g, '.')
  // }

  blinkingDigit() {
    this.arrDigigt.push(this.varDigitStr)
    this.arrDigigt = this.arrDigigt.slice(-2)
    
    console.log('this.arrDigigt', this.arrDigigt);
    
    if (this.arrDigigt[0] === this.arrDigigt[1]) {
      this.$digit.style.opacity = 0
      setTimeout(() => {
        this.$digit.style.opacity = 1
      }, 100);
    }
  }
  
  trueAllVars() {
    if (this.numA !== ''
    && this.numB !== ''
    && this.symbol !== '') {
      return true
    }
  }

  percentBtn(eTarget) { //! кнопки і операції => 10, %, =0.1 (numA = numA / 100)
    const equalBtn = document.querySelector('[data-equal]')
    if (eTarget.dataset.percent === '%') {
      if (this.numA !== '' && this.numB === '') { 

          if (this.symbol === '') {
            this.numA = this.fnToFixed(this.numA / 100)
            // this.digitRender(this.numA)
            this.varDigitStr = this.numA
          }

          if (this.symbol === '+' || this.symbol === '-') { //! кнопки і операції => 10, + or -, % (this.numB = this.numA / 100 * this.numA)
            this.numB = this.fnToFixed(this.numA / 100 * this.numA)
            // this.numB = this.numA / 100 * this.numA
            
            // this.numA = this.numA / 100
            // this.digitRender(this.numB)
            this.varDigitStr = this.numB
            console.log('if percent', 1);
          }  

          if (this.symbol === '*' || this.symbol === '/') { //! кнопки і операції => 10, * or /, % (this.numB = this.numA / 100)
            this.numB = this.fnToFixed(this.numA / 100)
            // this.numA = this.numA / 100
          // this.digitRender(this.numB)
          this.varDigitStr = this.numB
          console.log('if percent', 2);
          }
      } else if (this.numA !== '' && this.numB !== '') {

          if (this.symbol === '+' || this.symbol === '-'){ //! кнопки і операції => 50, + or -, 20, % (this.numB = this.numA / 100 * this.numB)
            this.numB = this.fnToFixed(this.numA / 100 * this.numB)
            // this.numA = this.numA / 100
            // this.digitRender(this.numB)
            this.varDigitStr = this.numB
            console.log('if percent', 3);
          }  

          if (this.symbol === '*' || this.symbol === '/') { //! кнопки і операції => 50, + or -, 20, % (this.numB = this.numA / 100 * this.numB)
            this.numB = this.fnToFixed(this.numB / 100)
            // this.digitRender(this.numB)
            this.varDigitStr = this.numB
            console.log('if percent', 4);
          }  
      } 
		}
  }


}

// ========================= 