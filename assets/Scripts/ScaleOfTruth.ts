import { _decorator, Animation, Button, Color, Component, Label, Node, Sprite, tween, UIOpacity, UITransform, Vec3 } from 'cc';
import { PhysicsDraggable } from './PhysicsDraggable';
const { ccclass, property } = _decorator;

interface CapsuleData {
    capsuleNode: Node;
    dropZone1: Node;
    dropZone2: Node;
    answer: boolean;
}

@ccclass('ScaleOfTruth')
export class ScaleOfTruth extends Component {

    @property(Node)
    IntroNode: Node = null;

    @property(Node)
    StartTheChallengeButton: Node = null;

    @property(Node)
    BlurredBG: Node = null;

    @property(Node)
    textBubble: Node = null;

    @property(Node)
    MiniGameNode: Node = null;

    @property(Node)
    capsuleStrip: Node = null;

    @property(Node)
    redShadow: Node = null;

    @property(Node)
    greenShadow: Node = null;

    @property(Node)
    UpperPart: Node = null;

    @property(Node)
    zoneA_Spots: Node = null; // dropzoneA parent // TRUE

    @property(Node)
    zoneB_Spots: Node = null;  // dropzoneB parent // FALSE

    @property(Node)
    center: Node = null;

    @property(Node)
    TryAgainNode: Node = null;

    @property(Node)
    tryAgainTextBubble: Node = null;

    @property(Node)
    happyWizard: Node = null;

    @property(Node)
    happyWizardTextBubble: Node = null;

    @property(Node)
    endNode: Node = null;

    @property(Node)
    levelCompleteScreen : Node = null;

    correctDrops: Node[] = [];
    wrongDrops: Node[] = [];

    currentCapsuleNumber: number = 0;
    currentCapsuleNode: Node = null;
    currentDropZone1: Node = null;
    currentDropZone2: Node = null;
    currentCapsuleAnswer: boolean = null;
    intro: string = null;
    happy: string = null;
    sad: string = null;
    dropzone1_number: number = 0;
    dropzone2_number: number = 0;

    start() {

    }

    onEnableDrag() {
        this.node.on('onDropCompleted', this.handleDrop, this);
    }

    onDisaDrag() {
        this.node.off('onDropCompleted', this.handleDrop, this);
    }


