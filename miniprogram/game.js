/**
 * 小岛物语 - 微信小程序版
 * 完全复刻 Phaser 版本
 */

// 加载适配器
require('./js/libs/weapp-adapter.js');

// 获取主 canvas
const canvas = wx.createCanvas();
const systemInfo = wx.getSystemInfoSync();

// 游戏配置
const GameConfig = {
  WIDTH: 720,
  HEIGHT: 1280,
};

// 缩放适配
const scaleX = systemInfo.windowWidth / GameConfig.WIDTH;
const scaleY = systemInfo.windowHeight / GameConfig.HEIGHT;
const scale = Math.min(scaleX, scaleY);

// 设置 canvas 尺寸
canvas.width = systemInfo.windowWidth;
canvas.height = systemInfo.windowHeight;

// 获取 2D 上下文
const ctx = canvas.getContext('2d');

// ===================
// 物品配置 (完全复刻)
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

// 仓库掉落物
const WAREHOUSE_DROPS = [
  { key: 'wood1', weight: 22 },
  { key: 'stone1', weight: 22 },
  { key: 'food1', weight: 22 },
  { key: 'ore1', weight: 16 },
  { key: 'cloth1', weight: 12 },
  { key: 'tool1', weight: 10 },
  { key: 'coin1', weight: 1 },
];

// 颜色配置
const TIER_COLORS = [
  '#607d8b', '#8d6e63', '#66bb6a', '#42a5f5', 
  '#ab47bc', '#ffa726', '#ef5350', '#ec407a', '#ffee58'
];

const TIER_BADGE_COLORS = [
  '#607d8b', '#795548', '#4caf50', '#2196f3',
  '#9c27b0', '#ff9800', '#f44336', '#e91e63', '#ffc107'
];

// ===================
// 网格配置 (复刻)
// ===================
const GRID_COLS = 6;
const GRID_ROWS = 7;
const CELL_SIZE = 85;
let gridOffsetX = 0;
let gridOffsetY = 0;

// 计算居中位置
function calcGridPosition() {
  const gridWidth = GRID_COLS * CELL_SIZE;
  const gridHeight = GRID_ROWS * CELL_SIZE;
  gridOffsetX = (GameConfig.WIDTH - gridWidth) / 2;
  const availableHeight = GameConfig.HEIGHT - 120 - 100;
  gridOffsetY = 120 + (availableHeight - gridHeight) / 2;
}

// ===================
// 游戏状态
// ===================
let gameState = {
  items: [],
  energy: 10000,
  maxEnergy: 10000,
  coins: 500,
  wood: 100,
  stone: 50,
  nextId: 1,
  selectedItem: null,
};

// ===================
// 存档管理
// ===================
function saveGame() {
  const saveData = {
    items: gameState.items.map(i => ({ key: i.config.key, x: i.x, y: i.y })),
    energy: gameState.energy,
    coins: gameState.coins,
    wood: gameState.wood,
    stone: gameState.stone,
    nextId: gameState.nextId,
  };
  wx.setStorageSync('island_game_merge', JSON.stringify(saveData));
}

function loadGame() {
  try {
    const data = wx.getStorageSync('island_game_merge');
    if (data) {
      const save = JSON.parse(data);
      gameState.energy = save.energy !== undefined ? save.energy : 10000;
      gameState.coins = save.coins !== undefined ? save.coins : 500;
      gameState.wood = save.wood !== undefined ? save.wood : 100;
      gameState.stone = save.stone !== undefined ? save.stone : 50;
      gameState.nextId = save.nextId || 1;
      gameState.items = [];
      
      if (save.items && save.items.length > 0) {
        save.items.forEach(item => {
          spawnItem(item.key, item.x, item.y, false);
        });
        return true;
      }
    }
  } catch (e) {
    console.error('Load failed:', e);
  }
  return false;
}

// ===================
// 游戏逻辑
// ===================
function getCellCenter(col, row) {
  return {
    x: gridOffsetX + col * CELL_SIZE + CELL_SIZE / 2,
    y: gridOffsetY + row * CELL_SIZE + CELL_SIZE / 2,
  };
}

function getItemAt(col, row) {
  return gameState.items.find(i => i.x === col && i.y === row);
}

function findEmptyCell() {
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      if (!getItemAt(col, row)) {
        return { col, row };
      }
    }
  }
  return null;
}

function spawnItem(key, col, row, animate = true) {
  const config = ITEMS[key];
  if (!config) return null;
  
  if (getItemAt(col, row)) {
    const empty = findEmptyCell();
    if (!empty) return null;
    col = empty.col;
    row = empty.row;
  }
  
  const item = {
    id: gameState.nextId++,
    config: config,
    x: col,
    y: row,
    scale: animate ? 0 : 1,
    lastClickTime: 0,
  };
  
  gameState.items.push(item);
  return item;
}

