import { scrollDownScreenHistory } from '@/scripts/index'

interface UIElems {
  btn: string,
  btnsContainer: string,
  container: string,
  screenContainer: string
  primaryScreen: string
}

export class UI {
  private $btn: HTMLElement
  private $btnsContainer: HTMLElement
  private $container: HTMLElement
  private $screenContainer: HTMLElement
  private $primaryScreen: HTMLElement

  constructor(btnsElem: UIElems){
    this.$btn = document.querySelector(btnsElem.btn)!
    this.$btnsContainer = document.querySelector(btnsElem.btnsContainer)!
    this.$container = document.querySelector(btnsElem.container)!
    this.$screenContainer = document.querySelector(btnsElem.screenContainer)!
    this.$primaryScreen = document.querySelector(btnsElem.primaryScreen)!
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
        this.$btnsContainer.addEventListener("touchstart", (e: TouchEvent) => {
          const eTarget = e.target as HTMLElement;
        if (eTarget.className.includes("button")) {
          //! Android Vibration
          if (eTarget.closest(".button")) {
            if (navigator.vibrate) {
              navigator.vibrate(75);
            }
          }
        }
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
      },
      false
    );
    
    this.$btnsContainer.addEventListener(
      "touchend",
      function (e: TouchEvent) {
        const eTarget = e.target as HTMLElement;
        eTarget.style.transition =
          "background-color 0.5s, opacity 0.5s, transform 0.2s";
        setTimeout(function () {
          eTarget.style.backgroundColor = "";
        }, 20);
      },
      false
    );
  }
}