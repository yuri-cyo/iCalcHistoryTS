import { scrollDownScreenHistory } from '@/scripts/index'
import { varResult } from '@/scripts/index'

interface UIElems {
  btn: string,
  btnsMath: string,
  btnsContainer: string,
  container: string,
  screenContainer: string,
  primaryScreen: string,
  arrAllSymbols: string[],
}

export class UI{
  public $btn: HTMLElement
  public $btnsMath: HTMLElement
  public $btnsContainer: HTMLElement
  public $container: HTMLElement
  public $screenContainer: HTMLElement
  public $primaryScreen: HTMLElement
  public arrAllSymbols: string[]

  constructor(btnsElem: UIElems){
    this.$btn = document.querySelector(btnsElem.btn)!
    this.$btnsMath = document.querySelector(btnsElem.btnsMath)!
    this.$btnsContainer = document.querySelector(btnsElem.btnsContainer)!
    this.$container = document.querySelector(btnsElem.container)!
    this.$screenContainer = document.querySelector(btnsElem.screenContainer)!
    this.$primaryScreen = document.querySelector(btnsElem.primaryScreen)!
    this.arrAllSymbols = btnsElem.arrAllSymbols
  }

  autoBorderRadiusInCalc() {
    const computedStyles = window.getComputedStyle(this.$btnsContainer);
    const height = this.$btn.clientHeight;
    const padding = parseFloat(computedStyles.getPropertyValue('padding'))

    this.$container.style.borderRadius = height / 2 + padding +'px';
    return this
  }

  adaptiveFSScreen() {
    const paddingLeftContainer = parseFloat(getComputedStyle(this.$screenContainer).paddingLeft);
    const paddingRightContainer = parseFloat(getComputedStyle(this.$screenContainer).paddingRight);
    const widthContainer = this.$screenContainer.offsetWidth - paddingLeftContainer - paddingRightContainer - 5
    console.log('widthContainer', widthContainer);
    
    let fontSize = parseInt(window.getComputedStyle(this.$primaryScreen).fontSize);
    
    while (this.$primaryScreen.offsetWidth > widthContainer && fontSize >= 20) {
      fontSize -= 1;
      this.$primaryScreen.style.fontSize = `${fontSize}px`;
    }
    while (this.$primaryScreen.offsetWidth < widthContainer && fontSize <= 87.5) {
      fontSize += 1;
      this.$primaryScreen.style.fontSize = `${fontSize}px`;
    }
    scrollDownScreenHistory()
    return this
  }

  btnsTouch() {
    function activeOn(eTarget: HTMLElement) {
      
      let touchColor = "";
      let className = eTarget.className;
      if (className.includes("button__m")) {
        touchColor = "#737371";
      }
      if (className.includes("button__control")) {
        touchColor = "#D9D9D9";
      }
      if (className.includes("button__number")) {
        touchColor = "#737373";
      }
      if (className.includes("button__math")) {
        touchColor = "#F3C895";
      }
      eTarget.style.backgroundColor = touchColor;
      eTarget.style.transition =
      "background-color 0s, opacity 0.5s, transform 0.2s";
    }
    function activeOut(eTarget: HTMLElement) {
      eTarget.style.transition =
      "background-color 0.5s, opacity 0.5s, transform 0.2s";
    setTimeout(function () {
      eTarget.style.backgroundColor = "";
      // eTarget.style.color = "";
    }, 20);
    }
    this.$btnsContainer.addEventListener("touchstart", (e: TouchEvent) => {
      const eTarget = e.target as HTMLElement;

      if (eTarget.className.includes("button")) {
        //! Android Vibration
        if (eTarget.closest(".button")) {
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }
        }
      }
      activeOn(eTarget)
      },
      false
    );

    this.$btnsContainer.addEventListener('mousedown', (e:Event)=> {
      const eTarget = e.target as HTMLElement;
      activeOn(eTarget)
    })
    this.$btnsContainer.addEventListener('mouseup', (e:Event)=> {
      const eTarget = e.target as HTMLElement;
      activeOut(eTarget)
    })
    
    this.$btnsContainer.addEventListener("touchend", function (e: TouchEvent) {
        const eTarget = e.target as HTMLElement;
        activeOut(eTarget)
      },
      false
    );
  }
  activeMathBtns() {
    const mathBtns = document.querySelectorAll('[data-math]')

    console.log('mathBtnsmathBtns', getComputedStyle(mathBtns[0]).backgroundColor);
    this.$btnsContainer.addEventListener('click', (event:Event)=> {


      if (event.target) {
        
        const targetElement = event.target as HTMLButtonElement
        const targetData: DOMStringMap = targetElement.dataset;

        function runDefaultStyleBtn() {
          mathBtns.forEach((elem: any)=> {
            elem.classList.remove('button__math-active')
          })
        }
        
        if (targetElement.closest(".button")) {
          if (targetData.math) {
            if (varResult().length > 1 
            && this.arrAllSymbols.includes(varResult()[varResult().length - 1])
            ) {
              runDefaultStyleBtn()
              targetElement.classList.add('button__math-active')
            } 
          }
          if (!this.arrAllSymbols.includes(varResult()[varResult().length - 1])) {
            runDefaultStyleBtn()
          } else {
            
          }

        }
      }
    })
  }
}