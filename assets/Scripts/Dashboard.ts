import { _decorator, Component, Node, tween, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Dashboard')
export class Dashboard extends Component {

    @property(Node)
    ProfileButton: Node = null;

    @property(Node)
    ProfileNode: Node = null;

    @property(Node)
    SettingsButton: Node = null;

    @property(Node)
    SettingsNode: Node = null;

    @property(Node)
    LeaderboardButton: Node = null;

    @property(Node)
    LeaderBoardNode: Node = null;

    @property(Node)
    RewardsButton: Node = null;

    @property(Node)
    RewardNode: Node = null;

    @property(Node)
    Level_1_Node: Node = null;

    @property(Node)
    BackButton: Node = null;

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
            this.node.parent.parent.emit("showLeftHUD");
            this.node.parent.parent.emit("showCoins", 150);

            this.node.getChildByName("Level Buttons").active = true;
            tween(this.node.getChildByName("Level Buttons").getComponent(UIOpacity))
            .to(1, { opacity: 255 }).start();
        }).start();
    }

    onProfileButtonClick(){
        console.log("Profile Button Clicked");
        this.node.parent.parent.emit("onProfileButtonClick");

        this.ProfileNode.active = true;
    }

    onSettingsButtonClick(){
        console.log("Settings Button Clicked");
        this.node.parent.parent.emit("onSettingsButtonClick");
        
        this.SettingsNode.active = true;
    }

    onLeaderboardButtonClick(){
        console.log("Leaderboard Button Clicked");
        this.node.parent.parent.emit("onLeaderboardButtonClick");

        this.LeaderBoardNode.active = true;
    }

    onRewardsButtonClick(){
        console.log("Rewards Button Clicked");
        this.node.parent.parent.emit("onRewardsButtonClick");

        this.RewardNode.active = true;
    }

    onLevel_1_SelectButtonClick(){
        // disable the buttons

        this.ProfileButton.active = false;
        this.SettingsButton.active = false;
        this.LeaderboardButton.active = false;
        this.RewardsButton.active = false;

        console.log("Level 1 Selected");
        this.node.parent.parent.emit("onLevel_1_SelectButtonClick");
        this.Level_1_Node.active = true;
    }

    onBackButtonClick()
    {
        this.ProfileNode.active = false;
        this.RewardNode.active = false;
        this.LeaderBoardNode.active = false;
        this.SettingsNode.active = false;
    }

    update(deltaTime: number) {
        
    }
}


