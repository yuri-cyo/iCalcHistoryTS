import { Calc } from "../modules/modules.js"

/// ========================= 

const calc = new Calc('buttonsCalc', ['ac', '%', '/', '*', '-', '+'])
// calc.mathOperations()


calc.$el.addEventListener('click', (e)=> {
	if (e.target.closest('.button')) {
		// console.error('includec button');
		calc.targetDataSet = e.target.dataset
		calc.target = e.target

		console.warn('press targetttttttttttttttttttttttttttttttt!!! ' + calc.targetDataSet)
		if (typeof calc.targetDataSet !== 'string') {
			
		}
		calc.symbolEntry()
		
		
		// calc.removeLastDot()
		// calc.numEntryA() //! Запис числа 1
		// calc.numEntryB() //! Запис числа 2
		calc.numbersEntryAorB() //! Запис числа 1 або 2
		// calc.removeLastDot()
		calc.removeLastDot()
		calc.buttonNegative()
		calc.equalSymbol() //! 1+2+3 FIX PROBLEM! OLD
		
		if (calc.targetDataSet.equal === '=') {
			calc.buttonsEqual() //! =
		}

		calc.percentBtn(e.target)
		
		
		calc.noNumBEqualNumA() 
		calc.clearOneSymbol()
		calc.mathOperations() //! Запуск математичної операції
		
		calc.buttonAC()
		
		
		calc.fixDotWithoutZero()
		calc.clearAfterEqualPressNum()
		calc.buttonACContent()
		calc.blinkingDigit()
		// calc.fixDots()
	
		// calc.baseDigit()
	
		// calc.symbolEntry() //! Запис математичного символа
	
		 //! рперший нуль тільки один!
	
	
	
		console.group('looooooooooooooooooooooooooooooooooooooooogs'); //! LOGS
				console.warn('statuslastDot ' + calc.statuslastDot)
        		console.warn('statusnoNumBEqualNumA ' + calc.statusnoNumBEqualNumA)
        		console.warn('equalCount ' + calc.equalCount)
				console.log('numA = ' + calc.numA);
				console.log('symbol = ' + calc.symbol);
				console.log('numB = ' + calc.numB);
				console.log('resultAB = ' + calc.resultAB)
				console.log('equalCount = ' + calc.equalCount)
				console.log('returnAorB  ' + calc.returnAorB)
				console.log('numAB()  ' + calc.numAB())
				console.warn('calc.negativeCount ' + calc.negativeCount);
				console.warn('last symbol in digit ' + calc.returnAorB[calc.returnAorB.length - 1])
				console.warn('digitCopy ',calc.digitCopy)
				console.warn('$digit ',calc.$digit.innerHTML)
	}

	

				
})



// calc.mathOperations()

// =====================================================

