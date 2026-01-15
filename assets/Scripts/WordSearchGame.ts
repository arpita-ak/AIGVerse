import { _decorator, Component, Node, Prefab, instantiate, Vec2, Graphics, UITransform, Color, EventTouch, Vec3 } from 'cc';
import { Cell } from './Cell';
const { ccclass, property } = _decorator;

@ccclass('WordSearchManager')
export class WordSearchManager extends Component {
    @property(Prefab) cellPrefab: Prefab = null;
    @property(Node) gridContainer: Node = null; // Node with Layout component
    @property(Graphics) highlightGfx: Graphics = null;

    private gridData: string[][] = [
        ['M', 'R', 'G', 'R', 'A', 'C', 'E', 'P', 'M', 'D', 'H', 'O'],
        ['K', 'E', 'Y', 'J', 'Q', 'E', 'Q', 'A', 'A', 'E', 'P', 'L'],
        ['G', 'S', 'W', 'I', 'G', 'L', 'M', 'V', 'N', 'N', 'Q', 'V'],
        ['C', 'P', 'I', 'U', 'F', 'U', 'S', 'C', 'N', 'G', 'Q', 'G'],
        ['F', 'E', 'R', 'N', 'A', 'D', 'P', 'I', 'E', 'A', 'M', 'E'],
        ['D', 'C', 'S', 'R', 'T', 'R', 'F', 'O', 'R', 'G', 'M', 'S'],
        ['B', 'T', 'T', 'O', 'G', 'E', 'V', 'R', 'S', 'E', 'E', 'T'],
        ['S', 'C', 'R', 'U', 'B', 'S', 'G', 'F', 'T', 'E', 'N', 'I'],
        ['H', 'S', 'A', 'N', 'E', 'G', 'U', 'R', 'A', 'O', 'T', 'M'],
        ['N', 'I', 'M', 'V', 'N', 'W', 'L', 'K', 'T', 'Y', 'R', 'A'],
        ['Q', 'W', 'L', 'O', 'B', 'B', 'Y', 'N', 'M', 'T', 'Y', 'T'],
        ['A', 'Z', 'A', 'L', 'B', 'I', 'K', 'L', 'S', 'P', 'Y', 'E']
    ];

    private targetWords: string[] = ["SCRUBS", "LOBBY", "GRACE", "ESTIMATE"];
    private currentWord: string = '';
    private gridNodes: Node[][] = [];
    private startCoords: Vec2 = null;
    private endCoords: Vec2 = null;

    start() {
        this.generateGrid();
        // Register touch events on the container itself
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    generateGrid() {
        for (let r = 0; r < 12; r++) {
            this.gridNodes[r] = [];
            for (let c = 0; c < 12; c++) {
                let cellNode = instantiate(this.cellPrefab);
                cellNode.parent = this.gridContainer;
                cellNode.getComponent(Cell).init(r, c, this.gridData[r][c]);
                this.gridNodes[r][c] = cellNode;
            }
        }
    }

    private getCellUnderTouch(event: EventTouch): Vec2 | null {
        const touchPos = event.getLocation(); // Screen position
        for (let r = 0; r < 12; r++) {
            for (let c = 0; c < 12; c++) {
                const node = this.gridNodes[r][c];
                const uiTransform = node.getComponent(UITransform);
                // Check if the world touch point is inside the node's bounding box
                if (uiTransform.getBoundingBoxToWorld().contains(touchPos)) {
                    return new Vec2(r, c);
                }
            }
        }
        return null;
    }

    onTouchStart(event: EventTouch) {
        console.log(event.getLocation());
        const coords = this.getCellUnderTouch(event);
        if (coords) {
            this.startCoords = coords;
            this.highlightGfx.clear();
        }
    }

    onTouchMove(event: EventTouch) {
        if (!this.startCoords) return;
        const coords = this.getCellUnderTouch(event);
        if (coords) {
            // Check for valid line (horizontal, vertical, diagonal)
            if (this.isValidLine(this.startCoords.x, this.startCoords.y, coords.x, coords.y)) {
                this.endCoords = coords;
                this.drawSelection(this.startCoords, this.endCoords);
            }
        }
    }

    isValidLine(r1, c1, r2, c2) {
        return r1 === r2 || c1 === c2 || Math.abs(r1 - r2) === Math.abs(c1 - c2);
    }

    drawSelection(start: Vec2, end: Vec2) {
        const startNode = this.gridNodes[start.x][start.y];
        const endNode = this.gridNodes[end.x][end.y];

        const gfxTransform = this.highlightGfx.getComponent(UITransform);
        // Convert world positions of nodes to the Graphics local space
        let p1 = gfxTransform.convertToNodeSpaceAR(startNode.worldPosition);
        let p2 = gfxTransform.convertToNodeSpaceAR(endNode.worldPosition);

        this.highlightGfx.clear();
        this.highlightGfx.lineWidth = 50;
        this.highlightGfx.strokeColor = new Color(255, 255, 0, 120); // Semi-transparent yellow
        this.highlightGfx.lineCap = Graphics.LineCap.ROUND;
        
        this.highlightGfx.moveTo(p1.x, p1.y);
        this.highlightGfx.lineTo(p2.x, p2.y);
        this.highlightGfx.stroke();
    }

    onTouchEnd() {
        if (this.startCoords && this.endCoords) {
            this.checkWord();
        }
        this.startCoords = null;
        this.endCoords = null;
    }

    checkWord() {
        let word = "";
        let dr = Math.sign(this.endCoords.x - this.startCoords.x);
        let dc = Math.sign(this.endCoords.y - this.startCoords.y);
        let currR = this.startCoords.x;
        let currC = this.startCoords.y;

        while (true) {
            word += this.gridData[currR][currC];
            if (currR === this.endCoords.x && currC === this.endCoords.y) break;
            currR += dr;
            currC += dc;
        }

        if (word == this.currentWord) {
            console.log("Found: " + word);
            // In a real game, you would save this 'highlightGfx' state or create a new permanent node
        } else {
            this.highlightGfx.clear();
        }
    }
}