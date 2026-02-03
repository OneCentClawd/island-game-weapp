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
  
  // 成就和设置图标 - 放在底部，版本号上方
  const iconY = H - safeBottom - 50;
  ctx.textAlign = 'center';
  ctx.font = `${28 * scale}px sans-serif`;
  ctx.fillText('🏆', 40 * scale, iconY * scale);  // 左下角
  ctx.fillText('⚙️', (W - 40) * scale, iconY * scale);  // 右下角
  
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
  
  const iconY = mainMenuState.iconY || 100;
  
  // 成就图标 - 左下角
  if (x >= 15 && x <= 65 && y >= iconY - 20 && y <= iconY + 20) {
    switchScene('Achievement');
    return;
  }
  
  // 设置图标 - 右下角
  if (x >= W - 65 && x <= W - 15 && y >= iconY - 20 && y <= iconY + 20) {
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
  // 购物者系统
  shoppers: [],  // 当前购物者列表
  maxShoppers: 3, // 最多同时3个购物者
};

// 购物者配置
const SHOPPER_TYPES = [
  { emoji: '👨', name: '农夫' },
  { emoji: '👩', name: '村民' },
  { emoji: '👴', name: '老爷爷' },
  { emoji: '👵', name: '老奶奶' },
  { emoji: '🧑', name: '旅行者' },
  { emoji: '👨‍🌾', name: '园丁' },
  { emoji: '👷', name: '工人' },
  { emoji: '🧙', name: '魔法师' },
];

// 根据玩家进度获取可用的物品池
function getShopperItemPool() {
  const pool = [];
  const mergeCount = SaveManager.data.statistics?.totalMerges || 0;
  const level = SaveManager.data.highestLevel || 1;
  
  // 基础物品（总是可用）
  pool.push({ key: 'wood1', weight: 10 });
  pool.push({ key: 'stone1', weight: 10 });
  
  // 根据进度解锁更多物品
  if (mergeCount >= 3 || level >= 2) {
    pool.push({ key: 'wood2', weight: 8 });
    pool.push({ key: 'stone2', weight: 8 });
  }
  if (mergeCount >= 10 || level >= 5) {
    pool.push({ key: 'wood3', weight: 5 });
    pool.push({ key: 'stone3', weight: 5 });
    pool.push({ key: 'coin1', weight: 6 });
  }
  if (mergeCount >= 25 || level >= 10) {
    pool.push({ key: 'wood4', weight: 3 });
    pool.push({ key: 'stone4', weight: 3 });
    pool.push({ key: 'coin2', weight: 4 });
  }
  if (mergeCount >= 50 || level >= 20) {
    pool.push({ key: 'wood5', weight: 2 });
    pool.push({ key: 'stone5', weight: 2 });
    pool.push({ key: 'coin3', weight: 3 });
  }
  if (mergeCount >= 100 || level >= 35) {
    pool.push({ key: 'coin4', weight: 1 });
  }
  
  return pool;
}

// 根据物品计算奖励
function calculateShopperReward(wants) {
  let baseCoin = 0;
  let baseDiamond = 0;
  
  wants.forEach(w => {
    const item = ITEMS[w.key];
    if (!item) return;
    // 根据物品等级计算奖励
    const tier = item.tier || 1;
    baseCoin += tier * 15 * w.count;
    if (tier >= 4) baseDiamond += Math.floor(tier / 2);
  });
  
  return { coin: baseCoin, diamond: baseDiamond };
}

// 生成一个购物者
function generateShopper() {
  const pool = getShopperItemPool();
  const totalWeight = pool.reduce((sum, p) => sum + p.weight, 0);
  
  // 随机选择1-3个不同物品
  const wantCount = Math.min(pool.length, Math.floor(Math.random() * 3) + 1);
  const wants = [];
  const usedKeys = new Set();
  
  for (let i = 0; i < wantCount; i++) {
    let rand = Math.random() * totalWeight;
    for (const p of pool) {
      if (usedKeys.has(p.key)) continue;
      rand -= p.weight;
      if (rand <= 0) {
        const count = Math.floor(Math.random() * 2) + 1; // 1-2个
        wants.push({ key: p.key, count });
        usedKeys.add(p.key);
        break;
      }
    }
  }
  
  if (wants.length === 0) {
    wants.push({ key: 'wood1', count: 1 });
  }
  
  const shopperType = SHOPPER_TYPES[Math.floor(Math.random() * SHOPPER_TYPES.length)];
  const reward = calculateShopperReward(wants);
  
  return {
    id: Date.now() + Math.random(),
    emoji: shopperType.emoji,
    name: shopperType.name,
    wants: wants,
    reward: reward,
    createdAt: Date.now(),
    expiresIn: 10 * 60 * 1000, // 10分钟过期
  };
}

// 检查并补充购物者
function refreshShoppers() {
  // 移除过期的购物者
  const now = Date.now();
  mergeState.shoppers = mergeState.shoppers.filter(s => 
    now - s.createdAt < s.expiresIn
  );
  
  // 补充购物者
  while (mergeState.shoppers.length < mergeState.maxShoppers) {
    mergeState.shoppers.push(generateShopper());
  }
  
  saveShoppers();
}

// 检查玩家是否拥有足够的物品
function checkShopperItems(shopper) {
  for (const want of shopper.wants) {
    const count = mergeState.items.filter(i => i.config.key === want.key).length;
    if (count < want.count) return false;
  }
  return true;
}

// 完成购物者订单
function fulfillShopper(shopper) {
  if (!checkShopperItems(shopper)) {
    showInfo('❌ 物品不足！');
    return false;
  }
  
  // 移除物品
  for (const want of shopper.wants) {
    let remaining = want.count;
    for (let i = mergeState.items.length - 1; i >= 0 && remaining > 0; i--) {
      if (mergeState.items[i].config.key === want.key) {
        mergeState.items.splice(i, 1);
        remaining--;
      }
    }
  }
  
  // 发放奖励
  if (shopper.reward.coin > 0) {
    SaveManager.addCoins(shopper.reward.coin);
  }
  if (shopper.reward.diamond > 0) {
    SaveManager.addResources({ diamond: shopper.reward.diamond });
  }
  
  // 移除购物者
  const idx = mergeState.shoppers.findIndex(s => s.id === shopper.id);
  if (idx >= 0) mergeState.shoppers.splice(idx, 1);
  
  // 立即补充新购物者
  mergeState.shoppers.push(generateShopper());
  
  showInfo(`🎉 ${shopper.emoji} ${shopper.name}满意地离开了！+💰${shopper.reward.coin}${shopper.reward.diamond > 0 ? ` +💎${shopper.reward.diamond}` : ''}`);
  
  // 更新每日任务
  updateDailyTaskProgress('shopper', 1);
  
  saveMergeGame();
  saveShoppers();
  return true;
}

// 保存购物者
function saveShoppers() {
  SaveManager.data.shoppers = mergeState.shoppers;
  SaveManager.save();
}

