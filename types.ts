export type Pt = [number, number];
export type IdPt = { id: string; pt: Pt };
// from and to are string start.id and end.id for the benefit of Kruskal.
export type Edge = { start: IdPt; end: IdPt; from?: string; to?: string; weight?: number; width: number };
export interface MapNode extends IdPt { radius: number }
export interface Tile extends IdPt {
  length: number;
  sourceType: 'MapNode'|'Edge';
  sourceId: string;
}

export type ColRow = [number, number]; // Wish I could specify integers here.

export interface Box {
  id?: string;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export type Filter = (any) => boolean;

export type ColRowFindFn = ({ colRow }: { colRow: ColRow }) => Array<any>;

export interface MoveParams {
  soul: Soul;
  neighbors: Array<Pt>;
  probable;
  getTargetsAtColRow: ColRowFindFn;
  canMoveHereFn?: CanMoveHereFn;
}

export interface CanMoveHereParams {
  getTargetsAtColRow: ColRowFindFn;
  colRow: ColRow;
}

export type MoveFn = (MoveParams) => Pt;
export type CanMoveHereFn = (CanMoveHereParams) => boolean;

export interface CanMoveHereDef {
  avoid: Array<string>;
}

export interface CommandDef {
  id: string;
  name: string;
  cmdFn: CmdFn;
  params?;
}

export interface Command extends CommandDef {
  actor?: Soul;
  targets?: Array<Soul>;
}

export interface CmdFn {
  (CmdParams): void;
}

export interface CmdParams {
  gameState: GameState;
  targetTree: TargetTree;
  // TODO: Define type that encompassing all the
  // things that can come from the targetTree.
  cmd: Command;
  probable;
}

export interface SoulProcessor {
  (targetTree: TargetTree, souls: Array<Soul>): void;
}

export type soulType = 'figure' | 'background';

export interface SoulDef {
  type: soulType;
  move?: MoveFn;
  canMoveHereFn?: CanMoveHereFn;
  getInteractionsWithThing?: (Soul, any) => Array<CommandDef>;
  facingsAllowed?: Array<Pt>;
  hitDice?: string;
  textureId?: string;
}

export interface Soul extends SoulDef, Partial<Box> {
  id: string;
  direction: Pt;
  pos: Pt;
  items: Array<Soul>;
  hp?: number;
  maxHP?: number;
}

export interface ItemRole {
  itemPositioningStyle: string;
  offset?: Pt;
}

export interface GridContext {
  id: string;
  colRow: ColRow;
}

export interface Sprite {
  col: number;
  row: number;
  width: number;
  height: number;
  hitRadius: number;
}

export type Done = (Error, any?) => void;

export interface UpdateResult {
  shouldAdvanceToNextSoul: boolean;
  renderShouldWaitToAdvanceToNextUpdate: boolean;
}

export interface AnimationDef {
  type: string;
  duration: number;
  postAnimationGameStateUpdater: Done;
  custom;
}

export interface GameState {
  allowAdvance: boolean;
  uiOn: boolean;
  cmdChoices: Array<Command>;
  cmdQueue: Array<Command>;
  animations: Array<AnimationDef>;
  ephemerals: {
    blasts: Array<BlastDef>;
  };
  gridsInit: boolean;
  grids?: Array<Grid>;
  soulTracker: SoulTracker;
  player?: Soul;
  lastClickedThingIds: Array<string>;
  displayMessage?: string;
  gameWon: boolean;
  deathNoticeSent: boolean;
  turn: number;
}

interface AddSouls {
  (grids: Array<Grid>, targetTree: TargetTree, souls: Array<Soul>): void;
}

export interface SoulTracker {
  addSouls: AddSouls;
  removeSouls: SoulProcessor;
  getSouls: () => Array<Soul>;
  getActingSoul: () => Soul;
  setActingSoul: (string) => void;
  incrementActorIndex: () => void;
  actingSoulGoesRightAfterPlayer: () => boolean;
}

export interface Grid {
  id: string;
  unitWidth: number;
  unitHeight: number;
  xOffset: number;
  yOffset: number;
  numberOfCols: number;
  numberOfRows: number;
  width: number;
  height: number;
  color: string;
  rows?: Array<Array<GridIntersection>>;
  effects?: Array<EffectDef>;
}

export interface GridIntersection extends Partial<Box> {
  pt: Pt;
  colRow: ColRow;
  gridId: string;
  id: string;
}

export interface BlastDef extends CircleDef {
  color: string;
}

export interface CircleDef {
  cx: number;
  cy: number;
  r: number;
}

export interface CurvesKit {
  start: Pt;
  curves: Array<BezierStep>;
}

export interface BezierStep {
  srcCtrl: Pt;
  destCtrl: Pt;
  dest: Pt;
}

export interface EffectDef {
  name: string;
  centers?: Array<[number, number]>;
  strength?: number;
  decayDist?: number;
}

export interface TargetTree {
  insert: (Box) => void;
  remove: (Box) => void;
  updateItemBox: (item: Box, newBox: Box) => void;
  search: (Box) => Array<Box>;
  raw;
  getIdsOfThingsInTree: () => Set<string>;
}
