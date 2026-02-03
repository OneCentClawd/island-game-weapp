/**
 * 小岛物语 - 微信小程序完整版
 * 包含所有功能模块
 */

// 加载适配器
require('./js/libs/weapp-adapter.js');

// 获取主 canvas
const canvas = wx.createCanvas();
const systemInfo = wx.getSystemInfoSync();

// ===================
// 游戏配置 - 直接使用屏幕尺寸
// ===================
const GameConfig = {
  WIDTH: systemInfo.windowWidth,
  HEIGHT: systemInfo.windowHeight,
  VERSION: '0.3.0',
};

// 不缩放，直接 1:1
const scale = 1;

canvas.width = systemInfo.windowWidth;
canvas.height = systemInfo.windowHeight;

const ctx = canvas.getContext('2d');

// ===================
// 颜色配置
// ===================
const Colors = {
  PRIMARY: '#4ecdc4',
  SECONDARY: '#ffe66d',
  ACCENT: '#ff6b6b',
  BACKGROUND: '#f7fff7',
  TEXT_DARK: '#2c3e50',
  TEXT_LIGHT: '#ffffff',
  
  TIER: ['#607d8b', '#8d6e63', '#66bb6a', '#42a5f5', '#ab47bc', '#ffa726', '#ef5350', '#ec407a', '#ffee58'],
  TIER_BADGE: ['#607d8b', '#795548', '#4caf50', '#2196f3', '#9c27b0', '#ff9800', '#f44336', '#e91e63', '#ffc107'],
};

// ===================
// 物品配置
// ===================
const ITEMS = {
  // 木材线 (8级)
  'wood1': { key: 'wood1', name: '树枝', emoji: '🌿', tier: 1, mergeInto: 'wood2' },
  'wood2': { key: 'wood2', name: '木头', emoji: '🪵', tier: 2, mergeInto: 'wood3' },
  'wood3': { key: 'wood3', name: '木板', emoji: '🪓', tier: 3, mergeInto: 'wood4' },
  'wood4': { key: 'wood4', name: '木箱', emoji: '📦', tier: 4, mergeInto: 'wood5' },
  'wood5': { key: 'wood5', name: '木屋', emoji: '🏠', tier: 5, mergeInto: 'wood6' },
  'wood6': { key: 'wood6', name: '别墅', emoji: '🏡', tier: 6, mergeInto: 'wood7' },
  'wood7': { key: 'wood7', name: '豪宅', emoji: '🏰', tier: 7, mergeInto: 'wood8' },
  'wood8': { key: 'wood8', name: '宫殿', emoji: '🏯', tier: 8 },
  
  // 石材线 (8级)
  'stone1': { key: 'stone1', name: '碎石', emoji: '🪨', tier: 1, mergeInto: 'stone2' },
  'stone2': { key: 'stone2', name: '石块', emoji: '🧱', tier: 2, mergeInto: 'stone3' },
  'stone3': { key: 'stone3', name: '石墙', emoji: '🧱', tier: 3, mergeInto: 'stone4' },
  'stone4': { key: 'stone4', name: '石塔', emoji: '🗼', tier: 4, mergeInto: 'stone5' },
  'stone5': { key: 'stone5', name: '城堡', emoji: '🏛️', tier: 5, mergeInto: 'stone6' },
  'stone6': { key: 'stone6', name: '要塞', emoji: '🏰', tier: 6, mergeInto: 'stone7' },
  'stone7': { key: 'stone7', name: '神殿', emoji: '⛩️', tier: 7, mergeInto: 'stone8' },
  'stone8': { key: 'stone8', name: '奇迹', emoji: '🗿', tier: 8 },
  
  // 食物线 (8级)
  'food1': { key: 'food1', name: '种子', emoji: '🌱', tier: 1, mergeInto: 'food2' },
  'food2': { key: 'food2', name: '草芽', emoji: '🌿', tier: 2, mergeInto: 'food3' },
  'food3': { key: 'food3', name: '蔬菜', emoji: '🥕', tier: 3, mergeInto: 'food4' },
  'food4': { key: 'food4', name: '水果', emoji: '🍎', tier: 4, mergeInto: 'food5' },
  'food5': { key: 'food5', name: '面包', emoji: '🍞', tier: 5, mergeInto: 'food6' },
  'food6': { key: 'food6', name: '蛋糕', emoji: '🎂', tier: 6, mergeInto: 'food7' },
  'food7': { key: 'food7', name: '盛宴', emoji: '🍱', tier: 7, mergeInto: 'food8' },
  'food8': { key: 'food8', name: '满汉全席', emoji: '🥘', tier: 8 },
  
  // 矿石线 (8级)
  'ore1': { key: 'ore1', name: '煤矿', emoji: '⬛', tier: 1, mergeInto: 'ore2' },
  'ore2': { key: 'ore2', name: '铜矿', emoji: '🪙', tier: 2, mergeInto: 'ore3' },
  'ore3': { key: 'ore3', name: '铁矿', emoji: '⚙️', tier: 3, mergeInto: 'ore4' },
  'ore4': { key: 'ore4', name: '银矿', emoji: '🥈', tier: 4, mergeInto: 'ore5' },
  'ore5': { key: 'ore5', name: '金矿', emoji: '🥇', tier: 5, mergeInto: 'ore6' },
  'ore6': { key: 'ore6', name: '宝石', emoji: '💎', tier: 6, mergeInto: 'ore7' },
  'ore7': { key: 'ore7', name: '神秘矿', emoji: '🔮', tier: 7, mergeInto: 'ore8' },
  'ore8': { key: 'ore8', name: '永恒石', emoji: '✨', tier: 8 },
  
  // 布料线 (8级)
  'cloth1': { key: 'cloth1', name: '棉花', emoji: '☁️', tier: 1, mergeInto: 'cloth2' },
  'cloth2': { key: 'cloth2', name: '线团', emoji: '🧶', tier: 2, mergeInto: 'cloth3' },
  'cloth3': { key: 'cloth3', name: '布匹', emoji: '🧵', tier: 3, mergeInto: 'cloth4' },
  'cloth4': { key: 'cloth4', name: '衣服', emoji: '👕', tier: 4, mergeInto: 'cloth5' },
  'cloth5': { key: 'cloth5', name: '礼服', emoji: '👗', tier: 5, mergeInto: 'cloth6' },
  'cloth6': { key: 'cloth6', name: '皇袍', emoji: '👘', tier: 6, mergeInto: 'cloth7' },
  'cloth7': { key: 'cloth7', name: '神衣', emoji: '🥻', tier: 7, mergeInto: 'cloth8' },
  'cloth8': { key: 'cloth8', name: '传说披风', emoji: '🦸', tier: 8 },
  
  // 工具线 (8级)
  'tool1': { key: 'tool1', name: '木棍', emoji: '🥢', tier: 1, mergeInto: 'tool2' },
  'tool2': { key: 'tool2', name: '石斧', emoji: '🪓', tier: 2, mergeInto: 'tool3' },
  'tool3': { key: 'tool3', name: '铁锤', emoji: '🔨', tier: 3, mergeInto: 'tool4' },
  'tool4': { key: 'tool4', name: '钢剑', emoji: '⚔️', tier: 4, mergeInto: 'tool5' },
  'tool5': { key: 'tool5', name: '魔杖', emoji: '🪄', tier: 5, mergeInto: 'tool6' },
  'tool6': { key: 'tool6', name: '神器', emoji: '🔱', tier: 6, mergeInto: 'tool7' },
  'tool7': { key: 'tool7', name: '圣剑', emoji: '🗡️', tier: 7, mergeInto: 'tool8' },
  'tool8': { key: 'tool8', name: '创世神器', emoji: '⚡', tier: 8 },
  
  // 金币线 (8级)
  'coin1': { key: 'coin1', name: '1金币', emoji: '🪙', tier: 1, value: 1, mergeInto: 'coin2' },
  'coin2': { key: 'coin2', name: '5金币', emoji: '💰', tier: 2, value: 5, mergeInto: 'coin3' },
  'coin3': { key: 'coin3', name: '25金币', emoji: '💰', tier: 3, value: 25, mergeInto: 'coin4' },
  'coin4': { key: 'coin4', name: '125金币', emoji: '💎', tier: 4, value: 125, mergeInto: 'coin5' },
  'coin5': { key: 'coin5', name: '625金币', emoji: '💎', tier: 5, value: 625, mergeInto: 'coin6' },
  'coin6': { key: 'coin6', name: '3125金币', emoji: '👑', tier: 6, value: 3125, mergeInto: 'coin7' },
  'coin7': { key: 'coin7', name: '15625金币', emoji: '👑', tier: 7, value: 15625, mergeInto: 'coin8' },
  'coin8': { key: 'coin8', name: '78125金币', emoji: '🏆', tier: 8, value: 78125 },
  
  // 特殊：仓库
  'warehouse': { key: 'warehouse', name: '仓库', emoji: '🏪', tier: 0 },
};

