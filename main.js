const GROWTH_RATE = 0.1;

const MAX_BALL_DIAMETER = 120;
const MAX_RECT_DIAGONAL = 150;

let figures = [];
let direction;
let img;

const buttons = [
	["Вверх", () => move(1)],
	["Вниз", () => move(2)],
	["Влево", () => move(3)],
	["Вправо", () => move(4)],
	["Рандом", () => move(5)],
	["Хаос", () => move(6)],
	["Стоп", () => move(7)],
	["Обновить", clean],
];

function Figure(x, y, direction) {
	this.posX = x;
	this.posY = y;
	this.speed = 1;
	this.velocity = random(0.02);
	this.direction = direction;
	this.chaos = false;
	this.isStay = true;

	this.moveLeft = () => {
		this.speed = this.speed + this.velocity;
		this.posX = this.posX - this.speed;
	};

	this.moveRight = () => {
		this.speed = this.speed + this.velocity;
		this.posX = this.posX + this.speed;
	};

	this.moveUp = () => {
		this.speed = this.speed + this.velocity;
		this.posY = this.posY - this.speed;
	};

	this.moveDown = () => {
		this.speed = this.speed + this.velocity;
		this.posY = this.posY + this.speed;
	};

	this.moveRandom = () => {
		this.direction = Math.round(random(1, 5));
	};

	this.moveChaos = () => {
		this.direction = Math.round(random(1, 5));
	};
}

function Pacman(x, y, direction) {
	Figure.apply(this, [x, y, direction]);
	this.diameter = random(5, 70);
	this.render = () => {
		fill(random(255), random(255), random(255));
		this.diameter = this.diameter + GROWTH_RATE;
		switch (this.direction) {
			case 1:
				this.moveUp();
				break;
			case 2:
				this.moveDown();
				break;
			case 3:
				this.moveLeft();
				break;
			case 4:
				this.moveRight();
				break;
			case 5:
				this.moveRandom();
				break;
		}
		arc(
			this.posX,
			this.posY,
			this.diameter,
			this.diameter,
			0.5,
			PI + HALF_PI + QUARTER_PI,
			PIE
		);
	};
}

function Rectangle(x, y, direction) {
	Figure.apply(this, [x, y, direction]);
	this.height = random(5, 70);
	this.width = random(5, 70);
	this.diagonal;
	this.posX = this.posX - this.width / 2;
	this.posY = this.posY - this.height / 2;
	this.render = () => {
		this.width = this.width + GROWTH_RATE;
		this.height = this.height + GROWTH_RATE;
		this.diagonal = Math.sqrt(
			this.width * this.width + this.height * this.height
		);
		switch (this.direction) {
			case 1:
				this.moveUp();
				break;
			case 2:
				this.moveDown();
				break;
			case 3:
				this.moveLeft();
				break;
			case 4:
				this.moveRight();
				break;
			case 5:
				this.moveRandom();
				break;
		}
		image(img, this.posX, this.posY, this.width, this.height);
	};
}

function Ball(x, y, direction) {
	Figure.apply(this, [x, y, direction]);
	this.diameter = random(5, 70);
	this.render = () => {
		this.diameter = this.diameter + GROWTH_RATE;
		switch (this.direction) {
			case 1:
				this.moveUp();
				break;
			case 2:
				this.moveDown();
				break;
			case 3:
				this.moveLeft();
				break;
			case 4:
				this.moveRight();
				break;
			case 5:
				this.moveRandom();
				break;
		}
		erase();
		circle(this.posX, this.posY, this.diameter);
		noErase();
	};
}

function drawField() {
	let w = width / 60;
	let c = color(0, 0, 0, 15);
	strokeWeight(1);
	stroke(0);

	stroke(c);

	for (let y = 0; y < width; y += w) {
		line(0, y, width, y);
	}

	for (let x = 0; x < width; x += w) {
		line(x, 0, x, height);
	}
}

function setup() {
	img = loadImage("https://sun9-65.userapi.com/c846220/v846220459/1f08bf/QkrPLEl2qgg.jpg");
	cnv = createCanvas(windowWidth, windowHeight);
	
	cnv.mousePressed(createFigure);
	strokeWeight(0);
	frameRate(120);

	let btn;
	let i = 10;

	buttons.forEach((x) => {
		btn = createButton(x[0]);
		btn.position(i, 10);
		btn.mousePressed(x[1]);
		i += btn.width + 10;
	});
}

