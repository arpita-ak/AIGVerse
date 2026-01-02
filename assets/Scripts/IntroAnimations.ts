import { _decorator, Animation, Component, Label, Node, tween, UIOpacity, Vec3, resources, UITransform, EditBox } from 'cc';
import { utils } from './utils';
const { ccclass, property } = _decorator;

@ccclass('IntroAnimations')
export class IntroAnimations extends Component {

    @property(Node)
    SplashScreenNode: Node = null;

    @property(Node)
    outline: Node = null;

    @property(Node)
    logo: Node = null;

    @property(Node)
    topRightHUD: Node = null;

    @property(Node)
    NextButton: Node = null;

    @property(Node)
    CTAButton: Node = null;

    @property(Node)
    HospitalBuildingNode: Node = null;

    // Building door and characters
    @property(Node)
    Entrance:Node = null;

    @property(Node)
    Entrance_blurred: Node = null;

    @property(Node)
    WizardCharacter: Node = null;

    @property(Node)
    mainTitle: Node = null;

    @property(Node)
    textbubble: Node = null; 

    @property(utils)
    utils: utils = null;

    // Register and Login Window
    @property(Node)
    LoginWindow: Node = null;

    @property(Node)
    RegisterWindow: Node = null;

    @property(Node)
    WizardCharacter_2: Node = null;

    @property(Node)
    Textbubble_2: Node = null;

    @property(EditBox)
    nameEditBox: EditBox = null;

    private Texts: any = null;
    private currentTextIndex: number = 0;

    start() {
        this.loadTextsAndPlayAnimation();
    }

    private loadTextsAndPlayAnimation() {
        resources.load('Texts', (err, textData) => {
            if (err) {
                console.error('Failed to load Texts.json:', err);
                return;
            }
            this.Texts = textData;
            this.Texts = this.Texts.json; // Access the JSON content
            console.log('Loaded Texts:', this.Texts.Intro.Title);
            this.playIntroAnimation();
        });
    }

    update(deltaTime: number) {
        
    }

    // Utility function to create a delay
    private sleep(seconds: number) {
        return new Promise<void>((resolve) => this.scheduleOnce(() => resolve(), seconds));
    }

    // Tween opacity of a Node or UIOpacity component
    private tweenOpacity(target: Node | UIOpacity, duration: number, toOpacity: number) {
        const comp = (target as Node).getComponent ? (target as Node).getComponent(UIOpacity) : (target as UIOpacity);
        return tween(comp).to(duration, { opacity: toOpacity }).start();
    }

    // Tween position/scale of a Node
    private tweenNode(node: Node, duration: number, props: any) {
        return tween(node).to(duration, props).start();
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
            const paddingX = 75; 
            const paddingY = 65;
            textBubble.getComponent(UITransform).setContentSize(labelWidth + paddingX, labelHeight + paddingY);

            // fade in text bubble and show text
            this.tweenOpacity(textBubble, 0.5, 255);
            label.getComponent(Label).string = ""; // Clear existing text
            label.getComponent(UIOpacity).opacity = 255;
            if (message && this.utils) {
                this.utils.showText(label, message);
            }
            await this.sleep(0.05*(message.length - 1) + 1); // wait for text to finish + extra time
    }

    // Reset text bubble
    private async resetTextBubble() {
        const label = this.textbubble.getChildByName('Label');
        label.getComponent(Label).string = "";
        this.tweenOpacity(this.textbubble, 0.3, 0);
        await this.sleep(0.3);
    }

