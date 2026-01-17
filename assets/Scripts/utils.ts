import { _decorator, Component, Label, Node, tween, UIOpacity, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('utils')
export class utils extends Component {

    @property(Node)
    LeftHUD: Node = null;

    @property(Node)
    RightHUD: Node = null;

    prev: any;
    currentAvatar: Node = null;

    start() {
        this.node.on("ShowText", this.showText, this);
        this.node.on("showLeftHUD", this.showLeftHUD, this);
        this.node.on("showRightHUD", this.showRightHUD, this);
        this.node.on("showCoins", this.showCoins, this);
        this.node.on("ChooseAvatarDone", this.ChooseAvatarDone, this);
    }

    ChooseAvatarDone(chosenAvatar: Node)
    {
        this.currentAvatar = chosenAvatar;
    }

    showText(node: Node, text: string) {
        if (this.prev) this.unschedule(this.prev);

        console.log("showing label: ", text);
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

    showLeftHUD(){
        this.LeftHUD.active = true;
        tween(this.LeftHUD.getComponent(UIOpacity))
        .to(1, { opacity: 255 }).start();
    }

    showRightHUD(){
        this.RightHUD.active = true;
        tween(this.RightHUD.getComponent(UIOpacity))
        .to(1, { opacity: 255 }).start();
    }

    showCoins(number: number)
    {
        let coinNode = this.RightHUD.getChildByName("Coins");
        coinNode.active = true;
        coinNode.getChildByName("title").getComponent(Label).string = number.toString() + " Coins";
    }

    update(deltaTime: number) {
        
    }
}


