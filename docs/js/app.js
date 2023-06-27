(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
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
            this.originResultAB = "";
            this.returnAorB = "";
            this.statusnoNumBEqualNumA = false;
            this.digitCopy = "";
            this.arrDigigt = [ "0" ];
            this.mOn = false;
            this.m = 0;
            this.countMbtns = 1;
            this.$screenM = document.querySelector(".calc__m-screen");
        }
        btnsTouchNumbers() {
            document.body.addEventListener("touchstart", (e => {
                if (e.target.className.includes("button")) //! Android Vibration
                if (e.target.closest(".button")) if ("vibrate" in navigator) navigator.vibrate(75);
                let touchColor = "";
                let className = e.target.className;
                if (className.includes("button__m")) touchColor = "#737371";
                if (className.includes("button__control")) touchColor = "#D9D9D9";
                if (className.includes("button__number")) touchColor = "#737373";
                if (className.includes("button__math")) touchColor = "#F3C895";
                e.target.style.backgroundColor = touchColor;
                e.target.style.transition = "background-color 0s, opacity 0.5s, transform 0.2s";
            }), false);
            document.body.addEventListener("touchend", (function(e) {
                e.target.className;
                e.target.style.transition = "background-color 0.5s, opacity 0.5s, transform 0.2s";
                setTimeout((function() {
                    e.target.style.backgroundColor = "";
                }), 20);
            }), false);
        }
        buttonACContent() {
            if (this.numA !== "" || this.numB !== "") this.$buttonAC.innerHTML = "C"; else if (this.numA === "" || this.numB === "") this.$buttonAC.innerHTML = "AC";
        }
        buttonAC() {
            if (this.targetDataSet.clear === "ac") {
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
            if (this.targetDataSet.clearone === "c" && this.returnAorB !== "") {
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
                if (this.symbol === "" && this.numB === "") fnNumAClearOneSymbol();
                if (this.numA !== "" && this.symbol !== "") fnNumBClearOneSymbol();
                if (this.numA === "" || this.numB === "") if (this.varDigitStr === "") this.varDigitStr = "0";
                if (this.varDigitStr === "-") {
                    this.varDigitStr = "0";
                    this.AorB("-0", "=");
                    if (this.numA === "-") {
                        this.numA = "0";
                        this.returnAorB = "0";
                    }
                    if (this.numB === "-") {
                        this.numB = "0";
                        this.returnAorB = "0";
                    }
                }
            }
        }
        AorB(a, opertion) {
            if (typeof this.targetDataSet.number === "string" && this.symbol === "" && this.numB === "") {
                if (opertion === "=") this.nextNumber(1, a, "=");
                if (opertion === "+") this.nextNumber(1, a, "+");
                this.mathBtnsClearActive();
            }
            if (typeof this.targetDataSet.number === "string" && this.numA !== "" && this.symbol !== "") {
                if (opertion === "=") this.nextNumber(2, a, "=");
                if (opertion === "+") this.nextNumber(2, a, "+");
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
            if (this.equalCount > 1 && typeof this.targetDataSet.math === "string") this.numB = "";
            if (this.numA !== "" && typeof this.targetDataSet.math === "string") {
                this.equalCount = 1;
                this.statusnoNumBEqualNumA = false;
                this.symbol = this.targetDataSet.math;
                this.mathBtnsClearActive();
                this.target.classList.toggle("button__math-active");
                if (this.lastIndex(this.varDigitStr) === ".") this.varDigitStr = this.varDigitStr.replace(/\.$/d, "");
 //! Fix last dot!
                        }
        }
        numAB() {
            if (this.symbol === "") return this.numA; else return this.numB;
        }
        returnVarAB(AorB) {
            if (this.numA === this.numAB()) this.numA = AorB; else if (this.numB === this.numAB()) this.numB = AorB;
        }
        nextNumber(x, value, modifier) {
            switch (x) {
              case 1:
                //! ================================== case 1 ================================
                this.fixMultiZero(this.numA);
                if (x === 1 && modifier === "=") this.numA = value;
                if (x === 1 && modifier === "+") this.numA += value;
                this.varDigitStr = this.numA;
                this.fixDots();
                this.returnAorB = this.numA;
                break;

              case 2:
                //! ================================== case 2 ================================
                this.fixMultiZero(this.numB);
                if (x === 2 && modifier === "=") this.numB = value;
                if (x === 2 && modifier === "+") this.numB += value;
                this.fixDots();
                this.varDigitStr = this.numB;
                this.returnAorB = this.numB;
                break;
            }
        }
        fixMultiZero(zeroVar) {
            if (zeroVar[0] === "0" && zeroVar[1] !== ".") {
                if (this.numA !== "" && this.numB === "") this.numA = this.numA.slice(1);
                if (this.numB !== "") this.numB = this.numB.slice(1);
            }
        }
        lastIndex(x) {
            return x[x.length - 1];
        }
        fixDots() {
            this.returnVarAB(this.numAB().replace(/-[^.\d]+/g, "").replace(/^([^\.]*\.)|\./g, "$1"));
            this.varDigitStr = this.varDigitStr.replace(/-[^.\d]+/g, "").replace(/^([^\.]*\.)|\./g, "$1");
            if (this.lastIndex(this.varDigitStr) === "." && this.arrOperations.includes(this.targetDataSet.math)) this.varDigitStr = this.varDigitStr.replace(/\.$/d, "");
        }
        buttonNegative() {
            if (this.lastIndex(this.numAB()) === "-") this.AorB(this.numAB().replace(/-$/g, "").replace(/^/g, "-"), "=");
            if (this.numAB() === "-") this.AorB(this.numAB().replace(/$/g, "0"), "=");
            if (this.numAB()[0] === "-" && this.numAB()[1] === "0" && this.numAB()[2] !== "." && typeof this.numAB()[2] === "string") this.AorB(this.numAB().replace(/^-0/g, "-"), "=");
        }
        buttonsEqual() {
            if (this.lastIndex(this.numB) === ".") this.numB.replace(/\.$/d, "");
            if (this.numA !== "" && this.symbol !== "" && this.numB !== "") {
                this.equalCount += 1;
                console.warn("method =");
                console.error("equalCount = " + this.equalCount);
                console.error("buttonsEqual() numB " + this.numB);
                this.varDigitStr = this.resultAB;
                this.numA = this.resultAB;
            }
        }
        clearAfterEqualPressNum() {
            if (typeof this.targetDataSet.number === "string" && this.equalCount > 1) {
                let saveNumA = "";
                saveNumA += this.targetDataSet.number;
                this.clearVars();
                this.AorB(saveNumA, "+");
                saveNumA = "";
                console.error("cccccccccccccccccccccccccclearAfterEqualPressNum() this.equalCount " + this.equalCount);
            }
        }
        equalSymbol() {
            if (this.arrOperations.includes(this.targetDataSet.math) && this.numA !== "" && this.symbol !== "" && this.numB !== "") {
                console.error("includes");
                this.numA = this.resultAB;
                this.varDigitStr = this.numA;
                this.numB = "";
            }
        }
        noNumBEqualNumA() {
            if (this.numA !== "" && this.symbol !== "" && this.numB === "") if (this.targetDataSet.equal === "=" || this.targetDataSet.m === "m+" || this.targetDataSet.m === "m-") {
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
            if (this.numA !== "" && this.symbol && this.numB !== "") switch (this.symbol) {
              case "+":
                this.resultAB = Number(this.numA) + Number(this.numB);
                this.foFixedNumFloat();
 //! ??? (увімкнути якщо результат глючить)
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
            this.originResultAB = this.resultAB;
            this.resultAB = this.fnToFixed(this.resultAB);
            if (Number(this.originResultAB) > 0 && Number(this.resultAB) == 0) ;
            console.error("this.resultdigitLengthFloat " + this.resultdigitLengthFloat);
            console.error(this.resultdigitLengthFloat);
        }
        fnToFixed(num) {
            num = parseFloat(num).toFixed(this.roundingAfterDot()).replace(/0+$/g, "").replace(/\.$/g, "");
            return num;
        }
        fixDotWithoutZero(eTarget) {
            if (this.numA == ".") {
                this.numA = "0.";
                this.varDigitStr = "0.";
                this.returnAorB = "0.";
            }
            if (this.numB == ".") {
                this.numB = "0.";
                this.varDigitStr = "0.";
                this.returnAorB = "0.";
            }
            console.log("fixDotWithoutZerofixDotWithoutZero");
            if (this.arrDigigt[1] === ".") this.numA = "0.";
        }
        formatNumberForDisplay(nubmerStr) {
            let [integerPart, decimalPart] = nubmerStr.split(".");
            integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
 //! ставить пробіли "1 234 000.5678"
                        let formattedStr = decimalPart ? `${integerPart},${decimalPart}` : integerPart;
            if (this.lastIndex(nubmerStr.toString()) === "." || this.lastIndex(nubmerStr.toString()) === ",") formattedStr += ",";
            return formattedStr;
        }
        roundingAfterDot() {
            let returnRound = this.numberLimit - Math.floor(this.varDigitStr).toString().length;
            console.log("returnRound", `${this.numberLimit} - ${Math.floor(this.varDigitStr).toString().length}`);
            if (returnRound <= 0) returnRound = 0;
            return returnRound;
        }
        formattedDigitM() {
            let formattedNumber = this.formatNumberForDisplay(this.m.toString());
            this.$screenM.innerHTML = "M=" + formattedNumber;
            if (this.mOn === false) this.$screenM.innerHTML = "";
        }
        digitRender(eTarget) {
            this.varDigitStr = this.varDigitStr.toString();
            console.log("nuuuuls", this.varDigitStr.replace(/[^0]/g, "").length);
            if (this.varDigitStr.replace(/\./, "").length <= this.numberLimit) {
                let formattedNumber = this.formatNumberForDisplay(this.varDigitStr);
                this.$digit.innerHTML = formattedNumber;
            }
            //! Динамічне зменшення / збільшення розміру шрифту в циферблаті
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
        percentBtn(eTarget) {
            //! кнопки і операції => 10, %, =0.1 (numA = numA / 100)
            if (eTarget.dataset.percent === "%") if (this.numA !== "" && this.numB === "") {
                if (this.symbol === "") {
                    this.numA = this.fnToFixed(this.numA / 100);
                    this.varDigitStr = this.numA;
                }
                if (this.symbol === "+" || this.symbol === "-") {
                    //! кнопки і операції => 10, + or -, % (this.numB = this.numA / 100 * this.numA)
                    this.numB = this.fnToFixed(this.numA / 100 * this.numA);
                    this.varDigitStr = this.numB;
                }
                if (this.symbol === "*" || this.symbol === "/") {
                    //! кнопки і операції => 10, * or /, % (this.numB = this.numA / 100)
                    this.numB = this.fnToFixed(this.numA / 100);
                    this.varDigitStr = this.numB;
                }
            } else if (this.numA !== "" && this.numB !== "") {
                if (this.symbol === "+" || this.symbol === "-") {
                    //! кнопки і операції => 50, + or -, 20, % (this.numB = this.numA / 100 * this.numB)
                    this.numB = this.fnToFixed(this.numA / 100 * this.numB);
                    this.varDigitStr = this.numB;
                }
                if (this.symbol === "*" || this.symbol === "/") {
                    //! кнопки і операції => 50, + or -, 20, % (this.numB = this.numA / 100 * this.numB)
                    this.numB = this.fnToFixed(this.numB / 100);
                    this.varDigitStr = this.numB;
                }
            }
        }
        fixMBtns(eTarget) {
            if (this.countMbtns > 1 && eTarget.dataset.number) {
                this.numA = "";
                this.symbol = "";
                this.numB = "";
            }
        }
        btnMplus(eTarget) {
            const btnsMoperations = () => {
                if (eTarget.dataset.m === "m+") {
                    this.m = Number(this.m) + Number(this.varDigitStr);
                    this.m = this.fnToFixed(this.m);
                }
                if (eTarget.dataset.m === "m-") {
                    this.m = Number(this.m) - Number(this.varDigitStr);
                    this.m = this.fnToFixed(this.m);
                }
            };
            if (eTarget.dataset.number || eTarget.dataset.math) this.countMbtns = 1;
            if (eTarget.dataset.m === "mc") {
                this.m = 0;
                this.$screenM.innerHTML = "";
                this.mOn = false;
            }
            if (eTarget.dataset.m === "m+" || eTarget.dataset.m === "m-") {
                this.countMbtns += 1;
                this.mOn = true;
                if (this.numA !== "" && this.numB !== "" && this.symbol !== "" && this.equalCount === 1) {
                    this.buttonsEqual();
                    btnsMoperations();
                    if (this.numA !== "" && this.symbol !== "" && this.numB === "" && this.equalCount > 1) {
                        this.numB = "";
                        this.symbol = "";
                        this.noNumBEqualNumA();
                    }
                    this.$screenM.innerHTML = this.m;
                } else {
                    btnsMoperations();
                    this.$screenM.innerHTML = this.m;
                }
                this.numA = this.m;
                this.numB = "";
                this.symbol = "";
            }
            if (eTarget.dataset.m === "mr") if (this.numB === "" && this.symbol === "") {
                this.numA = this.m;
                this.varDigitStr = "" + this.m;
            } else if (this.numA !== "" && this.symbol !== "") {
                this.numB = this.m;
                this.varDigitStr = "" + this.m;
            }
        }
    }
    document.querySelector(".buttons__container");
    const calc = new Calc("buttonsCalc", {
        numberLimit: 9
    });
    calc.btnsTouchNumbers();
    calc.$el.addEventListener("click", (e => {
        if (e.target.closest(".button")) {
            calc.targetDataSet = e.target.dataset;
            calc.target = e.target;
            console.warn("press targetttttttttttttttttttttttttttttttt!!! " + calc.targetDataSet);
            if (typeof calc.targetDataSet !== "string") ;
            calc.symbolEntry();
            calc.fixMBtns(e.target);
            if (calc.varDigitStr.length <= calc.numberLimit) if (calc.varDigitStr.includes(".")) calc.numbersEntryAorB(); //! Запис числа 1 або 2
             else if (calc.varDigitStr.length < calc.numberLimit) calc.numbersEntryAorB();
 //! Запис числа 1 або 2
                        calc.buttonNegative();
            calc.equalSymbol();
 //! 1+2+3 FIX PROBLEM!
                        if (calc.targetDataSet.equal === "=") calc.buttonsEqual();
 //! =
                        calc.percentBtn(e.target);
            calc.noNumBEqualNumA();
            calc.btnMplus(e.target);
            calc.formattedDigitM();
            calc.clearOneSymbol();
            calc.mathOperations();
 //! Запуск математичної операції
                        calc.buttonAC();
            calc.clearAfterEqualPressNum();
            calc.buttonACContent();
            calc.fixDotWithoutZero(e.target);
            calc.digitRender(e.target);
 //! DIGIT RENDER
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
            console.log("originResultAB = " + calc.originResultAB);
            console.log("resultAB = " + calc.resultAB);
            console.log("equalCount = " + calc.equalCount);
            console.log("countMbtns = " + calc.countMbtns);
            console.log("returnAorB  " + calc.returnAorB);
            console.log("numAB()  " + calc.numAB());
            console.warn("calc.negativeCount " + calc.negativeCount);
            console.warn("last symbol in digit " + calc.returnAorB[calc.returnAorB.length - 1]);
            console.warn("digitCopy ", calc.digitCopy);
            console.warn("$digit ", calc.$digit.innerHTML);
            console.warn("varDigitStr ", calc.varDigitStr);
            console.warn("roundingAfterDot()", calc.roundingAfterDot());
            console.warn("M+", calc.m);
        }
    }));
    window["FLS"] = true;
    isWebp();
})();