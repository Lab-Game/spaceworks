class Computer {
  constructor() {
    this.code = "void print() {\n\tprint(\"init\");\n}\n\nvoid in(string input) {\n\tprint(input);\n}";
    this.element = document.createElement('div');
    this.element.classList.add('computer');
    this.placeholder = "message to program";
    this.element.innerHTML = `<textarea class="code">${this.code}</textarea><div class="terminal"><div class="line" style="text-align: right;"><span class="link">run</span></div></div>`;
    this.element.querySelector('.link').addEventListener('click', event => {
      this.run();
    });

    this.inputs = [];
    this.outputs = [];
  }

  run() {
    const terminal = this.element.querySelector('.terminal');

    while (terminal.children.length > 1) {
      terminal.removeChild(terminal.lastChild);
    }

    this.exec(this.code, {
      print: text => {
        const line = document.createElement('div');
        line.classList.add('line');
        line.textContent = text;
        terminal.appendChild(line);

        return null;
      },
      read: port => {
        return this.inputs[port].read();
      },
      write: (port, value) => {
        this.inputs[port].write(value);

        return null;
      }
    });
  }

  exec(code, { print, read, write }) {
    print("Hello, World!");
  }
}
