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
    this.originResultAB = ''
    this.returnAorB = ''
    // this.statuslastDot = false
    // this.numberAfterDot = null
    this.statusnoNumBEqualNumA = false

    this.digitCopy = ''
    this.arrDigigt = ['0']

    this.mOn = false
    this.m = 0 
    this.countMbtns = 1
    this.$screenM = document.querySelector('.calc__m-screen')
    // console.log('roundingAfterDot()', this.roundingAfterDot());
	}


  btnsTouchNumbers() {
    // const btnsNumber = document.querySelectorAll('.button__number')
    // btnsNumber.forEach( (i)=> {
    //   i.addEventListener('touchstart', (e)=> {
    //     i.classList.remove('active-touch-numbers')
    //     i.classList.add('active-touch-numbers');
    //   })
    //     i.addEventListener('animationend', (e)=> {
    //         i.classList.remove('active-touch-numbers');
    //     })


    // }) 
    document.body.addEventListener("touchstart", (e)=> { 
      if (e.target.className.includes("button")){ //! Android Vibration
        if (e.target.closest('.button')) {
          if ("vibrate" in navigator) {
            navigator.vibrate(75);
          }

        }
        // e.target.style.backgroundColor = 'red'
			}
			let touchColor = "";
			let className = e.target.className;
			if (className.includes("button__m")){
        touchColor = "#737371";
			}
			if (className.includes("button__control")){
        touchColor = "#D9D9D9";
			}
			if (className.includes("button__number")){
        touchColor = "#737373";
			}
			if (className.includes("button__math")){
				touchColor = "#F3C895";
			}
			e.target.style.backgroundColor = touchColor;
			e.target.style.transition = "background-color 0s, opacity 0.5s, transform 0.2s";
		}, false);
		document.body.addEventListener("touchend", function(e) { 
			let className = e.target.className;
      e.target.style.transition = "background-color 0.5s, opacity 0.5s, transform 0.2s";
      setTimeout(function(){
            e.target.style.backgroundColor = "";
        }, 20);
		}, false);
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
    this.mathBtnsClearActive();
    // this.m = 0
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
        && this.numB === '') {
          if (this.targetDataSet.equal === '='
              || this.targetDataSet.m ==='m+'
              || this.targetDataSet.m ==='m-') {
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
  }
  
  mathOperations() {
    console.warn('this.symbol '+ this.symbol);
    if (this.numA !== '' && this.symbol && this.numB !== '') { 
      switch (this.symbol) {
        case '+':
          this.resultAB = Number(this.numA) + Number(this.numB)
          this.foFixedNumFloat() //! ??? (увімкнути якщо результат глючить)
          break
      case '-':
          this.resultAB = Number(this.numA) - Number(this.numB)
          this.foFixedNumFloat()
          break
      case '*':
        this.resultAB = Number(this.numA) * Number(this.numB)
        this.foFixedNumFloat()
          break
      case '/':
        this.resultAB = Number(this.numA) / Number(this.numB)
        this.foFixedNumFloat()
          break
      }
    }
  }


  foFixedNumFloat() {
    // if (this.varDigitStr.toString().replace(/[^0]/g, '').length >= this.numberLimit - 1) {
    //   return
    // } else {
      
    // }

    // if (this.resultAB.length > this.numberLimit) return
    // return

    // let intDigitLength = parseInt(this.varDigitStr) + '';
    // intDigitLength = intDigitLength.length
    // this.resultdigitLengthFloat = this.varDigitStr.length - intDigitLength
    // this.resultdigitLengthFloat = this.resultdigitLengthFloat + ''
    // if (this.varDigitStr.includes('.')) this.resultdigitLengthFloat;

    this.originResultAB = this.resultAB
    this.resultAB = this.fnToFixed(this.resultAB)
    if (Number(this.originResultAB) > 0 && Number(this.resultAB) == 0) {
      // return
      
      // let originalLength = this.$digit.innerHTML.length
      
      
      // this.resultAB = this.originResultAB.toExponential(this.numberLimit)
      // const regexExToNum = new RegExp(/^([+-]?\d+(\.\d+)?)e([+-]?\d+)$/, 'g')
      // let formatEtoN = this.$digit.innerHTML.replace(regexExToNum, '$1')
      // let symbolsE = this.resultAB.toString().length - formatEtoN.length //! К-сть символів  до Е 1234(e-2)
      // this.resultAB = this.originResultAB.toExponential(this.numberLimit - symbolsE)
      // console.log('formatEtoNformatEtoN', formatEtoN);

    } 

    console.error('this.resultdigitLengthFloat ' + this.resultdigitLengthFloat);
    console.error(this.resultdigitLengthFloat);

        // return this.resultAB = parseFloat(this.resultAB).toFixed(6)
        //     .replace(/0+$/g, '').replace(/\.$/g, '')
        // return this.resultAB = this.fnToFixed(this.resultAB)
        // this.resultAB = this.resultAB
        // if (this.resultAB.toString().replace(/[^0]/g, '').length > this.numberLimit) {
        //   this.resultAB = this.fnToFixed(this.resultAB)

        // } 
        // else if (this.resultAB === '') return

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
  
  fixDotWithoutZero(eTarget) {
    if (this.numA == '.') {
      this.numA = '0.'
      // this.digitRender('0.')
      this.varDigitStr = '0.'
      this.returnAorB = '0.'
    }
    if (this.numB == '.') {
      this.numB = '0.'
      // this.digitRender('0.')
      this.varDigitStr = '0.'
      this.returnAorB = '0.'
    }
    console.log('fixDotWithoutZerofixDotWithoutZero');
    if (this.arrDigigt[1] === '.') {
      this.numA = '0.'
    }
    
  }
  
	// digitRender(numberStr) {
  //   this.$digit.innerHTML = numberStr
	// }
  formatNumberForDisplay(nubmerStr) {
    // let str = '1234000.5678';
    let [integerPart, decimalPart] = nubmerStr.split('.');
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' '); //! ставить пробіли "1 234 000.5678"
    let formattedStr = decimalPart ? `${integerPart},${decimalPart}` : integerPart;
    // console.log(formattedStr); // "1 234 000.5678"
    if (this.lastIndex(nubmerStr.toString()) === '.'
        || this.lastIndex(nubmerStr.toString()) === ',') {
      formattedStr += ','
    }
    return formattedStr
  }


  roundingAfterDot() {
    let returnRound = this.numberLimit - Math.floor(this.varDigitStr).toString().length
    console.log('returnRound', `${this.numberLimit } - ${Math.floor(this.varDigitStr).toString().length}`);
    if (returnRound <= 0) {
      returnRound = 0
    }
    return returnRound
  }

  formattedDigitM() {
      let formattedNumber = this.formatNumberForDisplay(this.m.toString())
      this.$screenM.innerHTML = 'M=' + formattedNumber
      if (this.mOn === false) {
        this.$screenM.innerHTML = ''
      }
  }



  digitRender(eTarget) {
    this.varDigitStr = this.varDigitStr.toString()
    // this.varDigitStr = this.fnToFixed(this.varDigitStr)
      // if (this.varDigitStr.replace(/[^0]/g, '').length >= this.numberLimit) {
      //   return
      // } else {
      //   this.varDigitStr = this.fnToFixed(this.varDigitStr)
      // }
      // if (eTarget.dataset.math
      //     || eTarget.dataset.equal) {
      //       // if (this.varDigitStr.replace(/[^0]/g, '').length >= this.numberLimit) {
      //       //   return
      //       // } else {
      //         // this.varDigitStr = this.fnToFixed(this.varDigitStr)
      //       // }
      //       // this.varDigitStr = this.fnToFixed(this.varDigitStr)
      //     }
          console.log('nuuuuls', this.varDigitStr.replace(/[^0]/g, '').length);
      // if (this.varDigitStr >= this.numberLimit) this.varDigitStr = this.fnToFixed(this.varDigitStr)
    // if (this.varDigitStr.replace(/[^0]/g, '').length >= this.numberLimit - 1) {
    //   console.log('000000', this.varDigitStr.replace(/[^0]/g, '').length >= this.numberLimit - 1);
      
    // } else {
    // }
    if (this.varDigitStr.replace(/\./, '').length <= this.numberLimit 
        // || this.varDigitStr.replace(/[^0]/g, '').length >= this.numberLimit
        ) {
      let formattedNumber = this.formatNumberForDisplay(this.varDigitStr)
      this.$digit.innerHTML = formattedNumber
    } 
    // else this.$digit.innerHTML = this.varDigitStr.replace(/\./, ',')
    // else if (this.varDigitStr.length > this.numberLimit){ //! Форматує результат в науковий формат (число Ейлера або експоненційний формат)

    //   this.$digit.innerHTML = Number(this.varDigitStr).toExponential().replace('e+', 'e')
    //       let originalLength = this.$digit.innerHTML.length
    //       const regexExToNum = new RegExp(/^([+-]?\d+(\.\d+)?)e([+-]?\d+)$/, 'g')
    //       let formatEtoN = this.$digit.innerHTML.replace(regexExToNum, '$1').replace(/0+$/g, '')
    //       let roundingAfterDotExpon = this.numberLimit - (originalLength - formatEtoN.length + Math.floor(+formatEtoN).toString().length)
    //       console.log(`roundingAfterDotExpon ${this.numberLimit} - (${originalLength} - ${formatEtoN.length} + ${Math.floor(+formatEtoN).toString().length})`);
    //       console.log('roundingAfterDotExpon', roundingAfterDotExpon);

    //       this.$digit.innerHTML = Number(this.varDigitStr).toExponential(roundingAfterDotExpon).replace(/\.?0+e/g, 'e').replace('e+', 'e').replace(/\./, ',')
    // }

    //! Динамічне зменшення / збільшення розміру шрифту в циферблаті
    const container = document.querySelector('.calc__screen')
    const paddingLeftСontainer = parseFloat(getComputedStyle(container).paddingLeft);
    const paddingRightСontainer = parseFloat(getComputedStyle(container).paddingRight);
    const widthContainer = container.offsetWidth - paddingLeftСontainer - paddingRightСontainer
    console.log('widthContainer', widthContainer);
    console.log('this.$digit', this.$digit.offsetWidth);
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
  
  percentBtn(eTarget) { //! кнопки і операції => 10, %, =0.1 (numA = numA / 100)
    if (eTarget.dataset.percent === '%') {
      if (this.numA !== '' && this.numB === '') { 

          if (this.symbol === '') {
            this.numA = this.fnToFixed(this.numA / 100)
            this.varDigitStr = this.numA
          }

          if (this.symbol === '+' || this.symbol === '-') { //! кнопки і операції => 10, + or -, % (this.numB = this.numA / 100 * this.numA)
            this.numB = this.fnToFixed(this.numA / 100 * this.numA)
            this.varDigitStr = this.numB
          }  

          if (this.symbol === '*' || this.symbol === '/') { //! кнопки і операції => 10, * or /, % (this.numB = this.numA / 100)
            this.numB = this.fnToFixed(this.numA / 100)
            this.varDigitStr = this.numB
            }
      } else if (this.numA !== '' && this.numB !== '') {

          if (this.symbol === '+' || this.symbol === '-'){ //! кнопки і операції => 50, + or -, 20, % (this.numB = this.numA / 100 * this.numB)
            this.numB = this.fnToFixed(this.numA / 100 * this.numB)
            this.varDigitStr = this.numB
          }  

          if (this.symbol === '*' || this.symbol === '/') { //! кнопки і операції => 50, + or -, 20, % (this.numB = this.numA / 100 * this.numB)
            this.numB = this.fnToFixed(this.numB / 100)
            this.varDigitStr = this.numB
          }  
      } 
		}
  }

  fixMBtns(eTarget) {
    if (this.countMbtns > 1 && eTarget.dataset.number) {
      this.numA = ''
      this.symbol = ''
      this.numB = ''
    }
  }

  btnMplus(eTarget) {

    const btnsMoperations = ()=> {
      if (eTarget.dataset.m === 'm+') {
        this.m = Number(this.m) + Number(this.varDigitStr)
        this.m = this.fnToFixed(this.m)
      }
    }
    
    if (eTarget.dataset.number || eTarget.dataset.math) {
      this.countMbtns = 1
    }
    if (eTarget.dataset.m === 'mc') {
      this.m = 0
      this.$screenM.innerHTML = ''
      this.mOn = false
    }
    if (eTarget.dataset.m === 'm+' || eTarget.dataset.m === 'm-') {
      this.countMbtns += 1
      this.mOn = true
      if (this.numA !== '' 
      && this.numB !== '' 
      && this.symbol !== ''
      && this.equalCount === 1) {
        this.buttonsEqual()
        btnsMoperations()
        
        if (this.numA !== '' 
            && this.symbol !== '' 
            && this.numB === ''
            && this.equalCount > 1) {
              this.numB = ''
              this.symbol = ''
              this.noNumBEqualNumA()
        }
        this.$screenM.innerHTML = this.m
      } else {
        btnsMoperations()
        this.$screenM.innerHTML = this.m
      }
        this.numA = this.m
        // this.numA = ''
        this.numB = ''
        this.symbol = ''
    }
    if (eTarget.dataset.m === 'mr') {
        if (this.numB === '' && this.symbol === ''){
          this.numA = this.m
          this.varDigitStr = '' + this.m
        } else if (this.numA !== '' && this.symbol !== '') {
          this.numB = this.m
          this.varDigitStr = '' + this.m
        }
     

    }
  }


}

// ========================= 