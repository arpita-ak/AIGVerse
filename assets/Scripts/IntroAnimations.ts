import { _decorator, Animation, Component, Node, tween, UIOpacity, Vec3 } from 'cc';
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
    topRightDoc: Node = null;

    @property(Node)
    HospitalBuildingNode: Node = null;

    @property(Node)
    Entrance:Node = null;

    @property(Node)
    Entrance_blurred: Node = null;

    @property(Node)
    WizardCharacter: Node = null;

    @property(Node)
    text1: Node = null; 

    @property(Node)
    text2: Node = null; 

    @property(Node)
    text3: Node = null; 

    @property(Node)
    text4: Node = null; 

    @property(utils)
    utils: utils = null;

    start() {
        this.playIntroAnimation();
    }

    update(deltaTime: number) {
        
    }

    playIntroAnimation(){
        // play fill animation
        this.SplashScreenNode.getComponent(Animation).play("splashScreen");
        // after the above animtaion
        this.scheduleOnce(()=>{
            tween(this.outline.getComponent(UIOpacity))
                .to(1, {opacity: 0}).start();
            // move the logo towards top right
            tween(this.logo)
                .to(1, {position: this.topRightDoc.getPosition(), scale: new Vec3(0.3, 0.3, 0.3)})
                .start();
            tween(this.logo.getComponent(UIOpacity))
                .to(1, {opacity: 0}).start();
        }, 2.5);
        this.scheduleOnce(()=>{
            tween(this.topRightDoc.getComponent(UIOpacity)).to(1, {opacity: 255}).start();
        }, 3.5);
        // building visible
        this.scheduleOnce(()=>{ 
            tween(this.SplashScreenNode.getComponent(UIOpacity)).to(1, {opacity: 0}).start();
            // set up the scene as required
            this.HospitalBuildingNode.active = true;
            this.HospitalBuildingNode.getComponent(UIOpacity).opacity = 0;
            tween(this.HospitalBuildingNode.getComponent(UIOpacity)).to(1, {opacity: 255})
            .call(()=>{
                tween(this.HospitalBuildingNode).to(1, {scale: new Vec3(2.5, 2.5, 2.5)}).  start();
            }).start();
        }, 4);
        // entrance visible
        this.scheduleOnce(()=>{
            this.Entrance.active = true;
            tween(this.Entrance).to(1, {scale: new Vec3(1.8,1.8,1.8)})
            .call(()=>{
                this.Entrance_blurred.active = true;
                tween(this.Entrance_blurred.getComponent(UIOpacity)).to(1, {opacity: 255}).start();
            }).start();
        }, 6.5);
        // wizard character visible
        this.scheduleOnce(()=>{
            this.WizardCharacter.active = true;
            tween(this.WizardCharacter.getComponent(UIOpacity)).to(1, {opacity: 255})
            .delay(1)
            .call(()=>{
                // ready for texts
                tween(this.text1.getComponent(UIOpacity)).to(0.5, {opacity: 255}).start();
                this.utils.ShowText(this.text1.children[0], "Ah... you've arrived. \nWelcome, brave one.")
            })
            .delay(2)
            .call(()=>{
                tween(this.text1.getComponent(UIOpacity)).to(0.5, {opacity: 0}).start();
                tween(this.text2.getComponent(UIOpacity)).to(0.5, {opacity: 255}).start();
            })
            .delay(2)
            .call(()=>{
                tween(this.text2.getComponent(UIOpacity)).to(0.5, {opacity: 0}).start();
                tween(this.text3.getComponent(UIOpacity)).to(0.5, {opacity: 255}).start();
            })
            .delay(2)
            .call(()=>{
                tween(this.text3.getComponent(UIOpacity)).to(0.5, {opacity: 0}).start();
                tween(this.text4.getComponent(UIOpacity)).to(0.5, {opacity: 255}).start();
            }).start();
        }, 9.5);
    }
}


