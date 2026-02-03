// 云函数 - 存档管理
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { action, data } = event;
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  
  if (!openid) {
    return { success: false, error: 'No openid' };
  }
  
  const collection = db.collection('user_saves');
  
  try {
    if (action === 'save') {
      // 保存存档
      const existing = await collection.where({ openid }).get();
      
      if (existing.data.length > 0) {
        // 更新
        await collection.where({ openid }).update({
          data: {
            saveData: data,
            updateTime: db.serverDate()
          }
        });
      } else {
        // 新建
        await collection.add({
          data: {
            openid,
            saveData: data,
            createTime: db.serverDate(),
            updateTime: db.serverDate()
          }
        });
      }
      return { success: true };
      
    } else if (action === 'load') {
      // 读取存档
      const result = await collection.where({ openid }).get();
      
      if (result.data.length > 0) {
        return { success: true, data: result.data[0].saveData };
      } else {
        return { success: true, data: null };
      }
      
    } else {
      return { success: false, error: 'Unknown action' };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
};
