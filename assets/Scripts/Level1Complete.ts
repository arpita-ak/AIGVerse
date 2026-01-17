import { _decorator, Component, Label, Node, tween, UIOpacity, UITransform, Vec3 } from 'cc';
import { utils } from './utils';
const { ccclass, property } = _decorator;

@ccclass('Level1Complete')
export class Level1Complete extends Component {

    @property(Node)
    coinsLabelMask: Node = null;

    @property(Node)
    textBubble: Node = null;

     // Tween opacity of a Node or UIOpacity component
    private tweenOpacity(target: Node | UIOpacity, duration: number, toOpacity: number) {
        const comp = (target as Node).getComponent ? (target as Node).getComponent(UIOpacity) : (target as UIOpacity);
        return tween(comp).to(duration, { opacity: toOpacity }).start();
    }

    // Utility function to create a delay
    private sleep(seconds: number) {
        return new Promise<void>((resolve) => this.scheduleOnce(() => resolve(), seconds));
    }

    // Show a sequence of text messages with typewriter effect
    private async showTextBubble(textBubble: Node, message: string = "") {

        // calculate label width based on message length
            const label = textBubble.getChildByName('Label');
            label.getComponent(Label).string = message;

            // This is the critical step! 
            // It forces the Label to recalculate its internal mesh immediately.
            await label.getComponent(Label).updateRenderData(true);
            
            const labelWidth = label.getComponent(UITransform).contentSize.width;
            const labelHeight = label.getComponent(UITransform).contentSize.height;
            console.log("Label size: ", labelWidth, labelHeight);

            // adjust text bubble size based on label size
            const paddingX = 50; 
            const paddingY = 70;
            textBubble.getComponent(UITransform).setContentSize(labelWidth + paddingX, labelHeight + paddingY);

            // fade in text bubble and show text
            this.tweenOpacity(textBubble, 0.5, 255);
            label.getComponent(Label).string = ""; // Clear existing text
            label.getComponent(UIOpacity).opacity = 255;
            if (message) {
                this.node.parent.parent.emit("ShowText", label, message);
            }
            await this.sleep(0.05*(message.length - 1) + 1); // wait for text to finish + extra time
    }

    start() {
        this.showCoinsWindow();
    }

    update(deltaTime: number) {
        
    }

    showCoinsWindow()
    {
        this.node.active = true;
        this.tweenOpacity(this.node.getComponent(UIOpacity), 1, 255);

        let name = this.node.parent.parent.getComponent(utils).currentAvatar.name;
        this.node.getChildByName(name).active  = true;
        console.log("Chosen Avatar: ", name);

        let label1 = this.coinsLabelMask.getChildByName("label1");
        let label2 = this.coinsLabelMask.getChildByName("label2");
        let startPos = new Vec3(0, -100, 0);
        let endPos = new Vec3(0, 100, 0);
        
        let i = 0;
        let coins = this.schedule(() => {
            i += 1;
            label1.getComponent(Label).string = (i).toString();
            label1.setPosition(startPos);
            tween(label1).to(0.1, {position: endPos}).start();
            this.sleep(0.05).then(() => {
                i += 1;
                label2.getComponent(Label).string = (i).toString();
                label2.setPosition(startPos);

                if (i >= 50) {
                    endPos = new Vec3(0, 0, 0); // final position

                    this.textBubble.active = true;
                    // show text in the text bubble
                    this.tweenOpacity(this.textBubble.getComponent(UIOpacity), 0.5, 255);
                    this.showTextBubble(this.textBubble, 
                        "Brilliant, Rakshak \nYou've tipped the sales towards truth.");
                    this.unschedule(coins);
                }
                tween(label2).to(0.1, {position: endPos}).start();
                });     
        },0.15, 49);

    }
}


