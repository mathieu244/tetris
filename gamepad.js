const GAMEPADMAPPING=["A","B","X","Y","L1", "R2","L2","R1","SELECT", "START"]
const AXISMAPPING=["X","Y"]
function roundWithThreshold(x) {
  if (x >= 0.75) return 1;
  if (x <= -0.75) return -1;
  return 0;
}
class GamepadEvents {
  constructor({
    pollInterval = 0,
    axisThreshold = 0.05,
    buttonThreshold = 0.5,
    axisDebounce = 70 // en ms
  } = {}) {

    this.pollInterval = pollInterval;
    this.axisThreshold = axisThreshold;
    this.buttonThreshold = buttonThreshold;
    this.axisDebounce = axisDebounce;

    this._running = false;
    this._lastState = {};
    this._axisEmit = {}; // debounce par gamepad+axe

    this._boundPoll = this._poll.bind(this);
  }

  // -------- debounce interne --------
  _debounce(fn, delay) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  }

  start() {
    if (this._running) return;
    this._running = true;
    this._snapshotAll();
    this.pollInterval > 0 ? this._tickTimeout() : this._tickRAF();
  }

  stop() {
    this._running = false;
    cancelAnimationFrame(this._rafId);
    clearTimeout(this._timeoutId);
  }

  _tickRAF() {
    if (!this._running) return;
    this._poll();
    this._rafId = requestAnimationFrame(() => this._tickRAF());
  }

  _tickTimeout() {
    if (!this._running) return;
    this._poll();
    this._timeoutId = setTimeout(() => this._tickTimeout(), this.pollInterval);
  }

  _snapshotAll() {
    const gps = navigator.getGamepads();
    for (const g of gps) {
      if (!g) continue;
      this._lastState[g.index] = {
        buttons: g.buttons.map(b => this._normBtn(b)),
        axes: g.axes.slice()
      };
    }
  }

  _normBtn(b) {
    return typeof b === "object" ? b.value : b ? 1 : 0;
  }

  _poll() {
    const gps = navigator.getGamepads();
    for (const g of gps) {
      if (!g) continue;
      const prev = this._lastState[g.index] || { buttons: [], axes: [] };
      this._checkButtons(g, prev);
      this._checkAxes(g, prev);
      this._lastState[g.index] = {
        buttons: g.buttons.map(b => this._normBtn(b)),
        axes: g.axes.slice()
      };
    }
  }

  _checkButtons(g, prev) {
    const cur = g.buttons.map(b => this._normBtn(b));
    cur.forEach((v, i) => {
      const p = prev.buttons[i] ?? 0;
      const downPrev = p >= this.buttonThreshold;
      const downCur = v >= this.buttonThreshold;
      if (!downPrev && downCur) this._emit("gamepadbuttondown", { gamepad: g, button: GAMEPADMAPPING[i], value: v });
      if (downPrev && !downCur) this._emit("gamepadbuttonup", { gamepad: g, button: GAMEPADMAPPING[i] });
      if (downCur) this._emit("gamepadbutton", { gamepad: g, button: GAMEPADMAPPING[i], value: v });
    });
  }

  // ---------- AXES avec DEBOUNCE ----------
  _checkAxes(g, prev) {
    g.axes.forEach((v, i) => {
      const p = prev.axes[i] ?? 0;
      if (Math.abs(v - p) < this.axisThreshold) return;

      // créer un debouncer par (gamepad, axis)
      const key = g.index + ":" + i;
      if (!this._axisEmit[key]) {
        this._axisEmit[key] = this._debounce(detail => {
          this._emit("gamepadaxis", detail);
        }, this.axisDebounce);
      }

      this._axisEmit[key]({
        gamepad: g,
        axis: AXISMAPPING[i],
        value: roundWithThreshold(v),
        delta: v - p,
      });
    });
  }

  _emit(name, detail) {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  }
}

gp=new GamepadEvents();
gp.start();