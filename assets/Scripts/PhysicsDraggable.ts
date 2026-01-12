import { _decorator, Component, Node, Vec3, EventTouch, v3, UITransform, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PhysicsDraggable')
export class PhysicsDraggable extends Component {

    dropZoneA: Node = null!;
    dropZoneB: Node = null!;
    springStrength: number = 0.2; // Adjust for "snappiness" (0.1 to 0.5)

    private _isDragging: boolean = false;
    private _targetPos: Vec3 = v3();
    private _currentVel: Vec3 = v3();
    private _snapThreshold: number = 200;

    onEnable() {
        
        this._targetPos.set(this.node.position);
    }

    enableDrag(zoneA: Node, zoneB: Node)
    {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this.dropZoneA = zoneA;
        this.dropZoneB = zoneB;
    }

    disableDrag()
    {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    private onTouchStart(event: EventTouch) {
        this._isDragging = true;
        // Bring to front
        this.node.setSiblingIndex(this.node.parent!.children.length - 1);
        tween(this.node).to(0.1, {
            scale: new Vec3(0.6,0.6,0.6), 
            eulerAngles: new Vec3(0, 0, 0)}).start();
    }

    private onTouchMove(event: EventTouch) {
        // Convert screen touch to local node space
        const touchPos = event.getUILocation();
        const uiTransform = this.node.parent!.getComponent(UITransform)!;
        this._targetPos = uiTransform.convertToNodeSpaceAR(v3(touchPos.x, touchPos.y, 0));
    }

    private onTouchEnd() {
        this._isDragging = false;
        this.checkDropZones();
    }

    update(dt: number) {
        if (this._isDragging) {
            // Smooth Vector Follow (Lerp-based)
            // Position = current + (target - current) * strength
            let currentPos = this.node.position;
            let nextPos = v3();
            Vec3.lerp(nextPos, currentPos, this._targetPos, this.springStrength);
            this.node.setPosition(nextPos);
        }
    }

    private checkDropZones() {
        const posA = this.dropZoneA.worldPosition;
        const posB = this.dropZoneB.worldPosition;
        const myPos = this.node.worldPosition;

        if (Vec3.distance(myPos, posA) < this._snapThreshold) 
        {
            let zoneName = "TRUE";
            tween(this.dropZoneA.parent.parent)
            .to(0.1, {eulerAngles: new Vec3(0, 0, 4)})
            .call(()=>{
                this.node.setWorldRotation(this.dropZoneA.getRotation());
                tween(this.node).to(0.1, {
                    scale: this.dropZoneA.getScale(), 
                    worldPosition: this.dropZoneA.getWorldPosition()})
                .start();
            })
            .start();
            
            // Emit custom event for other systems to listen to
            this.node.parent.parent.parent.parent.emit('onDropCompleted', zoneName);
            console.log(`Dropped in: ${zoneName}`);
        } 
        else if (Vec3.distance(myPos, posB) < this._snapThreshold) 
        {
            let zoneName = "FALSE";
            tween(this.dropZoneB.parent.parent)
            .to(0.1, {eulerAngles: new Vec3(0, 0, -10)})
            .call(()=>{
                this.node.setWorldRotation(this.dropZoneB.getRotation());
                tween(this.node).to(0.1, {
                    scale: this.dropZoneB.getScale(), 
                    worldPosition: this.dropZoneB.getWorldPosition()})
                .start();
            })
            .start();
            this.node.parent.parent.parent.parent.emit('onDropCompleted', zoneName);
            console.log(`Dropped in: ${zoneName}`);
        }
    }
}