// 加载购物者
function loadShoppers() {
  const saved = SaveManager.data.shoppers;
  if (saved && saved.length > 0) {
    mergeState.shoppers = saved;
  } else {
    mergeState.shoppers = [];
  }
  refreshShoppers();
}

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
  
  // 顶部UI高度 + 购物者区域 + 安全区
  const topMargin = Math.max(safeTop, 35) + 160; // 增加购物者区域高度
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
  
  // 加载购物者
  loadShoppers();
  
  showInfo('点击仓库获取物品，完成购物者订单获得奖励！');
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
  
  // 购物者卡片点击检测
  if (mergeState.shopperCards) {
    for (const card of mergeState.shopperCards) {
      if (x >= card.x && x <= card.x + card.w &&
          y >= card.y && y <= card.y + card.h) {
        if (checkShopperItems(card.shopper)) {
          fulfillShopper(card.shopper);
        } else {
          // 显示缺少什么
          const missing = [];
          for (const want of card.shopper.wants) {
            const hasCount = mergeState.items.filter(i => i.config.key === want.key).length;
            if (hasCount < want.count) {
              const item = ITEMS[want.key];
              missing.push(`${item.emoji}x${want.count - hasCount}`);
            }
          }
          showInfo(`还需要: ${missing.join(' ')}`);
        }
        return;
      }
    }
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
  // 购物者区域
  drawShopperArea();
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

// 绘制购物者区域
function drawShopperArea() {
  const safeTop = systemInfo.safeArea ? systemInfo.safeArea.top : 40;
  const topPadding = Math.max(safeTop, 35);
  const shopperY = topPadding + 80;
  const W = GameConfig.WIDTH;
  
  // 购物者背景面板
  ctx.fillStyle = 'rgba(139, 90, 43, 0.85)';
  roundRect(10 * scale, shopperY * scale, (W - 20) * scale, 75 * scale, 10 * scale);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 1 * scale;
  roundRect(10 * scale, shopperY * scale, (W - 20) * scale, 75 * scale, 10 * scale);
  ctx.stroke();
  
  // 标题
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${12 * scale}px sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('🛒 购物者', 20 * scale, (shopperY + 12) * scale);
  
  // 绘制每个购物者
  const cardWidth = (W - 50) / 3;
  mergeState.shoppers.forEach((shopper, idx) => {
    const cardX = 15 + idx * (cardWidth + 5);
    const cardY = shopperY + 22;
    
    // 检查是否可完成
    const canFulfill = checkShopperItems(shopper);
    
    // 卡片背景
    ctx.fillStyle = canFulfill ? 'rgba(76, 175, 80, 0.9)' : 'rgba(50, 50, 50, 0.7)';
    roundRect(cardX * scale, cardY * scale, cardWidth * scale, 48 * scale, 6 * scale);
    ctx.fill();
    
    if (canFulfill) {
      ctx.strokeStyle = '#4CAF50';
      ctx.lineWidth = 2 * scale;
      roundRect(cardX * scale, cardY * scale, cardWidth * scale, 48 * scale, 6 * scale);
      ctx.stroke();
    }
    
    // 购物者头像
    ctx.font = `${18 * scale}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(shopper.emoji, (cardX + 5) * scale, (cardY + 16) * scale);
    
    // 需要的物品
    ctx.font = `${14 * scale}px sans-serif`;
    let wantX = cardX + 28;
    shopper.wants.forEach(want => {
      const item = ITEMS[want.key];
      if (item) {
        const hasCount = mergeState.items.filter(i => i.config.key === want.key).length;
        const color = hasCount >= want.count ? '#4CAF50' : '#ff6b6b';
        ctx.fillStyle = color;
        ctx.fillText(`${item.emoji}${want.count > 1 ? 'x' + want.count : ''}`, wantX * scale, (cardY + 16) * scale);
        wantX += 30;
      }
    });
    
    // 奖励
    ctx.font = `${11 * scale}px sans-serif`;
    ctx.fillStyle = '#ffd700';
    ctx.textAlign = 'left';
    let rewardText = `💰${shopper.reward.coin}`;
    if (shopper.reward.diamond > 0) rewardText += ` 💎${shopper.reward.diamond}`;
    ctx.fillText(rewardText, (cardX + 5) * scale, (cardY + 38) * scale);
    
    // 可完成标记
    if (canFulfill) {
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${10 * scale}px sans-serif`;
      ctx.textAlign = 'right';
      ctx.fillText('点击交付→', (cardX + cardWidth - 5) * scale, (cardY + 38) * scale);
    }
  });
  
  // 保存购物者卡片位置供触摸检测
  mergeState.shopperCards = mergeState.shoppers.map((s, idx) => ({
    shopper: s,
    x: 15 + idx * (cardWidth + 5),
    y: shopperY + 22,
    w: cardWidth,
    h: 48,
  }));
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
// ===================
// 消消乐关卡配置
// ===================
const MATCH3_LEVELS = [
  // 1-5关：入门，无障碍（超简单）
  { level: 1, moves: 30, target: { score: 300 }, stars: [300, 500, 800], reward: { coin: 50 } },
  { level: 2, moves: 28, target: { score: 500 }, stars: [500, 800, 1200], reward: { coin: 60 } },
  { level: 3, moves: 26, target: { score: 700 }, stars: [700, 1100, 1500], reward: { coin: 70 } },
  { level: 4, moves: 25, target: { score: 900 }, stars: [900, 1400, 1900], reward: { coin: 80 } },
  { level: 5, moves: 25, target: { score: 1200 }, stars: [1200, 1800, 2500], reward: { coin: 100, diamond: 1 } },
  // 6-10关：引入冰块（简单）
  { level: 6, moves: 25, target: { score: 1400, ice: 3 }, stars: [1400, 2100, 2800], reward: { coin: 100 }, obstacles: { ice: [[0,0],[7,7],[3,3]] } },
  { level: 7, moves: 24, target: { score: 1600, ice: 5 }, stars: [1600, 2400, 3200], reward: { coin: 110 }, obstacles: { ice: [[0,0],[0,7],[7,0],[7,7],[3,3]] } },
  { level: 8, moves: 24, target: { score: 1800, ice: 6 }, stars: [1800, 2700, 3600], reward: { coin: 120 }, obstacles: { ice: [[1,1],[1,6],[6,1],[6,6],[3,3],[4,4]] } },
  { level: 9, moves: 23, target: { score: 2000, ice: 8 }, stars: [2000, 3000, 4000], reward: { coin: 130 }, obstacles: { ice: [[0,0],[0,7],[7,0],[7,7],[2,3],[2,4],[5,3],[5,4]] } },
  { level: 10, moves: 20, target: { score: 2600, ice: 10 }, stars: [2600, 3900, 5200], reward: { coin: 150, diamond: 2 }, obstacles: { ice: [[0,3],[0,4],[3,0],[3,7],[4,0],[4,7],[7,3],[7,4],[3,3],[4,4]] } },
  // 11-15关：引入石头
  { level: 11, moves: 20, target: { score: 2800, stone: 4 }, stars: [2800, 4200, 5600], reward: { coin: 150 }, obstacles: { stone: [[3,3],[3,4],[4,3],[4,4]] } },
  { level: 12, moves: 20, target: { score: 3000, stone: 6, ice: 6 }, stars: [3000, 4500, 6000], reward: { coin: 160 }, obstacles: { stone: [[2,2],[2,5],[5,2],[5,5],[3,3],[4,4]], ice: [[1,1],[1,6],[6,1],[6,6],[0,3],[7,4]] } },
  { level: 13, moves: 18, target: { score: 3200, stone: 8 }, stars: [3200, 4800, 6400], reward: { coin: 170 }, obstacles: { stone: [[2,2],[2,3],[2,4],[2,5],[5,2],[5,3],[5,4],[5,5]] } },
  { level: 14, moves: 18, target: { score: 3400, stone: 6, ice: 8 }, stars: [3400, 5100, 6800], reward: { coin: 180 }, obstacles: { stone: [[3,2],[3,5],[4,2],[4,5],[3,3],[4,4]], ice: [[0,0],[0,7],[7,0],[7,7],[1,3],[1,4],[6,3],[6,4]] } },
  { level: 15, moves: 18, target: { score: 3600, stone: 8, ice: 8 }, stars: [3600, 5400, 7200], reward: { coin: 200, diamond: 3 }, obstacles: { stone: [[2,2],[2,5],[5,2],[5,5],[3,3],[3,4],[4,3],[4,4]], ice: [[0,2],[0,5],[2,0],[2,7],[5,0],[5,7],[7,2],[7,5]] } },
  // 16-20关：引入铁链
  { level: 16, moves: 18, target: { score: 3800, chain: 6 }, stars: [3800, 5700, 7600], reward: { coin: 200 }, obstacles: { chain: [[2,2],[2,5],[5,2],[5,5],[3,3],[4,4]] } },
  { level: 17, moves: 16, target: { score: 4000, chain: 8, ice: 6 }, stars: [4000, 6000, 8000], reward: { coin: 220 }, obstacles: { chain: [[1,1],[1,6],[6,1],[6,6],[3,2],[3,5],[4,2],[4,5]], ice: [[0,3],[0,4],[7,3],[7,4],[3,0],[4,7]] } },
  { level: 18, moves: 16, target: { score: 4200, chain: 8, stone: 4 }, stars: [4200, 6300, 8400], reward: { coin: 240 }, obstacles: { chain: [[2,1],[2,6],[5,1],[5,6],[3,2],[3,5],[4,2],[4,5]], stone: [[3,3],[3,4],[4,3],[4,4]] } },
  { level: 19, moves: 15, target: { score: 4400, chain: 10, ice: 8 }, stars: [4400, 6600, 8800], reward: { coin: 260 }, obstacles: { chain: [[1,2],[1,3],[1,4],[1,5],[6,2],[6,3],[6,4],[6,5],[3,1],[4,6]], ice: [[0,0],[0,7],[7,0],[7,7],[2,3],[2,4],[5,3],[5,4]] } },
  { level: 20, moves: 15, target: { score: 5000, chain: 10, stone: 6, ice: 8 }, stars: [5000, 7500, 10000], reward: { coin: 500, diamond: 5 }, obstacles: { chain: [[1,1],[1,6],[6,1],[6,6],[2,3],[2,4],[5,3],[5,4],[3,2],[4,5]], stone: [[3,3],[3,4],[4,3],[4,4],[2,2],[5,5]], ice: [[0,2],[0,5],[2,0],[2,7],[5,0],[5,7],[7,2],[7,5]] } },
  // 21-25关：进阶挑战
  { level: 21, moves: 18, target: { score: 5200, ice: 15 }, stars: [5200, 7800, 10400], reward: { coin: 280 }, obstacles: { ice: [[0,0],[0,1],[0,6],[0,7],[1,0],[1,7],[6,0],[6,7],[7,0],[7,1],[7,6],[7,7],[3,3],[3,4],[4,3]] } },
  { level: 22, moves: 16, target: { score: 5500, stone: 10 }, stars: [5500, 8250, 11000], reward: { coin: 300 }, obstacles: { stone: [[1,1],[1,2],[1,5],[1,6],[2,1],[2,6],[5,1],[5,6],[6,1],[6,2]] } },
  { level: 23, moves: 16, target: { score: 5800, chain: 12 }, stars: [5800, 8700, 11600], reward: { coin: 320 }, obstacles: { chain: [[0,2],[0,3],[0,4],[0,5],[2,0],[2,7],[5,0],[5,7],[7,2],[7,3],[7,4],[7,5]] } },
  { level: 24, moves: 15, target: { score: 6000, ice: 12, stone: 6 }, stars: [6000, 9000, 12000], reward: { coin: 340 }, obstacles: { ice: [[0,0],[0,7],[7,0],[7,7],[1,2],[1,5],[6,2],[6,5],[2,3],[2,4],[5,3],[5,4]], stone: [[3,2],[3,5],[4,2],[4,5],[3,3],[4,4]] } },
  { level: 25, moves: 15, target: { score: 6500, chain: 10, ice: 10 }, stars: [6500, 9750, 13000], reward: { coin: 400, diamond: 5 }, obstacles: { chain: [[1,1],[1,6],[6,1],[6,6],[2,2],[2,5],[5,2],[5,5],[3,3],[4,4]], ice: [[0,3],[0,4],[3,0],[3,7],[4,0],[4,7],[7,3],[7,4],[2,3],[5,4]] } },
  // 26-30关：高难度
  { level: 26, moves: 14, target: { score: 6800, stone: 8, chain: 8 }, stars: [6800, 10200, 13600], reward: { coin: 400 }, obstacles: { stone: [[2,2],[2,3],[2,4],[2,5],[5,2],[5,3],[5,4],[5,5]], chain: [[1,1],[1,6],[6,1],[6,6],[3,1],[3,6],[4,1],[4,6]] } },
  { level: 27, moves: 14, target: { score: 7000, ice: 16 }, stars: [7000, 10500, 14000], reward: { coin: 420 }, obstacles: { ice: [[0,0],[0,1],[0,6],[0,7],[1,0],[1,1],[1,6],[1,7],[6,0],[6,1],[6,6],[6,7],[7,0],[7,1],[7,6],[7,7]] } },
  { level: 28, moves: 13, target: { score: 7500, stone: 10, ice: 10 }, stars: [7500, 11250, 15000], reward: { coin: 450 }, obstacles: { stone: [[2,2],[2,3],[2,4],[2,5],[5,2],[5,3],[5,4],[5,5],[3,3],[4,4]], ice: [[0,2],[0,5],[2,0],[2,7],[5,0],[5,7],[7,2],[7,5],[1,3],[6,4]] } },
  { level: 29, moves: 13, target: { score: 8000, chain: 14, stone: 4 }, stars: [8000, 12000, 16000], reward: { coin: 480 }, obstacles: { chain: [[0,2],[0,3],[0,4],[0,5],[2,0],[2,7],[5,0],[5,7],[7,2],[7,3],[7,4],[7,5],[3,1],[4,6]], stone: [[3,3],[3,4],[4,3],[4,4]] } },
  { level: 30, moves: 18, target: { score: 8500, chain: 12, stone: 8, ice: 10 }, stars: [8500, 12750, 17000], reward: { coin: 600, diamond: 8 }, obstacles: { chain: [[1,1],[1,6],[6,1],[6,6],[2,2],[2,5],[5,2],[5,5],[3,1],[3,6],[4,1],[4,6]], stone: [[3,2],[3,3],[3,4],[3,5],[4,2],[4,3],[4,4],[4,5]], ice: [[0,0],[0,7],[7,0],[7,7],[0,3],[0,4],[7,3],[7,4],[2,3],[5,4]] } },
  // 31-35关：大师挑战
  { level: 31, moves: 20, target: { score: 9000, ice: 18 }, stars: [9000, 13500, 18000], reward: { coin: 500 }, obstacles: { ice: [[0,1],[0,2],[0,5],[0,6],[1,0],[1,2],[1,5],[1,7],[2,0],[2,1],[2,6],[2,7],[5,0],[5,1],[5,6],[5,7],[6,0],[6,7]] } },
  { level: 32, moves: 18, target: { score: 9500, stone: 12 }, stars: [9500, 14250, 19000], reward: { coin: 520 }, obstacles: { stone: [[1,2],[1,3],[1,4],[1,5],[2,1],[2,6],[3,1],[3,6],[4,1],[4,6],[5,2],[5,5]] } },
  { level: 33, moves: 18, target: { score: 10000, chain: 16 }, stars: [10000, 15000, 20000], reward: { coin: 550 }, obstacles: { chain: [[0,0],[0,1],[0,6],[0,7],[1,0],[1,7],[2,2],[2,5],[5,2],[5,5],[6,0],[6,7],[7,0],[7,1],[7,6],[7,7]] } },
  { level: 34, moves: 17, target: { score: 10500, ice: 14, chain: 10 }, stars: [10500, 15750, 21000], reward: { coin: 580 }, obstacles: { ice: [[0,2],[0,3],[0,4],[0,5],[2,0],[2,7],[5,0],[5,7],[7,2],[7,3],[7,4],[7,5],[3,3],[4,4]], chain: [[1,1],[1,6],[6,1],[6,6],[2,2],[2,5],[5,2],[5,5],[3,2],[4,5]] } },
  { level: 35, moves: 17, target: { score: 11000, stone: 10, chain: 10, ice: 10 }, stars: [11000, 16500, 22000], reward: { coin: 700, diamond: 10 }, obstacles: { stone: [[2,2],[2,3],[2,4],[2,5],[5,2],[5,3],[5,4],[5,5],[3,3],[4,4]], chain: [[1,1],[1,2],[1,5],[1,6],[6,1],[6,2],[6,5],[6,6],[3,1],[4,6]], ice: [[0,0],[0,7],[7,0],[7,7],[0,3],[0,4],[7,3],[7,4],[3,0],[4,7]] } },
  // 36-40关：传说难度
  { level: 36, moves: 18, target: { score: 11500, ice: 20 }, stars: [11500, 17250, 23000], reward: { coin: 600 }, obstacles: { ice: [[0,0],[0,1],[0,2],[0,5],[0,6],[0,7],[1,0],[1,7],[2,0],[2,7],[5,0],[5,7],[6,0],[6,7],[7,0],[7,1],[7,2],[7,5],[7,6],[7,7]] } },
  { level: 37, moves: 16, target: { score: 12000, stone: 14 }, stars: [12000, 18000, 24000], reward: { coin: 650 }, obstacles: { stone: [[1,1],[1,2],[1,5],[1,6],[2,1],[2,2],[2,5],[2,6],[5,1],[5,2],[5,5],[5,6],[6,1],[6,6]] } },
  { level: 38, moves: 16, target: { score: 12500, chain: 18 }, stars: [12500, 18750, 25000], reward: { coin: 700 }, obstacles: { chain: [[0,1],[0,2],[0,5],[0,6],[1,0],[1,3],[1,4],[1,7],[2,0],[2,7],[5,0],[5,7],[6,0],[6,3],[6,4],[6,7],[7,1],[7,6]] } },
  { level: 39, moves: 15, target: { score: 13000, stone: 12, chain: 12 }, stars: [13000, 19500, 26000], reward: { coin: 750 }, obstacles: { stone: [[2,2],[2,3],[2,4],[2,5],[3,2],[3,5],[4,2],[4,5],[5,2],[5,3],[5,4],[5,5]], chain: [[0,0],[0,7],[7,0],[7,7],[1,1],[1,6],[6,1],[6,6],[1,3],[1,4],[6,3],[6,4]] } },
  { level: 40, moves: 15, target: { score: 14000, chain: 14, stone: 10, ice: 14 }, stars: [14000, 21000, 28000], reward: { coin: 800, diamond: 12 }, obstacles: { chain: [[0,2],[0,3],[0,4],[0,5],[2,0],[2,7],[5,0],[5,7],[7,2],[7,3],[7,4],[7,5],[3,1],[4,6]], stone: [[2,2],[2,5],[3,2],[3,5],[4,2],[4,5],[5,2],[5,5],[3,3],[4,4]], ice: [[0,0],[0,1],[0,6],[0,7],[1,0],[1,7],[6,0],[6,7],[7,0],[7,1],[7,6],[7,7],[1,3],[6,4]] } },
  // 41-45关：噩梦难度
  { level: 41, moves: 16, target: { score: 14500, ice: 22 }, stars: [14500, 21750, 29000], reward: { coin: 700 }, obstacles: { ice: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[1,0],[1,7],[2,0],[2,7],[5,0],[5,7],[6,0],[6,7],[7,0],[7,1],[7,2],[7,5],[7,6],[7,7]] } },
  { level: 42, moves: 15, target: { score: 15000, stone: 16 }, stars: [15000, 22500, 30000], reward: { coin: 750 }, obstacles: { stone: [[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[2,1],[2,6],[5,1],[5,6],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6]] } },
  { level: 43, moves: 15, target: { score: 15500, chain: 20 }, stars: [15500, 23250, 31000], reward: { coin: 800 }, obstacles: { chain: [[0,0],[0,1],[0,2],[0,5],[0,6],[0,7],[1,0],[1,7],[2,0],[2,2],[2,5],[2,7],[5,0],[5,2],[5,5],[5,7],[6,0],[6,7],[7,0],[7,7]] } },
  { level: 44, moves: 14, target: { score: 16000, ice: 16, stone: 8, chain: 8 }, stars: [16000, 24000, 32000], reward: { coin: 850 }, obstacles: { ice: [[0,0],[0,1],[0,6],[0,7],[1,0],[1,7],[6,0],[6,7],[7,0],[7,1],[7,6],[7,7],[0,3],[0,4],[7,3],[7,4]], stone: [[2,2],[2,5],[5,2],[5,5],[3,3],[3,4],[4,3],[4,4]], chain: [[1,2],[1,5],[6,2],[6,5],[2,3],[2,4],[5,3],[5,4]] } },
  { level: 45, moves: 14, target: { score: 17000, chain: 16, stone: 12, ice: 12 }, stars: [17000, 25500, 34000], reward: { coin: 1000, diamond: 15 }, obstacles: { chain: [[0,2],[0,3],[0,4],[0,5],[2,0],[2,7],[5,0],[5,7],[7,2],[7,3],[7,4],[7,5],[1,1],[1,6],[6,1],[6,6]], stone: [[2,2],[2,3],[2,4],[2,5],[5,2],[5,3],[5,4],[5,5],[3,2],[3,5],[4,2],[4,5]], ice: [[0,0],[0,1],[0,6],[0,7],[1,0],[1,7],[6,0],[6,7],[7,0],[7,1],[7,6],[7,7]] } },
  // 46-50关：地狱难度（最终挑战）
  { level: 46, moves: 15, target: { score: 17500, ice: 24 }, stars: [17500, 26250, 35000], reward: { coin: 900 }, obstacles: { ice: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[1,0],[1,1],[1,6],[1,7],[2,0],[2,7],[5,0],[5,7],[6,0],[6,1],[6,6],[6,7],[7,0],[7,1],[7,2],[7,7]] } },
  { level: 47, moves: 14, target: { score: 18000, stone: 18 }, stars: [18000, 27000, 36000], reward: { coin: 950 }, obstacles: { stone: [[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[2,1],[2,3],[2,4],[2,6],[5,1],[5,3],[5,4],[5,6],[6,1],[6,2],[6,5],[6,6]] } },
  { level: 48, moves: 14, target: { score: 18500, chain: 22 }, stars: [18500, 27750, 37000], reward: { coin: 1000 }, obstacles: { chain: [[0,0],[0,1],[0,2],[0,5],[0,6],[0,7],[1,0],[1,2],[1,5],[1,7],[2,0],[2,7],[5,0],[5,7],[6,0],[6,2],[6,5],[6,7],[7,0],[7,1],[7,6],[7,7]] } },
  { level: 49, moves: 13, target: { score: 19000, ice: 18, stone: 10, chain: 12 }, stars: [19000, 28500, 38000], reward: { coin: 1100 }, obstacles: { ice: [[0,0],[0,1],[0,6],[0,7],[1,0],[1,7],[6,0],[6,7],[7,0],[7,1],[7,6],[7,7],[0,3],[0,4],[7,3],[7,4],[3,0],[4,7]], stone: [[2,2],[2,5],[3,3],[3,4],[4,3],[4,4],[5,2],[5,5],[3,2],[4,5]], chain: [[1,2],[1,3],[1,4],[1,5],[6,2],[6,3],[6,4],[6,5],[2,3],[2,4],[5,3],[5,4]] } },
  { level: 50, moves: 12, target: { score: 20000, chain: 18, stone: 14, ice: 18 }, stars: [20000, 30000, 40000], reward: { coin: 2000, diamond: 50 }, obstacles: { chain: [[0,2],[0,3],[0,4],[0,5],[2,0],[2,7],[5,0],[5,7],[7,2],[7,3],[7,4],[7,5],[1,1],[1,6],[6,1],[6,6],[3,1],[4,6]], stone: [[2,2],[2,3],[2,4],[2,5],[5,2],[5,3],[5,4],[5,5],[3,2],[3,5],[4,2],[4,5],[3,3],[4,4]], ice: [[0,0],[0,1],[0,6],[0,7],[1,0],[1,2],[1,5],[1,7],[6,0],[6,2],[6,5],[6,7],[7,0],[7,1],[7,6],[7,7],[2,1],[5,6]] } },
];

