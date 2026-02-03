/**
 * 小岛物语 - 微信小程序入口
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
canvas.width = GameConfig.WIDTH * scale;
canvas.height = GameConfig.HEIGHT * scale;

// 获取 2D 上下文
const ctx = canvas.getContext('2d');
ctx.scale(scale, scale);

// ===================
// 游戏数据
// ===================
const ITEMS = {
  warehouse: { key: 'warehouse', name: '仓库', emoji: '🏠', tier: 0 },
  wood1: { key: 'wood1', name: '木屑', emoji: '🪵', tier: 1, mergeInto: 'wood2' },
  wood2: { key: 'wood2', name: '木材', emoji: '🪵', tier: 2, mergeInto: 'wood3' },
  wood3: { key: 'wood3', name: '木板', emoji: '🪵', tier: 3, mergeInto: 'wood4' },
  wood4: { key: 'wood4', name: '优质木材', emoji: '🪵', tier: 4, value: 50 },
  stone1: { key: 'stone1', name: '碎石', emoji: '🪨', tier: 1, mergeInto: 'stone2' },
  stone2: { key: 'stone2', name: '石块', emoji: '🪨', tier: 2, mergeInto: 'stone3' },
  stone3: { key: 'stone3', name: '石材', emoji: '🪨', tier: 3, mergeInto: 'stone4' },
  stone4: { key: 'stone4', name: '优质石材', emoji: '🪨', tier: 4, value: 80 },
  seed1: { key: 'seed1', name: '种子', emoji: '🌱', tier: 1, mergeInto: 'seed2' },
  seed2: { key: 'seed2', name: '幼苗', emoji: '🌿', tier: 2, mergeInto: 'seed3' },
  seed3: { key: 'seed3', name: '小树', emoji: '🌳', tier: 3, mergeInto: 'seed4' },
  seed4: { key: 'seed4', name: '大树', emoji: '🌳', tier: 4, value: 100 },
  tool1: { key: 'tool1', name: '破旧工具', emoji: '🔧', tier: 1, mergeInto: 'tool2' },
  tool2: { key: 'tool2', name: '普通工具', emoji: '🔨', tier: 2, mergeInto: 'tool3' },
  tool3: { key: 'tool3', name: '精良工具', emoji: '⚒️', tier: 3, value: 60 },
  brick1: { key: 'brick1', name: '粘土', emoji: '🧱', tier: 1, mergeInto: 'brick2' },
  brick2: { key: 'brick2', name: '砖块', emoji: '🧱', tier: 2, mergeInto: 'brick3' },
  brick3: { key: 'brick3', name: '红砖', emoji: '🧱', tier: 3, value: 45 },
};

const WAREHOUSE_DROPS = [
  { key: 'wood1', weight: 30 },
  { key: 'stone1', weight: 25 },
  { key: 'seed1', weight: 20 },
  { key: 'tool1', weight: 15 },
  { key: 'brick1', weight: 10 },
];

// 游戏状态
let gameState = {
  items: [],
  energy: 10000,
  maxEnergy: 10000,
  coins: 500,
  nextId: 1,
  selectedItem: null,
};

// 网格配置
const GRID_COLS = 6;
const GRID_ROWS = 7;
const CELL_SIZE = 85;
const GRID_OFFSET_X = (GameConfig.WIDTH - GRID_COLS * CELL_SIZE) / 2;
const GRID_OFFSET_Y = (GameConfig.HEIGHT - GRID_ROWS * CELL_SIZE) / 2;

// 颜色配置
const TIER_COLORS = [
  '#607d8b', '#8d6e63', '#66bb6a', '#42a5f5', 
  '#ab47bc', '#ffa726', '#ef5350', '#ec407a', '#ffee58'
];

// ===================
// 存档管理
// ===================
function saveGame() {
  const saveData = {
    items: gameState.items.map(i => ({ key: i.config.key, x: i.x, y: i.y })),
    energy: gameState.energy,
    coins: gameState.coins,
    nextId: gameState.nextId,
  };
  wx.setStorageSync('island_game_save', JSON.stringify(saveData));
}

function loadGame() {
  try {
    const data = wx.getStorageSync('island_game_save');
    if (data) {
      const save = JSON.parse(data);
      gameState.energy = save.energy || 10000;
      gameState.coins = save.coins || 500;
      gameState.nextId = save.nextId || 1;
      gameState.items = [];
      
      save.items.forEach(item => {
        spawnItem(item.key, item.x, item.y, false);
      });
      return true;
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
    x: GRID_OFFSET_X + col * CELL_SIZE + CELL_SIZE / 2,
    y: GRID_OFFSET_Y + row * CELL_SIZE + CELL_SIZE / 2,
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
  };
  
  gameState.items.push(item);
  return item;
}

function removeItem(item) {
  const index = gameState.items.findIndex(i => i.id === item.id);
  if (index >= 0) {
    gameState.items.splice(index, 1);
  }
}

function clickWarehouse() {
  const empty = findEmptyCell();
  if (!empty) {
    showInfo('没有空位了！');
    return;
  }
  
  if (gameState.energy <= 0) {
    showInfo('体力不足！');
    return;
  }
  
  gameState.energy--;
  
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
  
  spawnItem(selected, empty.col, empty.row);
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
  spawnItem(newKey, x, y);
  
  saveGame();
  return true;
}

function sellItem(item) {
  if (!item.config.value) return;
  
  gameState.coins += item.config.value;
  removeItem(item);
  showInfo(`+${item.config.value} 金币`);
  saveGame();
}

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
function handleTouch(x, y) {
  // 转换坐标
  x = x / scale;
  y = y / scale;
  
  // 检查点击了哪个物品
  for (const item of gameState.items) {
    const pos = getCellCenter(item.x, item.y);
    const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
    
    if (dist < CELL_SIZE / 2) {
      if (item.config.key === 'warehouse') {
        clickWarehouse();
        return;
      }
      
      if (gameState.selectedItem) {
        if (gameState.selectedItem.id === item.id) {
          // 双击卖出
          if (item.config.value) {
            sellItem(item);
          }
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
      return;
    }
  }
  
  gameState.selectedItem = null;
}

wx.onTouchEnd(function(e) {
  if (e.changedTouches.length > 0) {
    const touch = e.changedTouches[0];
    handleTouch(touch.clientX, touch.clientY);
  }
});

// ===================
// 渲染
// ===================
function render() {
  // 清屏
  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(0, 0, GameConfig.WIDTH, GameConfig.HEIGHT / 2);
  
  // 草地
  ctx.fillStyle = '#4c8c50';
  ctx.fillRect(0, GameConfig.HEIGHT / 2, GameConfig.WIDTH, GameConfig.HEIGHT / 2);
  
  // 云朵
  ctx.font = '40px sans-serif';
  ctx.globalAlpha = 0.6;
  ctx.fillText('☁️', 50, 180);
  ctx.fillText('☁️', 300, 200);
  ctx.fillText('☁️', 550, 170);
  ctx.globalAlpha = 1;
  
  // 太阳
  ctx.font = '50px sans-serif';
  ctx.fillText('☀️', 620, 200);
  
  // 顶部UI
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  roundRect(ctx, 10, 10, GameConfig.WIDTH - 20, 100, 15);
  ctx.fill();
  
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🏝️ 小岛物语', GameConfig.WIDTH / 2, 50);
  
  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = '#ffff00';
  ctx.fillText(`⚡ ${gameState.energy}`, 100, 90);
  ctx.fillStyle = '#ffd700';
  ctx.fillText(`💰 ${gameState.coins}`, 300, 90);
  
  // 网格背景
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  roundRect(ctx, GRID_OFFSET_X - 10, GRID_OFFSET_Y - 10, 
    GRID_COLS * CELL_SIZE + 20, GRID_ROWS * CELL_SIZE + 20, 15);
  ctx.fill();
  
  // 网格
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const x = GRID_OFFSET_X + col * CELL_SIZE;
      const y = GRID_OFFSET_Y + row * CELL_SIZE;
      
      const isLight = (row + col) % 2 === 0;
      ctx.fillStyle = isLight ? 'rgba(255,255,255,0.15)' : 'rgba(224,224,224,0.15)';
      roundRect(ctx, x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4, 8);
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      roundRect(ctx, x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4, 8);
      ctx.stroke();
    }
  }
  
  // 物品
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
      ctx.lineWidth = 4;
      roundRect(ctx, pos.x - halfCard - 5, pos.y - halfCard - 5, cardSize + 10, cardSize + 10, 18);
      ctx.stroke();
    }
    
    // 卡片阴影
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    roundRect(ctx, pos.x - halfCard + 4, pos.y - halfCard + 4, cardSize, cardSize, 14);
    ctx.fill();
    
    // 卡片背景
    ctx.fillStyle = TIER_COLORS[item.config.tier] || '#607d8b';
    roundRect(ctx, pos.x - halfCard, pos.y - halfCard, cardSize, cardSize, 14);
    ctx.fill();
    
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 2;
    roundRect(ctx, pos.x - halfCard, pos.y - halfCard, cardSize, cardSize, 14);
    ctx.stroke();
    
    // Emoji
    ctx.font = `${36 * item.scale}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.config.emoji, pos.x, pos.y);
    
    // 等级徽章
    if (item.config.tier > 0) {
      const badgeX = pos.x + halfCard - 12;
      const badgeY = pos.y - halfCard + 12;
      
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, 12, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, 10, 0, Math.PI * 2);
      ctx.fillStyle = TIER_COLORS[item.config.tier];
      ctx.fill();
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(item.config.tier.toString(), badgeX, badgeY);
    }
  }
  
  // 底部信息栏
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  roundRect(ctx, 20, GameConfig.HEIGHT - 80, GameConfig.WIDTH - 40, 50, 12);
  ctx.fill();
  
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const info = infoMessage || '点击仓库获取物品，点击两个相同物品合成！';
  ctx.fillText(info, GameConfig.WIDTH / 2, GameConfig.HEIGHT - 55);
  
  requestAnimationFrame(render);
}

// 圆角矩形
function roundRect(ctx, x, y, w, h, r) {
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
  if (!loadGame()) {
    // 新游戏
    spawnItem('warehouse', 2, 3, false);
    spawnItem('wood1', 0, 0, false);
    spawnItem('wood1', 1, 0, false);
    spawnItem('stone1', 0, 1, false);
  }
  
  render();
}

startGame();
