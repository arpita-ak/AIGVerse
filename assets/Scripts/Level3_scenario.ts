import { _decorator, Button, Color, color, ColorKey, Component, error, Event, instantiate, JsonAsset, Label, Layout, Node, Prefab, resources, Sprite, SpriteFrame, tween, UIOpacity, UITransform } from 'cc';
const { ccclass, property } = _decorator;

// Define the structure of an Option
interface IOption {
    text: string;
    feedback: string;
    try_again: string;
    isCorrect: boolean;
}

// Define the structure of a single Scenario
interface IScenario {
    scenarioId: number;
    scenarioName: string;
    title: string;
    situation: string;
    wizard_textbubble: string;
    intro?: string; // Optional field
    dialogue?: string; // Optional field
    option1: IOption;
    option2: IOption;
    option3: IOption;
    option4: IOption;
    option5: IOption;
}

@ccclass('Level3_scenario')
export class Level3_scenario extends Component {

    @property(Node)
    IntroNode: Node = null;

    @property(Node)
    WizardNode: Node = null;

    @property(Node)
    textBubbleNode: Node = null;

    @property(Node)
    FrontDeskNode: Node = null;

    @property(Node)
    people: Node = null;

    @property(Node)
    BlurredBG: Node = null;

    @property(Node)
    Explore_the_options_button: Node = null;

    @property(Node)
    textBubble2: Node = null;

    @property(Node)
    OptionButtonsNode: Node = null;

    // first 4 are sad wizard, last one is happy wizard
    @property(SpriteFrame)
    wizards: SpriteFrame[] = [];

    @property(Node)
    FeedbackNode: Node = null;

    @property(Node)
    FeedbackTextBubble: Node = null;

    @property(Node)
    nextScenarioButton: Node = null;

    @property(Node)
    retryButton: Node = null;

    @property(Node)
    Level3_Scenario: Node = null;

    private BlueColor: Color = new Color('#014788');
    private RedColor: Color = new Color('#F44336');
    private GreenColor: Color = new Color('#006D0D');

    // Our Dictionary to store scenario data
    private scenarioDictionary: Map<number, IScenario> = new Map();
    private currentScenarioId: number = 3;

    start() {
        this.loadScenarios();
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

    loadScenarios() {
        // Ensure file is at: assets/resources/Level1_Scenarios.json
        resources.load('Level1_Scenarios', JsonAsset, (err, asset) => {
            if (err) {
                error("Could not load JSON:", err);
                return;
            }

            const jsonData = asset.json;
            const scenariosArray: IScenario[] = jsonData.Scenario;

            // Convert Array to Dictionary for quick lookup
            scenariosArray.forEach((scene) => {
                this.scenarioDictionary.set(scene.scenarioId, scene);
            });

            console.log(`Imported ${this.scenarioDictionary.size} scenarios.`);
            
            // Start the first scenario
            this.setupScenario(this.currentScenarioId);
        });
    }

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
        const paddingY = 90;
        textBubble.getComponent(UITransform).setContentSize(labelWidth + paddingX, labelHeight + paddingY);

        // fade in text bubble and show text
        this.tweenOpacity(textBubble, 0.5, 255);
        label.getComponent(Label).string = ""; // Clear existing text
        label.getComponent(UIOpacity).opacity = 255;
        this.node.parent.parent.emit("ShowText", label, message);
    
        await this.sleep(0.05*(message.length - 1) + 1); // wait for text to finish + extra time
        }

    setupScenario(id: number) {
        const data = this.scenarioDictionary.get(id);
        if (!data) return;

        console.log("Now Playing:", data.scenarioName);
        console.log("Wizard says:", data.wizard_textbubble);

        // Here you would call your showTextBubble function 
        // using data.wizard_textbubble
        this.showTextBubble(this.textBubbleNode, data.wizard_textbubble);

    }

    onAcceptTheChallengeButtonClick() {
        
        console.log("Accept The Challenge Button Clicked");

        // this hides everything related to intro
        this.IntroNode.active = false;

        // show front desk
        this.FrontDeskNode.active = true;
        this.tweenOpacity(this.FrontDeskNode.getComponent(UIOpacity), 1, 255);

        this.people.active = true;
        this.tweenOpacity(this.people.getComponent(UIOpacity), 1.5, 255);

        this.scheduleOnce(()=>{
            // show blurred background
            this.BlurredBG.active = true;
            this.tweenOpacity(this.BlurredBG.getComponent(UIOpacity), 1, 255); 
            this.textBubble2.active = true;
            this.showTextBubble(this.textBubble2, "My daughter is in pain for 8 months.\n Medicines failed. Need urgent\n appointment, only 2 days in hand\n before I neeed to travel back to be \nwith wife and younger son!")
        }, 2);
    }