const WAREHOUSE_DROPS = [
  { key: 'wood1', weight: 22 },
  { key: 'stone1', weight: 22 },
  { key: 'food1', weight: 22 },
  { key: 'ore1', weight: 16 },
  { key: 'cloth1', weight: 12 },
  { key: 'tool1', weight: 10 },
  { key: 'coin1', weight: 1 },
];

// 三消元素
const MATCH3_ELEMENTS = ['wood', 'stone', 'coin', 'star', 'heart', 'diamond'];
const MATCH3_EMOJIS = {
  wood: '🪵',
  stone: '🪨',
  coin: '🪙',
  star: '⭐',
  heart: '❤️',
  diamond: '💎',
};
const MATCH3_COLORS = {
  wood: '#8B4513',
  stone: '#808080',
  coin: '#FFD700',
  star: '#FFE66D',
  heart: '#FF6B6B',
  diamond: '#4ECDC4',
};

// ===================
// 存档管理
// ===================
const SaveManager = {
  data: null,
  
  init() {
    this.load();
  },
  
  load() {
    try {
      const saved = wx.getStorageSync('island_game_save_v2');
      if (saved) {
        this.data = JSON.parse(saved);
      } else {
        this.createNew();
      }
    } catch (e) {
      this.createNew();
    }
  },
  
  createNew() {
    this.data = {
      version: 2,
      resources: { wood: 100, stone: 50, coin: 500, diamond: 10 },
      energy: 10000,
      maxEnergy: 10000,
      lastEnergyUpdate: Date.now(),
      currentLevel: 1,
      highestLevel: 5,  // 默认解锁前5关
      levelStars: {},
      mergeItems: [],
      settings: { soundEnabled: true, musicEnabled: true },
      achievements: [],
      dailyTasks: { lastRefresh: 0, tasks: [], completed: [] },
      statistics: { totalMatches: 0, totalMerges: 0, totalCoins: 0 },
    };
    this.save();
  },
  
  save() {
    wx.setStorageSync('island_game_save_v2', JSON.stringify(this.data));
  },
  
  getResources() { return this.data.resources; },
  getEnergy() { return this.data.energy; },
  
  useEnergy(amount) {
    if (this.data.energy >= amount) {
      this.data.energy -= amount;
      this.save();
      return true;
    }
    return false;
  },
  
  addCoins(amount) {
    this.data.resources.coin += amount;
    this.data.statistics.totalCoins += amount;
    this.save();
  },
  
  addResource(type, amount) {
    if (this.data.resources[type] !== undefined) {
      this.data.resources[type] += amount;
      this.save();
    }
  },
};

// ===================
// 场景管理
// ===================
let currentScene = 'MainMenu';
let sceneData = {};
let mainMenuState = { buttons: [], resY: 50 };

// 特效
let effects = [];
// 信息提示
let infoMessage = '';
let infoTimer = null;

function showInfo(msg) {
  infoMessage = msg;
  if (infoTimer) clearTimeout(infoTimer);
  infoTimer = setTimeout(() => { infoMessage = ''; }, 2000);
}

function switchScene(sceneName, data = {}) {
  currentScene = sceneName;
  sceneData = data;
  effects = [];
  
  // 初始化场景
  switch (sceneName) {
    case 'MainMenu': initMainMenu(); break;
    case 'Merge': initMergeScene(); break;
    case 'Match3': initMatch3Scene(); break;
    case 'Island': initIslandScene(); break;
    case 'LevelSelect': initLevelSelectScene(); break;
    case 'Shop': initShopScene(); break;
    case 'Achievement': initAchievementScene(); break;
    case 'DailyTask': initDailyTaskScene(); break;
  }
}

// ===================
// 主菜单场景
// ===================
function initMainMenu() {
  // 主菜单无需特殊初始化
}

