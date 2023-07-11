class SketchPad {
  constructor(container, size = 400) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = size;
    this.canvas.height = size;
    this.canvas.style = `
            background-color: white;
            box-shadow: 0px 0px 10px 2px black;
        `;

    container.appendChild(this.canvas);

    const lineBreak = document.createElement("br");
    const anotherLineBreak = document.createElement("br");

    container.appendChild(lineBreak);
    container.appendChild(anotherLineBreak);

    this.clearBtn = this.#createElement({
      element: "button",
      innerHTML: "CLEAR",
      attribute: "id",
      attributeName: "clearBtn",
    });

    this.undoBtn = this.#createElement({
      element: "button",
      innerHTML: "UNDO",
      attribute: "id",
      attributeName: "undoBtn",
    });

    container.appendChild(this.clearBtn);
    container.appendChild(this.undoBtn);

    this.ctx = this.canvas.getContext("2d");

    this.reset();

    this.#addMouseEventListeners();
    this.#addTouchEventListeners();
    this.#addClearBtnListener();
    this.#addUndoBtnListener();
  }

  reset() {
    this.paths = [];
    this.isDrawing = false;
    this.#redraw();
  }

  #createElement(data) {
    const element = document.createElement(data.element);
    element.innerHTML = data.innerHTML;
    element.setAttribute(data.attribute, data.attributeName);

    return element;
  }

  #addMouseEventListeners() {
    this.canvas.onmousedown = (e) => {
      const mouse = this.#getMouse(e);
      this.paths.push([mouse]);
      this.isDrawing = true;
    };

    this.canvas.onmousemove = (e) => {
      if (this.isDrawing) {
        const mouse = this.#getMouse(e);
        const lastPath = this.paths[this.paths.length - 1];
        lastPath.push(mouse);
        this.#redraw();
      }
    };

    document.onmouseup = () => {
      this.isDrawing = false;
    };
  }

  #addTouchEventListeners() {
    this.canvas.ontouchstart = (e) => {
      const loc = e.touches[0];
      this.canvas.onmousedown(loc);
    };

    this.canvas.ontouchmove = (e) => {
      const loc = e.touches[0];
      this.canvas.onmousemove(loc);
    };

    document.ontouchend = () => {
      document.onmouseup();
    };
  }

  #addClearBtnListener() {
    this.clearBtn.onclick = () => {
      this.reset();
    };
  }

  #addUndoBtnListener() {
    this.undoBtn.onclick = () => {
      this.paths.pop();
      this.#redraw();
    };
  }

  #redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    draw.paths(this.ctx, this.paths);

    if (this.paths.length > 0) this.undoBtn.disabled = false;
    else this.undoBtn.disabled = true;
  }

  #getMouse(e) {
    const rect = this.canvas.getBoundingClientRect();
    return [Math.round(e.clientX - rect.left), Math.round(e.clientY - rect.top)];
  }
}