function draw() {
	background("white");
	strokeWeight(1);
	drawField();

	figures.forEach(function (figure) {
		if (
			figure.posX < 0 ||
			figure.posX > windowWidth ||
			figure.posY < 0 ||
			figure.posY > windowHeight ||
			figure.diameter > MAX_BALL_DIAMETER ||
			figure.diagonal > MAX_RECT_DIAGONAL
		) {
			figure.isStay = false;
		} else {
			for (let i = 0; i < figures.length; i++) {
				if (figures[i] == figure) {
					continue;
				} else {
					if (
						(figure instanceof Ball &&
							figures[i] instanceof Ball) ||
						(figure instanceof Ball &&
							figures[i] instanceof Pacman) ||
						(figure instanceof Pacman &&
							figures[i] instanceof Ball) ||
						(figure instanceof Pacman &&
							figures[i] instanceof Pacman)
					) {
						let distance = dist(
							figure.posX,
							figure.posY,
							figures[i].posX,
							figures[i].posY
						);
						if (
							distance <=
							figure.diameter / 2 + figures[i].diameter / 2
						) {
							figure.isStay = false;
							figures[i].isStay = false;
						}
					}

					if (
						(figure instanceof Ball &&
							figures[i] instanceof Rectangle) ||
						(figure instanceof Pacman &&
							figures[i] instanceof Rectangle)
					) {
						let testX = figure.posX;
						let testY = figure.posY;

						if (figure.posX < figures[i].posX)
							testX = figures[i].posX;
						else if (
							figure.posX >
							figures[i].posX + figures[i].width
						)
							testX = figures[i].posX + figures[i].width;
						if (figure.posY < figures[i].posY)
							testY = figures[i].posY;
						else if (
							figure.posY >
							figures[i].posY + figures[i].height
						)
							testY = figures[i].posY + figures[i].height;

						let distX = figure.posX - testX;
						let distY = figure.posY - testY;
						let distance = Math.sqrt(distX * distX + distY * distY);

						if (distance <= figure.diameter / 2) {
							figure.isStay = false;
							figures[i].isStay = false;
						}
					}

					if (
						(figure instanceof Rectangle &&
							figures[i] instanceof Ball) ||
						(figure instanceof Rectangle &&
							figures[i] instanceof Pacman)
					) {
						let testX = figures[i].posX;
						let testY = figures[i].posY;

						if (figures[i].posX < figure.posX) testX = figure.posX;
						else if (figures[i].posX > figure.posX + figure.width)
							testX = figure.posX + figure.width;
						if (figures[i].posY < figure.posY) testY = figure.posY;
						else if (figures[i].posY > figure.posY + figure.height)
							testY = figure.posY + figure.height;

						let distX = figures[i].posX - testX;
						let distY = figures[i].posY - testY;
						let distance = Math.sqrt(distX * distX + distY * distY);

						if (distance <= figures[i].diameter / 2) {
							figure.isStay = false;
							figures[i].isStay = false;
						}
					}

					if (
						figure instanceof Rectangle &&
						figures[i] instanceof Rectangle
					) {
						if (
							figure.posX + figure.width >= figures[i].posX &&
							figure.posX <= figures[i].posX + figures[i].width &&
							figure.posY + figure.height >= figures[i].posY &&
							figure.posY <= figures[i].posY + figures[i].height
						) {
							figure.isStay = false;
							figures[i].isStay = false;
						}
					}
				}
			}
		}
		figures = figures.filter((figure) => figure.isStay);

		if (figure.chaos) {
			figure.moveChaos();
		}

		figure.render();
	});
}

function createFigure() {
	let figure;

	switch (Math.round(random(1, 3))) {
		case 1:
			figure = new Pacman(mouseX, mouseY, direction);
			break;
		case 2:
			figure = new Ball(mouseX, mouseY, direction);
			break;
		case 3:
			figure = new Rectangle(mouseX, mouseY, direction);
			break;
	}
	figures.push(figure);
	figures[figures.length - 1].chaos = direction == 6;
	figures[figures.length - 1].direction = direction;
}

function move(dir) {
	direction = dir;
	figures.forEach((figure) => {
		figure.chaos = direction == 6;
		figure.direction = dir;
	});
}

function clean() {
	figures = [];
	clear();
}
