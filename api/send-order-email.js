const nodemailer = require('nodemailer');
require('dotenv').config();
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

    // 格式化订单日期
    const orderDate = new Date(orderData.date).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });

    // 生成订单项列表HTML
    const itemsHTML = orderData.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">¥${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">¥${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    // 邮件HTML内容
    const mailHtml = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; background-color: #fff; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #fc8eac; margin: 0; font-size: 24px;">少女Elenaの菜单</h1>
          <p style="color: #999; font-size: 14px; margin: 5px 0;">您的订单已确认</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <p style="margin: 5px 0;"><strong>订单号:</strong> #${Math.floor(Math.random() * 10000)}</p>
          <p style="margin: 5px 0;"><strong>订单时间:</strong> ${orderDate}</p>
          <p style="margin: 5px 0;"><strong>总金额:</strong> ¥${orderData.totalPrice.toFixed(2)}</p>
        </div>
        
        <h2 style="font-size: 18px; margin: 0 0 15px; color: #fc8eac;">订单详情</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="padding: 10px; text-align: left;">商品</th>
              <th style="padding: 10px; text-align: center;">数量</th>
              <th style="padding: 10px; text-align: right;">单价</th>
              <th style="padding: 10px; text-align: right;">小计</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">总计:</td>
              <td style="padding: 10px; text-align: right; font-weight: bold;">¥${orderData.totalPrice.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        
        <div style="background-color: #fff5f7; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #fc8eac;">
          <p style="margin: 0; color: #666;">感谢您的订购! 如有任何问题，请随时联系我们。</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          <p>此邮件由系统自动发送，请勿直接回复</p>
          <p>&copy; 2023 少女Elenaの菜单 - 版权所有</p>
        </div>
      </div>
    `;

    // 发送邮件
    await transporter.sendMail({
      from: '"少女Elenaの菜单" <265920579@qq.com>',
      to: email,
      subject: '您的订单已确认 - 少女Elenaの菜单',
      html: mailHtml
    });

    // 返回成功响应
    return res.status(200).json({ message: '订单确认邮件已发送' });
  } catch (error) {
    console.error('发送邮件时出错:', error);
    return res.status(500).json({ error: '发送邮件失败' });
  }
};

// 导出处理函数
module.exports = allowCors(handler); 