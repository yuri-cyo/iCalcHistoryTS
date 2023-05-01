const btnsContainer = document.querySelector('.buttons__container')
// const btns = document.querySelector('.button')

function setSize() {
	// console.log('size');
	// let widhtContainer = btnsContainer.getBoundingClientRect().width; //* 370px
	// let widhtContainer = btnsContainer.offsetWidth; //* 370px
	// let szBtnsX = 30
	
	window.addEventListener('resize', ()=> {
		let widhtContainer = window.innerWidth; //* 370px
		let szGap = widhtContainer / 100 * 3.4
		let szBtnsX = (widhtContainer / 3) - (szGap * 3) - 26
		console.log('widhtContainer', widhtContainer);
		
		btnsContainer.style.gap = `${szGap}px`
		btnsContainer.style.gridTemplateColumns = `repeat(4, ${szBtnsX}px)`;
		btnsContainer.style.gridTemplateRows = `repeat(6, ${szBtnsX}px)`;
	});

	// grid-template-rows: repeat(6, $sz-button - 12px);
	

	// btnsContainer.style.gridTemplateColumns = `repeat(4, ${szBtnsX})`
	// grid-template-columns: repeat(4, $sz-button);
}

export {btnsContainer, setSize}