function renderMainMenu() {
  const W = GameConfig.WIDTH;
  const H = GameConfig.HEIGHT;
  const centerX = W / 2;
  
  // 安全区域
  const safeBottom = systemInfo.safeArea ? (H - systemInfo.safeArea.bottom) : 20;
  
  // 获取胶囊按钮信息
  let capsuleBottom = 80;
  let capsuleLeft = W - 100; // 胶囊在右边
  try {
    const capsule = wx.getMenuButtonBoundingClientRect();
    capsuleBottom = capsule.bottom + 10;
    capsuleLeft = capsule.left;
  } catch (e) {}
  
  // 渐变背景
  const gradient = ctx.createLinearGradient(0, 0, 0, H * scale);
  gradient.addColorStop(0, '#4ecdc4');
  gradient.addColorStop(1, '#44a08d');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W * scale, H * scale);
  
  // 资源栏 - 放在胶囊左侧，和胶囊同一水平线
  const resY = capsuleBottom - 25;
  ctx.font = `bold ${13 * scale}px sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fff';
  // 只显示在胶囊左边的区域
  ctx.fillText(`⚡${SaveManager.getEnergy()}`, 15 * scale, resY * scale);
  ctx.fillText(`💰${SaveManager.getResources().coin}`, 80 * scale, resY * scale);
  ctx.fillText(`💎${SaveManager.getResources().diamond}`, 150 * scale, resY * scale);
  
  // 成就和设置图标 - 放在标题下方右侧
  const iconY = capsuleBottom + 15;
  ctx.textAlign = 'center';
  ctx.font = `${26 * scale}px sans-serif`;
  ctx.fillText('🏆', (W - 70) * scale, iconY * scale);
  ctx.fillText('⚙️', (W - 30) * scale, iconY * scale);
  
  // 保存图标位置
  mainMenuState.iconY = iconY;
  
  // 游戏标题 - 从胶囊下方开始
  const titleY = capsuleBottom + 80;
  ctx.font = `${70 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('🏝️', centerX * scale, titleY * scale);
  
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${42 * scale}px sans-serif`;
  ctx.shadowColor = '#000';
  ctx.shadowBlur = 5 * scale;
  ctx.shadowOffsetX = 2 * scale;
  ctx.shadowOffsetY = 2 * scale;
  ctx.fillText('小岛物语', centerX * scale, (titleY + 80) * scale);
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  ctx.fillStyle = '#ffe66d';
  ctx.font = `${16 * scale}px sans-serif`;
  ctx.fillText('Island Story', centerX * scale, (titleY + 115) * scale);
  
  // 按钮区域
  const btnStartY = titleY + 155;
  const btnEndY = H - safeBottom - 40;
  const btnCount = 5;
  const btnSpacing = Math.min(65, (btnEndY - btnStartY) / btnCount);
  
  const buttons = [
    { text: '🎮 消消乐', scene: 'LevelSelect' },
    { text: '🔄 合成模式', scene: 'Merge' },
    { text: '🏝️ 我的小岛', scene: 'Island' },
    { text: '📋 每日任务', scene: 'DailyTask' },
    { text: '🛒 商店', scene: 'Shop' },
  ];
  
  buttons.forEach((btn, i) => {
    const y = btnStartY + i * btnSpacing;
    drawButton(centerX, y, Math.min(250, W - 60), 48, btn.text);
  });
  
  // 保存按钮位置供触摸检测用
  mainMenuState.buttons = buttons.map((btn, i) => ({
    ...btn,
    y: btnStartY + i * btnSpacing,
    w: Math.min(250, W - 60),
    h: 48,
  }));
  mainMenuState.resY = resY;
  
  // 版本
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = `${11 * scale}px sans-serif`;
  ctx.fillText(`v${GameConfig.VERSION} - 开发中`, centerX * scale, (H - safeBottom - 10) * scale);
}

function handleMainMenuTouch(x, y) {
  const centerX = GameConfig.WIDTH / 2;
  const W = GameConfig.WIDTH;
  
  // 检查按钮点击
  for (const btn of mainMenuState.buttons) {
    const halfW = btn.w / 2;
    const halfH = btn.h / 2;
    if (x >= centerX - halfW && x <= centerX + halfW && 
        y >= btn.y - halfH && y <= btn.y + halfH) {
      switchScene(btn.scene);
      return;
    }
  }
  
  // 成就图标
  const iconY = mainMenuState.iconY || 100;
  if (x >= W - 85 && x <= W - 55 && y >= iconY - 15 && y <= iconY + 15) {
    switchScene('Achievement');
    return;
  }
  
  // 设置图标
  if (x >= W - 45 && x <= W - 15 && y >= iconY - 15 && y <= iconY + 15) {
    showInfo('⚙️ 设置功能开发中...');
    return;
  }
}

// ===================
// 合成场景
// ===================
let mergeState = {
  items: [],
  selectedItem: null,
  nextId: 1,
  gridOffsetX: 0,
  gridOffsetY: 0,
};

const MERGE_GRID = { 
  cols: 6, 
  rows: 8, 
  get cellSize() {
    // 根据屏幕宽度计算格子大小，留出左右边距
    return Math.floor((GameConfig.WIDTH - 40) / this.cols);
  }
};

function initMergeScene() {
  const cellSize = MERGE_GRID.cellSize;
  const gridWidth = MERGE_GRID.cols * cellSize;
  const gridHeight = MERGE_GRID.rows * cellSize;
  mergeState.gridOffsetX = (GameConfig.WIDTH - gridWidth) / 2;
  
  // 安全区域
  const safeTop = systemInfo.safeArea ? systemInfo.safeArea.top : 40;
  const safeBottom = systemInfo.safeArea ? (GameConfig.HEIGHT - systemInfo.safeArea.bottom) : 20;
  
  // 顶部UI高度 + 安全区
  const topMargin = Math.max(safeTop, 35) + 85;
  const bottomMargin = Math.max(safeBottom, 20) + 55;
  const availableHeight = GameConfig.HEIGHT - topMargin - bottomMargin;
  mergeState.gridOffsetY = topMargin + (availableHeight - gridHeight) / 2;
  
  // 如果网格太高，调整位置
  if (mergeState.gridOffsetY < topMargin) {
    mergeState.gridOffsetY = topMargin;
  }
  
  mergeState.items = [];
  mergeState.selectedItem = null;
  mergeState.nextId = 1;
  
  // 加载存档
  if (!loadMergeGame()) {
    // 新游戏
    spawnMergeItem('warehouse', 2, 3, false);
    spawnMergeItem('wood1', 0, 0, false);
    spawnMergeItem('wood1', 1, 0, false);
    spawnMergeItem('stone1', 0, 1, false);
    saveMergeGame();
  }
  
  showInfo('点击仓库获取物品，点击两个相同物品合成！');
}

function saveMergeGame() {
  SaveManager.data.mergeItems = mergeState.items.map(i => ({ key: i.config.key, x: i.x, y: i.y }));
  SaveManager.save();
}

function loadMergeGame() {
  const saved = SaveManager.data.mergeItems;
  if (saved && saved.length > 0) {
    saved.forEach(item => spawnMergeItem(item.key, item.x, item.y, false));
    return true;
  }
  return false;
}

function getMergeCellCenter(col, row) {
  const cellSize = MERGE_GRID.cellSize;
  return {
    x: mergeState.gridOffsetX + col * cellSize + cellSize / 2,
    y: mergeState.gridOffsetY + row * cellSize + cellSize / 2,
  };
}

function getMergeItemAt(col, row) {
  return mergeState.items.find(i => i.x === col && i.y === row);
}

function findMergeEmptyCell() {
  // 收集所有空位
  const emptyCells = [];
  for (let row = 0; row < MERGE_GRID.rows; row++) {
    for (let col = 0; col < MERGE_GRID.cols; col++) {
      if (!getMergeItemAt(col, row)) {
        emptyCells.push({ col, row });
      }
    }
  }
  // 随机选一个空位
  if (emptyCells.length === 0) return null;
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function spawnMergeItem(key, col, row, animate = true) {
  const config = ITEMS[key];
  if (!config) return null;
  
  if (getMergeItemAt(col, row)) {
    const empty = findMergeEmptyCell();
    if (!empty) return null;
    col = empty.col;
    row = empty.row;
  }
  
  const item = {
    id: mergeState.nextId++,
    config: config,
    x: col,
    y: row,
    scale: animate ? 0 : 1,
    lastClickTime: 0,
  };
  
  mergeState.items.push(item);
  return item;
}

function removeMergeItem(item) {
  const index = mergeState.items.findIndex(i => i.id === item.id);
  if (index >= 0) mergeState.items.splice(index, 1);
}

function clickWarehouse() {
  const empty = findMergeEmptyCell();
  if (!empty) { showInfo('❌ 没有空位了！'); return; }
  if (!SaveManager.useEnergy(1)) { showInfo('❌ 体力不足！'); return; }
  
  const total = WAREHOUSE_DROPS.reduce((sum, d) => sum + d.weight, 0);
  let rand = Math.random() * total;
  let selected = WAREHOUSE_DROPS[0].key;
  for (const drop of WAREHOUSE_DROPS) {
    rand -= drop.weight;
    if (rand <= 0) { selected = drop.key; break; }
  }
  
  const item = spawnMergeItem(selected, empty.col, empty.row);
  if (item) showInfo(`获得 ${item.config.emoji} ${item.config.name}！`);
  saveMergeGame();
}

function tryMerge(item1, item2) {
  if (item1.config.key !== item2.config.key) return false;
  if (!item1.config.mergeInto) return false;
  
  const newKey = item1.config.mergeInto;
  const x = item2.x, y = item2.y;
  
  removeMergeItem(item1);
  removeMergeItem(item2);
  
  const newItem = spawnMergeItem(newKey, x, y);
  if (newItem) {
    showInfo(`✨ 合成了 ${newItem.config.emoji} ${newItem.config.name}！`);
    createMergeEffect(getMergeCellCenter(x, y));
    SaveManager.data.statistics.totalMerges++;
  }
  saveMergeGame();
  return true;
}

function collectCoin(item) {
  if (!item.config.value) return;
  SaveManager.addCoins(item.config.value);
  removeMergeItem(item);
  showInfo(`💰 +${item.config.value} 金币！`);
  saveMergeGame();
}

function createMergeEffect(pos) {
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    effects.push({
      x: pos.x, y: pos.y,
      vx: Math.cos(angle) * 3, vy: Math.sin(angle) * 3,
      life: 1, emoji: '✨',
    });
  }
}

function handleMergeTouch(x, y) {
  const cellSize = MERGE_GRID.cellSize;
  const cardSize = cellSize - 12;
  
  // 返回按钮检测
  const safeBottom = systemInfo.safeArea ? (GameConfig.HEIGHT - systemInfo.safeArea.bottom) : 20;
  const bottomY = GameConfig.HEIGHT - Math.max(safeBottom, 15) - 45;
  if (x >= 15 && x <= 95 && y >= bottomY && y <= bottomY + 36) {
    switchScene('MainMenu');
    return;
  }
  
  for (const item of mergeState.items) {
    const pos = getMergeCellCenter(item.x, item.y);
    const halfSize = (cardSize / 2) * item.scale;
    
    if (x >= pos.x - halfSize && x <= pos.x + halfSize &&
        y >= pos.y - halfSize && y <= pos.y + halfSize) {
      
      if (item.config.key === 'warehouse') {
        clickWarehouse();
        mergeState.selectedItem = null;
        return;
      }
      
      if (item.config.value && !item.config.mergeInto) {
        collectCoin(item);
        mergeState.selectedItem = null;
        return;
      }
      
      const now = Date.now();
      
      if (mergeState.selectedItem) {
        if (mergeState.selectedItem.id === item.id) {
          if (now - item.lastClickTime < 500 && item.config.value) {
            collectCoin(item);
            mergeState.selectedItem = null;
            return;
          }
          mergeState.selectedItem = null;
        } else if (tryMerge(mergeState.selectedItem, item)) {
          mergeState.selectedItem = null;
        } else {
          mergeState.selectedItem = item;
        }
      } else {
        mergeState.selectedItem = item;
      }
      
      item.lastClickTime = now;
      return;
    }
  }
  
  mergeState.selectedItem = null;
}

function renderMergeScene() {
  // 背景
  drawMergeBackground();
  // 顶部UI
  drawMergeTopUI();
  // 网格
  drawMergeGrid();
  // 物品
  drawMergeItems();
  // 特效
  drawEffects();
  // 底部UI
  drawBottomInfo();
  // 返回按钮
  drawBackButton();
}

function drawMergeBackground() {
  const W = GameConfig.WIDTH;
  const H = GameConfig.HEIGHT;
  
  // 天空渐变（柔和的蓝色）
  const skyGradient = ctx.createLinearGradient(0, 0, 0, H * 0.5 * scale);
  skyGradient.addColorStop(0, '#87CEEB');
  skyGradient.addColorStop(1, '#64B4DC');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, W * scale, H * 0.5 * scale);
  
  // 草地渐变
  const grassGradient = ctx.createLinearGradient(0, H * 0.5 * scale, 0, H * scale);
  grassGradient.addColorStop(0, '#4C8C50');
  grassGradient.addColorStop(1, '#2D5A30');
  ctx.fillStyle = grassGradient;
  ctx.fillRect(0, H * 0.5 * scale, W * scale, H * 0.5 * scale);
  
  // 天空装饰
  ctx.globalAlpha = 0.6;
  ctx.font = `${40 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('☁️', 60 * scale, 150 * scale);
  ctx.fillText('☁️', 300 * scale, 180 * scale);
  ctx.fillText('☁️', 550 * scale, 160 * scale);
  ctx.globalAlpha = 0.8;
  ctx.font = `${50 * scale}px sans-serif`;
  ctx.fillText('☀️', 650 * scale, 160 * scale);
  
  // 草地装饰 - 左右两侧
  ctx.globalAlpha = 0.7;
  ctx.font = `${50 * scale}px sans-serif`;
  ctx.fillText('🌳', 30 * scale, 680 * scale);
  ctx.fillText('🌴', 660 * scale, 700 * scale);
  ctx.fillText('🌲', 25 * scale, 900 * scale);
  ctx.fillText('🌳', 655 * scale, 920 * scale);
  ctx.fillText('🌴', 30 * scale, 1100 * scale);
  ctx.fillText('🌲', 660 * scale, 1120 * scale);
  
  // 花朵点缀
  ctx.font = `${24 * scale}px sans-serif`;
  ctx.globalAlpha = 0.6;
  ctx.fillText('🌸', 85 * scale, 750 * scale);
  ctx.fillText('🌷', 625 * scale, 780 * scale);
  ctx.fillText('🌻', 50 * scale, 980 * scale);
  ctx.fillText('🌺', 670 * scale, 1000 * scale);
  ctx.fillText('🌼', 70 * scale, 1180 * scale);
  ctx.fillText('🌷', 640 * scale, 1200 * scale);
  
  // 小动物
  ctx.fillText('🦋', 100 * scale, 850 * scale);
  ctx.fillText('🐰', 610 * scale, 870 * scale);
  ctx.fillText('🐿️', 90 * scale, 1050 * scale);
  ctx.fillText('🐦', 620 * scale, 1070 * scale);
  
  ctx.globalAlpha = 1;
}

function drawMergeTopUI() {
  // 获取安全区域顶部距离（避开刘海/状态栏）
  const safeTop = systemInfo.safeArea ? systemInfo.safeArea.top : 40;
  const topPadding = Math.max(safeTop, 35);
  
  // 顶部面板
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  roundRect(10 * scale, topPadding * scale, (GameConfig.WIDTH - 20) * scale, 75 * scale, 12 * scale);
  ctx.fill();
  
  // 标题
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${22 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🏝️ 小岛物语', GameConfig.WIDTH / 2 * scale, (topPadding + 22) * scale);
  
  // 资源栏
  const res = SaveManager.getResources();
  ctx.font = `bold ${15 * scale}px sans-serif`;
  const y = topPadding + 55;
  
  ctx.fillStyle = '#ffff00';
  ctx.fillText(`⚡${SaveManager.getEnergy()}`, 60 * scale, y * scale);
  ctx.fillStyle = '#ffd700';
  ctx.fillText(`💰${res.coin}`, 160 * scale, y * scale);
  ctx.fillStyle = '#deb887';
  ctx.fillText(`🪵${res.wood}`, 270 * scale, y * scale);
  ctx.fillStyle = '#c0c0c0';
  ctx.fillText(`🪨${res.stone}`, 350 * scale, y * scale);
}

function drawMergeGrid() {
  const cellSize = MERGE_GRID.cellSize;
  const gridWidth = MERGE_GRID.cols * cellSize;
  const gridHeight = MERGE_GRID.rows * cellSize;
  
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  roundRect(
    (mergeState.gridOffsetX - 8) * scale,
    (mergeState.gridOffsetY - 8) * scale,
    (gridWidth + 16) * scale,
    (gridHeight + 16) * scale,
    12 * scale
  );
  ctx.fill();
  
  for (let row = 0; row < MERGE_GRID.rows; row++) {
    for (let col = 0; col < MERGE_GRID.cols; col++) {
      const x = mergeState.gridOffsetX + col * cellSize;
      const y = mergeState.gridOffsetY + row * cellSize;
      
      const isLight = (row + col) % 2 === 0;
      ctx.fillStyle = isLight ? 'rgba(255,255,255,0.15)' : 'rgba(224,224,224,0.15)';
      roundRect((x + 2) * scale, (y + 2) * scale, (cellSize - 4) * scale, (cellSize - 4) * scale, 6 * scale);
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1 * scale;
      roundRect((x + 2) * scale, (y + 2) * scale, (cellSize - 4) * scale, (cellSize - 4) * scale, 6 * scale);
      ctx.stroke();
    }
  }
}

function drawMergeItems() {
  const cellSize = MERGE_GRID.cellSize;
  const cardSize = cellSize - 12; // 卡片比格子小一点
  
  for (const item of mergeState.items) {
    if (item.scale < 1) item.scale = Math.min(1, item.scale + 0.1);
    
    const pos = getMergeCellCenter(item.x, item.y);
    const currentCardSize = cardSize * item.scale;
    const halfCard = currentCardSize / 2;
    
    // 选中高亮
    if (mergeState.selectedItem && mergeState.selectedItem.id === item.id) {
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 3 * scale;
      roundRect((pos.x - halfCard - 4) * scale, (pos.y - halfCard - 4) * scale, (currentCardSize + 8) * scale, (currentCardSize + 8) * scale, 14 * scale);
      ctx.stroke();
    }
    
    // 阴影
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    roundRect((pos.x - halfCard + 3) * scale, (pos.y - halfCard + 3) * scale, currentCardSize * scale, currentCardSize * scale, 12 * scale);
    ctx.fill();
    
    // 背景
    ctx.fillStyle = Colors.TIER[item.config.tier] || '#607d8b';
    roundRect((pos.x - halfCard) * scale, (pos.y - halfCard) * scale, currentCardSize * scale, currentCardSize * scale, 12 * scale);
    ctx.fill();
    
    // 边框
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 2 * scale;
    roundRect((pos.x - halfCard) * scale, (pos.y - halfCard) * scale, currentCardSize * scale, currentCardSize * scale, 12 * scale);
    ctx.stroke();
    
    // 高光
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    roundRect((pos.x - halfCard + 4) * scale, (pos.y - halfCard + 4) * scale, (currentCardSize - 8) * scale, (currentCardSize / 2 - 4) * scale, 8 * scale);
    ctx.fill();
    
    // Emoji - 大小根据卡片调整
    const emojiSize = Math.floor(cardSize * 0.55);
    ctx.font = `${emojiSize * item.scale * scale}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.config.emoji, pos.x * scale, pos.y * scale);
    
    // 等级徽章
    if (item.config.tier > 0) {
      const badgeSize = Math.floor(cardSize * 0.22);
      const badgeX = pos.x + halfCard - badgeSize * 0.5;
      const badgeY = pos.y - halfCard + badgeSize * 0.5;
      
      ctx.beginPath();
      ctx.arc(badgeX * scale, badgeY * scale, (badgeSize + 2) * scale, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(badgeX * scale, badgeY * scale, badgeSize * scale, 0, Math.PI * 2);
      ctx.fillStyle = Colors.TIER_BADGE[item.config.tier];
      ctx.fill();
      
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${badgeSize * scale}px sans-serif`;
      ctx.fillText(item.config.tier.toString(), badgeX * scale, badgeY * scale);
    }
  }
}

// ===================
// 三消场景 (简化版)
// ===================
let match3State = {
  board: [],
  selectedTile: null,
  score: 0,
  moves: 20,
  targetScore: 1000,
  level: 1,
  isProcessing: false,
};

const MATCH3_GRID = { cols: 8, rows: 8, tileSize: 80, offsetX: 40, offsetY: 300 };

function initMatch3Scene() {
  match3State.level = sceneData.level || 1;
  match3State.score = 0;
  match3State.moves = 20;
  match3State.targetScore = 1000 + (match3State.level - 1) * 500;
  match3State.selectedTile = null;
  match3State.isProcessing = false;
  
  initMatch3Board();
}

function initMatch3Board() {
  match3State.board = [];
  for (let row = 0; row < MATCH3_GRID.rows; row++) {
    match3State.board[row] = [];
    for (let col = 0; col < MATCH3_GRID.cols; col++) {
      let type;
      do {
        type = MATCH3_ELEMENTS[Math.floor(Math.random() * MATCH3_ELEMENTS.length)];
      } while (wouldMatch(row, col, type));
      match3State.board[row][col] = { type, row, col };
    }
  }
}

function wouldMatch(row, col, type) {
  // 检查左边两个
  if (col >= 2 && 
      match3State.board[row][col-1]?.type === type && 
      match3State.board[row][col-2]?.type === type) {
    return true;
  }
  // 检查上边两个
  if (row >= 2 && 
      match3State.board[row-1]?.[col]?.type === type && 
      match3State.board[row-2]?.[col]?.type === type) {
    return true;
  }
  return false;
}

function getMatch3TileCenter(col, row) {
  return {
    x: MATCH3_GRID.offsetX + col * MATCH3_GRID.tileSize + MATCH3_GRID.tileSize / 2,
    y: MATCH3_GRID.offsetY + row * MATCH3_GRID.tileSize + MATCH3_GRID.tileSize / 2,
  };
}

function handleMatch3Touch(x, y) {
  if (match3State.isProcessing) return;
  
  const safeBottom = systemInfo.safeArea ? (GameConfig.HEIGHT - systemInfo.safeArea.bottom) : 20;
  const bottomY = GameConfig.HEIGHT - Math.max(safeBottom, 15) - 45;
  
  // 返回按钮
  if (x >= 15 && x <= 95 && y >= bottomY && y <= bottomY + 36) {
    switchScene('LevelSelect');
    return;
  }
  
  const col = Math.floor((x - MATCH3_GRID.offsetX) / MATCH3_GRID.tileSize);
  const row = Math.floor((y - MATCH3_GRID.offsetY) / MATCH3_GRID.tileSize);
  
  if (col < 0 || col >= MATCH3_GRID.cols || row < 0 || row >= MATCH3_GRID.rows) {
    match3State.selectedTile = null;
    return;
  }
  
  const tile = match3State.board[row][col];
  if (!tile) return;
  
  if (match3State.selectedTile) {
    const sel = match3State.selectedTile;
    const dx = Math.abs(sel.col - col);
    const dy = Math.abs(sel.row - row);
    
    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      // 交换
      swapTiles(sel, tile);
    } else {
      match3State.selectedTile = tile;
    }
  } else {
    match3State.selectedTile = tile;
  }
}