    onStartTheChallengeButtonClick()
    {
        this.StartTheChallengeButton.getComponent(Button).interactable = false;

        // hide intro 
        tween(this.IntroNode.getComponent(UIOpacity)).to(1, {opacity: 0})
        .call(()=>{
            this.IntroNode.active = false;
        }).start();

        // show the blurred BG
        this.BlurredBG.active = true;
        tween(this.BlurredBG.getComponent(UIOpacity)).to(1, {opacity: 255}).start();

        this.showTextBubble(this.textBubble, "Not all beliefs heal.\nUse your wisdom, Rakshak, \nand let the truth rise!")
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
            const paddingX = 55; 
            const paddingY = 65;
            textBubble.getComponent(UITransform).setContentSize(labelWidth + paddingX, labelHeight + paddingY);

            // fade in text bubble and show text
            this.tweenOpacity(textBubble, 0.5, 255);
            label.getComponent(Label).string = ""; // Clear existing text
            label.getComponent(UIOpacity).opacity = 255;
            if (message) {
                this.node.parent.parent.emit("ShowText", textBubble.getChildByName("Label"), message)
            }
            await this.sleep(0.05*(message.length - 1) + 1); // wait for text to finish + extra time
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

    onAcceptTheChallengeButtonClick()
    {
        // move forward

        // hide the blurred BG
        tween(this.BlurredBG.getComponent(UIOpacity)).to(0.1, {opacity: 0})
        .call(()=>{
            this.BlurredBG.active = false;
        }).start();

        // start the minigame
        this.MiniGameNode.active = true;
        this.startDragging(1);
    }

    startDragging( n: number )
    {
        this.currentCapsuleNumber = n;
        this.currentCapsuleNode = this.capsuleStrip.children[n-1].getChildByName("capsule");
        this.sad = "Wrong choice! \nThat capsule doesn’t belong \nthere. Think carefully.";
        this.currentDropZone1 = this.zoneA_Spots.children[this.dropzone1_number];
        this.currentDropZone2 = this.zoneB_Spots.children[this.dropzone2_number]; 

        switch(n)
        {
            case 1: 
            this.intro = "Truth or lie, Rakshak,\nchoose with care.";
            this.happy = "Boom. That’s how you light \nup a room, well played.";
            this.currentCapsuleAnswer = false;
            break;

            case 2: 
            this.intro = "Every choice tips the scale\nchoose wisely.";
            this.happy = "Now that's a reaction worth\nremembering. On to the next.";
            this.currentCapsuleAnswer = true;
            break;

            case 3: 
            this.intro = "One truth can save. \nOne lie can break.";
            this.happy = "That's the kind of move that\nearns trust in seconds.";
            this.currentCapsuleAnswer = true;
            break;

            case 4: 
            this.intro = "Even capsules hold\nconsequences."
            this.happy = "You read thhe room. You\nowned the moment. Respect.";
            this.currentCapsuleAnswer = false;
            break;

            case 5: 
            this.intro = "Trust your wisdom, Rakshak.";
            this.happy = "If empathy were a superpower\nyou just leveled up.";
            this.currentCapsuleAnswer = false;
            break;

            case 6: 
            this.intro = "Even capsules hold \nconsequences.";
            this.happy = "You didn't just respond \nyou resonated.";
            this.currentCapsuleAnswer = true;
            break;

            case 7: 
            this.intro = "Guide the balance with \nyour truth.";
            this.happy = "Now that's what\n Rakshak are made of.";
            this.currentCapsuleAnswer = true;
            break;
        }
        // show the intro wizard
        this.happyWizard.getChildByName("happy").active = false;
        this.happyWizard.getChildByName("sad").active = false;
        this.happyWizard.getChildByName("intro").active = true;
        this.tweenOpacity(this.happyWizard, 0.1, 255);
        this.tweenOpacity(this.happyWizardTextBubble, 0.1, 255);
        this.showTextBubble(this.happyWizardTextBubble, this.intro);

        this.scheduleOnce(()=>{
            // bring the capsule to center
            this.sendToCenter();
            // enable label
            this.currentCapsuleNode.getChildByName("Label").getComponent(UIOpacity).opacity = 255;
            // enable the drag and assign drop zones
            this.onEnableDrag();
            this.currentCapsuleNode.getComponent(PhysicsDraggable)
                .enableDrag(this.currentDropZone1, this.currentDropZone2, this.currentCapsuleAnswer);
        }, 2);
    }

    sendToCenter()
    {
        tween(this.currentCapsuleNode)
        .to(0.5, {
            worldPosition: this.center.getWorldPosition(),
            scale: new Vec3(0.6, 0.6, 0.6),
            eulerAngles: new Vec3(0, 0, 0)
        })
        .start();
    }


    handleDrop(dronZoneNode: Node, dropZone: string, showNextQuestion: boolean) {
        console.log(dropZone);
        if (dropZone == 'TRUE') this.dropzone1_number++;
        else if (dropZone == 'FALSE') this.dropzone2_number++;

        // when the ans is right
        if (showNextQuestion)
        {
            this.tweenOpacity(this.greenShadow, 0.5, 255);
            // show the happy wizard
            this.happyWizard.getChildByName("happy").active = true;
            this.happyWizard.getChildByName("sad").active = false;
            this.happyWizard.getChildByName("intro").active = false;

            this.showTextBubble(this.happyWizardTextBubble, this.happy);
            this.correctDrops.push(dronZoneNode);
            
            this.scheduleOnce(()=>{
                this.tweenOpacity(this.greenShadow, 0.5, 0);

                if (this.currentCapsuleNumber<7) this.startDragging(this.currentCapsuleNumber+1);
                else this.endMiniGame();
            }, 5);
        }
        else 
        {
            this.tweenOpacity(this.redShadow, 0.5, 255);
            // show the sad wizard
            this.happyWizard.getChildByName("happy").active = false;
            this.happyWizard.getChildByName("sad").active = true;
            this.happyWizard.getChildByName("intro").active = false;

            this.showTextBubble(this.happyWizardTextBubble, this.sad);

            this.wrongDrops.push(dronZoneNode);

            // showing try again Node
            console.log("SHOWING TRY AGAIN");
            //this.TryAgainNode.active = true;
            //this.tweenOpacity(this.TryAgainNode, 0.5, 255);
            //this.showTextBubble(this.tryAgainTextBubble, 
                //"Wrong choice! \nThat capsule doesn’t belong \nthere. Think carefully.");
            
            this.scheduleOnce(()=>{
                this.tweenOpacity(this.redShadow, 0.5, 0);
                
                if (this.currentCapsuleNumber<7) this.startDragging(this.currentCapsuleNumber+1);
                else this.endMiniGame();
            }, 6);
        }

    }

    onRetryButtonClick()
    {
        this.sendToCenter();
        this.tweenOpacity(this.TryAgainNode, 0.5, 0);
        this.sleep(0.5);
        this.TryAgainNode.active = false;
    }

    endMiniGame()
    {
        console.log("Ending MINI Game Scale of Truth");
        this.wrongDrops.forEach((e)=>{
            tween(e).to(0.1, {scale: new Vec3(0,0,0)}).start();
            this.sleep(0.1);
        });

        this.scheduleOnce(()=>{
            this.MiniGameNode.active = false;
            this.endNode.active = true;
            this.endNode.getChildByName("Label").getComponent(Label).string = this.correctDrops.length.toString()+"/7";
            this.endNode.getChildByName("coin_Label").getComponent(Label).string = this.correctDrops.length.toString()+"0 coins";
            
            if (this.correctDrops.length>=4)
            {
                // move ahead as enough right answers are there
                this.endNode.getChildByName("Wizard").getComponent(Animation).play("scale_of_truth_wizard_happy");
                this.endNode.getChildByName("number_bg").getComponent(Sprite).color = new Color('#197C5B');
            }
            else 
            {
                // move ahead as enough right answers are there
                this.endNode.getChildByName("Wizard").getComponent(Animation).play("scale_of_truth_wizard_sad");
                this.endNode.getChildByName("number_bg").getComponent(Sprite).color = new Color('#B90000');
            }
        }, 2);
    }

    onNextButtonClick()
    {
        this.levelCompleteScreen.active = true;
    }

    update(deltaTime: number) {
        
    }
}


