import { _decorator, Component, Node, Vec3, EventTouch, v3, UITransform, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PhysicsDraggable')
export class PhysicsDraggable extends Component {
    // Configuration
    private springStrength: number = 0.2; // Adjust for "snappiness" (0.1 to 0.5)
    private snapThreshold: number = 200;
    private scaleDuringDrag: Vec3 = v3(0.6, 0.6, 0.6);
    private scaleAnimDuration: number = 0.1;
    private scheduleDelay: number = 1;

    // Drop zones and answer tracking
    private dropZoneA: Node = null!;
    private dropZoneB: Node = null!;
    private correctAns: boolean = null;

    // Drag state
    private isDragging: boolean = false;
    private targetPos: Vec3 = v3();

    onEnable() {
        this.targetPos.set(this.node.position);
    }

    enableDrag(zoneA: Node, zoneB: Node, correct: boolean)
    {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this.dropZoneA = zoneA;
        this.dropZoneB = zoneB;
        this.correctAns = correct;
    }

    disableDrag()
    {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    private onTouchStart(event: EventTouch) {
        this.isDragging = true;
        // Bring to front
        this.node.setSiblingIndex(this.node.parent!.children.length - 1);
        tween(this.node).to(this.scaleAnimDuration, {
            scale: this.scaleDuringDrag, 
            eulerAngles: new Vec3(0, 0, 0)}).start();
    }

    private onTouchMove(event: EventTouch) {
        // Convert screen touch to local node space
        const touchPos = event.getUILocation();
        const uiTransform = this.node.parent!.getComponent(UITransform)!;
        this.targetPos = uiTransform.convertToNodeSpaceAR(v3(touchPos.x, touchPos.y, 0));
    }

    private onTouchEnd() {
        this.isDragging = false;
        this.checkDropZones();
    }

    update(dt: number) {
        if (this.isDragging) {
            // Smooth Vector Follow (Lerp-based)
            const currentPos = this.node.position;
            const nextPos = v3();
            Vec3.lerp(nextPos, currentPos, this.targetPos, this.springStrength);
            this.node.setPosition(nextPos);
        }
    }

    private checkDropZones() {
        const posA = this.dropZoneA.worldPosition;
        const posB = this.dropZoneB.worldPosition;
        const myPos = this.node.worldPosition;

        if (Vec3.distance(myPos, posA) < this.snapThreshold) {
            this.handleDropZone(this.dropZoneA, 'TRUE', true);
        } else if (Vec3.distance(myPos, posB) < this.snapThreshold) {
            this.handleDropZone(this.dropZoneB, 'FALSE', false);
        }
    }

    private handleDropZone(dropZone: Node, zoneName: string, isZoneA: boolean) {
        const rotationAngle = isZoneA ? 4 : -10;
        
        tween(dropZone.parent.parent)
            .to(this.scaleAnimDuration, { eulerAngles: new Vec3(0, 0, rotationAngle) })
            .call(() => {
                this.node.setWorldRotation(dropZone.getWorldRotation());
                tween(this.node).to(this.scaleAnimDuration, {
                    scale: dropZone.getScale(),
                    worldPosition: dropZone.getWorldPosition()
                }).start();
            })
            .start();

        this.scheduleOnce(() => {
            const isCorrect = isZoneA ? this.correctAns : !this.correctAns;
            if (isCorrect) {
                this.disableDrag();
                dropZone.active = true;
                this.node.active = false;
            }
            this.node.parent.parent.parent.parent.emit('onDropCompleted', zoneName, isCorrect);
        }, this.scheduleDelay);
    }
}