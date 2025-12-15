const keys = {};

window.addEventListener("keydown", e => {
  if (keys[e.code]) return; // éviter répétitions
  keys[e.code] = true;

      console.log(e.code);

  switch (e.code) {
    // Controlleur 1
    case "ArrowLeft":  
    window.dispatchEvent(new CustomEvent("gamepadaxis", {
        detail: { gamepad:{ index:1, isKeyboard:true }, axis:"X", value:-1 }
    }));
    break;
    case "ArrowRight":
    window.dispatchEvent(new CustomEvent("gamepadaxis", {
        detail: { gamepad:{ index:1, isKeyboard:true }, axis:"X", value:1 }
    }));
    break;

    case "ArrowUp":    
    window.dispatchEvent(new CustomEvent("gamepadaxis", {
        detail: { gamepad:{ index:1, isKeyboard:true }, axis:"Y", value:-1 }
    }));
    break;
    case "ArrowDown":      window.dispatchEvent(new CustomEvent("gamepadaxis", {
        detail: { gamepad:{ index:1, isKeyboard:true }, axis:"Y", value:1 }
    }));
    break;
    case "ControlRight":
      window.dispatchEvent(new CustomEvent("gamepadbuttondown", {
        detail: { gamepad:{ index:1, isKeyboard:true }, button:"B", value:1 }
      }));
      break;

    case "ShiftRight":
      window.dispatchEvent(new CustomEvent("gamepadbuttondown", {
        detail: { gamepad:{ index:1, isKeyboard:true }, button:"A", value:1 }
      }));
      break;
    case "Backslash":      
        window.dispatchEvent(new CustomEvent("gamepadbuttondown", {
        detail: { gamepad:{ index:1, isKeyboard:true }, button:"SELECT", value: 1 }
    }));
    break;
    case "Enter":      
        window.dispatchEvent(new CustomEvent("gamepadbuttondown", {
        detail: { gamepad:{ index:1, isKeyboard:true }, button:"START", value: 1 }
    }));
    break;

    // Controlleur 0 (Gauche)
    case "KeyA":  
    window.dispatchEvent(new CustomEvent("gamepadaxis", {
        detail: { gamepad:{ index:0, isKeyboard:true }, axis:"X", value:-1 }
    }));
    break;
    case "KeyD":
    window.dispatchEvent(new CustomEvent("gamepadaxis", {
        detail: { gamepad:{ index:0, isKeyboard:true }, axis:"X", value:1 }
    }));
    break;

    case "KeyW":    
    window.dispatchEvent(new CustomEvent("gamepadaxis", {
        detail: { gamepad:{ index:0, isKeyboard:true }, axis:"Y", value:-1 }
    }));
    break;
    case "KeyS":      window.dispatchEvent(new CustomEvent("gamepadaxis", {
        detail: { gamepad:{ index:0, isKeyboard:true }, axis:"Y", value:1 }
    }));
    break;
    case "KeyZ":      
        window.dispatchEvent(new CustomEvent("gamepadbuttondown", {
        detail: { gamepad:{ index:0, isKeyboard:true }, button:"Y", value: 1 }
    }));
    break;
    case "KeyX":      
        window.dispatchEvent(new CustomEvent("gamepadbuttondown", {
        detail: { gamepad:{ index:0, isKeyboard:true }, button:"X", value: 1 }
    }));
    break;
    case "KeyC":      
        window.dispatchEvent(new CustomEvent("gamepadbuttondown", {
        detail: { gamepad:{ index:0, isKeyboard:true }, button:"SELECT", value: 1 }
    }));
    break;
    case "KeyV":      
        window.dispatchEvent(new CustomEvent("gamepadbuttondown", {
        detail: { gamepad:{ index:0, isKeyboard:true }, button:"START", value: 1 }
    }));
    break;
    case "Space":      
        window.dispatchEvent(new CustomEvent("gamepadbuttondown", {
        detail: { gamepad:{ index:0, isKeyboard:true }, button:"L1", value: 1 }
    }));
    break;
    case "ControlLeft":
      window.dispatchEvent(new CustomEvent("gamepadbuttondown", {
        detail: { gamepad:{ index:0, isKeyboard:true }, button:"B", value:1 }
      }));
    break;
    case "ShiftLeft":
      window.dispatchEvent(new CustomEvent("gamepadbuttondown", {
        detail: { gamepad:{ index:0, isKeyboard:true }, button:"A", value:1 }
      }));
    break;
  }
});

window.addEventListener("keyup", e => {
  keys[e.code] = false;

  switch (e.code) {
    case "KeyA":
    case "KeyD":
            window.dispatchEvent(new CustomEvent("gamepadaxis", {
        detail: { gamepad:{ index:0, isKeyboard:true }, axis:"Y", value:0 }
    }));
     break;
    case "KeyW":
    case "KeyS":      window.dispatchEvent(new CustomEvent("gamepadaxis", {
        detail: { gamepad:{ index:0, isKeyboard:true }, axis:"Y", value:0 }
    }));
    break;
/*    case "ControlLeft":
      window.dispatchEvent(new CustomEvent("gamepadbuttondown", {
        detail: { gamepad:{ index:0, isKeyboard:true }, button:"B" }
      }));
      break;
    case "ShiftLeft":
      window.dispatchEvent(new CustomEvent("gamepadbuttondown", {
        detail: { gamepad:{ index:0, isKeyboard:true }, button:"A" }
      }));
      break;*/
      // Controlleur 2
    case "ArrowLeft":
    case "ArrowRight":
            window.dispatchEvent(new CustomEvent("gamepadaxis", {
        detail: { gamepad:{ index:1, isKeyboard:true }, axis:"Y", value:0 }
    }));
     break;
    case "ArrowUp":
    case "ArrowDown":      window.dispatchEvent(new CustomEvent("gamepadaxis", {
        detail: { gamepad:{ index:1, isKeyboard:true }, axis:"Y", value:0 }
    }));
    break;
 /*   case "ControlRight":
      window.dispatchEvent(new CustomEvent("gamepadbuttondown", {
        detail: { gamepad:{ index:1, isKeyboard:true }, button:"B" }
      }));
      break;
    case "ShiftRight":
      window.dispatchEvent(new CustomEvent("gamepadbuttondown", {
        detail: { gamepad:{ index:1, isKeyboard:true }, button:"A" }
      }));
      break;*/
  }
});