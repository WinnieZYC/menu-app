// 简单测试API
module.exports = (req, res) => {
  try {
    // 检查环境变量是否存在
    const emailPassExists = !!process.env.EMAIL_PASS;
    
    // 响应信息
    res.status(200).json({
      message: 'API测试成功',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      emailPassSet: emailPassExists ? '已设置' : '未设置'
    });
  } catch (error) {
    res.status(500).json({
      error: '测试API出错',
      message: error.message
    });
  }
}; 