let match3State = {
  board: [],
  selectedTile: null,
  score: 0,
  moves: 20,
  targetScore: 1000,
  level: 1,
  levelConfig: null,
  isProcessing: false,
  gameOver: false,
  won: false,
  stars: 0,
  showResult: false,
  combo: 0,
  // 障碍物计数
  iceCleared: 0,
  stoneCleared: 0,
  chainCleared: 0,
};

const MATCH3_GRID = { 
  cols: 8, 
  rows: 8, 
  get tileSize() { return Math.floor((GameConfig.WIDTH - 20) / this.cols); },
  get offsetX() { return (GameConfig.WIDTH - this.cols * this.tileSize) / 2; },
  get offsetY() { 
    let capsuleBottom = 80;
    try { const c = wx.getMenuButtonBoundingClientRect(); capsuleBottom = c.bottom + 15; } catch(e){}
    return capsuleBottom + 130; 
  }
};

function initMatch3Scene() {
  match3State.level = sceneData.level || 1;
  match3State.levelConfig = MATCH3_LEVELS[match3State.level - 1] || MATCH3_LEVELS[0];
  match3State.score = 0;
  match3State.moves = match3State.levelConfig.moves;
  match3State.targetScore = match3State.levelConfig.target.score;
  match3State.selectedTile = null;
  match3State.isProcessing = false;
  match3State.gameOver = false;
  match3State.won = false;
  match3State.stars = 0;
  match3State.showResult = false;
  match3State.combo = 0;
  match3State.iceCleared = 0;
  match3State.stoneCleared = 0;
  match3State.chainCleared = 0;
  
  initMatch3Board();
}