    onExploreTheOptionsButtonClick() {
        console.log("Explore The Options Button Clicked");
        // disable the button
        this.Explore_the_options_button.active = false;
        
        // hide people
        this.people.active = false;
        this.tweenOpacity(this.people.getComponent(UIOpacity), 0.5, 0);
        // hide text bubble2
        this.tweenOpacity(this.textBubble2, 0.5, 0);

        // show the options
        this.tweenOpacity(this.OptionButtonsNode.getComponent(UIOpacity), 0.5, 255);
        let i = 0;
        this.OptionButtonsNode.children.forEach((optionButton)=>{
            i++;
            console.log(optionButton.children);
            optionButton.getChildByName('option_bg').getChildByName('Label').getComponent(Label).string = this.scenarioDictionary.get(this.currentScenarioId)[`option${i}`].text;

            optionButton.getChildByName('number_bg').getComponent(Sprite).color = this.BlueColor;
            optionButton.getChildByName('option_bg').getComponent(Sprite).color = new Color(Color.WHITE);
            optionButton.getChildByName('option_bg').getChildByName('Label').getComponent(Label).color = this.BlueColor;

            optionButton.getChildByName('number_bg').getChildByName('number').getComponent(Label).string = i.toString();
            optionButton.getComponent(Button).interactable = true;
            optionButton.active = true;
        });
        this.OptionButtonsNode.active = true;
    }

    /**
     * Called when a player chooses an option button
     * @param optionNumber 1, 2, 3, 4, or 5
     */
    public onUserChoice(event, optionNumber: number) {
        const scenario = this.scenarioDictionary.get(this.currentScenarioId);
        if (!scenario) return;

        // Access the specific option dynamically
        const selectedOption: IOption = scenario[`option${optionNumber}`];
        let optionButton = this.OptionButtonsNode.children[optionNumber-1];

        // disable interaction
        this.OptionButtonsNode.children.forEach((optionButton)=>{
            optionButton.getComponent(Button).interactable = false;
        });

        if (selectedOption.isCorrect) {
            console.log("Success Animation Triggered: " + selectedOption.feedback);
            
            optionButton.getChildByName('number_bg').getComponent(Sprite).color = this.GreenColor;
            optionButton.getChildByName('option_bg').getComponent(Sprite).color = this.GreenColor;
            optionButton.getChildByName('option_bg').getChildByName('Label').getComponent(Label).color = new Color(Color.WHITE);

            // add confetti 
            this.sleep(1).then(()=>{
                this.FeedbackNode.active = true;
                this.FeedbackNode.getChildByName("Wizard").getComponent(Sprite).spriteFrame = this.wizards[optionNumber-1];
                this.tweenOpacity(this.FeedbackNode, 0.5, 255);
                this.showTextBubble(this.FeedbackTextBubble, selectedOption.feedback);
                // next scenario prep
                this.retryButton.active = false;
                this.nextScenarioButton.active = true;
            });
            
        } else {
            console.log("Failure Animation Triggered: " + selectedOption.feedback);
            optionButton.getChildByName('number_bg').getComponent(Sprite).color = this.RedColor;
            optionButton.getChildByName('option_bg').getComponent(Sprite).color = this.RedColor;
            optionButton.getChildByName('option_bg').getChildByName('Label').getComponent(Label).color = new Color(Color.WHITE);

            this.sleep(1).then(()=>{
                this.FeedbackNode.active = true;
                this.FeedbackNode.getChildByName("Wizard").getComponent(Sprite).spriteFrame = this.wizards[optionNumber-1];
                this.tweenOpacity(this.FeedbackNode, 0.5, 255);
                this.showTextBubble(this.FeedbackTextBubble, selectedOption.feedback);
            });
        }
    }

    onRetryButtonClick()
    {
        this.FeedbackNode.active = false;
        this.onExploreTheOptionsButtonClick();
    }

    onNextScenarioButtonClick()
    {
        // Move to next scenario

        //not necessary as we will fetch it again
        // this.currentScenarioId++;
        this.Level3_Scenario.active = true;
    }
}