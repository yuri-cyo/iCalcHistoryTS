export class Calc {
	constructor(selector, options) {
		this.options = options
		this.$el = document.querySelector(`#${selector}`)
		// this.$btns = document.querySelector('.button')
		this.$digit = document.querySelector('[data-digit]')
    this.$buttonAC = document.querySelector('[data-clear]')
    this.$buttonsMath = document.querySelectorAll('[data-math]')
		
    this.negativeCount = 1
    this.equalCount = 1

		this.numA = ''
		this.symbol = ''
		this.numB = ''
		this.resultAB = ''
    this.returnAorB = ''
    this.statuslastDot = false
    this.numberAfterDot = null
    this.statusnoNumBEqualNumA = false

    this.digitCopy = ''
    this.arrDigigt = ['0']

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
    this.numA = ''
    this.numB = ''
    this.symbol = ''
    this.resultAB = ''
    this.returnAorB = ''
    this.negativeCount = 1 //!
    this.equalCount = 1
    this.statuslastDot = false
    this.statusnoNumBEqualNumA = false
    this.mathBtnsClearActive()
    // this.arrDigigt = ['0']
  }
  
  clearOneSymbol() {
    if (this.targetDataSet.clearone === 'c' && this.returnAorB !== '') {
      this.mathBtnsClearActive()

      const fnNumAClearOneSymbol = () => {
        this.digitRender(this.$digit.innerHTML.slice(0, -1))
        this.numA = this.$digit.innerHTML
        this.returnAorB = this.$digit.innerHTML
      }
      const fnNumBClearOneSymbol = () => {
        this.digitRender(this.$digit.innerHTML.slice(0, -1))
        this.numB = this.$digit.innerHTML
        this.returnAorB = this.$digit.innerHTML
      }
      
      if (
        this.symbol === '' && 
        this.numB === '') {
          if (this.lastIndex(this.$digit.innerHTML) === '.') {
            this.statuslastDot = false
            this.digitRender(this.$digit.innerHTML.slice(0, -1))
            this.numberAfterDot = null
            this.numB.slice(0, -1)
            }   
            fnNumAClearOneSymbol()
          }

          if (this.numA !== ''
          && this.symbol !== '') {
              if (this.lastIndex(this.$digit.innerHTML) === '.') {
                this.statuslastDot = false
                this.digitRender(this.$digit.innerHTML.slice(0, -1))
                this.numberAfterDot = null
                }   
                fnNumBClearOneSymbol()
          }
          if (this.numA === '' || this.numB === '' ) {
            if (this.$digit.innerHTML === '') {
              this.digitRender('0')
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

      if (this.lastIndex(this.$digit.innerHTML) === '.') {
        this.digitRender(this.$digit.innerHTML.replace(/\.$/d, '')) //! Fix last dot!
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

      this.digitRender(this.numA)  //* вивід на табло numA
      this.fixDots()
      this.removeLastDot()
      this.returnAorB = this.numA
      break

      case 2: //! ================================== case 2 ================================

      this.fixMultiZero(this.numB)

      if (x === 2 && modifier === '=') this.numB = value //* при клікі на число додається в змінну numA
      if (x === 2 && modifier === '+') this.numB += value //* при клікі на число додається в змінну numA
      
      this.fixDots()
      this.digitRender(this.numB)
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

    this.digitRender(this.$digit.innerHTML
                    .replace(/-[^.\d]+/g,"")
                    .replace( /^([^\.]*\.)|\./g, '$1' ))

    if (this.lastIndex(this.$digit.innerHTML) === '.' && this.options.includes(this.targetDataSet.math)) {
      this.digitRender(this.$digit.innerHTML.replace(/\.$/d), '')
    }
    
  }


  removeLastDot() {
    console.error('this.statuslastDot ' + this.statuslastDot);
    if (this.lastIndex(this.numAB()) === '.') {
      this.statuslastDot = true
      this.AorB(this.numAB().replace(/\.$/d, '') , '=')
      this.digitRender(this.numAB() + '.')
    }
    if (this.statuslastDot === true 
        && this.lastIndex(this.numAB()) !== '.'
        && this.targetDataSet.number !== '.'
        && this.targetDataSet.number !== '-') {
          console.error('this.statuslastDot ' + this.statuslastDot);
          this.statuslastDot = false
          // let this.numberAfterDot = null
          this.numberAfterDot = this.lastIndex(this.numAB())
          
          this.AorB(this.numAB().replace(/.$/d, '.' + this.numberAfterDot), '=')

          if (this.numAB().length === 2 && this.numAB()[0] === '.') {
            this.AorB(0 + this.numAB(), '=')
          }

          console.error('this.statuslastDot + NUM ' + this.statuslastDot);
          console.error('this.numberAfterDot + NUM ' + this.numberAfterDot);
        }

    if (this.numAB() === '' && this.statuslastDot === true) {
      // this.$digit.innerHTML = '0.'
      this.AorB('0', '=')
      this.digitRender('0.')
    }
    if (typeof this.targetDataSet.math === 'string') {
      this.statuslastDot = false
    }
        // if (this.targetDataSet.number !== '.' && this.statuslastDot === true) {
        // }
  }

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
      this.digitRender(this.resultAB)
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
    if(this.options.includes(this.targetDataSet.math)
        && this.numA !== ''
        && this.symbol !== ''
        && this.numB !== '') {
          
      console.error('includes')
      
      this.numA = this.resultAB
      this.digitRender(this.numA)
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
        this.digitRender(this.numA)
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
          // this.resultAB = parseFloat(this.resultAB).toFixed(10)
          //   .replace(/0+$/g, '').replace(/\.$/g, '')
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
    let intDigitLength = parseInt(this.$digit.innerHTML) + '';
    intDigitLength = intDigitLength.length
    this.resultdigitLengthFloat = this.$digit.innerHTML.length - intDigitLength
    this.resultdigitLengthFloat = this.resultdigitLengthFloat + ''
    if (this.$digit.innerHTML.includes('.')) this.resultdigitLengthFloat;

    console.error('this.resultdigitLengthFloat ' + this.resultdigitLengthFloat);
    console.error(this.resultdigitLengthFloat);

        // return this.resultAB = parseFloat(this.resultAB).toFixed(6)
        //     .replace(/0+$/g, '').replace(/\.$/g, '')
        return this.resultAB = this.fnToFixed(this.resultAB)
  }

  fnToFixed(num) {
    num = parseFloat(num).toFixed(6)
            .replace(/0+$/g, '').replace(/\.$/g, '')
    return num
  }
  
  fixDotWithoutZero() {
    if (this.numA === '.') {
      this.numA = '0.'
      this.digitRender('0.')
      this.returnAorB = '0.'
    }
    if (this.numB === '.') {
      this.numB = '0.'
      this.digitRender('0.')
      this.returnAorB = '0.'
    }
  }
  
	digitRender(numberStr) {
    this.$digit.innerHTML = numberStr
	}

  blinkingDigit() {
    this.arrDigigt.push(this.$digit.innerHTML)
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
            this.digitRender(this.numA)
          }

          if (this.symbol === '+' || this.symbol === '-') { //! кнопки і операції => 10, + or -, % (this.numB = this.numA / 100 * this.numA)
            this.numB = this.fnToFixed(this.numA / 100 * this.numA)
            // this.numB = this.numA / 100 * this.numA
            
            // this.numA = this.numA / 100
            this.digitRender(this.numB)
            console.log('if percent', 1);
          }  

          if (this.symbol === '*' || this.symbol === '/') { //! кнопки і операції => 10, * or /, % (this.numB = this.numA / 100)
            this.numB = this.fnToFixed(this.numA / 100)
            // this.numA = this.numA / 100
          this.digitRender(this.numB)
          console.log('if percent', 2);
          }
      } else if (this.numA !== '' && this.numB !== '') {

          if (this.symbol === '+' || this.symbol === '-'){ //! кнопки і операції => 50, + or -, 20, % (this.numB = this.numA / 100 * this.numB)
            this.numB = this.fnToFixed(this.numA / 100 * this.numB)
            // this.numA = this.numA / 100
            this.digitRender(this.numB)
            console.log('if percent', 3);
          }  

          if (this.symbol === '*' || this.symbol === '/') { //! кнопки і операції => 50, + or -, 20, % (this.numB = this.numA / 100 * this.numB)
            this.numB = this.fnToFixed(this.numB / 100)
            this.digitRender(this.numB)
            console.log('if percent', 4);
          }  
      } 
		}
  }


}

// ========================= 