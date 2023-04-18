(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    class Calc {
        constructor(selector, options) {
            this.arrOperations = [ "ac", "%", "/", "*", "-", "+" ];
            this.$el = document.querySelector(`#${selector}`);
            this.$digit = document.querySelector("[data-digit]");
            this.numberLimit = options.numberLimit;
            //! this.roundingAfterDot() - Повертає розраховану кількість чисел після коми!!!
                        this.varDigitStr = "";
            this.$buttonAC = document.querySelector("[data-clear]");
            this.$buttonsMath = document.querySelectorAll("[data-math]");
            this.negativeCount = 1;
            this.equalCount = 1;
            this.numA = "";
            this.symbol = "";
            this.numB = "";
            this.resultAB = "";
            this.returnAorB = "";
            this.statusnoNumBEqualNumA = false;
            this.digitCopy = "";
            this.arrDigigt = [ "0" ];
        }
        digitStyle() {}
        buttonACContent() {
            if ("" !== this.numA || "" !== this.numB) this.$buttonAC.innerHTML = "C"; else if ("" === this.numA || "" === this.numB) this.$buttonAC.innerHTML = "AC";
        }
        buttonAC() {
            if ("ac" === this.targetDataSet.clear) {
                this.clearVars();
                console.warn("AC clear!");
            }
        }
        clearVars() {
            this.$digit.innerHTML = "0";
            this.varDigitStr = "0";
            this.numA = "";
            this.numB = "";
            this.symbol = "";
            this.resultAB = "";
            this.returnAorB = "";
            this.negativeCount = 1;
 //!
                        this.equalCount = 1;
            this.statusnoNumBEqualNumA = false;
            this.mathBtnsClearActive();
        }
        clearOneSymbol() {
            if ("c" === this.targetDataSet.clearone && "" !== this.returnAorB) {
                this.mathBtnsClearActive();
                const fnNumAClearOneSymbol = () => {
                    this.varDigitStr = this.varDigitStr.slice(0, -1);
                    this.numA = this.varDigitStr;
                    this.returnAorB = this.varDigitStr;
                };
                const fnNumBClearOneSymbol = () => {
                    this.varDigitStr = this.varDigitStr.slice(0, -1);
                    this.numB = this.varDigitStr;
                    this.returnAorB = this.varDigitStr;
                };
                if ("" === this.symbol && "" === this.numB) fnNumAClearOneSymbol();
                if ("" !== this.numA && "" !== this.symbol) fnNumBClearOneSymbol();
                if ("" === this.numA || "" === this.numB) if ("" === this.varDigitStr) this.varDigitStr = "0";
                if ("-" === this.varDigitStr) {
                    this.varDigitStr = "0";
                    this.AorB("-0", "=");
                    if ("-" === this.numA) {
                        this.numA = "0";
                        this.returnAorB = "0";
                    }
                    if ("-" === this.numB) {
                        this.numB = "0";
                        this.returnAorB = "0";
                    }
                }
            }
        }
        AorB(a, opertion) {
            if ("string" === typeof this.targetDataSet.number && "" === this.symbol && "" === this.numB) {
                if ("=" === opertion) this.nextNumber(1, a, "=");
                if ("+" === opertion) this.nextNumber(1, a, "+");
                this.mathBtnsClearActive();
            }
            if ("string" === typeof this.targetDataSet.number && "" !== this.numA && "" !== this.symbol) {
                if ("=" === opertion) this.nextNumber(2, a, "=");
                if ("+" === opertion) this.nextNumber(2, a, "+");
                this.mathBtnsClearActive();
            }
        }
        numbersEntryAorB() {
            this.AorB(this.targetDataSet.number, "+");
            console.error("numAB() " + this.numAB());
        }
        mathBtnsClearActive() {
            for (let elem of this.$buttonsMath) {
                function removeClassMathActive() {
                    elem.classList.remove("button__math-active");
                }
                removeClassMathActive();
            }
        }
        symbolEntry() {
            if (this.equalCount > 1 && "string" === typeof this.targetDataSet.math) this.numB = "";
            if ("" !== this.numA && "string" === typeof this.targetDataSet.math) {
                this.equalCount = 1;
                this.statusnoNumBEqualNumA = false;
                this.symbol = this.targetDataSet.math;
                this.mathBtnsClearActive();
                this.target.classList.toggle("button__math-active");
                if ("." === this.lastIndex(this.varDigitStr)) this.varDigitStr = this.varDigitStr.replace(/\.$/d, "");
 //! Fix last dot!
                        }
        }
        numAB() {
            if ("" === this.symbol) return this.numA; else return this.numB;
        }
        returnVarAB(AorB) {
            if (this.numA === this.numAB()) this.numA = AorB; else if (this.numB === this.numAB()) this.numB = AorB;
        }
        nextNumber(x, value, modifier) {
            switch (x) {
              case 1:
                //! ================================== case 1 ================================
                this.fixMultiZero(this.numA);
                if (1 === x && "=" === modifier) this.numA = value;
                if (1 === x && "+" === modifier) this.numA += value;
                this.varDigitStr = this.numA;
                this.fixDots();
                this.returnAorB = this.numA;
                break;

              case 2:
                //! ================================== case 2 ================================
                this.fixMultiZero(this.numB);
                if (2 === x && "=" === modifier) this.numB = value;
                if (2 === x && "+" === modifier) this.numB += value;
                this.fixDots();
                this.varDigitStr = this.numB;
                this.returnAorB = this.numB;
                break;
            }
        }
        fixMultiZero(zeroVar) {
            if ("0" === zeroVar[0] && "." !== zeroVar[1]) {
                if ("" !== this.numA && "" === this.numB) this.numA = this.numA.slice(1);
                if ("" !== this.numB) this.numB = this.numB.slice(1);
            }
        }
        lastIndex(x) {
            return x[x.length - 1];
        }
        fixDots() {
            this.returnVarAB(this.numAB().replace(/-[^.\d]+/g, "").replace(/^([^\.]*\.)|\./g, "$1"));
            this.varDigitStr = this.varDigitStr.replace(/-[^.\d]+/g, "").replace(/^([^\.]*\.)|\./g, "$1");
            if ("." === this.lastIndex(this.varDigitStr) && this.arrOperations.includes(this.targetDataSet.math)) this.varDigitStr = this.varDigitStr.replace(/\.$/d, "");
        }
        buttonNegative() {
            if ("-" === this.lastIndex(this.numAB())) this.AorB(this.numAB().replace(/-$/g, "").replace(/^/g, "-"), "=");
            if ("-" === this.numAB()) this.AorB(this.numAB().replace(/$/g, "0"), "=");
            if ("-" === this.numAB()[0] && "0" === this.numAB()[1] && "." !== this.numAB()[2] && "string" === typeof this.numAB()[2]) this.AorB(this.numAB().replace(/^-0/g, "-"), "=");
        }
        buttonsEqual() {
            if ("." === this.lastIndex(this.numB)) this.numB.replace(/\.$/d, "");
            if ("" !== this.numA && "" !== this.symbol && "" !== this.numB) {
                this.equalCount += 1;
                console.warn("method =");
                console.error("equalCount = " + this.equalCount);
                console.error("buttonsEqual() numB " + this.numB);
                this.varDigitStr = this.resultAB;
                this.numA = this.resultAB;
            }
        }
        clearAfterEqualPressNum() {
            if ("string" === typeof this.targetDataSet.number && this.equalCount > 1) {
                let saveNumA = "";
                saveNumA += this.targetDataSet.number;
                this.clearVars();
                this.AorB(saveNumA, "+");
                saveNumA = "";
                console.error("cccccccccccccccccccccccccclearAfterEqualPressNum() this.equalCount " + this.equalCount);
            }
        }
        equalSymbol() {
            if (this.arrOperations.includes(this.targetDataSet.math) && "" !== this.numA && "" !== this.symbol && "" !== this.numB) {
                console.error("includes");
                this.numA = this.resultAB;
                this.varDigitStr = this.numA;
                this.numB = "";
            }
        }
        noNumBEqualNumA() {
            if ("" !== this.numA && "" !== this.symbol && "" === this.numB && "=" === this.targetDataSet.equal) {
                this.numB = this.numA;
                this.mathOperations();
                this.numA = this.resultAB;
                this.varDigitStr = this.numA;
                this.resultAB = this.numA;
                this.statusnoNumBEqualNumA = true;
                this.equalCount += 1;
                this.mathBtnsClearActive();
            }
        }
        mathOperations() {
            console.warn("this.symbol " + this.symbol);
            if ("" !== this.numA && this.symbol && "" !== this.numB) switch (this.symbol) {
              case "+":
                this.resultAB = Number(this.numA) + Number(this.numB);
                this.foFixedNumFloat();
                break;

              case "-":
                this.resultAB = Number(this.numA) - Number(this.numB);
                this.foFixedNumFloat();
                break;

              case "*":
                this.resultAB = Number(this.numA) * Number(this.numB);
                this.foFixedNumFloat();
                break;

              case "/":
                this.resultAB = Number(this.numA) / Number(this.numB);
                this.foFixedNumFloat();
                break;
            }
        }
        limitResultAB() {
            if (this.varDigitStr.toString().length > this.numberLimit) {
                this.varDigitStr = Number(this.varDigitStr).toExponential(this.roundingAfterDot());
                this.isExponential = true;
            } else this.isExponential = false;
        }
        foFixedNumFloat() {
            let intDigitLength = parseInt(this.varDigitStr) + "";
            intDigitLength = intDigitLength.length;
            this.resultdigitLengthFloat = this.varDigitStr.length - intDigitLength;
            this.resultdigitLengthFloat = this.resultdigitLengthFloat + "";
            if (this.varDigitStr.includes(".")) this.resultdigitLengthFloat;
            console.error("this.resultdigitLengthFloat " + this.resultdigitLengthFloat);
            console.error(this.resultdigitLengthFloat);
            return this.resultAB = this.fnToFixed(this.resultAB);
        }
        fnToFixed(num) {
            num = parseFloat(num).toFixed(this.roundingAfterDot()).replace(/0+$/g, "").replace(/\.$/g, "");
            return num;
        }
        fixDotWithoutZero() {
            if ("." === this.numA) {
                this.numA = "0.";
                this.varDigitStr = "0.";
                this.returnAorB = "0.";
            }
            if ("." === this.numB) {
                this.numB = "0.";
                this.varDigitStr = "0.";
                this.returnAorB = "0.";
            }
        }
        roundingAfterDot() {
            let returnRound = this.numberLimit - Math.floor(this.varDigitStr).toString().length;
            if (returnRound <= 0) returnRound = 1;
            return returnRound;
        }
        digitRender() {
            const options = {
                maximumFractionDigits: 20,
                minimumFractionDigits: 0
            };
            if (this.varDigitStr.length <= this.numberLimit) {
                let formattedNumber = Number(this.varDigitStr).toLocaleString("uk-UA", options);
                console.log("varDigitStrvarDigitStrvarDigitStr", this.varDigitStr);
                if ("." === this.lastIndex(this.varDigitStr)) this.$digit.innerHTML = formattedNumber + ","; else this.$digit.innerHTML = formattedNumber;
            } else if (this.varDigitStr.length > this.numberLimit) {
                //! Форматує результат в науковий формат (число Ейлера або експоненційний формат)
                this.$digit.innerHTML = Number(this.varDigitStr).toExponential().replace("e+", "e");
                let originalLength = this.$digit.innerHTML.length;
                const regexExToNum = new RegExp(/^([+-]?\d+(\.\d+)?)e([+-]?\d+)$/, "g");
                let formatEtoN = this.$digit.innerHTML.replace(regexExToNum, "$1").replace(/0+$/g, "");
                let roundingAfterDotExpon = this.numberLimit - (originalLength - formatEtoN.length + Math.floor(+formatEtoN).toString().length);
                console.log("formatEtoN", formatEtoN);
                this.$digit.innerHTML = Number(this.varDigitStr).toExponential(roundingAfterDotExpon).replace(/\.?0+e/g, "e").replace("e+", "e");
                this.exponentialRound = roundingAfterDotExpon;
 //! вивід в консоль в файлі script.js
                        }
            const container = document.querySelector(".calc__screen");
            const paddingLeftСontainer = parseFloat(getComputedStyle(container).paddingLeft);
            const paddingRightСontainer = parseFloat(getComputedStyle(container).paddingRight);
            const widthContainer = container.offsetWidth - paddingLeftСontainer - paddingRightСontainer;
            console.log("widthContainer", widthContainer);
            console.log("this.$digit", this.$digit.offsetWidth);
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
            this.arrDigigt.push(this.varDigitStr);
            this.arrDigigt = this.arrDigigt.slice(-2);
            console.log("this.arrDigigt", this.arrDigigt);
            if (this.arrDigigt[0] === this.arrDigigt[1]) {
                this.$digit.style.opacity = 0;
                setTimeout((() => {
                    this.$digit.style.opacity = 1;
                }), 100);
            }
        }
        trueAllVars() {
            if ("" !== this.numA && "" !== this.numB && "" !== this.symbol) return true;
        }
        percentBtn(eTarget) {
            //! кнопки і операції => 10, %, =0.1 (numA = numA / 100)
            document.querySelector("[data-equal]");
            if ("%" === eTarget.dataset.percent) if ("" !== this.numA && "" === this.numB) {
                if ("" === this.symbol) {
                    this.numA = this.fnToFixed(this.numA / 100);
                    this.varDigitStr = this.numA;
                }
                if ("+" === this.symbol || "-" === this.symbol) {
                    //! кнопки і операції => 10, + or -, % (this.numB = this.numA / 100 * this.numA)
                    this.numB = this.fnToFixed(this.numA / 100 * this.numA);
                    this.varDigitStr = this.numB;
                    console.log("if percent", 1);
                }
                if ("*" === this.symbol || "/" === this.symbol) {
                    //! кнопки і операції => 10, * or /, % (this.numB = this.numA / 100)
                    this.numB = this.fnToFixed(this.numA / 100);
                    this.varDigitStr = this.numB;
                    console.log("if percent", 2);
                }
            } else if ("" !== this.numA && "" !== this.numB) {
                if ("+" === this.symbol || "-" === this.symbol) {
                    //! кнопки і операції => 50, + or -, 20, % (this.numB = this.numA / 100 * this.numB)
                    this.numB = this.fnToFixed(this.numA / 100 * this.numB);
                    this.varDigitStr = this.numB;
                    console.log("if percent", 3);
                }
                if ("*" === this.symbol || "/" === this.symbol) {
                    //! кнопки і операції => 50, + or -, 20, % (this.numB = this.numA / 100 * this.numB)
                    this.numB = this.fnToFixed(this.numB / 100);
                    this.varDigitStr = this.numB;
                    console.log("if percent", 4);
                }
            }
        }
    }
    const calc = new Calc("buttonsCalc", {
        numberLimit: 9
    });
    calc.$el.addEventListener("click", (e => {
        if (e.target.closest(".button")) {
            calc.targetDataSet = e.target.dataset;
            calc.target = e.target;
            console.warn("press targetttttttttttttttttttttttttttttttt!!! " + calc.targetDataSet);
            if ("string" !== typeof calc.targetDataSet) ;
            calc.symbolEntry();
            if (calc.varDigitStr.length < calc.numberLimit + 1) if (calc.varDigitStr.includes(".")) calc.numbersEntryAorB(); //! Запис числа 1 або 2
             else if (calc.varDigitStr.length < calc.numberLimit) calc.numbersEntryAorB();
 //! Запис числа 1 або 2
                        calc.buttonNegative();
            calc.equalSymbol();
 //! 1+2+3 FIX PROBLEM! OLD
                        if ("=" === calc.targetDataSet.equal) calc.buttonsEqual();
 //! =
                        calc.percentBtn(e.target);
            calc.noNumBEqualNumA();
            calc.clearOneSymbol();
            calc.mathOperations();
 //! Запуск математичної операції
                        calc.buttonAC();
            calc.fixDotWithoutZero();
            calc.clearAfterEqualPressNum();
            calc.buttonACContent();
            calc.digitRender();
            calc.blinkingDigit();
            //! рперший нуль тільки один!
                        console.group("looooooooooooooooooooooooooooooooooooooooogs");
 //! LOGS
                        console.warn("statuslastDot " + calc.statuslastDot);
            console.warn("statusnoNumBEqualNumA " + calc.statusnoNumBEqualNumA);
            console.warn("equalCount " + calc.equalCount);
            console.log("numA = " + calc.numA);
            console.log("symbol = " + calc.symbol);
            console.log("numB = " + calc.numB);
            console.log("resultAB = " + calc.resultAB);
            console.log("equalCount = " + calc.equalCount);
            console.log("returnAorB  " + calc.returnAorB);
            console.log("numAB()  " + calc.numAB());
            console.warn("calc.negativeCount " + calc.negativeCount);
            console.warn("last symbol in digit " + calc.returnAorB[calc.returnAorB.length - 1]);
            console.warn("digitCopy ", calc.digitCopy);
            console.warn("$digit ", calc.$digit.innerHTML);
            console.warn("varDigitStr ", calc.varDigitStr);
            console.warn("roundingAfterDot()", calc.roundingAfterDot());
            console.warn("exponentialRound", calc.exponentialRound);
        }
    }));
    window["FLS"] = true;
    isWebp();
})();