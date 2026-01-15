import { _decorator, Component, Label, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Cell')
export class Cell extends Component {
    @property(Label) letterLabel: Label = null;
    
    public row: number = 0;
    public col: number = 0;
    public letter: string = "";

    init(r: number, c: number, char: string) {
        this.row = r;
        this.col = c;
        this.letter = char;
        this.letterLabel.string = char;
    }
}