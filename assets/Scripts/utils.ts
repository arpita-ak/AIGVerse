import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('utils')
export class utils extends Component {
    start() {

    }

    showText(node: Node, text: string) {
        const label = node.getComponent(Label);
        if (!label) return;

        let i = 0;
        label.string = ""; // Clear existing text

        // Parameters: callback, interval (sec), repeat (count - 1), delay
        this.schedule(() => {
            i++;
            label.string = text.slice(0, i);
        }, 0.05, text.length - 1, 0); 
    }

    update(deltaTime: number) {
        
    }
}


