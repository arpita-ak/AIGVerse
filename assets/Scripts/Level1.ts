import { _decorator, Component, Label, Node, tween, UIOpacity, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Level1')
export class Level1 extends Component {

    @property(Node)
    blurredBackground: Node = null;

    @property(Node)
    textBubble: Node = null;

    @property(Node)
    Wizard: Node = null;

    @property(Node)
    NextButton: Node = null;

    @property(Node)
    StartMiniGameButton: Node = null;

    @property(Node)
    WordRushMiniGameNode: Node = null;

    start() {
        this.showLevel1Details();
    }
    
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

    showLevel1Details()
    {
        console.log("Level 1 Text Bubble Showing");
        this.showTextBubble(this.textBubble, 
            "To pass the gate, play a quick \nmini-game to unlock \nthe path ahead!");

        this.scheduleOnce(() => {
            this.NextButton.active = true;
        }, 4);
    }

    onNextButtonClick()
    {
        console.log("Level 1 Next Button Clicked");

        this.blurredBackground.active = true;
        this.textBubble.active = false;
        this.textBubble.getChildByName("Label").getComponent(UIOpacity).opacity = 0;
        this.textBubble.getChildByName("Label").getComponent(Label).string = "";
        this.NextButton.active = false;

        tween(this.blurredBackground.getComponent(UIOpacity))
            .to(1, { opacity: 255 })
            .call(() => {
                // tween(this.Wizard)
                // .to(1, {position: new Vec3(0, -350, 0), scale: new Vec3(2, 2, 2)})
                // .start();

                tween(this.textBubble)
                .to(1, {position: new Vec3(50, 50, 0)})
                .start();
            })
            .start();

        this.scheduleOnce(() => {
            this.textBubble.active = true;
            this.textBubble.getComponent(UITransform).setContentSize(400, 180);
            tween(this.textBubble.getComponent(UIOpacity)).to(1, {opacity: 255}).start();
            tween(this.textBubble.getChildByName("Label").getComponent(UIOpacity)).to(0.1, {opacity: 255}).start();
            this.node.parent.parent.emit("ShowText", 
                this.textBubble.getChildByName("Label"), 
                "Answer questions, collect \nletters, unlock the door.");
        }, 2);

        this.scheduleOnce(() => {
            this.StartMiniGameButton.active = true;
        }, 3);
    }

    onStartMiniGame()
    {
        this.StartMiniGameButton.active = false;
        this.blurredBackground.active = false;
        this.Wizard.active = false;
        this.textBubble.active = false;

        console.log("Starting Mini Game for Level 1");
        // Logic to start the mini-game goes here

        this.WordRushMiniGameNode.active = true;
    }

    update(deltaTime: number) {
        
    }
}


