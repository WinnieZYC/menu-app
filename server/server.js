const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json());

// 创建邮件发送器
const transporter = nodemailer.createTransport({
  service: 'qq',
  port: 465,
  secure: true,
  auth: {
    user: '1069256197@qq.com', // 替换为您的QQ邮箱
    pass: process.env.EMAIL_PASS // 使用环境变量存储授权码
  }
});

// 验证发送器配置
transporter.verify((error, success) => {
  if (error) {
    console.error('邮件配置错误:', error);
  } else {
    console.log('服务器已就绪，可以发送邮件');
  }
});

// 发送订单确认邮件的API
app.post('/api/send-order-email', async (req, res) => {
  const { email, orderData } = req.body;
  
  if (!email || !orderData) {
    return res.status(400).json({ success: false, message: '缺少必要参数' });
  }

  try {
    // 格式化订单日期
    const orderDate = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // 生成菜品列表
    const itemsList = orderData.items.map(item => 
      `<tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">¥${(item.price * item.quantity).toFixed(2)}</td>
       </tr>`
    ).join('');

    // 邮件内容
    const mailOptions = {
      from: '"少女Elenaの菜单" <1069256197@qq.com>',
      to: '1069256197@qq.com', // 固定收件人邮箱
      subject: '✨ 您的订单已确认 - 少女Elenaの菜单',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
          <h2 style="color: #ff6b81; text-align: center; margin-bottom: 20px;">🌸 订单确认 🌸</h2>
          
          <p style="color: #555;">亲爱的顾客：</p>
          
          <p style="color: #555;">感谢您在少女Elenaの菜单下单！您的订单已成功确认，详情如下：</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>订单编号:</strong> #${orderData.id}</p>
            <p><strong>订单时间:</strong> ${orderDate}</p>
            <p><strong>总金额:</strong> ¥${orderData.total.toFixed(2)}</p>
          </div>
          
          <h3 style="color: #ff6b81; border-bottom: 2px solid #ff6b81; padding-bottom: 8px;">订单详情</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #ff6b8120;">
              <th style="padding: 10px; text-align: left;">菜品名称</th>
              <th style="padding: 10px; text-align: left;">数量</th>
              <th style="padding: 10px; text-align: left;">价格</th>
            </tr>
            ${itemsList}
            <tr style="background-color: #f9f9f9;">
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">总计:</td>
              <td style="padding: 10px; font-weight: bold;">¥${orderData.total.toFixed(2)}</td>
            </tr>
          </table>
          
          <p style="color: #555; margin-top: 20px;">如有任何疑问，请随时与我们联系。</p>
          
          <div style="text-align: center; margin-top: 30px; color: #888; font-size: 12px;">
            <p>💖 少女Elenaの菜单 - 为您提供最美味的体验 💖</p>
          </div>
        </div>
      `
    };

    // 发送邮件
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: '订单确认邮件已发送' });
  } catch (error) {
    console.error('发送邮件失败:', error);
    res.status(500).json({ success: false, message: '发送邮件失败', error: error.message });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
}); 