function swapTiles(tile1, tile2) {
  // 交换位置
  const t1r = tile1.row, t1c = tile1.col;
  const t2r = tile2.row, t2c = tile2.col;
  
  match3State.board[t1r][t1c] = tile2;
  match3State.board[t2r][t2c] = tile1;
  tile1.row = t2r; tile1.col = t2c;
  tile2.row = t1r; tile2.col = t1c;
  
  // 检查匹配
  const matches = findMatches();
  if (matches.length > 0) {
    match3State.moves--;
    match3State.selectedTile = null;
    processMatches(matches);
  } else {
    // 换回来
    match3State.board[t1r][t1c] = tile1;
    match3State.board[t2r][t2c] = tile2;
    tile1.row = t1r; tile1.col = t1c;
    tile2.row = t2r; tile2.col = t2c;
    showInfo('无法消除！');
  }
}

function findMatches() {
  const matches = new Set();
  
  // 横向
  for (let row = 0; row < MATCH3_GRID.rows; row++) {
    for (let col = 0; col < MATCH3_GRID.cols - 2; col++) {
      const t1 = match3State.board[row][col];
      const t2 = match3State.board[row][col+1];
      const t3 = match3State.board[row][col+2];
      if (t1 && t2 && t3 && t1.type === t2.type && t2.type === t3.type) {
        matches.add(t1); matches.add(t2); matches.add(t3);
      }
    }
  }
  
  // 纵向
  for (let row = 0; row < MATCH3_GRID.rows - 2; row++) {
    for (let col = 0; col < MATCH3_GRID.cols; col++) {
      const t1 = match3State.board[row][col];
      const t2 = match3State.board[row+1][col];
      const t3 = match3State.board[row+2][col];
      if (t1 && t2 && t3 && t1.type === t2.type && t2.type === t3.type) {
        matches.add(t1); matches.add(t2); matches.add(t3);
      }
    }
  }
  
  return Array.from(matches);
}

