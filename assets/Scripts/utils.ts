import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('utils')
export class utils extends Component {
    start() {

    }

    ShowText(node: Node, text: string){
        let label = node.getComponent(Label);
        let i = 0;
        this.schedule(()=>{
            label.string = text.slice(0, i);
            console.log(label.string);
        }, 0.1, text.length);
    }

    update(deltaTime: number) {
        
    }
}


