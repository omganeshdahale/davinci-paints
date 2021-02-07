const COLORS = ["white", "black", "red", "blue", "green", 
				"cyan", "yellow", "magenta",]; // default color pallete

window.onload = () => {
	let canvas = document.querySelector("#canvas");
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	let canvasLeft = canvas.offsetLeft;
	let canvasTop = canvas.offsetTop;
	let c = canvas.getContext("2d");

	// setting solid white background
	c.rect(0, 0, canvas.width, canvas.height);
	c.save();
	c.fillStyle = "white";
	c.fill();
	c.restore();
	c.lineCap = "round";
	c.lineJoin = "round";

	let ham = false;
	if (window.innerWidth <= 768) {
		ham = document.querySelector("#ham");
	}

	let container = document.querySelector("#container");
	const colorBtn = document.querySelector("#color-btn");
	let activeColor;

	// adding color pallete to nav
	for (let color of COLORS) {
		let btn = colorBtn.content.cloneNode(true); // document fragment holding button
		let realBtn = btn.children[0] // real button
		realBtn.children[0].style.background = color;
		realBtn.onclick = () => {
			c.strokeStyle = color;
			activeColor.classList.remove("active-color");
			activeColor = realBtn;
			activeColor.classList.add("active-color");
		}
		if (color === "black") {activeColor = realBtn;} // default color black
		container.append(btn);
	}
	activeColor.click();


	// setting shape controls up
	let btnRect = document.querySelector("#rect");
	btnRect.onclick = enableRect;
	let btnEllipse = document.querySelector("#ellipse");
	btnEllipse.onclick = enableEllipse;
	let btnLine = document.querySelector("#line");
	btnLine.onclick = enableLine;
	let btnBrush = document.querySelector("#brush");
	btnBrush.onclick = enableBrush;
	let btnActive = btnBrush; // default pen: brush

	let brushSlider = document.querySelector("#brush-size");
	updateBrushSize();

	function updateBrushSize() {c.lineWidth = brushSlider.value;}

	brushSlider.onchange = updateBrushSize;

	btnActive.click() // setting default pen
	function enableBrush() {
		btnActive.classList.remove("btnActive");
		btnActive = btnBrush;
		btnActive.classList.add("btnActive");
		canvas.onclick = null;

		canvas.onpointerdown = (e) => {
			c.beginPath();
			c.moveTo(e.clientX-canvasLeft, e.clientY-canvasTop);
			if (ham) {ham.classList.add("remove");}
			
			canvas.onpointermove = (e) => {
				c.lineTo(e.clientX-canvasLeft, e.clientY-canvasTop);
				c.stroke();
			}

			canvas.onpointerup = () => {
				canvas.onpointerup = canvas.onpointermove = null;
				if (ham) {ham.classList.remove("remove");}
			}
		}
	}

	function enableRect() {
		btnActive.classList.remove("btnActive");
		btnActive = btnRect;
		btnActive.classList.add("btnActive");
		canvas.onclick = null;

		canvas.onpointerdown = (e) => {
			let snap = c.getImageData(0, 0, canvas.width, canvas.height);
			let initialX = e.clientX-canvasLeft;
			let initialY = e.clientY-canvasTop;
			if (ham) {ham.classList.add("remove");}

			canvas.onpointermove = (e) => {
				c.putImageData(snap, 0, 0);
				c.beginPath();
				c.save();
				c.lineJoin = "miter";
				c.strokeRect(initialX, initialY, e.clientX-initialX-canvasLeft, +e.clientY-initialY-canvasTop);
				c.stroke();
				c.restore();
			}

			canvas.onpointerup = () => {
				canvas.onpointerup = canvas.onpointermove = null;
				if (ham) {ham.classList.remove("remove");}
			}
		}
	}

	function enableEllipse() {
		btnActive.classList.remove("btnActive");
		btnActive = btnEllipse;
		btnActive.classList.add("btnActive");
		canvas.onclick = null;

		canvas.onpointerdown = (e) => {
			let snap = c.getImageData(0, 0, canvas.width, canvas.height);
			let initialX = e.clientX-canvasLeft;
			let initialY = e.clientY-canvasTop;
			if (ham) {ham.classList.add("remove");}

			canvas.onpointermove = (e) => {
				c.putImageData(snap, 0, 0);
				let finalX = e.clientX-canvasLeft;
				let finalY = e.clientY-canvasTop;

				let w = (finalX >= initialX) ? (finalX-initialX)/2 : (initialX-finalX)/2;
				let h = (finalY >= initialY) ? (finalY-initialY)/2 : (initialY-finalY)/2;
				let x = (finalX >= initialX) ? initialX +w: finalX +w;
				let y = (finalY >= initialY) ? initialY +h: finalY +h;

				c.beginPath();
				c.moveTo(x+w, y);
				c.ellipse(x, y, w, h, 0, 0, 2*Math.PI);
				c.stroke();
			}

			canvas.onpointerup = () => {
				canvas.onpointerup = canvas.onpointermove = null;
				if (ham) {ham.classList.remove("remove");}
			}
		}
	}

	function enableLine() {
		btnActive.classList.remove("btnActive");
		btnActive = btnLine;
		btnActive.classList.add("btnActive");
		canvas.onclick = null;

		canvas.onpointerdown = (e) => {
			let snap = c.getImageData(0, 0, canvas.width, canvas.height);
			let initialX = e.clientX-canvasLeft;
			let initialY = e.clientY-canvasTop;
			if (ham) {ham.classList.add("remove");} 
			
			canvas.onpointermove = (e) => {
				c.putImageData(snap, 0, 0);

				c.beginPath();
				c.moveTo(initialX, initialY);
				c.lineTo(e.clientX-canvasLeft, e.clientY-canvasTop);
				c.stroke();
			}

			canvas.onpointerup = () => {
				canvas.onpointerup = canvas.onpointermove = null;
				if (ham) {ham.classList.remove("remove");}
			}
		}
	}

	let download = document.querySelector("#download");
	let a = document.createElement("a");

	download.onclick = () => {
		a.download = "paint.png";
		a.href = canvas.toDataURL();
		a.click();
	}

	let clear = document.querySelector("#clear");
	clear.onclick = () => {
		c.beginPath();
		c.save();
		c.fillStyle = "white";
		c.rect(0, 0, canvas.width, canvas.height);
		c.fill();
		c.restore();
	}

	let btnFill = document.querySelector("#bucket");
	btnFill.onclick = enableFill

	function enableFill() {
		btnActive.classList.remove("btnActive");
		btnActive = btnFill;
		btnActive.classList.add("btnActive");

		canvas.onpointerdown = null;
		canvas.onclick = (e) => {

			let imgData = c.getImageData(0, 0, canvas.width, canvas.height);
			let [X, Y] = [e.clientX-canvasLeft, e.clientY-canvasTop];
			let i = getIndex(X,Y);
			const [R, G, B, A] = [imgData.data[i], imgData.data[i+1], imgData.data[i+2], imgData.data[i+3]];

			let pixelStack = [[X, Y]];
			let [r,g,b,a] = hex2rgba(c.strokeStyle);

			if (r === imgData.data[i] 
				&& g === imgData.data[i+1] 
				&& b === imgData.data[i+2] 
				&& a === imgData.data[i+3]) 
				{pixelStack.pop();} // if initial color is same as fill color don't do fill;

			while (pixelStack.length) {
				[X, Y] = pixelStack.pop();

				while (true) {
					if (Y === -1 || !matchColor(X, Y))
					{
						Y += 1;
						break;
					} // boundary reached

					Y--;
				}

				let reachLeft = false;
				let reachRight = false;
				while (true) {

					if (Y <= canvas.height-1 && matchColor(X, Y))
					{
						let i = getIndex(X, Y);
						let [r,g,b,a] = hex2rgba(c.strokeStyle);
						imgData.data[i] = r; // r
						imgData.data[i+1] = g; // g
						imgData.data[i+2] = b; // b
						imgData.data[i+3] = a; // a

						if (X !== 0) { // left pixel available
							if (!matchColor(X-1, Y)) {reachLeft = false;}
							else if (!reachLeft) {
								pixelStack.push([X-1, Y]);
								reachLeft = true;
							}
							
						}
						if (X !== canvas.width-1) { // left pixel available
							if (!matchColor(X+1, Y)) {reachRight = false;}
							else if (!reachRight) {
								pixelStack.push([X+1, Y]);
								reachRight = true;
							}
						}

						Y++;
					}
					else {break;} // boundary reached
				}
			}

			function matchColor(X, Y) {
				let i = getIndex(X, Y);
				return R === imgData.data[i] && G === imgData.data[i+1] && B === imgData.data[i+2] && A === imgData.data[i+3];
			}

			c.putImageData(imgData, 0, 0);
		}
	}

	function getIndex(X, Y) {
		return ((canvas.width*Y*4)-1 +(X+1) *4) -3; // IMPORTANT FORMULA
	}

	function hex2rgba(hex) {
		hex = hex.slice(1, hex.length);
		let r = hex.length === 8 ? parseInt(hex.slice(2,4), 16) : parseInt(hex.slice(0,2), 16);
		let g = hex.length === 8 ? parseInt(hex.slice(4,6), 16) : parseInt(hex.slice(2,4), 16);
		let b = hex.length === 8 ? parseInt(hex.slice(6,8), 16) : parseInt(hex.slice(4,6), 16);
		let a = hex.length === 8 ? parseInt(hex.slice(0,2), 16) : 255;

		return [r,g,b,a];
	}

}