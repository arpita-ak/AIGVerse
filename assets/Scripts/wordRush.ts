import { _decorator, Component, Label, Node, resources, JsonAsset, UITransform, tween, Vec2, Vec3, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

interface QuestionData {
        id: number;
        text: string;
        optionA: string;
        optionB: string;
        correct: string;
    }

interface UserChoice {
    questionId: number;
    selectedOption: string; // "A" or "B"
    isCorrect: boolean;
}

@ccclass('wordRush')
export class wordRush extends Component {
    
    @property(Label)
    questionNode: Label = null;

    @property(Node)
    options1: Node = null;

    @property(Node)
    options2: Node = null;

    @property(Node)
    answers: Node = null;

    @property(Node)
    finalAlphabets: Node = null;

    private questions: QuestionData[] = [];
    private currentQuestion: QuestionData = null;
    private currentQuestionIndex: number = 0;
    private _isAnswerChosen: boolean = true;

    // This is your Dictionary to store results
    private quizResults: Map<number, UserChoice> = new Map();
    
    start() {
        this.loadQuizData();
    }

    loadQuizData() {
        resources.load('WordRushData', JsonAsset, (err, asset) => {
            if (err) return;
            this.questions = asset.json.Questions;
            this.showNextQuestion(0);
        });
    }

    showNextQuestion(_number: number) {
        if (_number < this.questions.length && this._isAnswerChosen) {
            this.currentQuestionIndex = _number;
            this.currentQuestion = this.questions[this.currentQuestionIndex];
            this.showQuestion(this.currentQuestion.text, this.currentQuestion.optionA, this.currentQuestion.optionB);
        }
    }

    showQuestion(
        question: string, 
        options1: string, 
        options2: string) 
    {
        this.questionNode.string = question;
        this.options1.getChildByName('text').getComponent(Label).string = options1;
        this.options2.getChildByName('text').getComponent(Label).string = options2;

        // reset option colors
        this.options1.getChildByName('red').active = false;
        this.options1.getChildByName('green').active = false;
        this.options2.getChildByName('red').active = false;
        this.options2.getChildByName('green').active = false;
    }

    // Called when a user clicks an option button
    public onOptionSelected(event, choice: string) { // choice = "A" or "B"
        if (!this._isAnswerChosen) return; // prevent multiple selections
        this._isAnswerChosen = false; // lock further selections until next question

        const currentQ = this.questions[this.currentQuestionIndex];
        const correct = choice === currentQ.correct;

        // 1. Store in Dictionary
        this.quizResults.set(currentQ.id, {
            questionId: currentQ.id,
            selectedOption: choice,
            isCorrect: correct
        });

        // 2. Trigger Animation logic
        if (correct) {
            this.playSuccessAnimation();
        } else {
            this.playFailureAnimation();
        }

        console.log(`Stored Question ${currentQ.id}: Chosen ${choice}, Correct: ${correct}`);
    }

    playSuccessAnimation() {
        if (this.currentQuestion.correct === "A") {
            this.options1.getChildByName('green').active = true;
        } else {
            this.options2.getChildByName('green').active = true;
        }  

        // show answer in the answers section
        let ans = this.currentQuestion.correct === "A" ? this.currentQuestion.optionA : this.currentQuestion.optionB;
        const answerNode = this.answers.getChildByName(`${ans}`);
        let originalWidth = answerNode.getComponent(UITransform).width;
        answerNode.getComponent(UITransform).width = 0;
        answerNode.active = true;
        tween(answerNode.getComponent(UITransform))
            .to(0.1, { width: 60 })
            .start();

        let startPos = answerNode.getPosition();
        answerNode.on(Node.EventType.TOUCH_START, () => {
            answerNode.off(Node.EventType.TOUCH_START);

            console.log("Answer moved to final position");
            tween(answerNode.getComponent(UITransform))
                .to(0.1, { width: originalWidth })
                .start();

            // Move to finalAlphabets section
            let letterNode = this.finalAlphabets.children[this.currentQuestionIndex].getChildByName('letter');
            letterNode.setWorldPosition(answerNode.getWorldPosition());
            letterNode.setScale(new Vec3(0, 0, 0)); // start from scale 0
            letterNode.parent.active = true;

            tween(letterNode)
                .to(0.5, {scale: new Vec3(3, 3, 3) })
                .delay(0.2)

                .to(0.5, {position: new Vec3(0, 0, 0), scale: new Vec3(1, 1, 1) })
                .delay(0.5)
                .call(() => {
                    this._isAnswerChosen = true; // unlock for next question
                    this.showNextQuestion(this.currentQuestionIndex + 1);
                })
                .start();
            return
        }, this);
    }

    playFailureAnimation() {
        if (this.currentQuestion.correct === "A") {
            this.options2.getChildByName('red').active = true;
        } else {
            this.options1.getChildByName('red').active = true;
        }

        tween(this.node.getChildByName('feedback').getComponent(UIOpacity))
        .to(0.2, { opacity: 255 })
        .delay(0.7)
        .to(0.2, { opacity: 0 })
        .start();

        // After animation, show retry option
        this.scheduleOnce(() => {
            // show the same question again for retry
            this._isAnswerChosen = true;
            this.showNextQuestion(this.currentQuestionIndex);
        }, 1);
    }

    update(deltaTime: number) {
        
    }
}


