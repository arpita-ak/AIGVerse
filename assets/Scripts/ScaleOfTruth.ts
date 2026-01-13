import { _decorator, Button, Component, Label, Node, tween, UIOpacity, UITransform, Vec3 } from 'cc';
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

    currentCapsuleNumber: number = 0;
    currentCapsuleNode: Node = null;
    currentDropZone1: Node = null;
    currentDropZone2: Node = null;
    currentCapsuleAnswer: boolean = null;

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
            const paddingX = 75; 
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

        switch(n)
        {
            case 1: 
            this.currentDropZone1 = this.zoneA_Spots.children[0];
            this.currentDropZone2 = this.zoneB_Spots.children[0]; // ccorect ans goes here
            this.currentCapsuleAnswer = false;
            break;

            case 2: 
            this.currentDropZone1 = this.zoneA_Spots.children[0];  // ccorect ans goes here
            this.currentDropZone2 = this.zoneB_Spots.children[1]; 
            this.currentCapsuleAnswer = true;
            break;

            case 3: 
            this.currentDropZone1 = this.zoneA_Spots.children[1];  // ccorect ans goes here
            this.currentDropZone2 = this.zoneB_Spots.children[1];  
            this.currentCapsuleAnswer = true;
            break;

            case 4: 
            this.currentDropZone1 = this.zoneA_Spots.children[2];  
            this.currentDropZone2 = this.zoneB_Spots.children[1];  // ccorect ans goes here
            this.currentCapsuleAnswer = false;
            break;

            case 5: 
            this.currentDropZone1 = this.zoneA_Spots.children[2];  
            this.currentDropZone2 = this.zoneB_Spots.children[2];  // ccorect ans goes here
            this.currentCapsuleAnswer = false;
            break;

            case 6: 
            this.currentDropZone1 = this.zoneA_Spots.children[2];  // ccorect ans goes here
            this.currentDropZone2 = this.zoneB_Spots.children[3];  
            this.currentCapsuleAnswer = true;
            break;

            case 7: 
            this.currentDropZone1 = this.zoneA_Spots.children[3];  // ccorect ans goes here
            this.currentDropZone2 = this.zoneB_Spots.children[3];  
            this.currentCapsuleAnswer = true;
            break;
        }
        
        // bring the capsule to center
        this.sendToCenter();
        // enable label
        this.currentCapsuleNode.getChildByName("Label").getComponent(UIOpacity).opacity = 255;
        // enable the drag and assign drop zones
        this.onEnableDrag();
        this.currentCapsuleNode.getComponent(PhysicsDraggable)
            .enableDrag(this.currentDropZone1, this.currentDropZone2, this.currentCapsuleAnswer);
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


    handleDrop(dropZone: string, showNextQuestion: boolean) {
        console.log(dropZone);

        // when the ans is right
        if (showNextQuestion)
        {
            this.tweenOpacity(this.happyWizard, 0.1, 255);
            this.tweenOpacity(this.happyWizardTextBubble, 0.1, 255);
            // this.showTextBubble(this.happyWizardTextBubble, "Boom. That’s how you light \nup a room, well played.");
            this.scheduleOnce(()=>{
                this.tweenOpacity(this.happyWizard, 0.1, 0);
                this.tweenOpacity(this.happyWizardTextBubble, 0.1, 0);
                this.startDragging(this.currentCapsuleNumber+1);
            }, 2);
        }
        else 
        {
            // showing try again Node
            console.log("SHOWING TRY AGAIN");
            this.TryAgainNode.active = true;
            this.tweenOpacity(this.TryAgainNode, 0.5, 255);
            this.showTextBubble(this.tryAgainTextBubble, 
                "Wrong choice! \nThat capsule doesn’t belong \nthere. Think carefully.");
        }

    }

    onRetryButtonClick()
    {
        this.sendToCenter();
        this.tweenOpacity(this.TryAgainNode, 0.5, 0);
        this.sleep(0.5);
        this.TryAgainNode.active = false;
    }

    update(deltaTime: number) {
        
    }
}