function spawnWarehouse(col, row) {
  return spawnItem('warehouse', col, row, false);
}

function removeItem(item) {
  const index = gameState.items.findIndex(i => i.id === item.id);
  if (index >= 0) {
    gameState.items.splice(index, 1);
  }
}

function clickWarehouse() {
  // 先检查空位
  const empty = findEmptyCell();
  if (!empty) {
    showInfo('❌ 没有空位了！先合成一些物品');
    return;
  }
  
  // 再检查体力
  if (gameState.energy <= 0) {
    showInfo('❌ 体力不足！');
    return;
  }
  
  gameState.energy--;
  
  // 随机选择物品
  const total = WAREHOUSE_DROPS.reduce((sum, d) => sum + d.weight, 0);
  let rand = Math.random() * total;
  let selected = WAREHOUSE_DROPS[0].key;
  
  for (const drop of WAREHOUSE_DROPS) {
    rand -= drop.weight;
    if (rand <= 0) {
      selected = drop.key;
      break;
    }
  }
  
  const item = spawnItem(selected, empty.col, empty.row);
  if (item) {
    showInfo(`获得 ${item.config.emoji} ${item.config.name}！`);
  }
  saveGame();
}

function tryMerge(item1, item2) {
  if (item1.config.key !== item2.config.key) return false;
  if (!item1.config.mergeInto) return false;
  
  const newKey = item1.config.mergeInto;
  const x = item2.x;
  const y = item2.y;
  
  removeItem(item1);
  removeItem(item2);
  
  const newItem = spawnItem(newKey, x, y);
  if (newItem) {
    showInfo(`✨ 合成了 ${newItem.config.emoji} ${newItem.config.name}！`);
    // 创建合成特效
    createMergeEffect(getCellCenter(x, y));
  }
  
  saveGame();
  return true;
}

function collectCoin(item) {
  if (!item.config.value) return;
  
  gameState.coins += item.config.value;
  removeItem(item);
  showInfo(`💰 +${item.config.value} 金币！`);
  saveGame();
}

// 特效
let effects = [];

function createMergeEffect(pos) {
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    effects.push({
      x: pos.x,
      y: pos.y,
      vx: Math.cos(angle) * 3,
      vy: Math.sin(angle) * 3,
      life: 1,
      emoji: '✨',
    });
  }
}

// 信息提示
let infoMessage = '';
let infoTimer = null;

function showInfo(msg) {
  infoMessage = msg;
  if (infoTimer) clearTimeout(infoTimer);
  infoTimer = setTimeout(() => {
    infoMessage = '';
  }, 2000);
}

// ===================
// 触摸处理
// ===================
function handleTouch(touchX, touchY) {
  // 转换到游戏坐标
  const x = touchX / scale;
  const y = touchY / scale;
  
  // 检查返回按钮
  if (x >= 15 && x <= 105 && y >= GameConfig.HEIGHT - 140 && y <= GameConfig.HEIGHT - 100) {
    // 返回主菜单（小程序中可以考虑其他处理）
    showInfo('小程序版暂无主菜单');
    return;
  }
  
  // 检查点击了哪个物品
  for (const item of gameState.items) {
    const pos = getCellCenter(item.x, item.y);
    const halfSize = 35 * item.scale;
    
    if (x >= pos.x - halfSize && x <= pos.x + halfSize &&
        y >= pos.y - halfSize && y <= pos.y + halfSize) {
      
      // 仓库
      if (item.config.key === 'warehouse') {
        clickWarehouse();
        gameState.selectedItem = null;
        return;
      }
      
      // 金币 - 直接收集
      if (item.config.value && !item.config.mergeInto) {
        collectCoin(item);
        gameState.selectedItem = null;
        return;
      }
      
      const now = Date.now();
      
      if (gameState.selectedItem) {
        if (gameState.selectedItem.id === item.id) {
          // 双击检测 - 收集金币
          if (now - item.lastClickTime < 500 && item.config.value) {
            collectCoin(item);
            gameState.selectedItem = null;
            return;
          }
          // 取消选中
          gameState.selectedItem = null;
        } else if (tryMerge(gameState.selectedItem, item)) {
          // 合成成功
          gameState.selectedItem = null;
        } else {
          // 选择新物品
          gameState.selectedItem = item;
        }
      } else {
        gameState.selectedItem = item;
      }
      
      item.lastClickTime = now;
      return;
    }
  }
  
  gameState.selectedItem = null;
}

wx.onTouchStart(function(e) {
  if (e.touches.length > 0) {
    const touch = e.touches[0];
    handleTouch(touch.clientX, touch.clientY);
  }
});

