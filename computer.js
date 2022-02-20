class ComputerGUI extends EventTarget {
  constructor() {
    super();

    this.element = document.createElement('div');
    this.element.classList.add('computer');
    this.editor = document.createElement('textarea');
    this.editor.classList.add('code');
    this.element.appendChild(this.editor);
    this.terminal = document.createElement('div');
    this.terminal.classList.add('terminal');
    this.terminal.innerHTML = `<div class="line" style="text-align: right;"><span class="link">run</span></div>`;
    this.element.appendChild(this.terminal);

    this.terminal.querySelector('.link').addEventListener('click', event => {
      this.dispatchEvent(new ComputerEvent({ type: 'run' }));
    });
  }

  setCode(code) {
    var { selectionStart, selectionEnd } = this.editor;

    this.editor.value = code;

    this.editor.focus();

    this.editor.selectionStart = selectionStart;
    this.editor.selectionEnd = selectionEnd;
  }

  print(text) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.textContent = text;
    this.terminal.appendChild(line);
  }

  error(text) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.color = 'red';
    line.textContent = text;
    this.terminal.appendChild(line);
  }

  clear() {
    while (this.terminal.children.length > 1) {
      this.terminal.removeChild(this.terminal.lastChild);
    }
  }
}

class ComputerEvent extends Event {
  constructor(data) {
    super(data.type);

    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        try {
          this[key] = data[key];
        } catch (e) {}
      }
    }
  }
}

class Computer extends EventTarget {
  constructor() {
    super();

    this._code = "void print() {\n\tprint(\"init\");\n}\n\nvoid in(string input) {\n\tprint(input);\n}";
    this.inputs = [];
    this.outputs = [];
  }

  get code() {
    return this._code;
  }

  set code(value) {
    this._code = value;

    this.dispatchEvent(new ComputerEvent({ type: 'update', code: value }));
  }

  attach(gui) {
    this.addEventListener('print', event => {
      gui.print(event.text);
    });

    this.addEventListener('error', event => {
      gui.error(event.text);
    });

    this.addEventListener('clear', event => {
      gui.clear();
    });

    this.addEventListener('update', event => {
      gui.setCode(this.code);
    });

    gui.addEventListener('run', event => {
      this.run();
    });

    gui.setCode(this.code);
  }

  print(text) {
    this.dispatchEvent(new ComputerEvent({ type: 'print', text: text }));
  }

  error(text) {
    this.dispatchEvent(new ComputerEvent({ type: 'error', text: text }));
  }

  run() {
    this.print("computer:run");
  }
}
