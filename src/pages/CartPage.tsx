import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItemComponent } from '../components/CartItem';
import { Button } from '../components/Button';
import { theme } from '../styles/theme';
import Swal from 'sweetalert2';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 1rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: ${theme.colors.primary};
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const EmptyCart = styled(motion.div)`
  text-align: center;
  padding: 3rem;
  background: ${theme.colors.light};
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.medium};
  margin: 2rem 0;
  
  h3 {
    color: ${theme.colors.secondary};
    margin-bottom: 1rem;
  }
  
  p {
    color: ${theme.colors.text};
    margin-bottom: 2rem;
  }
  
  svg {
    width: 80px;
    height: 80px;
    fill: ${theme.colors.primary};
    margin-bottom: 1.5rem;
    opacity: 0.7;
  }
`;

const CartList = styled(motion.div)`
  margin-bottom: 2rem;
`;

const SummaryCard = styled(motion.div)`
  background: ${theme.colors.light};
  border-radius: ${theme.borderRadius.large};
  padding: 1.5rem;
  box-shadow: ${theme.shadows.medium};
  margin-top: 2rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed ${theme.colors.primary};
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const SummaryLabel = styled.span`
  color: ${theme.colors.text};
`;

const SummaryValue = styled.span`
  color: ${theme.colors.secondary};
  font-weight: bold;
`;

const TotalRow = styled(SummaryRow)`
  border-bottom: none;
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
`;

const TotalLabel = styled(SummaryLabel)`
  color: ${theme.colors.secondary};
`;

const TotalValue = styled(SummaryValue)`
  font-size: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  
  button {
    flex: 1;
  }
`;

const OrderForm = styled.div`
  margin-top: 2rem;
  background: ${theme.colors.light};
  border-radius: ${theme.borderRadius.large};
  padding: 1.5rem;
  box-shadow: ${theme.shadows.medium};
`;

const FormTitle = styled.h3`
  color: ${theme.colors.primary};
  margin-bottom: 1rem;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${theme.colors.text};
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius.small};
  font-family: ${theme.fonts.main};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.secondary};
  }
`;

export const CartPage: React.FC = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const [phoneNumber, setPhoneNumber] = useState('9175201314');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmitOrder = useCallback(async () => {
    // 验证购物车不为空
    if (cart.length === 0) {
      Swal.fire({
        title: '提示',
        text: '您的菜单是空的哦，请先添加一些美食~',
        icon: 'warning',
        confirmButtonColor: theme.colors.primary,
      });
      return;
    }
    
    // 提交订单
    setIsSubmitting(true);
    try {
      // 模拟生成订单ID
      const orderId = `ORDER${Date.now().toString().slice(-6)}`;
      
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} ${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;
      
      // 准备订单数据
      const orderData = {
        id: orderId,
        date: formattedDate,
        items: cart.map(item => ({
          name: item.item.name,
          price: item.item.price,
          quantity: item.quantity
        })),
        total: getTotalPrice()
      };

      // 如果用户提供了邮箱，发送订单确认邮件
      if (email) {
        try {
          const emailResponse = await fetch('/api/send-order-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, orderData })
          });
          
          const emailResult = await emailResponse.json();
          if (!emailResult.message) {
            console.error('邮件发送失败:', emailResult.error);
          } else {
            console.log('邮件发送成功:', emailResult.message);
          }
        } catch (emailError) {
          console.error('邮件发送错误:', emailError);
        }
      }
      
      // 格式化显示内容
      const orderItems = cart.map(item => `${item.item.name} x${item.quantity}`).join('\n');
      const totalPrice = getTotalPrice().toFixed(2);
      
      // 显示成功信息
      await Swal.fire({
        title: '下单成功！',
        html: `
          <div style="text-align: left;">
            <p><b>订单编号:</b> #${orderId}</p>
            <p><b>下单时间:</b> ${formattedDate}</p>
            ${email ? `<p><b>确认邮件已发送至:</b> ${email}</p>` : ''}
            <p><b>点菜明细:</b></p>
            <pre style="white-space: pre-wrap;">${orderItems}</pre>
            <p><b>总价:</b> ￥${totalPrice}</p>
          </div>
        `,
        icon: 'success',
        confirmButtonColor: theme.colors.primary,
      });
      
      // 清空购物车
      clearCart();
      
      // 返回主页
      navigate('/');
    } catch (error) {
      console.error('订单提交失败:', error);
      Swal.fire({
        title: '出错了',
        text: '订单提交失败，请稍后重试',
        icon: 'error',
        confirmButtonColor: theme.colors.primary,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [cart, getTotalPrice, clearCart, navigate, email]);
  
  return (
    <PageContainer>
      <Header>
        <Title>我的菜单</Title>
      </Header>
      
      {cart.length === 0 ? (
        <EmptyCart
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <svg viewBox="0 0 24 24">
            <path d="M7,18c-1.1,0-1.99,0.9-1.99,2S5.9,22,7,22s2-0.9,2-2S8.1,18,7,18z M17,18c-1.1,0-1.99,0.9-1.99,2s0.89,2,1.99,2s2-0.9,2-2S18.1,18,17,18z M8.1,13h7.45c0.75,0,1.41-0.41,1.75-1.03l3.86-7.01c0.19-0.34,0.19-0.76-0.01-1.1c-0.19-0.34-0.54-0.55-0.93-0.55H6.87L6.17,2H4v2h2l3.6,7.59l-1.35,2.44C7.88,14.55,8.26,15,8.9,15h11v-2H8.9L8.1,13z" />
          </svg>
          <h3>您的菜单还是空的哦~</h3>
          <p>回到菜单页添加一些美味的食物吧！</p>
          <Button onClick={() => navigate('/')}>返回菜单</Button>
        </EmptyCart>
      ) : (
        <>
          <CartList>
            <AnimatePresence>
              {cart.map((item) => (
                <CartItemComponent key={item.item.id} item={item} />
              ))}
            </AnimatePresence>
          </CartList>
          
          <SummaryCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SummaryRow>
              <SummaryLabel>菜品数量</SummaryLabel>
              <SummaryValue>{cart.reduce((sum, item) => sum + item.quantity, 0)}</SummaryValue>
            </SummaryRow>
            
            <TotalRow>
              <TotalLabel>总价</TotalLabel>
              <TotalValue>￥{getTotalPrice().toFixed(2)}</TotalValue>
            </TotalRow>
            
            <ButtonGroup>
              <Button variant="outline" onClick={() => navigate('/')}>
                继续点菜
              </Button>
              <Button variant="secondary" onClick={clearCart}>
                清空菜单
              </Button>
            </ButtonGroup>
          </SummaryCard>
          
          <OrderForm>
            <FormTitle>确认下单信息</FormTitle>
            <FormGroup>
              <Label htmlFor="phone">联系电话:</Label>
              <Input 
                type="tel"
                id="phone"
                placeholder="请输入您的手机号"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isSubmitting}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="email">邮箱地址: (可选，接收订单确认邮件)</Label>
              <Input 
                type="email"
                id="email"
                placeholder="请输入您的邮箱地址"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </FormGroup>
            
            <Button 
              variant="primary"
              fullWidth
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? '处理中...' : '确认下单'}
            </Button>
          </OrderForm>
        </>
      )}
    </PageContainer>
  );
}; 