// ===================
// 渲染
// ===================
function render() {
  // 清屏并绘制背景
  drawBackground();
  
  // 顶部UI
  drawTopUI();
  
  // 网格
  drawGrid();
  
  // 物品
  drawItems();
  
  // 特效
  drawEffects();
  
  // 底部信息栏
  drawBottomUI();
  
  // 返回按钮
  drawBackButton();
  
  requestAnimationFrame(render);
}

function drawBackground() {
  // 天空渐变
  for (let y = 0; y < GameConfig.HEIGHT / 2; y += 4) {
    const ratio = y / (GameConfig.HEIGHT / 2);
    const r = Math.floor(135 + (100 - 135) * ratio);
    const g = Math.floor(206 + (180 - 206) * ratio);
    const b = Math.floor(235 + (220 - 235) * ratio);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, y * scale, GameConfig.WIDTH * scale, 4 * scale);
  }
  
  // 草地渐变
  for (let y = GameConfig.HEIGHT / 2; y < GameConfig.HEIGHT; y += 4) {
    const ratio = (y - GameConfig.HEIGHT / 2) / (GameConfig.HEIGHT / 2);
    const r = Math.floor(76 + (45 - 76) * ratio);
    const g = Math.floor(140 + (90 - 140) * ratio);
    const b = Math.floor(80 + (50 - 80) * ratio);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, y * scale, GameConfig.WIDTH * scale, 4 * scale);
  }
  
  // 天空装饰
  ctx.font = `${40 * scale}px sans-serif`;
  ctx.globalAlpha = 0.6;
  ctx.fillText('☁️', 50 * scale, 180 * scale);
  ctx.fillText('☁️', 280 * scale, 200 * scale);
  ctx.fillText('☁️', 550 * scale, 175 * scale);
  ctx.globalAlpha = 0.8;
  ctx.font = `${50 * scale}px sans-serif`;
  ctx.fillText('☀️', 650 * scale, 220 * scale);
  ctx.globalAlpha = 1;
  
  // 草地装饰 (简化版)
  ctx.globalAlpha = 0.7;
  ctx.font = `${50 * scale}px sans-serif`;
  ctx.fillText('🌳', 20 * scale, 700 * scale);
  ctx.fillText('🌴', 650 * scale, 720 * scale);
  ctx.fillText('🌲', 15 * scale, 1000 * scale);
  ctx.fillText('🌳', 640 * scale, 1020 * scale);
  ctx.font = `${24 * scale}px sans-serif`;
  ctx.fillText('🌸', 80 * scale, 750 * scale);
  ctx.fillText('🌷', 620 * scale, 780 * scale);
  ctx.fillText('🌻', 50 * scale, 900 * scale);
  ctx.fillText('🌺', 660 * scale, 920 * scale);
  ctx.fillText('🦋', 100 * scale, 850 * scale);
  ctx.fillText('🐰', 600 * scale, 1050 * scale);
  ctx.globalAlpha = 1;
}

function drawTopUI() {
  // 顶部面板背景
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  roundRect(10 * scale, 10 * scale, (GameConfig.WIDTH - 20) * scale, 110 * scale, 15 * scale);
  ctx.fill();
  
  // 标题
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${28 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🏝️ 小岛物语', GameConfig.WIDTH / 2 * scale, 35 * scale);
  
  // 资源条背景
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  roundRect(30 * scale, 67 * scale, (GameConfig.WIDTH - 60) * scale, 36 * scale, 10 * scale);
  ctx.fill();
  
  // 体力
  ctx.font = `bold ${20 * scale}px sans-serif`;
  ctx.fillStyle = '#ffff00';
  ctx.fillText(`⚡ ${gameState.energy}`, 100 * scale, 85 * scale);
  
  // 金币
  ctx.fillStyle = '#ffd700';
  ctx.fillText(`💰 ${gameState.coins}`, 250 * scale, 85 * scale);
  
  // 木材
  ctx.fillStyle = '#deb887';
  ctx.fillText(`🪵 ${gameState.wood}`, 420 * scale, 85 * scale);
  
  // 石材
  ctx.fillStyle = '#c0c0c0';
  ctx.fillText(`🪨 ${gameState.stone}`, 570 * scale, 85 * scale);
}

function drawGrid() {
  // 网格整体背景
  const gridWidth = GRID_COLS * CELL_SIZE;
  const gridHeight = GRID_ROWS * CELL_SIZE;
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  roundRect(
    (gridOffsetX - 10) * scale,
    (gridOffsetY - 10) * scale,
    (gridWidth + 20) * scale,
    (gridHeight + 20) * scale,
    15 * scale
  );
  ctx.fill();
  
  // 单元格
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const x = gridOffsetX + col * CELL_SIZE;
      const y = gridOffsetY + row * CELL_SIZE;
      
      // 棋盘格效果
      const isLight = (row + col) % 2 === 0;
      ctx.fillStyle = isLight ? 'rgba(255,255,255,0.15)' : 'rgba(224,224,224,0.15)';
      roundRect((x + 2) * scale, (y + 2) * scale, (CELL_SIZE - 4) * scale, (CELL_SIZE - 4) * scale, 8 * scale);
      ctx.fill();
      
      // 边框
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1 * scale;
      roundRect((x + 2) * scale, (y + 2) * scale, (CELL_SIZE - 4) * scale, (CELL_SIZE - 4) * scale, 8 * scale);
      ctx.stroke();
    }
  }
}

