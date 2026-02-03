// 排行榜云函数
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { action, data } = event;
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  switch (action) {
    case 'submit':
      return await submitScore(openid, data);
    case 'getRank':
      return await getRankings(data);
    case 'getMyRank':
      return await getMyRank(openid, data);
    default:
      return { success: false, error: 'Unknown action' };
  }
};

// 提交分数
async function submitScore(openid, data) {
  const { type, score, level, nickname, avatar } = data;
  // type: 'match3_score' | 'match3_level' | 'merge_coin' | 'puppy_love'
  
  try {
    const collection = db.collection('leaderboard');
    
    // 查找是否已有记录
    const existing = await collection.where({
      openid,
      type
    }).get();
    
    if (existing.data.length > 0) {
      const record = existing.data[0];
      // 只更新更高的分数
      if (score > record.score) {
        await collection.doc(record._id).update({
          data: {
            score,
            level: level || record.level,
            nickname: nickname || record.nickname,
            avatar: avatar || record.avatar,
            updateTime: db.serverDate()
          }
        });
      }
    } else {
      // 新建记录
      await collection.add({
        data: {
          openid,
          type,
          score,
          level: level || 1,
          nickname: nickname || '匿名玩家',
          avatar: avatar || '',
          createTime: db.serverDate(),
          updateTime: db.serverDate()
        }
      });
    }
    
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// 获取排行榜
async function getRankings(data) {
  const { type, limit = 50 } = data;
  
  try {
    const result = await db.collection('leaderboard')
      .where({ type })
      .orderBy('score', 'desc')
      .limit(limit)
      .get();
    
    return {
      success: true,
      rankings: result.data.map((item, index) => ({
        rank: index + 1,
        nickname: item.nickname,
        avatar: item.avatar,
        score: item.score,
        level: item.level
      }))
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// 获取自己的排名
async function getMyRank(openid, data) {
  const { type } = data;
  
  try {
    // 获取自己的分数
    const myRecord = await db.collection('leaderboard')
      .where({ openid, type })
      .get();
    
    if (myRecord.data.length === 0) {
      return { success: true, rank: -1, score: 0 };
    }
    
    const myScore = myRecord.data[0].score;
    
    // 数比我高的人数
    const higherCount = await db.collection('leaderboard')
      .where({
        type,
        score: _.gt(myScore)
      })
      .count();
    
    return {
      success: true,
      rank: higherCount.total + 1,
      score: myScore,
      nickname: myRecord.data[0].nickname
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