function processMatches(matches) {
  match3State.isProcessing = true;
  
  // 计分
  match3State.score += matches.length * 10;
  
  // 移除匹配的方块
  matches.forEach(tile => {
    const pos = getMatch3TileCenter(tile.col, tile.row);
    effects.push({ x: pos.x, y: pos.y, vx: 0, vy: -2, life: 1, emoji: '✨' });
    match3State.board[tile.row][tile.col] = null;
  });
  
  // 延迟处理下落
  setTimeout(() => {
    dropTiles();
    fillBoard();
    
    const newMatches = findMatches();
    if (newMatches.length > 0) {
      setTimeout(() => processMatches(newMatches), 300);
    } else {
      match3State.isProcessing = false;
      checkGameEnd();
    }
  }, 300);
}

function dropTiles() {
  for (let col = 0; col < MATCH3_GRID.cols; col++) {
    let emptyRow = MATCH3_GRID.rows - 1;
    for (let row = MATCH3_GRID.rows - 1; row >= 0; row--) {
      if (match3State.board[row][col]) {
        if (row !== emptyRow) {
          match3State.board[emptyRow][col] = match3State.board[row][col];
          match3State.board[emptyRow][col].row = emptyRow;
          match3State.board[row][col] = null;
        }
        emptyRow--;
      }
    }
  }
}