function initMatch3Board() {
  match3State.board = [];
  const config = match3State.levelConfig;
  const obstacles = config.obstacles || {};
  
  // 创建障碍物位置集合
  const iceSet = new Set((obstacles.ice || []).map(p => `${p[0]},${p[1]}`));
  const stoneSet = new Set((obstacles.stone || []).map(p => `${p[0]},${p[1]}`));
  const chainSet = new Set((obstacles.chain || []).map(p => `${p[0]},${p[1]}`));
  
  for (let row = 0; row < MATCH3_GRID.rows; row++) {
    match3State.board[row] = [];
    for (let col = 0; col < MATCH3_GRID.cols; col++) {
      const key = `${row},${col}`;
      
      // 石头格子：不能放方块
      if (stoneSet.has(key)) {
        match3State.board[row][col] = { type: 'stone', obstacle: 'stone', row, col, hp: 1 };
        continue;
      }
      
      let type;
      do {
        type = MATCH3_ELEMENTS[Math.floor(Math.random() * MATCH3_ELEMENTS.length)];
      } while (wouldMatch(row, col, type));
      
      const tile = { type, row, col };
      
      // 冰块覆盖
      if (iceSet.has(key)) {
        tile.ice = 1; // 冰层厚度
      }
      
      // 铁链锁住
      if (chainSet.has(key)) {
        tile.chain = true;
      }
      
      match3State.board[row][col] = tile;
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
  // 结算弹窗处理
  if (match3State.showResult) {
    const W = GameConfig.WIDTH;
    const H = GameConfig.HEIGHT;
    const centerX = W / 2;
    const centerY = H / 2;
    const popupH = 320;
    const popupY = centerY - popupH / 2;
    const btnY = popupY + 230;
    const btnW = 100;
    const btnH = 45;
    
    // 返回按钮
    if (x >= centerX - btnW - 20 && x <= centerX - 20 && y >= btnY && y <= btnY + btnH) {
      match3State.showResult = false;
      switchScene('LevelSelect');
      return;
    }
    
    // 继续/重试按钮
    if (x >= centerX + 20 && x <= centerX + btnW + 20 && y >= btnY && y <= btnY + btnH) {
      match3State.showResult = false;
      if (match3State.won && match3State.level < 20) {
        switchScene('Match3', { level: match3State.level + 1 });
      } else {
        switchScene('Match3', { level: match3State.level });
      }
      return;
    }
    return; // 弹窗显示时不处理其他点击
  }
  
  if (match3State.isProcessing || match3State.gameOver) return;
  
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
  
  // 特殊方块直接交换触发
  if (tile1.special === 'rainbow' || tile2.special === 'rainbow') {
    match3State.moves--;
    match3State.selectedTile = null;
    match3State.combo = 0;
    
    // 彩虹方块交换：消除对方类型的所有方块
    const rainbow = tile1.special === 'rainbow' ? tile1 : tile2;
    const other = tile1.special === 'rainbow' ? tile2 : tile1;
    const toRemove = new Set();
    
    toRemove.add(`${rainbow.row},${rainbow.col}`);
    
    if (other.special === 'rainbow') {
      // 两个彩虹：全场消除！
      for (let r = 0; r < MATCH3_GRID.rows; r++) {
        for (let c = 0; c < MATCH3_GRID.cols; c++) {
          toRemove.add(`${r},${c}`);
        }
      }
    } else {
      // 消除所有同类型
      for (let r = 0; r < MATCH3_GRID.rows; r++) {
        for (let c = 0; c < MATCH3_GRID.cols; c++) {
          const t = match3State.board[r][c];
          if (t && t.type === other.type) {
            toRemove.add(`${r},${c}`);
          }
        }
      }
    }
    
    // 触发消除
    match3State.isProcessing = true;
    match3State.score += toRemove.size * 15;
    
    toRemove.forEach(key => {
      const [row, col] = key.split(',').map(Number);
      const tile = match3State.board[row][col];
      if (tile) {
        const pos = getMatch3TileCenter(col, row);
        effects.push({ x: pos.x, y: pos.y, vx: (Math.random() - 0.5) * 4, vy: -4, life: 1.2, emoji: '✨' });
        match3State.board[row][col] = null;
      }
    });
    
    effects.push({ x: getMatch3TileCenter(rainbow.col, rainbow.row).x, y: getMatch3TileCenter(rainbow.col, rainbow.row).y, vx: 0, vy: 0, life: 1.5, emoji: '🌈' });
    
    setTimeout(() => {
      dropTiles();
      fillBoard();
      const newMatches = findMatches();
      if (newMatches.length > 0) {
        setTimeout(() => processMatches(newMatches), 250);
      } else {
        match3State.isProcessing = false;
        match3State.combo = 0;
        checkGameEnd();
      }
    }, 300);
    return;
  }
  
  // 检查匹配
  const matches = findMatches();
  if (matches.length > 0) {
    match3State.moves--;
    match3State.selectedTile = null;
    match3State.combo = 0;
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
  const matches = [];
  const checked = new Set();
  
  // 横向检测
  for (let row = 0; row < MATCH3_GRID.rows; row++) {
    let col = 0;
    while (col < MATCH3_GRID.cols) {
      const tile = match3State.board[row][col];
      // 跳过：空、彩虹、石头、被铁链锁住
      if (!tile || tile.type === 'rainbow' || tile.obstacle === 'stone' || tile.chain) { col++; continue; }
      
      // 找连续相同的
      let count = 1;
      while (col + count < MATCH3_GRID.cols) {
        const next = match3State.board[row][col + count];
        if (next && next.type === tile.type && !next.special && !next.chain && !next.obstacle) {
          count++;
        } else break;
      }
      
      if (count >= 3) {
        const matchTiles = [];
        for (let i = 0; i < count; i++) {
          matchTiles.push(match3State.board[row][col + i]);
        }
        matches.push({ tiles: matchTiles, direction: 'horizontal', count });
      }
      col += Math.max(1, count);
    }
  }
  
  // 纵向检测
  for (let col = 0; col < MATCH3_GRID.cols; col++) {
    let row = 0;
    while (row < MATCH3_GRID.rows) {
      const tile = match3State.board[row][col];
      if (!tile || tile.type === 'rainbow' || tile.obstacle === 'stone' || tile.chain) { row++; continue; }
      
      let count = 1;
      while (row + count < MATCH3_GRID.rows) {
        const next = match3State.board[row + count][col];
        if (next && next.type === tile.type && !next.special && !next.chain && !next.obstacle) {
          count++;
        } else break;
      }
      
      if (count >= 3) {
        const matchTiles = [];
        for (let i = 0; i < count; i++) {
          matchTiles.push(match3State.board[row + i][col]);
        }
        matches.push({ tiles: matchTiles, direction: 'vertical', count });
      }
      row += Math.max(1, count);
    }
  }
  
  return matches;
}

function processMatches(matches) {
  match3State.isProcessing = true;
  
  const toRemove = new Set();
  const specialToCreate = [];
  
  for (const match of matches) {
    const { tiles, direction, count } = match;
    
    // 检查是否需要创建特殊方块
    if (count === 4) {
      // 4连：创建条纹方块（横/竖）
      const centerTile = tiles[1];
      specialToCreate.push({
        row: centerTile.row,
        col: centerTile.col,
        type: centerTile.type,
        special: direction === 'horizontal' ? 'stripe_v' : 'stripe_h'
      });
    } else if (count >= 5) {
      // 5连：创建彩虹方块
      const centerTile = tiles[2];
      specialToCreate.push({
        row: centerTile.row,
        col: centerTile.col,
        type: 'rainbow',
        special: 'rainbow'
      });
    }
    
    // 标记要消除的方块
    tiles.forEach(t => toRemove.add(`${t.row},${t.col}`));
  }
  
  // 计分（连消加成）
  const baseScore = toRemove.size * 10;
  const comboBonus = match3State.combo * 5;
  match3State.score += baseScore + comboBonus;
  match3State.combo++;
  
  // 处理特殊方块的爆炸效果
  toRemove.forEach(key => {
    const [row, col] = key.split(',').map(Number);
    const tile = match3State.board[row][col];
    if (tile && tile.special) {
      triggerSpecialTile(tile, toRemove);
    }
  });
  
  // 处理相邻障碍物（石头、冰块、铁链）
  const adjacentObstacles = new Set();
  toRemove.forEach(key => {
    const [row, col] = key.split(',').map(Number);
    // 检查上下左右
    [[row-1, col], [row+1, col], [row, col-1], [row, col+1]].forEach(([r, c]) => {
      if (r >= 0 && r < MATCH3_GRID.rows && c >= 0 && c < MATCH3_GRID.cols) {
        const adj = match3State.board[r][c];
        if (adj && adj.obstacle === 'stone') {
          adjacentObstacles.add(`${r},${c}`);
        }
      }
    });
  });
  
  // 处理石头
  adjacentObstacles.forEach(key => {
    const [row, col] = key.split(',').map(Number);
    const tile = match3State.board[row][col];
    if (tile && tile.obstacle === 'stone') {
      tile.hp--;
      if (tile.hp <= 0) {
        match3State.board[row][col] = null;
        match3State.stoneCleared++;
        const pos = getMatch3TileCenter(col, row);
        effects.push({ x: pos.x, y: pos.y, vx: 0, vy: 0, life: 1, emoji: '💨' });
      }
    }
  });
  
  // 移除方块并添加特效
  toRemove.forEach(key => {
    const [row, col] = key.split(',').map(Number);
    const tile = match3State.board[row][col];
    if (tile && tile.obstacle !== 'stone') {
      const pos = getMatch3TileCenter(col, row);
      
      // 处理冰块
      if (tile.ice) {
        tile.ice--;
        match3State.iceCleared++;
        effects.push({ x: pos.x, y: pos.y, vx: 0, vy: -1, life: 0.8, emoji: '❄️' });
        if (tile.ice > 0) return; // 冰还没碎完，不消除方块
      }
      
      // 处理铁链
      if (tile.chain) {
        delete tile.chain;
        match3State.chainCleared++;
        effects.push({ x: pos.x, y: pos.y, vx: 0, vy: -1, life: 0.8, emoji: '⛓️' });
        return; // 铁链解开了，但方块保留
      }
      
      effects.push({ x: pos.x, y: pos.y, vx: (Math.random() - 0.5) * 3, vy: -3, life: 1, emoji: '✨' });
      match3State.board[row][col] = null;
    }
  });
  
  // 创建特殊方块
  specialToCreate.forEach(s => {
    if (!match3State.board[s.row][s.col]) {
      match3State.board[s.row][s.col] = {
        type: s.type,
        special: s.special,
        row: s.row,
        col: s.col
      };
      const pos = getMatch3TileCenter(s.col, s.row);
      effects.push({ x: pos.x, y: pos.y, vx: 0, vy: 0, life: 1.5, emoji: '💫' });
    }
  });
  
  // 延迟处理下落
  setTimeout(() => {
    dropTiles();
    fillBoard();
    
    const newMatches = findMatches();
    if (newMatches.length > 0) {
      setTimeout(() => processMatches(newMatches), 250);
    } else {
      match3State.isProcessing = false;
      match3State.combo = 0;
      checkGameEnd();
    }
  }, 250);
}

function triggerSpecialTile(tile, toRemove) {
  const { row, col, special } = tile;
  
  if (special === 'stripe_h') {
    // 横向条纹：消除整行
    for (let c = 0; c < MATCH3_GRID.cols; c++) {
      toRemove.add(`${row},${c}`);
    }
    const pos = getMatch3TileCenter(col, row);
    effects.push({ x: pos.x, y: pos.y, vx: 0, vy: 0, life: 1, emoji: '💥' });
  } else if (special === 'stripe_v') {
    // 纵向条纹：消除整列
    for (let r = 0; r < MATCH3_GRID.rows; r++) {
      toRemove.add(`${r},${col}`);
    }
    const pos = getMatch3TileCenter(col, row);
    effects.push({ x: pos.x, y: pos.y, vx: 0, vy: 0, life: 1, emoji: '💥' });
  } else if (special === 'rainbow') {
    // 彩虹：消除所有同类型方块（随机选一种）
    const types = MATCH3_ELEMENTS.filter(t => t !== 'rainbow');
    const targetType = types[Math.floor(Math.random() * types.length)];
    for (let r = 0; r < MATCH3_GRID.rows; r++) {
      for (let c = 0; c < MATCH3_GRID.cols; c++) {
        const t = match3State.board[r][c];
        if (t && t.type === targetType) {
          toRemove.add(`${r},${c}`);
        }
      }
    }
    const pos = getMatch3TileCenter(col, row);
    effects.push({ x: pos.x, y: pos.y, vx: 0, vy: 0, life: 1.5, emoji: '🌈' });
  }
}

function dropTiles() {
  for (let col = 0; col < MATCH3_GRID.cols; col++) {
    let emptyRow = MATCH3_GRID.rows - 1;
    for (let row = MATCH3_GRID.rows - 1; row >= 0; row--) {
      const tile = match3State.board[row][col];
      // 石头不动
      if (tile && tile.obstacle === 'stone') {
        continue;
      }
      if (tile) {
        if (row !== emptyRow) {
          // 检查下面是否有石头阻挡
          let canDrop = true;
          for (let r = row + 1; r <= emptyRow; r++) {
            const below = match3State.board[r][col];
            if (below && below.obstacle === 'stone') {
              canDrop = false;
              break;
            }
          }
          if (canDrop) {
            match3State.board[emptyRow][col] = tile;
            tile.row = emptyRow;
            match3State.board[row][col] = null;
          }
        }
        emptyRow--;
      }
    }
  }
}

function fillBoard() {
  for (let col = 0; col < MATCH3_GRID.cols; col++) {
    for (let row = 0; row < MATCH3_GRID.rows; row++) {
      const tile = match3State.board[row][col];
      // 跳过石头和已有方块
      if (tile) continue;
      
      const type = MATCH3_ELEMENTS[Math.floor(Math.random() * MATCH3_ELEMENTS.length)];
      match3State.board[row][col] = { type, row, col };
    }
  }
}

function checkGameEnd() {
  if (match3State.gameOver) return;
  
  const config = match3State.levelConfig;
  
  const target = config.target;
  
  // 检查所有目标是否完成
  let allTargetsMet = match3State.score >= target.score;
  if (target.ice && match3State.iceCleared < target.ice) allTargetsMet = false;
  if (target.stone && match3State.stoneCleared < target.stone) allTargetsMet = false;
  if (target.chain && match3State.chainCleared < target.chain) allTargetsMet = false;
  
  if (allTargetsMet) {
    // 计算星级
    let stars = 1;
    if (match3State.score >= config.stars[1]) stars = 2;
    if (match3State.score >= config.stars[2]) stars = 3;
    
    match3State.won = true;
    match3State.gameOver = true;
    match3State.stars = stars;
    match3State.showResult = true;
    
    // 更新存档
    const oldStars = SaveManager.data.levelStars[match3State.level] || 0;
    if (stars > oldStars) {
      SaveManager.data.levelStars[match3State.level] = stars;
    }
    SaveManager.data.highestLevel = Math.max(SaveManager.data.highestLevel, match3State.level + 1);
    
    // 发放奖励
    const reward = config.reward;
    if (reward.coin) SaveManager.addResources({ coin: reward.coin });
    if (reward.diamond) SaveManager.addResources({ diamond: reward.diamond });
    
    // 更新每日任务进度
    updateDailyTaskProgress('match3', 1);
    if (stars >= 3) updateDailyTaskProgress('star', 1);
    
    // 统计
    SaveManager.data.statistics = SaveManager.data.statistics || {};
    SaveManager.data.statistics.totalCoins = (SaveManager.data.statistics.totalCoins || 0) + (reward.coin || 0);
    
    SaveManager.save();
    
  } else if (match3State.moves <= 0) {
    match3State.won = false;
    match3State.gameOver = true;
    match3State.stars = 0;
    match3State.showResult = true;
  }
}

function renderMatch3Scene() {
  const W = GameConfig.WIDTH;
  const H = GameConfig.HEIGHT;
  
  // 背景
  const gradient = ctx.createLinearGradient(0, 0, 0, H * scale);
  gradient.addColorStop(0, '#2c3e50');
  gradient.addColorStop(1, '#1a252f');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W * scale, H * scale);
  
  // 安全区域
  let capsuleBottom = 80;
  try { const c = wx.getMenuButtonBoundingClientRect(); capsuleBottom = c.bottom + 15; } catch(e){}
  
  // 关卡信息
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${24 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`第 ${match3State.level} 关`, W / 2 * scale, capsuleBottom * scale);
  
  // 分数和目标
  const infoY = capsuleBottom + 35;
  ctx.font = `${14 * scale}px sans-serif`;
  
  // 分数进度条背景
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  roundRect(30 * scale, infoY * scale, (W - 60) * scale, 20 * scale, 10 * scale);
  ctx.fill();
  
  // 分数进度条
  const progressPct = Math.min(1, match3State.score / match3State.targetScore);
  ctx.fillStyle = progressPct >= 1 ? '#4CAF50' : '#4ecdc4';
  roundRect(30 * scale, infoY * scale, ((W - 60) * progressPct) * scale, 20 * scale, 10 * scale);
  ctx.fill();
  
  // 星星标记
  const config = match3State.levelConfig;
  const barWidth = W - 60;
  for (let i = 0; i < 3; i++) {
    const starPct = config.stars[i] / config.stars[2];
    const starX = 30 + barWidth * (config.stars[i] / config.stars[2] * 0.9 + 0.1 * (i + 1) / 3);
    ctx.font = `${14 * scale}px sans-serif`;
    ctx.fillStyle = match3State.score >= config.stars[i] ? '#ffd700' : '#666';
    ctx.fillText('⭐', Math.min(starX, W - 30) * scale, (infoY - 12) * scale);
  }
  
  // 分数文字
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${12 * scale}px sans-serif`;
  ctx.fillText(`${match3State.score} / ${match3State.targetScore}`, W / 2 * scale, (infoY + 10) * scale);
  
  // 剩余步数
  const movesY = infoY + 50;
  ctx.fillStyle = match3State.moves <= 5 ? '#ff6b6b' : '#ffe66d';
  ctx.font = `bold ${36 * scale}px sans-serif`;
  ctx.fillText(match3State.moves.toString(), W / 2 * scale, movesY * scale);
  ctx.font = `${14 * scale}px sans-serif`;
  ctx.fillStyle = '#aaa';
  ctx.fillText('剩余步数', W / 2 * scale, (movesY + 25) * scale);
  
  // 障碍物目标显示
  const target = config.target;
  let targetY = movesY + 50;
  ctx.font = `${12 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  
  const targets = [];
  if (target.ice) targets.push({ emoji: '🧊', current: match3State.iceCleared, need: target.ice });
  if (target.stone) targets.push({ emoji: '🪨', current: match3State.stoneCleared, need: target.stone });
  if (target.chain) targets.push({ emoji: '⛓️', current: match3State.chainCleared, need: target.chain });
  
  if (targets.length > 0) {
    const spacing = 70;
    const startX = W / 2 - (targets.length - 1) * spacing / 2;
    targets.forEach((t, i) => {
      const tx = startX + i * spacing;
      const done = t.current >= t.need;
      ctx.fillStyle = done ? '#4CAF50' : '#fff';
      ctx.fillText(`${t.emoji} ${t.current}/${t.need}`, tx * scale, targetY * scale);
    });
  }
  
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
      if (tile.special === 'rainbow') {
        // 彩虹方块：渐变背景
        const rainbowGradient = ctx.createLinearGradient(
          (pos.x - size/2) * scale, pos.y * scale,
          (pos.x + size/2) * scale, pos.y * scale
        );
        rainbowGradient.addColorStop(0, '#ff6b6b');
        rainbowGradient.addColorStop(0.25, '#ffe66d');
        rainbowGradient.addColorStop(0.5, '#4ecdc4');
        rainbowGradient.addColorStop(0.75, '#45b7d1');
        rainbowGradient.addColorStop(1, '#f093fb');
        ctx.fillStyle = rainbowGradient;
      } else {
        ctx.fillStyle = MATCH3_COLORS[tile.type] || '#888';
      }
      roundRect((pos.x - size/2) * scale, (pos.y - size/2) * scale, size * scale, size * scale, 10 * scale);
      ctx.fill();
      
      // 石头障碍物
      if (tile.obstacle === 'stone') {
        ctx.fillStyle = '#666';
        roundRect((pos.x - size/2) * scale, (pos.y - size/2) * scale, size * scale, size * scale, 10 * scale);
        ctx.fill();
        ctx.font = `${emojiSize * scale}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🪨', pos.x * scale, pos.y * scale);
        continue;
      }
      
      // 特殊方块标记
      if (tile.special === 'stripe_h') {
        // 横条纹
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 3 * scale;
        ctx.beginPath();
        ctx.moveTo((pos.x - size/2 + 5) * scale, pos.y * scale);
        ctx.lineTo((pos.x + size/2 - 5) * scale, pos.y * scale);
        ctx.stroke();
      } else if (tile.special === 'stripe_v') {
        // 竖条纹
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 3 * scale;
        ctx.beginPath();
        ctx.moveTo(pos.x * scale, (pos.y - size/2 + 5) * scale);
        ctx.lineTo(pos.x * scale, (pos.y + size/2 - 5) * scale);
        ctx.stroke();
      }
      
      // 冰层覆盖
      if (tile.ice) {
        ctx.fillStyle = 'rgba(135, 206, 250, 0.5)';
        roundRect((pos.x - size/2) * scale, (pos.y - size/2) * scale, size * scale, size * scale, 10 * scale);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2 * scale;
        roundRect((pos.x - size/2) * scale, (pos.y - size/2) * scale, size * scale, size * scale, 10 * scale);
        ctx.stroke();
      }
      
      // 铁链覆盖
      if (tile.chain) {
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 3 * scale;
        // X形铁链
        ctx.beginPath();
        ctx.moveTo((pos.x - size/3) * scale, (pos.y - size/3) * scale);
        ctx.lineTo((pos.x + size/3) * scale, (pos.y + size/3) * scale);
        ctx.moveTo((pos.x + size/3) * scale, (pos.y - size/3) * scale);
        ctx.lineTo((pos.x - size/3) * scale, (pos.y + size/3) * scale);
        ctx.stroke();
      }
      
      // Emoji
      const emojiSize = Math.floor(MATCH3_GRID.tileSize * 0.55);
      ctx.font = `${emojiSize * scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (tile.special === 'rainbow') {
        ctx.fillText('🌈', pos.x * scale, pos.y * scale);
      } else {
        ctx.fillText(MATCH3_EMOJIS[tile.type], pos.x * scale, pos.y * scale);
      }
    }
  }
  
  // 连击显示
  if (match3State.combo > 1) {
    ctx.fillStyle = '#ff6b6b';
    ctx.font = `bold ${20 * scale}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`${match3State.combo}连击！`, W / 2 * scale, (movesY + 55) * scale);
  }
  
  // 特效
  drawEffects();
  
  // 底部返回按钮
  const safeBottom = systemInfo.safeArea ? (H - systemInfo.safeArea.bottom) : 20;
  const bottomY = H - Math.max(safeBottom, 15) - 45;
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  roundRect(15 * scale, bottomY * scale, 80 * scale, 36 * scale, 10 * scale);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${14 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('← 返回', 55 * scale, (bottomY + 18) * scale);
  
  // 结算弹窗
  if (match3State.showResult) {
    renderMatch3Result();
  }
}

function renderMatch3Result() {
  const W = GameConfig.WIDTH;
  const H = GameConfig.HEIGHT;
  const centerX = W / 2;
  const centerY = H / 2;
  
  // 遮罩
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, 0, W * scale, H * scale);
  
  // 弹窗背景
  const popupW = W - 60;
  const popupH = 320;
  const popupX = 30;
  const popupY = centerY - popupH / 2;
  
  ctx.fillStyle = match3State.won ? '#4ecdc4' : '#ff6b6b';
  roundRect(popupX * scale, popupY * scale, popupW * scale, popupH * scale, 20 * scale);
  ctx.fill();
  
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  roundRect((popupX + 5) * scale, (popupY + 5) * scale, (popupW - 10) * scale, (popupH - 10) * scale, 15 * scale);
  ctx.fill();
  
  // 标题
  ctx.fillStyle = '#333';
  ctx.font = `bold ${28 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(match3State.won ? '🎉 恭喜过关！' : '😢 挑战失败', centerX * scale, (popupY + 50) * scale);
  
  // 星星
  if (match3State.won) {
    ctx.font = `${40 * scale}px sans-serif`;
    const starY = popupY + 100;
    for (let i = 0; i < 3; i++) {
      ctx.fillText(i < match3State.stars ? '⭐' : '☆', (centerX - 50 + i * 50) * scale, starY * scale);
    }
  }
  
  // 分数
  ctx.fillStyle = '#666';
  ctx.font = `${18 * scale}px sans-serif`;
  ctx.fillText(`得分: ${match3State.score}`, centerX * scale, (popupY + 150) * scale);
  
  // 奖励
  if (match3State.won) {
    const reward = match3State.levelConfig.reward;
    let rewardText = '奖励: ';
    if (reward.coin) rewardText += `💰${reward.coin} `;
    if (reward.diamond) rewardText += `💎${reward.diamond}`;
    ctx.fillStyle = '#f5a623';
    ctx.font = `bold ${16 * scale}px sans-serif`;
    ctx.fillText(rewardText, centerX * scale, (popupY + 180) * scale);
  }
  
  // 按钮
  const btnY = popupY + 230;
  const btnW = 100;
  const btnH = 45;
  
  // 返回按钮
  ctx.fillStyle = '#999';
  roundRect((centerX - btnW - 20) * scale, btnY * scale, btnW * scale, btnH * scale, 10 * scale);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${16 * scale}px sans-serif`;
  ctx.fillText('返回', (centerX - btnW / 2 - 20) * scale, (btnY + btnH / 2) * scale);
  
  // 继续/重试按钮
  ctx.fillStyle = match3State.won ? '#4CAF50' : '#ff6b6b';
  roundRect((centerX + 20) * scale, btnY * scale, btnW * scale, btnH * scale, 10 * scale);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillText(match3State.won ? '下一关' : '重试', (centerX + btnW / 2 + 20) * scale, (btnY + btnH / 2) * scale);
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
  
  for (let i = 0; i < 50; i++) {
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
  const W = GameConfig.WIDTH;
  const H = GameConfig.HEIGHT;
  
  // 背景
  const gradient = ctx.createLinearGradient(0, 0, 0, H * scale);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W * scale, H * scale);
  
  // 安全区域
  let capsuleBottom = 80;
  try {
    const capsule = wx.getMenuButtonBoundingClientRect();
    capsuleBottom = capsule.bottom + 15;
  } catch (e) {}
  
  // 标题
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${28 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🎮 选择关卡', W / 2 * scale, capsuleBottom * scale);
  
  // 当前进度
  ctx.font = `${14 * scale}px sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillText(`已解锁 ${SaveManager.data.highestLevel}/20 关`, W / 2 * scale, (capsuleBottom + 30) * scale);
  
  // 关卡按钮
  const safeBottom = systemInfo.safeArea ? (H - systemInfo.safeArea.bottom) : 20;
  const startY = capsuleBottom + 70;
  const endY = H - safeBottom - 70;
  const cols = 5;
  const rows = 4;
  const spacingX = Math.min(65, (W - 40) / cols);
  const spacingY = Math.min(75, (endY - startY) / 10);
  const startX = (W - (cols - 1) * spacingX) / 2;
  
  for (let i = 0; i < 50; i++) {
    const level = i + 1;
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = startX + col * spacingX;
    const y = startY + row * spacingY;
    
    const unlocked = level <= SaveManager.data.highestLevel;
    const stars = SaveManager.data.levelStars[level] || 0;
    
    // 按钮阴影
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.arc((x + 2) * scale, (y + 2) * scale, 28 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    // 按钮背景
    if (unlocked) {
      const btnGradient = ctx.createRadialGradient(x * scale, y * scale, 0, x * scale, y * scale, 28 * scale);
      btnGradient.addColorStop(0, '#5ee7df');
      btnGradient.addColorStop(1, '#4ecdc4');
      ctx.fillStyle = btnGradient;
    } else {
      ctx.fillStyle = '#555';
    }
    ctx.beginPath();
    ctx.arc(x * scale, y * scale, 28 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    // 边框
    ctx.strokeStyle = unlocked ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.arc(x * scale, y * scale, 28 * scale, 0, Math.PI * 2);
    ctx.stroke();
    
    // 关卡号或锁
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${20 * scale}px sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.fillText(unlocked ? level.toString() : '🔒', x * scale, y * scale);
    
    // 星星
    if (unlocked) {
      ctx.font = `${12 * scale}px sans-serif`;
      const starStr = (stars >= 1 ? '⭐' : '☆') + (stars >= 2 ? '⭐' : '☆') + (stars >= 3 ? '⭐' : '☆');
      ctx.fillText(starStr, x * scale, (y + 32) * scale);
    }
  }
  
  // 返回按钮
  const bottomY = H - Math.max(safeBottom, 15) - 45;
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  roundRect(15 * scale, bottomY * scale, 80 * scale, 36 * scale, 10 * scale);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${14 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('← 返回', 55 * scale, (bottomY + 18) * scale);
}

// ===================
// 岛屿场景 (简化)
// ===================
function initIslandScene() {}

// ===================
// 小岛状态
// ===================
let islandState = {
  puppy: {
    x: 0.5, // 相对位置 (0-1)
    y: 0.5,
    mood: 100, // 心情 0-100
    hunger: 100, // 饱腹度 0-100
    love: 0, // 好感度
    state: 'idle', // idle, walking, happy, sleeping
    targetX: 0.5,
    targetY: 0.5,
    lastFed: Date.now(),
    lastPet: Date.now(),
  },
  buildings: [
    { type: 'house', x: 0.5, y: 0.4, emoji: '🏠' },
    { type: 'tree', x: 0.3, y: 0.35, emoji: '🌴' },
    { type: 'tree', x: 0.7, y: 0.55, emoji: '🌳' },
  ],
  lastUpdate: Date.now(),
};

function initIslandScene() {
  // 加载保存的小狗状态
  if (SaveManager.data.puppy) {
    islandState.puppy = { ...islandState.puppy, ...SaveManager.data.puppy };
  }
  islandState.lastUpdate = Date.now();
}

function updatePuppy() {
  const puppy = islandState.puppy;
  const now = Date.now();
  const dt = (now - islandState.lastUpdate) / 1000;
  islandState.lastUpdate = now;
  
  // 饱腹度随时间下降 (每分钟降1点)
  const timeSinceFed = (now - puppy.lastFed) / 60000;
  puppy.hunger = Math.max(0, 100 - timeSinceFed * 0.5);
  
  // 心情受饱腹度影响
  if (puppy.hunger < 30) {
    puppy.mood = Math.max(0, puppy.mood - dt * 0.5);
  } else if (puppy.hunger > 70) {
    puppy.mood = Math.min(100, puppy.mood + dt * 0.1);
  }
  
  // 小狗移动
  if (puppy.state === 'walking') {
    const dx = puppy.targetX - puppy.x;
    const dy = puppy.targetY - puppy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0.01) {
      puppy.x += (dx / dist) * 0.002;
      puppy.y += (dy / dist) * 0.002;
    } else {
      puppy.state = 'idle';
    }
  }
  
  // 随机走动
  if (puppy.state === 'idle' && Math.random() < 0.005) {
    puppy.targetX = 0.3 + Math.random() * 0.4;
    puppy.targetY = 0.4 + Math.random() * 0.3;
    puppy.state = 'walking';
  }
}

function feedPuppy() {
  const res = SaveManager.getResources();
  if (res.coin >= 10) {
    SaveManager.addResources({ coin: -10 });
    islandState.puppy.hunger = Math.min(100, islandState.puppy.hunger + 30);
    islandState.puppy.mood = Math.min(100, islandState.puppy.mood + 10);
    islandState.puppy.love += 1;
    islandState.puppy.lastFed = Date.now();
    islandState.puppy.state = 'happy';
    setTimeout(() => { islandState.puppy.state = 'idle'; }, 2000);
    showInfo('🍖 喂食成功！小狗很开心~');
    savePuppyState();
  } else {
    showInfo('💰 金币不足，需要10金币');
  }
}

function petPuppy() {
  islandState.puppy.mood = Math.min(100, islandState.puppy.mood + 5);
  islandState.puppy.love += 0.5;
  islandState.puppy.lastPet = Date.now();
  islandState.puppy.state = 'happy';
  setTimeout(() => { islandState.puppy.state = 'idle'; }, 1500);
  showInfo('💕 摸摸小狗~');
  savePuppyState();
}

function savePuppyState() {
  SaveManager.data.puppy = { ...islandState.puppy };
  SaveManager.save();
}

function getPuppyEmoji() {
  const puppy = islandState.puppy;
  if (puppy.state === 'happy') return '🐕';
  if (puppy.state === 'sleeping') return '😴';
  if (puppy.hunger < 20) return '🐶'; // 饿了，可怜巴巴
  if (puppy.mood < 30) return '🐕‍🦺';
  return '🐕';
}

function handleIslandTouch(x, y) {
  const safeBottom = systemInfo.safeArea ? (GameConfig.HEIGHT - systemInfo.safeArea.bottom) : 20;
  const bottomY = GameConfig.HEIGHT - Math.max(safeBottom, 15) - 45;
  
  // 返回按钮
  if (x >= 15 && x <= 95 && y >= bottomY && y <= bottomY + 36) {
    savePuppyState();
    switchScene('MainMenu');
    return;
  }
  
  const W = GameConfig.WIDTH;
  const H = GameConfig.HEIGHT;
  const centerX = W / 2;
  const centerY = H / 2;
  
  // 检测点击小狗
  const puppyScreenX = centerX + (islandState.puppy.x - 0.5) * 300;
  const puppyScreenY = centerY + (islandState.puppy.y - 0.5) * 250;
  const puppyDist = Math.sqrt((x - puppyScreenX) ** 2 + (y - puppyScreenY) ** 2);
  
  if (puppyDist < 50) {
    petPuppy();
    return;
  }
  
  // 检测喂食按钮
  if (x >= W - 90 && x <= W - 10 && y >= bottomY - 50 && y <= bottomY) {
    feedPuppy();
    return;
  }
}

function renderIslandScene() {
  updatePuppy();
  
  const W = GameConfig.WIDTH;
  const H = GameConfig.HEIGHT;
  const centerX = W / 2;
  const centerY = H / 2;
  
  // 海洋背景
  const gradient = ctx.createLinearGradient(0, 0, 0, H * scale);
  gradient.addColorStop(0, '#87CEEB');
  gradient.addColorStop(1, '#1e90ff');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W * scale, H * scale);
  
  // 沙滩
  ctx.fillStyle = '#F4A460';
  ctx.beginPath();
  ctx.ellipse(centerX * scale, centerY * scale, 180 * scale, 150 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 草地
  ctx.fillStyle = '#90EE90';
  ctx.beginPath();
  ctx.ellipse(centerX * scale, centerY * scale, 160 * scale, 130 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 建筑
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const b of islandState.buildings) {
    const bx = centerX + (b.x - 0.5) * 300;
    const by = centerY + (b.y - 0.5) * 250;
    ctx.font = `${50 * scale}px sans-serif`;
    ctx.fillText(b.emoji, bx * scale, by * scale);
  }
  
  // 小狗
  const puppy = islandState.puppy;
  const puppyX = centerX + (puppy.x - 0.5) * 300;
  const puppyY = centerY + (puppy.y - 0.5) * 250;
  
  // 小狗阴影
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(puppyX * scale, (puppyY + 20) * scale, 25 * scale, 10 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 小狗本体
  const puppyEmoji = getPuppyEmoji();
  const puppySize = puppy.state === 'happy' ? 55 : 45;
  ctx.font = `${puppySize * scale}px sans-serif`;
  ctx.fillText(puppyEmoji, puppyX * scale, puppyY * scale);
  
  // 小狗状态气泡
  if (puppy.hunger < 30) {
    ctx.font = `${20 * scale}px sans-serif`;
    ctx.fillText('🍖❓', puppyX * scale, (puppyY - 40) * scale);
  } else if (puppy.state === 'happy') {
    ctx.font = `${20 * scale}px sans-serif`;
    ctx.fillText('💕', puppyX * scale, (puppyY - 40) * scale);
  }
  
  // 顶部状态栏
  const safeTop = systemInfo.safeArea ? systemInfo.safeArea.top : 40;
  let capsuleBottom = 80;
  try {
    const capsule = wx.getMenuButtonBoundingClientRect();
    capsuleBottom = capsule.bottom + 10;
  } catch (e) {}
  
  // 标题
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${28 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('🏝️ 我的小岛', centerX * scale, capsuleBottom * scale);
  
  // 小狗状态面板
  const panelY = capsuleBottom + 30;
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  roundRect(15 * scale, panelY * scale, (W - 30) * scale, 70 * scale, 12 * scale);
  ctx.fill();
  
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${16 * scale}px sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(`🐕 小狗`, 25 * scale, (panelY + 22) * scale);
  ctx.fillText(`💕 好感: ${Math.floor(islandState.puppy.love)}`, 25 * scale, (panelY + 52) * scale);
  
  // 饱腹度条
  ctx.fillText(`🍖`, (W / 2 - 20) * scale, (panelY + 22) * scale);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  roundRect((W / 2 + 10) * scale, (panelY + 12) * scale, 100 * scale, 16 * scale, 8 * scale);
  ctx.fill();
  ctx.fillStyle = puppy.hunger > 30 ? '#4CAF50' : '#ff5722';
  roundRect((W / 2 + 10) * scale, (panelY + 12) * scale, (puppy.hunger) * scale, 16 * scale, 8 * scale);
  ctx.fill();
  
  // 心情条
  ctx.fillStyle = '#fff';
  ctx.fillText(`😊`, (W / 2 - 20) * scale, (panelY + 52) * scale);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  roundRect((W / 2 + 10) * scale, (panelY + 42) * scale, 100 * scale, 16 * scale, 8 * scale);
  ctx.fill();
  ctx.fillStyle = puppy.mood > 30 ? '#2196F3' : '#ff9800';
  roundRect((W / 2 + 10) * scale, (panelY + 42) * scale, (puppy.mood) * scale, 16 * scale, 8 * scale);
  ctx.fill();
  
  // 底部按钮
  const safeBottom = systemInfo.safeArea ? (H - systemInfo.safeArea.bottom) : 20;
  const bottomY = H - Math.max(safeBottom, 15) - 45;
  
  // 返回按钮
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  roundRect(15 * scale, bottomY * scale, 80 * scale, 36 * scale, 10 * scale);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${14 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('← 返回', 55 * scale, (bottomY + 18) * scale);
  
  // 喂食按钮
  ctx.fillStyle = 'rgba(255,152,0,0.8)';
  roundRect((W - 90) * scale, (bottomY - 50) * scale, 80 * scale, 40 * scale, 10 * scale);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${14 * scale}px sans-serif`;
  ctx.fillText('🍖 喂食', (W - 50) * scale, (bottomY - 30) * scale);
  ctx.font = `${11 * scale}px sans-serif`;
  ctx.fillText('10💰', (W - 50) * scale, (bottomY - 12) * scale);
}

// ===================
// 商店场景 (简化)
// ===================
function initShopScene() {}

// ===================
// 商店系统
// ===================
const SHOP_ITEMS = [
  { id: 'energy_50', emoji: '⚡', name: '体力 x50', desc: '恢复50点体力', cost: { diamond: 5 }, give: { energy: 50 } },
  { id: 'energy_200', emoji: '⚡', name: '体力 x200', desc: '恢复200点体力', cost: { diamond: 15 }, give: { energy: 200 } },
  { id: 'coin_500', emoji: '💰', name: '金币 x500', desc: '获得500金币', cost: { diamond: 10 }, give: { coin: 500 } },
  { id: 'coin_2000', emoji: '💰', name: '金币 x2000', desc: '获得2000金币', cost: { diamond: 35 }, give: { coin: 2000 } },
  { id: 'puppy_food', emoji: '🍖', name: '狗粮大礼包', desc: '喂食10次的量', cost: { coin: 80 }, give: { puppyFood: 10 } },
  { id: 'starter_pack', emoji: '🎁', name: '新手礼包', desc: '💎50 💰1000 ⚡100', cost: { real: 1 }, give: { diamond: 50, coin: 1000, energy: 100 }, once: true },
];

let shopState = {
  purchasedOnce: [], // 已购买的一次性商品
};

function initShop() {
  shopState.purchasedOnce = SaveManager.data.purchasedOnce || [];
}

function purchaseShopItem(index) {
  const item = SHOP_ITEMS[index];
  if (!item) return;
  
  // 检查是否已购买一次性商品
  if (item.once && shopState.purchasedOnce.includes(item.id)) {
    showInfo('❌ 已购买过该商品');
    return;
  }
  
  // 检查是否是真实货币（暂不支持）
  if (item.cost.real) {
    showInfo('💳 付费功能开发中...');
    return;
  }
  
  // 检查资源是否足够
  const res = SaveManager.getResources();
  if (item.cost.diamond && res.diamond < item.cost.diamond) {
    showInfo('💎 钻石不足');
    return;
  }
  if (item.cost.coin && res.coin < item.cost.coin) {
    showInfo('💰 金币不足');
    return;
  }
  
  // 扣除资源
  if (item.cost.diamond) SaveManager.addResources({ diamond: -item.cost.diamond });
  if (item.cost.coin) SaveManager.addResources({ coin: -item.cost.coin });
  
  // 发放奖励
  if (item.give.energy) {
    SaveManager.data.energy = Math.min(SaveManager.data.maxEnergy, SaveManager.data.energy + item.give.energy);
  }
  if (item.give.coin) SaveManager.addResources({ coin: item.give.coin });
  if (item.give.diamond) SaveManager.addResources({ diamond: item.give.diamond });
  if (item.give.puppyFood) {
    // 狗粮直接加饱腹度
    if (islandState && islandState.puppy) {
      islandState.puppy.hunger = Math.min(100, islandState.puppy.hunger + item.give.puppyFood * 10);
      islandState.puppy.love += item.give.puppyFood;
      savePuppyState();
    }
  }
  
  // 记录一次性购买
  if (item.once) {
    shopState.purchasedOnce.push(item.id);
    SaveManager.data.purchasedOnce = shopState.purchasedOnce;
  }
  
  SaveManager.save();
  showInfo(`✅ 购买成功！${item.name}`);
}

function handleShopTouch(x, y) {
  const W = GameConfig.WIDTH;
  const H = GameConfig.HEIGHT;
  const safeBottom = systemInfo.safeArea ? (H - systemInfo.safeArea.bottom) : 20;
  const bottomY = H - Math.max(safeBottom, 15) - 45;
  
  // 返回按钮
  if (x >= 15 && x <= 95 && y >= bottomY && y <= bottomY + 36) {
    switchScene('MainMenu');
    return;
  }
  
  // 商品购买按钮
  let capsuleBottom = 80;
  try { const c = wx.getMenuButtonBoundingClientRect(); capsuleBottom = c.bottom + 15; } catch(e){}
  
  const startY = capsuleBottom + 60;
  const cols = 2;
  const itemWidth = (W - 50) / cols;
  const itemHeight = 100;
  const spacing = 10;
  
  for (let i = 0; i < SHOP_ITEMS.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const ix = 20 + col * (itemWidth + spacing);
    const iy = startY + row * (itemHeight + spacing);
    
    if (x >= ix && x <= ix + itemWidth && y >= iy && y <= iy + itemHeight) {
      purchaseShopItem(i);
      return;
    }
  }
}

function renderShopScene() {
  const W = GameConfig.WIDTH;
  const H = GameConfig.HEIGHT;
  
  initShop();
  
  // 背景
  const gradient = ctx.createLinearGradient(0, 0, 0, H * scale);
  gradient.addColorStop(0, '#f093fb');
  gradient.addColorStop(1, '#f5576c');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W * scale, H * scale);
  
  // 安全区域
  let capsuleBottom = 80;
  try { const c = wx.getMenuButtonBoundingClientRect(); capsuleBottom = c.bottom + 15; } catch(e){}
  
  // 标题
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${26 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🛒 商店', W / 2 * scale, capsuleBottom * scale);
  
  // 当前资源显示
  const res = SaveManager.getResources();
  ctx.font = `bold ${14 * scale}px sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fillText(`💎 ${res.diamond}    💰 ${res.coin}    ⚡ ${SaveManager.getEnergy()}`, W / 2 * scale, (capsuleBottom + 28) * scale);
  
  // 商品列表 (2列布局)
  const startY = capsuleBottom + 60;
  const cols = 2;
  const itemWidth = (W - 50) / cols;
  const itemHeight = 100;
  const spacing = 10;
  
  SHOP_ITEMS.forEach((item, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const ix = 20 + col * (itemWidth + spacing);
    const iy = startY + row * (itemHeight + spacing);
    
    const purchased = item.once && shopState.purchasedOnce.includes(item.id);
    
    // 卡片背景
    ctx.fillStyle = purchased ? 'rgba(100,100,100,0.5)' : 'rgba(255,255,255,0.2)';
    roundRect(ix * scale, iy * scale, itemWidth * scale, itemHeight * scale, 12 * scale);
    ctx.fill();
    
    // 边框
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1 * scale;
    roundRect(ix * scale, iy * scale, itemWidth * scale, itemHeight * scale, 12 * scale);
    ctx.stroke();
    
    // Emoji
    ctx.font = `${36 * scale}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(item.emoji, (ix + 35) * scale, (iy + 40) * scale);
    
    // 名称
    ctx.fillStyle = purchased ? '#aaa' : '#fff';
    ctx.font = `bold ${14 * scale}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(item.name, (ix + 65) * scale, (iy + 30) * scale);
    
    // 描述
    ctx.font = `${11 * scale}px sans-serif`;
    ctx.fillStyle = purchased ? '#888' : 'rgba(255,255,255,0.8)';
    ctx.fillText(item.desc.substring(0, 12), (ix + 65) * scale, (iy + 50) * scale);
    
    // 价格/已购买
    ctx.textAlign = 'center';
    if (purchased) {
      ctx.fillStyle = '#aaa';
      ctx.font = `bold ${12 * scale}px sans-serif`;
      ctx.fillText('已购买', (ix + itemWidth / 2) * scale, (iy + 80) * scale);
    } else {
      ctx.fillStyle = '#ffe66d';
      ctx.font = `bold ${13 * scale}px sans-serif`;
      let priceText = '';
      if (item.cost.diamond) priceText = `💎 ${item.cost.diamond}`;
      else if (item.cost.coin) priceText = `💰 ${item.cost.coin}`;
      else if (item.cost.real) priceText = `¥${item.cost.real}`;
      ctx.fillText(priceText, (ix + itemWidth / 2) * scale, (iy + 80) * scale);
    }
  });
  
  // 返回按钮
  const safeBottom = systemInfo.safeArea ? (H - systemInfo.safeArea.bottom) : 20;
  const bottomY = H - Math.max(safeBottom, 15) - 45;
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  roundRect(15 * scale, bottomY * scale, 80 * scale, 36 * scale, 10 * scale);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${14 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('← 返回', 55 * scale, (bottomY + 18) * scale);
}

// ===================
// 成就场景 (简化)
// ===================
function initAchievementScene() {}

// ===================
// 成就系统
// ===================
const ACHIEVEMENTS_CONFIG = [
  { id: 'first_level', emoji: '🌟', name: '初来乍到', desc: '完成第一关', reward: { diamond: 5 }, check: () => SaveManager.data.highestLevel > 1 },
  { id: 'level_5', emoji: '🎮', name: '小试牛刀', desc: '通关5个关卡', reward: { diamond: 10 }, check: () => SaveManager.data.highestLevel > 5 },
  { id: 'level_10', emoji: '🎯', name: '游戏达人', desc: '通关10个关卡', reward: { diamond: 20 }, check: () => SaveManager.data.highestLevel > 10 },
  { id: 'level_20', emoji: '👑', name: '通关大师', desc: '通关第20关', reward: { diamond: 50 }, check: () => SaveManager.data.highestLevel > 20 },
  { id: 'level_50', emoji: '🏆', name: '传奇玩家', desc: '通关全部50关', reward: { diamond: 100 }, check: () => SaveManager.data.highestLevel > 50 },
  { id: 'merge_10', emoji: '🔄', name: '合成新手', desc: '合成10次', reward: { coin: 100 }, check: () => (SaveManager.data.statistics?.totalMerges || 0) >= 10 },
  { id: 'merge_100', emoji: '⚗️', name: '合成专家', desc: '合成100次', reward: { coin: 500 }, check: () => (SaveManager.data.statistics?.totalMerges || 0) >= 100 },
  { id: 'coin_1000', emoji: '💰', name: '小富翁', desc: '累计获得1000金币', reward: { diamond: 10 }, check: () => (SaveManager.data.statistics?.totalCoins || 0) >= 1000 },
  { id: 'coin_10000', emoji: '💎', name: '大富翁', desc: '累计获得10000金币', reward: { diamond: 30 }, check: () => (SaveManager.data.statistics?.totalCoins || 0) >= 10000 },
  { id: 'puppy_love_10', emoji: '🐕', name: '小狗的朋友', desc: '小狗好感度达到10', reward: { coin: 200 }, check: () => (islandState?.puppy?.love || 0) >= 10 },
  { id: 'puppy_love_50', emoji: '❤️', name: '小狗的挚友', desc: '小狗好感度达到50', reward: { diamond: 20 }, check: () => (islandState?.puppy?.love || 0) >= 50 },
  { id: 'all_stars', emoji: '⭐', name: '完美主义', desc: '任意关卡获得三星', reward: { diamond: 15 }, check: () => Object.values(SaveManager.data.levelStars || {}).some(s => s >= 3) },
];

let achievementState = {
  claimed: [], // 已领取奖励的成就
};

function initAchievements() {
  achievementState.claimed = SaveManager.data.achievementsClaimed || [];
}

function claimAchievement(id) {
  if (achievementState.claimed.includes(id)) return false;
  
  const ach = ACHIEVEMENTS_CONFIG.find(a => a.id === id);
  if (!ach || !ach.check()) return false;
  
  achievementState.claimed.push(id);
  SaveManager.data.achievementsClaimed = achievementState.claimed;
  
  if (ach.reward.diamond) SaveManager.addResources({ diamond: ach.reward.diamond });
  if (ach.reward.coin) SaveManager.addResources({ coin: ach.reward.coin });
  
  SaveManager.save();
  showInfo(`🎉 成就达成！${ach.name} +${ach.reward.diamond ? '💎' + ach.reward.diamond : '💰' + ach.reward.coin}`);
  return true;
}

function handleAchievementTouch(x, y) {
  const W = GameConfig.WIDTH;
  const H = GameConfig.HEIGHT;
  const safeBottom = systemInfo.safeArea ? (H - systemInfo.safeArea.bottom) : 20;
  const bottomY = H - Math.max(safeBottom, 15) - 45;
  
  // 返回按钮
  if (x >= 15 && x <= 95 && y >= bottomY && y <= bottomY + 36) {
    switchScene('MainMenu');
    return;
  }
  
  // 成就领取按钮
  let capsuleBottom = 80;
  try { const c = wx.getMenuButtonBoundingClientRect(); capsuleBottom = c.bottom + 15; } catch(e){}
  
  const startY = capsuleBottom + 50;
  const itemHeight = 75;
  const spacing = 8;
  
  for (let i = 0; i < ACHIEVEMENTS_CONFIG.length; i++) {
    const ach = ACHIEVEMENTS_CONFIG[i];
    const iy = startY + i * (itemHeight + spacing);
    
    // 检测领取按钮
    const btnX = W - 80;
    if (x >= btnX && x <= btnX + 60 && y >= iy + 20 && y <= iy + 55) {
      const done = ach.check();
      const claimed = achievementState.claimed.includes(ach.id);
      
      if (claimed) {
        showInfo('✅ 已领取');
      } else if (done) {
        claimAchievement(ach.id);
      } else {
        showInfo('❌ 成就未达成');
      }
      return;
    }
  }
}

function renderAchievementScene() {
  const W = GameConfig.WIDTH;
  const H = GameConfig.HEIGHT;
  
  initAchievements();
  
  // 背景
  const gradient = ctx.createLinearGradient(0, 0, 0, H * scale);
  gradient.addColorStop(0, '#ffecd2');
  gradient.addColorStop(1, '#fcb69f');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W * scale, H * scale);
  
  // 安全区域
  let capsuleBottom = 80;
  try { const c = wx.getMenuButtonBoundingClientRect(); capsuleBottom = c.bottom + 15; } catch(e){}
  
  // 标题
  ctx.fillStyle = '#333';
  ctx.font = `bold ${26 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🏆 成就', W / 2 * scale, capsuleBottom * scale);
  
  // 统计
  const completed = ACHIEVEMENTS_CONFIG.filter(a => a.check()).length;
  ctx.font = `${13 * scale}px sans-serif`;
  ctx.fillStyle = '#666';
  ctx.fillText(`已完成 ${completed}/${ACHIEVEMENTS_CONFIG.length}`, W / 2 * scale, (capsuleBottom + 25) * scale);
  
  // 成就列表
  const startY = capsuleBottom + 50;
  const itemHeight = 75;
  const spacing = 8;
  
  ACHIEVEMENTS_CONFIG.forEach((ach, i) => {
    const iy = startY + i * (itemHeight + spacing);
    const done = ach.check();
    const claimed = achievementState.claimed.includes(ach.id);
    
    // 卡片背景
    ctx.fillStyle = done ? 'rgba(76,175,80,0.2)' : 'rgba(255,255,255,0.5)';
    roundRect(15 * scale, iy * scale, (W - 30) * scale, itemHeight * scale, 10 * scale);
    ctx.fill();
    
    // 边框
    ctx.strokeStyle = done ? 'rgba(76,175,80,0.5)' : 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1 * scale;
    roundRect(15 * scale, iy * scale, (W - 30) * scale, itemHeight * scale, 10 * scale);
    ctx.stroke();
    
    // Emoji
    ctx.font = `${32 * scale}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = done ? '#333' : '#999';
    ctx.fillText(ach.emoji, 45 * scale, (iy + 38) * scale);
    
    // 名称
    ctx.fillStyle = done ? '#333' : '#666';
    ctx.font = `bold ${14 * scale}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(ach.name, 75 * scale, (iy + 28) * scale);
    
    // 描述
    ctx.font = `${11 * scale}px sans-serif`;
    ctx.fillStyle = '#888';
    ctx.fillText(ach.desc, 75 * scale, (iy + 48) * scale);
    
    // 奖励
    ctx.font = `${11 * scale}px sans-serif`;
    ctx.fillStyle = '#f5a623';
    const rewardText = ach.reward.diamond ? `💎 ${ach.reward.diamond}` : `💰 ${ach.reward.coin}`;
    ctx.fillText(rewardText, 75 * scale, (iy + 65) * scale);
    
    // 领取按钮
    const btnX = W - 80;
    ctx.textAlign = 'center';
    if (claimed) {
      ctx.fillStyle = '#aaa';
      roundRect(btnX * scale, (iy + 20) * scale, 55 * scale, 35 * scale, 8 * scale);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${11 * scale}px sans-serif`;
      ctx.fillText('已领取', (btnX + 27) * scale, (iy + 38) * scale);
    } else if (done) {
      ctx.fillStyle = '#4CAF50';
      roundRect(btnX * scale, (iy + 20) * scale, 55 * scale, 35 * scale, 8 * scale);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${11 * scale}px sans-serif`;
      ctx.fillText('领取', (btnX + 27) * scale, (iy + 38) * scale);
    } else {
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      roundRect(btnX * scale, (iy + 20) * scale, 55 * scale, 35 * scale, 8 * scale);
      ctx.fill();
      ctx.fillStyle = '#999';
      ctx.font = `bold ${11 * scale}px sans-serif`;
      ctx.fillText('未达成', (btnX + 27) * scale, (iy + 38) * scale);
    }
  });
  
  // 返回按钮
  const safeBottom = systemInfo.safeArea ? (H - systemInfo.safeArea.bottom) : 20;
  const bottomY = H - Math.max(safeBottom, 15) - 45;
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  roundRect(15 * scale, bottomY * scale, 80 * scale, 36 * scale, 10 * scale);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${14 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('← 返回', 55 * scale, (bottomY + 18) * scale);
}

// ===================
// 每日任务场景 (简化)
// ===================
function initDailyTaskScene() {}

// ===================
// 每日任务系统
// ===================
const DAILY_TASKS_CONFIG = [
  { id: 'match3_3', emoji: '🎮', name: '完成3关消消乐', target: 3, reward: { coin: 100 }, rewardText: '💰 100' },
  { id: 'merge_20', emoji: '🔄', name: '合成20次', target: 20, reward: { coin: 50, energy: 10 }, rewardText: '💰50 ⚡10' },
  { id: 'coin_500', emoji: '💰', name: '收集500金币', target: 500, reward: { diamond: 5 }, rewardText: '💎 5' },
  { id: 'feed_puppy', emoji: '🐕', name: '喂小狗3次', target: 3, reward: { coin: 80 }, rewardText: '💰 80' },
  { id: 'match3_1', emoji: '⭐', name: '完成1关三星', target: 1, reward: { diamond: 3 }, rewardText: '💎 3' },
  { id: 'shopper_3', emoji: '🛒', name: '完成3个订单', target: 3, reward: { coin: 120, diamond: 2 }, rewardText: '💰120 💎2' },
];

let dailyTaskState = {
  tasks: [],
  lastRefresh: 0,
};

function initDailyTasks() {
  const today = new Date().toDateString();
  const savedDate = SaveManager.data.dailyTasks.lastRefresh;
  
  // 如果是新的一天，刷新任务
  if (savedDate !== today) {
    // 随机选3个任务
    const shuffled = [...DAILY_TASKS_CONFIG].sort(() => Math.random() - 0.5);
    dailyTaskState.tasks = shuffled.slice(0, 3).map(t => ({
      ...t,
      progress: 0,
      claimed: false,
    }));
    dailyTaskState.lastRefresh = today;
    SaveManager.data.dailyTasks = {
      lastRefresh: today,
      tasks: dailyTaskState.tasks,
      stats: SaveManager.data.dailyTasks.stats || { matches: 0, merges: 0, coins: 0, feeds: 0, stars: 0 },
    };
    SaveManager.save();
  } else {
    dailyTaskState.tasks = SaveManager.data.dailyTasks.tasks || [];
    dailyTaskState.lastRefresh = savedDate;
  }
}

function updateDailyTaskProgress(type, amount = 1) {
  if (!SaveManager.data.dailyTasks.stats) {
    SaveManager.data.dailyTasks.stats = { matches: 0, merges: 0, coins: 0, feeds: 0, stars: 0, shoppers: 0 };
  }
  const stats = SaveManager.data.dailyTasks.stats;
  
  switch (type) {
    case 'match3': stats.matches += amount; break;
    case 'merge': stats.merges += amount; break;
    case 'coin': stats.coins += amount; break;
    case 'feed': stats.feeds += amount; break;
    case 'star': stats.stars += amount; break;
    case 'shopper': stats.shoppers = (stats.shoppers || 0) + amount; break;
  }
  
  // 更新任务进度
  for (const task of dailyTaskState.tasks) {
    if (task.claimed) continue;
    switch (task.id) {
      case 'match3_3': task.progress = stats.matches; break;
      case 'merge_20': task.progress = stats.merges; break;
      case 'coin_500': task.progress = stats.coins; break;
      case 'feed_puppy': task.progress = stats.feeds; break;
      case 'match3_1': task.progress = stats.stars; break;
      case 'shopper_3': task.progress = stats.shoppers || 0; break;
    }
  }
  
  SaveManager.data.dailyTasks.tasks = dailyTaskState.tasks;
  SaveManager.data.dailyTasks.stats = stats;
  SaveManager.save();
}

function claimDailyTask(index) {
  const task = dailyTaskState.tasks[index];
  if (!task || task.claimed || task.progress < task.target) return false;
  
  task.claimed = true;
  SaveManager.addResources(task.reward);
  if (task.reward.energy) {
    SaveManager.data.energy = Math.min(SaveManager.data.maxEnergy, SaveManager.data.energy + task.reward.energy);
  }
  SaveManager.data.dailyTasks.tasks = dailyTaskState.tasks;
  SaveManager.save();
  showInfo(`🎁 领取成功！${task.rewardText}`);
  return true;
}

function handleDailyTaskTouch(x, y) {
  const W = GameConfig.WIDTH;
  const H = GameConfig.HEIGHT;
  const safeBottom = systemInfo.safeArea ? (H - systemInfo.safeArea.bottom) : 20;
  const bottomY = H - Math.max(safeBottom, 15) - 45;
  
  // 返回按钮
  if (x >= 15 && x <= 95 && y >= bottomY && y <= bottomY + 36) {
    switchScene('MainMenu');
    return;
  }
  
  // 任务领取按钮
  let capsuleBottom = 80;
  try { const c = wx.getMenuButtonBoundingClientRect(); capsuleBottom = c.bottom + 15; } catch(e){}
  
  const startY = capsuleBottom + 60;
  const taskHeight = 90;
  const taskSpacing = 10;
  
  for (let i = 0; i < dailyTaskState.tasks.length; i++) {
    const task = dailyTaskState.tasks[i];
    const ty = startY + i * (taskHeight + taskSpacing);
    const btnX = W - 90;
    const btnY = ty + 30;
    
    // 检测点击领取按钮
    if (x >= btnX && x <= btnX + 70 && y >= btnY && y <= btnY + 35) {
      if (task.claimed) {
        showInfo('✅ 已领取');
      } else if (task.progress >= task.target) {
        claimDailyTask(i);
      } else {
        showInfo('❌ 任务未完成');
      }
      return;
    }
  }
}

function renderDailyTaskScene() {
  const W = GameConfig.WIDTH;
  const H = GameConfig.HEIGHT;
  
  // 初始化任务
  if (dailyTaskState.tasks.length === 0) {
    initDailyTasks();
  }
  
  // 背景
  const gradient = ctx.createLinearGradient(0, 0, 0, H * scale);
  gradient.addColorStop(0, '#a8edea');
  gradient.addColorStop(1, '#fed6e3');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W * scale, H * scale);
  
  // 安全区域
  let capsuleBottom = 80;
  try { const c = wx.getMenuButtonBoundingClientRect(); capsuleBottom = c.bottom + 15; } catch(e){}
  
  // 标题
  ctx.fillStyle = '#333';
  ctx.font = `bold ${26 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('📋 每日任务', W / 2 * scale, capsuleBottom * scale);
  
  // 刷新提示
  ctx.font = `${12 * scale}px sans-serif`;
  ctx.fillStyle = '#666';
  ctx.fillText('每日0点刷新', W / 2 * scale, (capsuleBottom + 25) * scale);
  
  // 任务列表
  const startY = capsuleBottom + 60;
  const taskHeight = 90;
  const taskSpacing = 10;
  
  dailyTaskState.tasks.forEach((task, i) => {
    const ty = startY + i * (taskHeight + taskSpacing);
    
    // 任务卡片背景
    ctx.fillStyle = task.claimed ? 'rgba(200,200,200,0.6)' : 'rgba(255,255,255,0.8)';
    roundRect(20 * scale, ty * scale, (W - 40) * scale, taskHeight * scale, 12 * scale);
    ctx.fill();
    
    // 边框
    ctx.strokeStyle = task.progress >= task.target ? '#4CAF50' : 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 2 * scale;
    roundRect(20 * scale, ty * scale, (W - 40) * scale, taskHeight * scale, 12 * scale);
    ctx.stroke();
    
    // Emoji
    ctx.font = `${36 * scale}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(task.emoji, 55 * scale, (ty + 35) * scale);
    
    // 任务名称
    ctx.fillStyle = task.claimed ? '#999' : '#333';
    ctx.font = `bold ${16 * scale}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(task.name, 85 * scale, (ty + 28) * scale);
    
    // 奖励
    ctx.font = `${13 * scale}px sans-serif`;
    ctx.fillStyle = '#666';
    ctx.fillText(`奖励: ${task.rewardText}`, 85 * scale, (ty + 48) * scale);
    
    // 进度条
    const progressWidth = 120;
    const progressX = 85;
    const progressY = ty + 62;
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    roundRect(progressX * scale, progressY * scale, progressWidth * scale, 14 * scale, 7 * scale);
    ctx.fill();
    
    const progressPct = Math.min(1, task.progress / task.target);
    ctx.fillStyle = task.claimed ? '#aaa' : (progressPct >= 1 ? '#4CAF50' : '#2196F3');
    roundRect(progressX * scale, progressY * scale, (progressWidth * progressPct) * scale, 14 * scale, 7 * scale);
    ctx.fill();
    
    // 进度文字
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${10 * scale}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.min(task.progress, task.target)}/${task.target}`, (progressX + progressWidth / 2) * scale, (progressY + 7) * scale);
    
    // 领取按钮
    const btnX = W - 90;
    const btnY = ty + 30;
    if (task.claimed) {
      ctx.fillStyle = '#aaa';
      roundRect(btnX * scale, btnY * scale, 60 * scale, 32 * scale, 8 * scale);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${12 * scale}px sans-serif`;
      ctx.fillText('已领取', (btnX + 30) * scale, (btnY + 16) * scale);
    } else if (task.progress >= task.target) {
      ctx.fillStyle = '#4CAF50';
      roundRect(btnX * scale, btnY * scale, 60 * scale, 32 * scale, 8 * scale);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${12 * scale}px sans-serif`;
      ctx.fillText('领取', (btnX + 30) * scale, (btnY + 16) * scale);
    } else {
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      roundRect(btnX * scale, btnY * scale, 60 * scale, 32 * scale, 8 * scale);
      ctx.fill();
      ctx.fillStyle = '#999';
      ctx.font = `bold ${12 * scale}px sans-serif`;
      ctx.fillText('未完成', (btnX + 30) * scale, (btnY + 16) * scale);
    }
  });
  
  // 返回按钮
  const safeBottom = systemInfo.safeArea ? (H - systemInfo.safeArea.bottom) : 20;
  const bottomY = H - Math.max(safeBottom, 15) - 45;
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  roundRect(15 * scale, bottomY * scale, 80 * scale, 36 * scale, 10 * scale);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${14 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('← 返回', 55 * scale, (bottomY + 18) * scale);
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
