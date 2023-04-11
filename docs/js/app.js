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
            this.options = options;
            this.$el = document.querySelector(`#${selector}`);
            this.$digit = document.querySelector("[data-digit]");
            this.$buttonAC = document.querySelector("[data-clear]");
            this.$buttonsMath = document.querySelectorAll("[data-math]");
            this.negativeCount = 1;
            this.equalCount = 1;
            this.numA = "";
            this.symbol = "";
            this.numB = "";
            this.resultAB = "";
            this.returnAorB = "";
            this.statuslastDot = false;
            this.numberAfterDot = null;
            this.statusnoNumBEqualNumA = false;
            this.digitCopy = "";
            this.arrDigigt = [ "0" ];
        }
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
            this.numA = "";
            this.numB = "";
            this.symbol = "";
            this.resultAB = "";
            this.returnAorB = "";
            this.negativeCount = 1;
 //!
                        this.equalCount = 1;
            this.statuslastDot = false;
            this.statusnoNumBEqualNumA = false;
            this.mathBtnsClearActive();
        }
        clearOneSymbol() {
            if ("c" === this.targetDataSet.clearone && "" !== this.returnAorB) {
                this.mathBtnsClearActive();
                const fnNumAClearOneSymbol = () => {
                    this.digitRender(this.$digit.innerHTML.slice(0, -1));
                    this.numA = this.$digit.innerHTML;
                    this.returnAorB = this.$digit.innerHTML;
                };
                const fnNumBClearOneSymbol = () => {
                    this.digitRender(this.$digit.innerHTML.slice(0, -1));
                    this.numB = this.$digit.innerHTML;
                    this.returnAorB = this.$digit.innerHTML;
                };
                if ("" === this.symbol && "" === this.numB) {
                    if ("." === this.lastIndex(this.$digit.innerHTML)) {
                        this.statuslastDot = false;
                        this.digitRender(this.$digit.innerHTML.slice(0, -1));
                        this.numberAfterDot = null;
                        this.numB.slice(0, -1);
                    }
                    fnNumAClearOneSymbol();
                }
                if ("" !== this.numA && "" !== this.symbol) {
                    if ("." === this.lastIndex(this.$digit.innerHTML)) {
                        this.statuslastDot = false;
                        this.digitRender(this.$digit.innerHTML.slice(0, -1));
                        this.numberAfterDot = null;
                    }
                    fnNumBClearOneSymbol();
                }
                if ("" === this.numA || "" === this.numB) if ("" === this.$digit.innerHTML) this.digitRender("0");
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
                if ("." === this.lastIndex(this.$digit.innerHTML)) this.digitRender(this.$digit.innerHTML.replace(/\.$/d, ""));
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
                this.digitRender(this.numA);
                this.fixDots();
                this.removeLastDot();
                this.returnAorB = this.numA;
                break;

              case 2:
                //! ================================== case 2 ================================
                this.fixMultiZero(this.numB);
                if (2 === x && "=" === modifier) this.numB = value;
                if (2 === x && "+" === modifier) this.numB += value;
                this.fixDots();
                this.digitRender(this.numB);
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
            this.digitRender(this.$digit.innerHTML.replace(/-[^.\d]+/g, "").replace(/^([^\.]*\.)|\./g, "$1"));
            if ("." === this.lastIndex(this.$digit.innerHTML) && this.options.includes(this.targetDataSet.math)) this.digitRender(this.$digit.innerHTML.replace(/\.$/d), "");
        }
        removeLastDot() {
            console.error("this.statuslastDot " + this.statuslastDot);
            if ("." === this.lastIndex(this.numAB())) {
                this.statuslastDot = true;
                this.AorB(this.numAB().replace(/\.$/d, ""), "=");
                this.digitRender(this.numAB() + ".");
            }
            if (true === this.statuslastDot && "." !== this.lastIndex(this.numAB()) && "." !== this.targetDataSet.number && "-" !== this.targetDataSet.number) {
                console.error("this.statuslastDot " + this.statuslastDot);
                this.statuslastDot = false;
                this.numberAfterDot = this.lastIndex(this.numAB());
                this.AorB(this.numAB().replace(/.$/d, "." + this.numberAfterDot), "=");
                if (2 === this.numAB().length && "." === this.numAB()[0]) this.AorB(0 + this.numAB(), "=");
                console.error("this.statuslastDot + NUM " + this.statuslastDot);
                console.error("this.numberAfterDot + NUM " + this.numberAfterDot);
            }
            if ("" === this.numAB() && true === this.statuslastDot) {
                this.AorB("0", "=");
                this.digitRender("0.");
            }
            if ("string" === typeof this.targetDataSet.math) this.statuslastDot = false;
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
                this.digitRender(this.resultAB);
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
            if (this.options.includes(this.targetDataSet.math) && "" !== this.numA && "" !== this.symbol && "" !== this.numB) {
                console.error("includes");
                this.numA = this.resultAB;
                this.digitRender(this.numA);
                this.numB = "";
            }
        }
        noNumBEqualNumA() {
            if ("" !== this.numA && "" !== this.symbol && "" === this.numB && "=" === this.targetDataSet.equal) {
                this.numB = this.numA;
                this.mathOperations();
                this.numA = this.resultAB;
                this.digitRender(this.numA);
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
        foFixedNumFloat() {
            let intDigitLength = parseInt(this.$digit.innerHTML) + "";
            intDigitLength = intDigitLength.length;
            this.resultdigitLengthFloat = this.$digit.innerHTML.length - intDigitLength;
            this.resultdigitLengthFloat = this.resultdigitLengthFloat + "";
            if (this.$digit.innerHTML.includes(".")) this.resultdigitLengthFloat;
            console.error("this.resultdigitLengthFloat " + this.resultdigitLengthFloat);
            console.error(this.resultdigitLengthFloat);
            return this.resultAB = this.fnToFixed(this.resultAB);
        }
        fnToFixed(num) {
            num = parseFloat(num).toFixed(6).replace(/0+$/g, "").replace(/\.$/g, "");
            return num;
        }
        fixDotWithoutZero() {
            if ("." === this.numA) {
                this.numA = "0.";
                this.digitRender("0.");
                this.returnAorB = "0.";
            }
            if ("." === this.numB) {
                this.numB = "0.";
                this.digitRender("0.");
                this.returnAorB = "0.";
            }
        }
        digitRender(numberStr) {
            this.$digit.innerHTML = numberStr;
        }
        blinkingDigit() {
            this.arrDigigt.push(this.$digit.innerHTML);
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
                    this.digitRender(this.numA);
                }
                if ("+" === this.symbol || "-" === this.symbol) {
                    //! кнопки і операції => 10, + or -, % (this.numB = this.numA / 100 * this.numA)
                    this.numB = this.fnToFixed(this.numA / 100 * this.numA);
                    this.digitRender(this.numB);
                    console.log("if percent", 1);
                }
                if ("*" === this.symbol || "/" === this.symbol) {
                    //! кнопки і операції => 10, * or /, % (this.numB = this.numA / 100)
                    this.numB = this.fnToFixed(this.numA / 100);
                    this.digitRender(this.numB);
                    console.log("if percent", 2);
                }
            } else if ("" !== this.numA && "" !== this.numB) {
                if ("+" === this.symbol || "-" === this.symbol) {
                    //! кнопки і операції => 50, + or -, 20, % (this.numB = this.numA / 100 * this.numB)
                    this.numB = this.fnToFixed(this.numA / 100 * this.numB);
                    this.digitRender(this.numB);
                    console.log("if percent", 3);
                }
                if ("*" === this.symbol || "/" === this.symbol) {
                    //! кнопки і операції => 50, + or -, 20, % (this.numB = this.numA / 100 * this.numB)
                    this.numB = this.fnToFixed(this.numB / 100);
                    this.digitRender(this.numB);
                    console.log("if percent", 4);
                }
            }
        }
    }
    const calc = new Calc("buttonsCalc", [ "ac", "%", "/", "*", "-", "+" ]);
    calc.$el.addEventListener("click", (e => {
        if (e.target.closest(".button")) {
            calc.targetDataSet = e.target.dataset;
            calc.target = e.target;
            console.warn("press targetttttttttttttttttttttttttttttttt!!! " + calc.targetDataSet);
            if ("string" !== typeof calc.targetDataSet) ;
            calc.symbolEntry();
            calc.numbersEntryAorB();
 //! Запис числа 1 або 2
                        calc.removeLastDot();
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
        }
    }));
    window["FLS"] = true;
    isWebp();
})();