function fillBoard() {
  for (let col = 0; col < MATCH3_GRID.cols; col++) {
    for (let row = 0; row < MATCH3_GRID.rows; row++) {
      if (!match3State.board[row][col]) {
        const type = MATCH3_ELEMENTS[Math.floor(Math.random() * MATCH3_ELEMENTS.length)];
        match3State.board[row][col] = { type, row, col };
      }
    }
  }
}

function checkGameEnd() {
  if (match3State.score >= match3State.targetScore) {
    showInfo('🎉 过关！');
    SaveManager.data.highestLevel = Math.max(SaveManager.data.highestLevel, match3State.level + 1);
    SaveManager.save();
  } else if (match3State.moves <= 0) {
    showInfo('😢 失败了，再试一次！');
  }
}

function renderMatch3Scene() {
  // 背景
  const gradient = ctx.createLinearGradient(0, 0, 0, GameConfig.HEIGHT * scale);
  gradient.addColorStop(0, '#2c3e50');
  gradient.addColorStop(1, '#1a252f');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, GameConfig.WIDTH * scale, GameConfig.HEIGHT * scale);
  
  // 关卡信息
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${28 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(`第 ${match3State.level} 关`, GameConfig.WIDTH / 2 * scale, 80 * scale);
  
  ctx.font = `${20 * scale}px sans-serif`;
  ctx.fillStyle = '#4ecdc4';
  ctx.fillText(`分数: ${match3State.score}`, (GameConfig.WIDTH / 2 - 100) * scale, 130 * scale);
  ctx.fillStyle = '#ff6b6b';
  ctx.fillText(`目标: ${match3State.targetScore}`, (GameConfig.WIDTH / 2 + 100) * scale, 130 * scale);
  
  ctx.fillStyle = '#ffe66d';
  ctx.font = `bold ${48 * scale}px sans-serif`;
  ctx.fillText(match3State.moves.toString(), GameConfig.WIDTH / 2 * scale, 220 * scale);
  ctx.font = `${20 * scale}px sans-serif`;
  ctx.fillText('剩余步数', GameConfig.WIDTH / 2 * scale, 260 * scale);
  
  // 棋盘背景
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  roundRect(
    (MATCH3_GRID.offsetX - 10) * scale,
    (MATCH3_GRID.offsetY - 10) * scale,
    (MATCH3_GRID.cols * MATCH3_GRID.tileSize + 20) * scale,
    (MATCH3_GRID.rows * MATCH3_GRID.tileSize + 20) * scale,
    15 * scale
  );
  ctx.fill();
  
  // 方块
  for (let row = 0; row < MATCH3_GRID.rows; row++) {
    for (let col = 0; col < MATCH3_GRID.cols; col++) {
      const tile = match3State.board[row][col];
      if (!tile) continue;
      
      const pos = getMatch3TileCenter(col, row);
      const size = MATCH3_GRID.tileSize - 8;
      
      // 选中高亮
      if (match3State.selectedTile && match3State.selectedTile.row === row && match3State.selectedTile.col === col) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3 * scale;
        roundRect((pos.x - size/2 - 3) * scale, (pos.y - size/2 - 3) * scale, (size + 6) * scale, (size + 6) * scale, 10 * scale);
        ctx.stroke();
      }
      
      // 方块背景
      ctx.fillStyle = MATCH3_COLORS[tile.type];
      roundRect((pos.x - size/2) * scale, (pos.y - size/2) * scale, size * scale, size * scale, 10 * scale);
      ctx.fill();
      
      // Emoji
      ctx.font = `${40 * scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(MATCH3_EMOJIS[tile.type], pos.x * scale, pos.y * scale);
    }
  }
  
  // 特效
  drawEffects();
  // 底部
  drawBottomInfo();
  drawBackButton();
}

// ===================
// 关卡选择场景
// ===================
function initLevelSelectScene() {}

function handleLevelSelectTouch(x, y) {
  const safeBottom = systemInfo.safeArea ? (GameConfig.HEIGHT - systemInfo.safeArea.bottom) : 20;
  const bottomY = GameConfig.HEIGHT - Math.max(safeBottom, 15) - 45;
  
  // 返回按钮
  if (x >= 15 && x <= 95 && y >= bottomY && y <= bottomY + 36) {
    switchScene('MainMenu');
    return;
  }
  
  // 关卡按钮
  const safeTop = systemInfo.safeArea ? systemInfo.safeArea.top : 40;
  const startY = safeTop + 120;
  const cols = 5;
  const spacing = Math.min(70, (GameConfig.WIDTH - 60) / cols);
  const startX = (GameConfig.WIDTH - (cols - 1) * spacing) / 2;
  
  for (let i = 0; i < 20; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const lx = startX + col * spacing;
    const ly = startY + row * spacing;
    
    if (x >= lx - 30 && x <= lx + 30 && y >= ly - 30 && y <= ly + 30) {
      const level = i + 1;
      if (level <= SaveManager.data.highestLevel) {
        switchScene('Match3', { level });
      } else {
        showInfo('🔒 关卡未解锁');
      }
      return;
    }
  }
}

function renderLevelSelectScene() {
  // 背景
  const gradient = ctx.createLinearGradient(0, 0, 0, GameConfig.HEIGHT * scale);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, GameConfig.WIDTH * scale, GameConfig.HEIGHT * scale);
  
  // 标题
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${36 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('选择关卡', GameConfig.WIDTH / 2 * scale, 100 * scale);
  
  // 关卡按钮
  const startY = 200;
  const cols = 5;
  const spacing = 120;
  const startX = (GameConfig.WIDTH - (cols - 1) * spacing) / 2;
  
  for (let i = 0; i < 20; i++) {
    const level = i + 1;
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = startX + col * spacing;
    const y = startY + row * spacing;
    
    const unlocked = level <= SaveManager.data.highestLevel;
    const stars = SaveManager.data.levelStars[level] || 0;
    
    // 按钮背景
    ctx.fillStyle = unlocked ? '#4ecdc4' : '#666';
    ctx.beginPath();
    ctx.arc(x * scale, y * scale, 40 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    // 关卡号或锁
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${24 * scale}px sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.fillText(unlocked ? level.toString() : '🔒', x * scale, y * scale);
    
    // 星星
    if (unlocked && stars > 0) {
      ctx.font = `${14 * scale}px sans-serif`;
      ctx.fillText('⭐'.repeat(stars), x * scale, (y + 35) * scale);
    }
  }
  
  drawBackButton();
}

// ===================
// 岛屿场景 (简化)
// ===================
function initIslandScene() {}

function handleIslandTouch(x, y) {
  const safeBottom = systemInfo.safeArea ? (GameConfig.HEIGHT - systemInfo.safeArea.bottom) : 20;
  const bottomY = GameConfig.HEIGHT - Math.max(safeBottom, 15) - 45;
  
  if (x >= 15 && x <= 95 && y >= bottomY && y <= bottomY + 36) {
    switchScene('MainMenu');
    return;
  }
}

function renderIslandScene() {
  // 海洋背景
  ctx.fillStyle = '#1e90ff';
  ctx.fillRect(0, 0, GameConfig.WIDTH * scale, GameConfig.HEIGHT * scale);
  
  // 岛屿
  ctx.fillStyle = '#90EE90';
  ctx.beginPath();
  ctx.ellipse(GameConfig.WIDTH / 2 * scale, GameConfig.HEIGHT / 2 * scale, 250 * scale, 200 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 沙滩
  ctx.fillStyle = '#F4A460';
  ctx.beginPath();
  ctx.ellipse(GameConfig.WIDTH / 2 * scale, GameConfig.HEIGHT / 2 * scale, 270 * scale, 220 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#90EE90';
  ctx.beginPath();
  ctx.ellipse(GameConfig.WIDTH / 2 * scale, GameConfig.HEIGHT / 2 * scale, 240 * scale, 190 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 建筑
  ctx.font = `${60 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('🏠', GameConfig.WIDTH / 2 * scale, GameConfig.HEIGHT / 2 * scale);
  ctx.font = `${40 * scale}px sans-serif`;
  ctx.fillText('🌴', (GameConfig.WIDTH / 2 - 100) * scale, (GameConfig.HEIGHT / 2 - 50) * scale);
  ctx.fillText('🌳', (GameConfig.WIDTH / 2 + 100) * scale, (GameConfig.HEIGHT / 2 + 50) * scale);
  
  // 标题
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${36 * scale}px sans-serif`;
  ctx.fillText('我的小岛', GameConfig.WIDTH / 2 * scale, 100 * scale);
  
  ctx.font = `${20 * scale}px sans-serif`;
  ctx.fillText('(建设中...)', GameConfig.WIDTH / 2 * scale, 150 * scale);
  
  drawBackButton();
}

// ===================
// 商店场景 (简化)
// ===================
function initShopScene() {}

function handleShopTouch(x, y) {
  const safeBottom = systemInfo.safeArea ? (GameConfig.HEIGHT - systemInfo.safeArea.bottom) : 20;
  const bottomY = GameConfig.HEIGHT - Math.max(safeBottom, 15) - 45;
  
  if (x >= 15 && x <= 95 && y >= bottomY && y <= bottomY + 36) {
    switchScene('MainMenu');
    return;
  }
}

function renderShopScene() {
  const gradient = ctx.createLinearGradient(0, 0, 0, GameConfig.HEIGHT * scale);
  gradient.addColorStop(0, '#f093fb');
  gradient.addColorStop(1, '#f5576c');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, GameConfig.WIDTH * scale, GameConfig.HEIGHT * scale);
  
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${36 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('🛒 商店', GameConfig.WIDTH / 2 * scale, 100 * scale);
  
  // 商品
  const items = [
    { emoji: '⚡', name: '体力 x100', price: '💎 10' },
    { emoji: '💰', name: '金币 x1000', price: '💎 50' },
    { emoji: '💎', name: '钻石 x100', price: '¥6' },
    { emoji: '🎁', name: '新手礼包', price: '¥1' },
  ];
  
  items.forEach((item, i) => {
    const y = 200 + i * 120;
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    roundRect(50 * scale, y * scale, (GameConfig.WIDTH - 100) * scale, 100 * scale, 15 * scale);
    ctx.fill();
    
    ctx.font = `${50 * scale}px sans-serif`;
    ctx.fillText(item.emoji, 120 * scale, (y + 50) * scale);
    
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${24 * scale}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(item.name, 180 * scale, (y + 45) * scale);
    ctx.font = `${20 * scale}px sans-serif`;
    ctx.fillText(item.price, 180 * scale, (y + 75) * scale);
    ctx.textAlign = 'center';
  });
  
  drawBackButton();
}

// ===================
// 成就场景 (简化)
// ===================
function initAchievementScene() {}

function handleAchievementTouch(x, y) {
  const safeBottom = systemInfo.safeArea ? (GameConfig.HEIGHT - systemInfo.safeArea.bottom) : 20;
  const bottomY = GameConfig.HEIGHT - Math.max(safeBottom, 15) - 45;
  
  if (x >= 15 && x <= 95 && y >= bottomY && y <= bottomY + 36) {
    switchScene('MainMenu');
    return;
  }
}

function renderAchievementScene() {
  const gradient = ctx.createLinearGradient(0, 0, 0, GameConfig.HEIGHT * scale);
  gradient.addColorStop(0, '#ffecd2');
  gradient.addColorStop(1, '#fcb69f');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, GameConfig.WIDTH * scale, GameConfig.HEIGHT * scale);
  
  ctx.fillStyle = '#333';
  ctx.font = `bold ${36 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('🏆 成就', GameConfig.WIDTH / 2 * scale, 100 * scale);
  
  const achievements = [
    { emoji: '🌟', name: '初来乍到', desc: '完成第一关', done: SaveManager.data.highestLevel > 1 },
    { emoji: '🔥', name: '连击大师', desc: '达成5连击', done: false },
    { emoji: '💰', name: '小富翁', desc: '累计获得1000金币', done: SaveManager.data.statistics.totalCoins >= 1000 },
    { emoji: '🔄', name: '合成新手', desc: '合成10次', done: SaveManager.data.statistics.totalMerges >= 10 },
  ];
  
  achievements.forEach((a, i) => {
    const y = 180 + i * 100;
    ctx.fillStyle = a.done ? 'rgba(76,175,80,0.3)' : 'rgba(0,0,0,0.1)';
    roundRect(50 * scale, y * scale, (GameConfig.WIDTH - 100) * scale, 80 * scale, 15 * scale);
    ctx.fill();
    
    ctx.font = `${40 * scale}px sans-serif`;
    ctx.fillText(a.emoji, 100 * scale, (y + 40) * scale);
    
    ctx.fillStyle = '#333';
    ctx.font = `bold ${22 * scale}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(a.name, 150 * scale, (y + 35) * scale);
    ctx.font = `${16 * scale}px sans-serif`;
    ctx.fillText(a.desc, 150 * scale, (y + 60) * scale);
    
    if (a.done) {
      ctx.fillStyle = '#4CAF50';
      ctx.font = `${24 * scale}px sans-serif`;
      ctx.textAlign = 'right';
      ctx.fillText('✓', (GameConfig.WIDTH - 70) * scale, (y + 45) * scale);
    }
    ctx.textAlign = 'center';
  });
  
  drawBackButton();
}

// ===================
// 每日任务场景 (简化)
// ===================
function initDailyTaskScene() {}

function handleDailyTaskTouch(x, y) {
  const safeBottom = systemInfo.safeArea ? (GameConfig.HEIGHT - systemInfo.safeArea.bottom) : 20;
  const bottomY = GameConfig.HEIGHT - Math.max(safeBottom, 15) - 45;
  
  if (x >= 15 && x <= 95 && y >= bottomY && y <= bottomY + 36) {
    switchScene('MainMenu');
    return;
  }
}

function renderDailyTaskScene() {
  const gradient = ctx.createLinearGradient(0, 0, 0, GameConfig.HEIGHT * scale);
  gradient.addColorStop(0, '#a8edea');
  gradient.addColorStop(1, '#fed6e3');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, GameConfig.WIDTH * scale, GameConfig.HEIGHT * scale);
  
  ctx.fillStyle = '#333';
  ctx.font = `bold ${36 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('📋 每日任务', GameConfig.WIDTH / 2 * scale, 100 * scale);
  
  const tasks = [
    { emoji: '🎮', name: '完成3关消消乐', reward: '💰 100', progress: '1/3' },
    { emoji: '🔄', name: '合成20次', reward: '⚡ 50', progress: '5/20' },
    { emoji: '💰', name: '收集500金币', reward: '💎 5', progress: '200/500' },
  ];
  
  tasks.forEach((task, i) => {
    const y = 180 + i * 120;
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    roundRect(50 * scale, y * scale, (GameConfig.WIDTH - 100) * scale, 100 * scale, 15 * scale);
    ctx.fill();
    
    ctx.font = `${40 * scale}px sans-serif`;
    ctx.fillText(task.emoji, 100 * scale, (y + 50) * scale);
    
    ctx.fillStyle = '#333';
    ctx.font = `bold ${20 * scale}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(task.name, 150 * scale, (y + 40) * scale);
    ctx.font = `${16 * scale}px sans-serif`;
    ctx.fillText(`奖励: ${task.reward}`, 150 * scale, (y + 65) * scale);
    ctx.fillText(`进度: ${task.progress}`, 150 * scale, (y + 85) * scale);
    ctx.textAlign = 'center';
  });
  
  drawBackButton();
}

// ===================
// 通用UI组件
// ===================
function drawButton(x, y, w, h, text) {
  ctx.fillStyle = '#ffe66d';
  roundRect((x - w/2) * scale, (y - h/2) * scale, w * scale, h * scale, 10 * scale);
  ctx.fill();
  
  ctx.strokeStyle = '#e6c84a';
  ctx.lineWidth = 3 * scale;
  roundRect((x - w/2) * scale, (y - h/2) * scale, w * scale, h * scale, 10 * scale);
  ctx.stroke();
  
  ctx.fillStyle = '#2c3e50';
  ctx.font = `bold ${24 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x * scale, y * scale);
}

function drawBackButton() {
  const safeBottom = systemInfo.safeArea ? (GameConfig.HEIGHT - systemInfo.safeArea.bottom) : 20;
  const bottomY = GameConfig.HEIGHT - Math.max(safeBottom, 15) - 45;
  
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  roundRect(15 * scale, bottomY * scale, 80 * scale, 36 * scale, 10 * scale);
  ctx.fill();
  
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${14 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('← 返回', 55 * scale, (bottomY + 18) * scale);
}

function drawBottomInfo() {
  const safeBottom = systemInfo.safeArea ? (GameConfig.HEIGHT - systemInfo.safeArea.bottom) : 20;
  const bottomY = GameConfig.HEIGHT - Math.max(safeBottom, 15) - 45;
  
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  roundRect(105 * scale, bottomY * scale, (GameConfig.WIDTH - 120) * scale, 36 * scale, 10 * scale);
  ctx.fill();
  
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${13 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const info = infoMessage || '';
  ctx.fillText(info, (GameConfig.WIDTH / 2 + 40) * scale, (bottomY + 18) * scale);
}

function drawEffects() {
  for (let i = effects.length - 1; i >= 0; i--) {
    const e = effects[i];
    e.x += e.vx;
    e.y += e.vy;
    e.life -= 0.03;
    
    if (e.life <= 0) {
      effects.splice(i, 1);
      continue;
    }
    
    ctx.globalAlpha = e.life;
    ctx.font = `${24 * scale}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(e.emoji, e.x * scale, e.y * scale);
    ctx.globalAlpha = 1;
  }
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ===================
// 触摸处理
// ===================
wx.onTouchStart(function(e) {
  if (e.touches.length > 0) {
    const touch = e.touches[0];
    const x = touch.clientX / scale;
    const y = touch.clientY / scale;
    
    switch (currentScene) {
      case 'MainMenu': handleMainMenuTouch(x, y); break;
      case 'Merge': handleMergeTouch(x, y); break;
      case 'Match3': handleMatch3Touch(x, y); break;
      case 'LevelSelect': handleLevelSelectTouch(x, y); break;
      case 'Island': handleIslandTouch(x, y); break;
      case 'Shop': handleShopTouch(x, y); break;
      case 'Achievement': handleAchievementTouch(x, y); break;
      case 'DailyTask': handleDailyTaskTouch(x, y); break;
    }
  }
});

// ===================
// 主渲染循环
// ===================
function render() {
  switch (currentScene) {
    case 'MainMenu': renderMainMenu(); break;
    case 'Merge': renderMergeScene(); break;
    case 'Match3': renderMatch3Scene(); break;
    case 'LevelSelect': renderLevelSelectScene(); break;
    case 'Island': renderIslandScene(); break;
    case 'Shop': renderShopScene(); break;
    case 'Achievement': renderAchievementScene(); break;
    case 'DailyTask': renderDailyTaskScene(); break;
  }
  
  requestAnimationFrame(render);
}

// ===================
// 启动游戏
// ===================
SaveManager.init();
switchScene('MainMenu');
render();
