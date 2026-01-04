import { _decorator, Component, Node, tween, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Dashboard')
export class Dashboard extends Component {

    @property(Node)
    ProfileButton: Node = null;

    @property(Node)
    SettingsButton: Node = null;

    @property(Node)
    LeaderboardButton: Node = null;

    @property(Node)
    RewardsBButton: Node = null;

    @property(Node)
    Level_1_Node: Node = null;

    start() {
        this.onDasboardLoad();
    }

    onDasboardLoad(){
        console.log("Dashboard Loaded");
        this.node.active = true;
        tween(this.node.getComponent(UIOpacity)).to(1, { opacity: 255 })
        .call(()=>{
            this.node.getChildByName("Digital screen with white").active = true;
            tween(this.node.getChildByName("Digital screen with white").getComponent(UIOpacity))
            .to(1, { opacity: 255 }).start();
        })
        .delay(1)
        .call(() => {
            this.node.getChildByName("Digital Screen with white glow").active = true;
            tween(this.node.getChildByName("Digital Screen with white glow").getComponent(UIOpacity))
            .to(1, { opacity: 255 }).start();
        })
        .delay(1)
        .call(() => {
            this.node.getChildByName("Left HUD").active = true;
            tween(this.node.getChildByName("Left HUD").getComponent(UIOpacity))
            .to(1, { opacity: 255 }).start();

            this.node.getChildByName("Level Buttons").active = true;
            tween(this.node.getChildByName("Level Buttons").getComponent(UIOpacity))
            .to(1, { opacity: 255 }).start();
        }).start();
    }

    onProfileButtonClick(){
        console.log("Profile Button Clicked");
        this.node.parent.parent.emit("onProfileButtonClick");
    }

    onSettingsButtonClick(){
        console.log("Settings Button Clicked");
        this.node.parent.parent.emit("onSettingsButtonClick");
    }

    onLeaderboardButtonClick(){
        console.log("Leaderboard Button Clicked");
        this.node.parent.parent.emit("onLeaderboardButtonClick");
    }

    onRewardsButtonClick(){
        console.log("Rewards Button Clicked");
        this.node.parent.parent.emit("onRewardsButtonClick");
    }

    onLevel_1_SelectButtonClick(){
        console.log("Level 1 Selected");
        this.node.parent.parent.emit("onLevel_1_SelectButtonClick");
        this.Level_1_Node.active = true;
    }

    update(deltaTime: number) {
        
    }
}


