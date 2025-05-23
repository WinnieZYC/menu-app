const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');

// 加载环境变量
dotenv.config();

// 处理CORS
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

// 处理请求
const handler = async (req, res) => {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只允许POST请求' });
  }

  try {
    const { email, orderData } = req.body;

    // 验证必填字段
    if (!email || !orderData) {
      return res.status(400).json({ error: '邮箱和订单数据为必填项' });
    }

    // 验证环境变量
    if (!process.env.EMAIL_PASS) {
      console.error('EMAIL_PASS环境变量未设置');
      return res.status(500).json({ error: '邮箱授权码未配置，请联系管理员' });
    }

    // 创建邮件传输器
    const transporter = nodemailer.createTransport({
      host: 'smtp.qq.com',
      port: 465,
      secure: true,
      auth: {
        user: '265920579@qq.com', // QQ邮箱
        pass: process.env.EMAIL_PASS // QQ邮箱授权码
      }
    });

    // 简化的邮件内容
    const orderSummary = orderData.items.map(item => 
      `${item.name} × ${item.quantity} = ¥${(item.price * item.quantity).toFixed(2)}`
    ).join('<br>');

    const totalPrice = orderData.total || orderData.totalPrice || 0;

    // 发送邮件
    const result = await transporter.sendMail({
      from: '"少女Elenaの菜单" <265920579@qq.com>',
      to: email,
      subject: '您的订单已确认 - 少女Elenaの菜单',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
          <h1 style="color: #fc8eac;">订单确认</h1>
          <p>感谢您的订购！以下是您的订单明细：</p>
          <div style="margin: 20px 0; padding: 10px; background-color: #f9f9f9;">
            ${orderSummary}
            <hr>
            <p><strong>总计: ¥${totalPrice.toFixed(2)}</strong></p>
          </div>
          <p>我们将尽快处理您的订单！</p>
          <p>-- 少女Elenaの菜单团队</p>
        </div>
      `
    });

    console.log('邮件发送成功:', result);
    return res.status(200).json({ message: '订单确认邮件已发送', messageId: result.messageId });
  } catch (error) {
    console.error('发送邮件时出错:', error);
    return res.status(500).json({ 
      error: '发送邮件失败', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// 导出处理函数
module.exports = allowCors(handler); 