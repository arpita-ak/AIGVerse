import { _decorator, Component, Node, tween, Vec3, UIOpacity, Label, Animation, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('chooseAvatar')
export class chooseAvatar extends Component {

    @property(Node)
    Rakshak_character: Node = null;

    @property(Node)
    Rakshika_Character: Node = null;

    @property(Node)
    RightButton: Node = null;
    
    @property(Node)
    LeftButton: Node = null;

    @property(Node)
    RakshakConfirmButton: Node = null;

    @property(Node)
    RakshikaConfirmButton: Node = null;

    @property(Node)
    CoinsWindow: Node = null;

    @property(Node)
    coinsLabelMask: Node = null;

    @property(Node)
    textBubble: Node = null;

    @property(Node)
    DashboardNode: Node = null;

    CurrentAvatar: Node = null;
    centerScale: Vec3 = new Vec3(1.2, 1.2, 1.2);
    sideScale: Vec3 = new Vec3(0.7, 0.7, 0.7);
    rewardScale: Vec3 = new Vec3(0.8, 0.8, 0.8);

    start() {
        // default is Rakshak is at the center
        this.CurrentAvatar = this.Rakshak_character;
        this.Rakshak_character.getComponent(Animation).play("avatar_male");
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

    // Show Rakshak
    showRakshak()
    {

    }

    onRightButtonClick()
    {
        this.CurrentAvatar = this.Rakshika_Character;

        // move the Rakshika to center
        tween(this.Rakshika_Character)
        .to(1, {position: new Vec3(0, -64, 0), scale: this.centerScale})
        .start();

        // move the Rakshak to the leftwards 
        tween(this.Rakshak_character)
        .to(1, {position: new Vec3(-600, -130, 0), scale: this.sideScale})
        .start();
        this.Rakshak_character.getComponent(Animation).pause();


        // disable the right button
        this.tweenOpacity(this.RightButton, 0.5, 0);
        this.sleep(0.5);
        this.RightButton.active = false;

        // activate the left button
        this.LeftButton.active = true;
        this.tweenOpacity(this.LeftButton, 0.5, 255);
        this.Rakshika_Character.getComponent(Animation).play("avatar_female");

        this.RakshakConfirmButton.active = false;
        this.RakshikaConfirmButton.active = true;
    }

     onLeftButtonClick()
    {
        this.CurrentAvatar = this.Rakshak_character;

        // move the Rakshak to the center 
        tween(this.Rakshak_character)
        .to(1, {position: new Vec3(0, -64, 0), scale: this.centerScale})
        .start();

        // move the Rakshika to center
        tween(this.Rakshika_Character)
        .to(1, {position: new Vec3(600, -130, 0), scale: this.sideScale})
        .start();
        this.Rakshika_Character.getComponent(Animation).pause();

        // disable the left button
        this.tweenOpacity(this.LeftButton, 0.5, 0);
        this.sleep(0.5);
        this.LeftButton.active = false;

        // activate the right button
        this.RightButton.active = true;
        this.tweenOpacity(this.RightButton, 0.5, 255);
        this.Rakshak_character.getComponent(Animation).play("avatar_male");

        this.RakshakConfirmButton.active = true;
        this.RakshikaConfirmButton.active = false;
    }

    onRakshakConfirmButtonClick()
    {
        console.log("Rakshak selected");

        // disable all buttons
        this.tweenOpacity(this.RightButton, 0.1, 0);
        this.tweenOpacity(this.LeftButton, 0.1, 0);
        this.sleep(0.1);
        this.RightButton.active = false;
        this.LeftButton.active = false;
        this.RakshakConfirmButton.active = false;
        this.RakshikaConfirmButton.active = false;
        
        // disable both
        this.Rakshak_character.active = false;
        this.Rakshika_Character.active = false;
        // Store selection and proceed

        // proceed to get coins
        // show coin collection screen
        this.showCoinsWindow();

        // move the Rakshika to left
        this.Rakshak_character.setPosition(new Vec3(-400, -64, 0));
        this.Rakshak_character.setScale(this.rewardScale);
        this.Rakshak_character.active = true;
        this.Rakshak_character.getComponent(Animation).play("avatar_male_reward");
    }

    onRakshikaConfirmButtonClick()
    {
        console.log("Rakshika selected");
        // disable all buttons
        this.tweenOpacity(this.RightButton, 0.1, 0);
        this.tweenOpacity(this.LeftButton, 0.1, 0);
        this.sleep(0.1);
        this.RightButton.active = false;
        this.LeftButton.active = false;
        this.RakshakConfirmButton.active = false;
        this.RakshikaConfirmButton.active = false;

        // disable both
        this.Rakshak_character.active = false;
        this.Rakshika_Character.active = false;

        // Store selection and proceed

        // proceed to get coins
        // show coin collection screen
        this.showCoinsWindow();

        // move the Rakshika to left
        this.Rakshika_Character.setPosition(new Vec3(-400, -64, 0));
        this.Rakshika_Character.setScale(this.rewardScale);
        this.Rakshika_Character.active = true;
        this.Rakshika_Character.getComponent(Animation).play("avatar_female_reward");
    }

    showCoinsWindow()
    {
        this.CoinsWindow.active = true;
        this.tweenOpacity(this.CoinsWindow.getComponent(UIOpacity), 1, 255);

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
                        "Congratulations you've earned\n50 coins on Avatar selection.");
                    this.unschedule(coins);
                }
                tween(label2).to(0.1, {position: endPos}).start();
                });     
        },0.15, 24);

    }

    onGetStartButtonClicked()
    {
        console.log("Avatar selection done: ", this.CurrentAvatar.name);
        
        this.node.active = false;
        this.node.parent.parent.emit("ChooseAvatarDone", this.CurrentAvatar);
        // write next process here

        // trigger the dashboard load
        this.node.parent.parent.emit("onDashboardLoad");
        this.DashboardNode.active = true;
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

    update(deltaTime: number) {
        
    }
}