function drawItems() {
  for (const item of gameState.items) {
    // 更新动画
    if (item.scale < 1) {
      item.scale = Math.min(1, item.scale + 0.1);
    }
    
    const pos = getCellCenter(item.x, item.y);
    const cardSize = 70 * item.scale;
    const halfCard = cardSize / 2;
    
    // 选中高亮
    if (gameState.selectedItem && gameState.selectedItem.id === item.id) {
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 4 * scale;
      roundRect(
        (pos.x - halfCard - 5) * scale,
        (pos.y - halfCard - 5) * scale,
        (cardSize + 10) * scale,
        (cardSize + 10) * scale,
        18 * scale
      );
      ctx.stroke();
    }
    
    // 卡片阴影
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    roundRect(
      (pos.x - halfCard + 4) * scale,
      (pos.y - halfCard + 4) * scale,
      cardSize * scale,
      cardSize * scale,
      16 * scale
    );
    ctx.fill();
    
    // 卡片背景
    ctx.fillStyle = TIER_COLORS[item.config.tier] || '#607d8b';
    roundRect(
      (pos.x - halfCard) * scale,
      (pos.y - halfCard) * scale,
      cardSize * scale,
      cardSize * scale,
      16 * scale
    );
    ctx.fill();
    
    // 卡片边框
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 3 * scale;
    roundRect(
      (pos.x - halfCard) * scale,
      (pos.y - halfCard) * scale,
      cardSize * scale,
      cardSize * scale,
      16 * scale
    );
    ctx.stroke();
    
    // 内部高光
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    roundRect(
      (pos.x - halfCard + 6) * scale,
      (pos.y - halfCard + 6) * scale,
      (cardSize - 12) * scale,
      (cardSize / 2 - 6) * scale,
      10 * scale
    );
    ctx.fill();
    
    // Emoji
    ctx.font = `${36 * item.scale * scale}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.config.emoji, pos.x * scale, pos.y * scale);
    
    // 等级徽章
    if (item.config.tier > 0) {
      const badgeX = pos.x + halfCard - 8;
      const badgeY = pos.y - halfCard + 8;
      
      ctx.beginPath();
      ctx.arc(badgeX * scale, badgeY * scale, 14 * scale, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(badgeX * scale, badgeY * scale, 12 * scale, 0, Math.PI * 2);
      ctx.fillStyle = TIER_BADGE_COLORS[item.config.tier];
      ctx.fill();
      
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${14 * scale}px sans-serif`;
      ctx.fillText(item.config.tier.toString(), badgeX * scale, badgeY * scale);
    }
  }
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
    ctx.fillText(e.emoji, e.x * scale, e.y * scale);
    ctx.globalAlpha = 1;
  }
}

function drawBottomUI() {
  // 底部信息栏
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  roundRect(20 * scale, (GameConfig.HEIGHT - 80) * scale, (GameConfig.WIDTH - 40) * scale, 50 * scale, 12 * scale);
  ctx.fill();
  
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${18 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const info = infoMessage || '点击仓库获取物品，点击两个相同物品合成！';
  ctx.fillText(info, GameConfig.WIDTH / 2 * scale, (GameConfig.HEIGHT - 55) * scale);
}

function drawBackButton() {
  // 返回按钮背景
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  roundRect(15 * scale, (GameConfig.HEIGHT - 140) * scale, 90 * scale, 40 * scale, 10 * scale);
  ctx.fill();
  
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${18 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('← 返回', 60 * scale, (GameConfig.HEIGHT - 120) * scale);
}

// 圆角矩形辅助函数
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
// 游戏启动
// ===================
function startGame() {
  calcGridPosition();
  
  if (!loadGame()) {
    // 新游戏 - 初始化
    spawnWarehouse(2, 3);
    spawnItem('wood1', 0, 0, false);
    spawnItem('wood1', 1, 0, false);
    spawnItem('stone1', 0, 1, false);
    saveGame();
  }
  
  showInfo('点击仓库获取物品，点击两个相同物品合成！');
  render();
}

startGame();
