# AIGVerse Codebase Guide for AI Agents

## Project Overview
AIGVerse is a Cocos Creator (v3.8.6) TypeScript game focused on educational gameplay in a hospital/healthcare setting. The architecture uses component-based scenes with mini-games teaching soft skills and healthcare values.

## Architecture

### Core Structure
- **Scene Components**: Each level/screen is a Cocos Creator scene with TypeScript components (`.ccclass` decorator)
- **Asset-Driven**: Scenes contain visual nodes (UI, sprites, animations) with attached behavior scripts
- **Data-Driven Mini-Games**: Gameplay logic loads JSON files from `assets/resources/` (e.g., `WordRushData.json`, `Level1_Scenarios.json`)

### Major Components

| Component | Purpose | File |
|-----------|---------|------|
| **IntroAnimations** | Splash screen, login, avatar selection intro sequences | IntroAnimations.ts |
| **Dashboard** | Main hub with level selection, profile, settings buttons | Dashboard.ts |
| **Level1, Level2, Level3** | Level entry points with dialogue and mini-game launchers | Level1.ts, etc. |
| **Level1_scenario** | Decision-based scenario with 5 options and feedback system | Level1_scenario.ts |
| **wordRush** | Word-guessing quiz with answer collection mechanic | wordRush.ts |
| **ScaleOfTruth** | Balance-scale decision game | ScaleOfTruth.ts |
| **PhysicsDraggable** | Drag-and-drop utility for interactive elements with spring physics | PhysicsDraggable.ts |

### Data Flow
1. **Scenes load data** via `resources.load()` (async)
2. **JSON structures**: Questions (wordRush), Scenarios (Level1_scenario), etc.
3. **Results storage**: Components use `Map<questionId, UserChoice>` to track answers
4. **Event emission**: Parent nodes emit events (e.g., `"ShowText"`, `"onLevel_1_SelectButtonClick"`)

## Key Development Patterns

### Component Structure
```typescript
@ccclass('ComponentName')
export class ComponentName extends Component {
    @property(Node) nodeName: Node = null;  // Inspector-exposed nodes
    start() { } // Initialization
    update(deltaTime) { } // Frame updates (usually empty)
}
```

### Animation Pattern (Tween-Based)
Use Cocos `tween()` for smooth transitions:
```typescript
tween(node.getComponent(UIOpacity))
    .to(0.5, { opacity: 255 })
    .delay(0.2)
    .call(() => { /* callback */ })
    .start();
```

### Text Display (Animated Typing)
Use `utils.ts` to trigger typewriter effect:
```typescript
this.node.emit("ShowText", labelNode, "Text to display");
// In utils.ts: schedules character-by-character reveal at 0.05s intervals
```

### Result Tracking
Store user choices in `Map<id, UserChoice>`:
```typescript
quizResults.set(questionId, {
    questionId: id,
    selectedOption: "A" or "B",
    isCorrect: boolean
});
```

### Event Patterns
- **Parent communication**: `this.node.parent.parent.emit("eventName", data)`
- **Child event listeners**: `this.node.on("eventName", handler, this)`
- **Cleanup**: Always unsubscribe when done (`node.off()`)

## Build & Debugging

### Project Setup
- **Framework**: Cocos Creator (TypeScript support)
- **TypeScript**: Non-strict mode (`"strict": false` in tsconfig.json)
- **Build Outputs**: `build/web-mobile/`, `build-templates/web-desktop/`

### Common Commands (via Cocos Creator Editor)
- **Build**: Editor → Project → Build
- **Preview**: Editor → Preview in Browser
- **Scene Files**: Located in `assets/` as `.scene` files with corresponding scripts

## Important Files & Locations

| Type | Location | Notes |
|------|----------|-------|
| Scripts | `assets/Scripts/*.ts` | Component logic (11 main files) |
| Scenes | `assets/*.scene` | Main.scene is root |
| Quiz Data | `assets/resources/*.json` | WordRushData.json, Level1_Scenarios.json |
| Animations | `assets/Animations/` | Sprite animations (splashScreen.anim) |
| UI Assets | `assets/Game Assets/` | Images, fonts, prefabs |

## Conventions & Anti-Patterns

### ✅ DO:
- Use `@property(Node)` for scene node references (Inspector-configurable)
- Call `getChildByName()` for dynamic node access
- Emit events upward through `node.parent.parent.emit()`
- Use `scheduleOnce()` for delayed callbacks
- Store game state in component Maps/arrays

### ❌ DON'T:
- Avoid modifying `strict: true` in tsconfig (non-strict is intentional)
- Don't create cross-component references directly; use events instead
- Avoid `node.destroy()` mid-animation; use callbacks
- Don't hardcode values; use `@property` for tweaking in Inspector

## Common Patterns by Use Case

### Adding a New Mini-Game
1. Create component in `assets/Scripts/YourGame.ts` extending `Component`
2. Load data: `resources.load('DataFileName', JsonAsset, (err, asset) => { })`
3. Track results in `Map<id, choice>`
4. Emit completion event to parent: `this.node.parent.parent.emit("gameComplete", results)`

### Adding Scenario Options
1. Edit JSON in `assets/resources/Level*_Scenarios.json`
2. Component reads `IScenario` interface with `option1-5` fields
3. Set `isCorrect: true/false` to mark right answer

### Creating Animations
- Use `tween()` chains in TypeScript (preferred over `.anim` files for logic)
- Example: Position + opacity + scale transforms with delays and callbacks

## Known Quirks
- **Node hierarchy navigation**: Often uses `this.node.parent.parent.emit()` (2 levels up)
- **Resource loading**: Async with callback; always check for errors
- **Non-strict TypeScript**: Type safety is relaxed; be careful with property access
- **Component references**: Prefer Inspector assignment over direct instantiation
