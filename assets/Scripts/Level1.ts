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

    showLevel1Details()
    {
        console.log("Level 1 Text Bubble Showing");
        this.node.parent.parent.emit("ShowText", 
            this.textBubble.getChildByName("Label"), 
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


