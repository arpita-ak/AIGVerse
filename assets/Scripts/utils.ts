import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('utils')
export class utils extends Component {

    prev: any;

    start() {
        this.node.on("ShowText", this.showText, this);
    }

    showText(node: Node, text: string) {
        if (this.prev) this.unschedule(this.prev);

        console.log("showing labe: ", text);
        const label = node.getComponent(Label);
        if (!label) return;

        let i = 0;
        label.string = ""; // Clear existing text

        // Parameters: callback, interval (sec), repeat (count - 1), delay
        this.prev = this.schedule(() => {
            i++;
            label.string = text.slice(0, i);
            
        }, 0.05, text.length - 1, 0); 
    }

    update(deltaTime: number) {
        
    }
}


