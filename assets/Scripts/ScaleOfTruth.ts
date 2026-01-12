import { _decorator, Button, Component, Node, tween, UIOpacity, Vec3 } from 'cc';
import { PhysicsDraggable } from './PhysicsDraggable';
const { ccclass, property } = _decorator;

@ccclass('ScaleOfTruth')
export class ScaleOfTruth extends Component {

    @property(Node)
    IntroNode: Node = null;

    @property(Node)
    StartTheChallengeButton: Node = null;

    @property(Node)
    BlurredBG: Node = null;

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

    currentCapsuleNumber: number = 0;
    currentCapsuleNode: Node = null;
    currentDropZone1: Node = null;
    currentDropZone2: Node = null;

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
    }

    onAcceptTheChallengeButtonClick()
    {
        // move forward

        // hide the blurred BG
        tween(this.BlurredBG.getComponent(UIOpacity)).to(1, {opacity: 0})
        .call(()=>{
            this.BlurredBG.active = false;
        }).start();

        // start the minigame
        this.MiniGameNode.active = true;
        this.startDragging();
    }

    startDragging(){
        this.currentCapsuleNumber = 1;
        this.currentCapsuleNode = this.capsuleStrip.children[0].getChildByName("capsule");
        this.currentDropZone1 = this.zoneA_Spots.children[0];
        this.currentDropZone2 = this.zoneB_Spots.children[0];

        // bring the capsule to center
        this.sendToCenter();
        // enable label
        this.currentCapsuleNode.getChildByName("Label").getComponent(UIOpacity).opacity = 255;
        // enable the drag and assign drop zones
        this.onEnableDrag();
        this.currentCapsuleNode.getComponent(PhysicsDraggable)
            .enableDrag(this.currentDropZone1, this.currentDropZone2);
    }

    sendToCenter()
    {
        tween(this.currentCapsuleNode)
        .to(1, {
            worldPosition: this.center.getWorldPosition(),
            scale: new Vec3(0.6, 0.6, 0.6),
            eulerAngles: new Vec3(0, 0, 0)
        }).start();
    }


    handleDrop(dropZone: string) {
        console.log(dropZone);
    }

    update(deltaTime: number) {
        
    }
}


