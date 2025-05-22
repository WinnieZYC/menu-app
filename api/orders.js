// Vercel API路由 - 订单处理
const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

// 内存中的订单存储
const orders = [];

// 处理请求
const handler = async (req, res) => {
  if (req.method === 'GET') {
    // 获取所有订单
    return res.status(200).json(orders);
  } else if (req.method === 'POST') {
    // 创建新订单
    try {
      const { orderData } = req.body;
      
      if (!orderData) {
        return res.status(400).json({ error: '订单数据为必填项' });
      }
      
      // 生成订单ID和时间戳
      const orderId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      const createdOrder = {
        id: orderId,
        ...orderData,
        createdAt: new Date().toISOString()
      };
      
      // 存储订单
      orders.push(createdOrder);
      
      return res.status(201).json({ 
        message: '订单创建成功',
        order: createdOrder
      });
    } catch (error) {
      console.error('创建订单时出错:', error);
      return res.status(500).json({ error: '创建订单失败' });
    }
  } else {
    return res.status(405).json({ error: '不支持的请求方法' });
  }
};

// 导出处理函数
module.exports = allowCors(handler); 