    async playIntroAnimation(){
        // play splashscreen radial fill animation
        this.SplashScreenNode.getComponent(Animation).play('splashScreen');

        // wait then fade outline and move logo to top right
        await this.sleep(2.5);
        this.tweenOpacity(this.outline.getComponent(UIOpacity), 1, 0);
        this.tweenNode(this.logo, 1, { position: this.topRightHUD.getPosition(), scale: new Vec3(0.3, 0.3, 0.3) });
        this.tweenOpacity(this.logo.getComponent(UIOpacity), 1, 0);

        // top right doc visible with logo
        await this.sleep(1);
        this.tweenOpacity(this.topRightHUD.getComponent(UIOpacity), 1, 255);

        // building visible
        await this.sleep(0.5);
        this.tweenOpacity(this.SplashScreenNode.getComponent(UIOpacity), 1, 0);
        this.HospitalBuildingNode.active = true;
        const hbOpacity = this.HospitalBuildingNode.getComponent(UIOpacity);
        if (hbOpacity) hbOpacity.opacity = 0;
        // building scale up to show the entrance
        tween(hbOpacity).to(1, { opacity: 255 }).call(() => {
            this.tweenNode(this.HospitalBuildingNode, 1, { scale: new Vec3(2.5, 2.5, 2.5) });
        }).start();

        // entrance door visible
        await this.sleep(2.5);
        this.Entrance.active = true;
        this.tweenNode(this.Entrance, 1, { scale: new Vec3(1.8, 1.8, 1.8) });
        // show title here (from JSON)
        this.mainTitle.active = true;
        this.mainTitle.getComponent(Label).string = this.Texts.Intro.Title;
        this.tweenOpacity(this.mainTitle.getComponent(UIOpacity), 1, 255);

        // entrance blurred effect
        await this.sleep(1);
        this.Entrance_blurred.active = true;
        this.tweenOpacity(this.Entrance_blurred.getComponent(UIOpacity), 1, 255);

        // wizard character visible and text sequence
        await this.sleep(1);
        this.WizardCharacter.active = true;
        this.tweenOpacity(this.WizardCharacter.getComponent(UIOpacity), 1, 255);
        await this.sleep(1);

        // Show first text and next button
        this.currentTextIndex = 1;
        await this.showTextBubble(this.textbubble, this.Texts.Intro.Text1);
        this.NextButton.active = true;
        this.tweenOpacity(this.NextButton.getComponent(UIOpacity), 0.5, 255);
    }

    onNextButtonClicked() {
        console.log("Next button clicked");
        // hide the next button temporarily
        this.tweenOpacity(this.NextButton.getComponent(UIOpacity), 0.3, 0);
        this.NextButton.active = false;
        
        if (this.currentTextIndex === 1) {
            // Show Text2
            this.resetTextBubble();
            this.showTextBubble(this.textbubble, this.Texts.Intro.Text2).then(() => {
                // Keep next button visible
                this.NextButton.active = true;
                this.tweenOpacity(this.NextButton.getComponent(UIOpacity), 0.5, 255);
            });
            this.currentTextIndex = 2;
        } else if (this.currentTextIndex === 2) {
            // Show Text3
            this.resetTextBubble();
            this.showTextBubble(this.textbubble, this.Texts.Intro.Text3).then(() => {
                // Keep next button visible
                this.NextButton.active = true;
                this.tweenOpacity(this.NextButton.getComponent(UIOpacity), 0.5, 255);
            });
            this.currentTextIndex = 3;
        } else if (this.currentTextIndex === 3) {
            // Show Text4
            this.resetTextBubble();
            this.showTextBubble(this.textbubble, this.Texts.Intro.Text4).then(() => {
                // show CTA button
                this.CTAButton.active = true;
                this.tweenOpacity(this.CTAButton.getComponent(UIOpacity), 0.5, 255);
            });
            this.currentTextIndex = 4;
        }
    }

    async onCTAButtonClicked() {
        console.log("CTA button clicked");
        // Hide CTA button
        this.tweenOpacity(this.CTAButton.getComponent(UIOpacity), 0.3, 0);
        this.CTAButton.active = false;

        // Transition to Login screen
        this.WizardCharacter.active = false;
        this.textbubble.active = false;

        // Proceed to Login screen
        this.LoginWindow.active = true;
        this.tweenOpacity(this.LoginWindow.getComponent(UIOpacity), 1, 255);
        this.tweenNode(this.LoginWindow, 2, { scale: new Vec3(0.55, 0.55, 0) });

        // show the register window after a delay
        await this.sleep(1);
        this.RegisterWindow.active = true;
        this.tweenOpacity(this.RegisterWindow.getComponent(UIOpacity), 0.2, 255);
        
        // show the second wizard character and text bubble
        await this.sleep(0.5);
        this.WizardCharacter_2.active = true;
        this.tweenOpacity(this.WizardCharacter_2.getComponent(UIOpacity), 0.5, 255);

        // fade in text bubble and show text
        const message = "Ah, the Rakshak returns...\nThe mission awaits.\nEnter your scrool name\nand secret spell.";
        this.showTextBubble(this.Textbubble_2, message);
    }
}


