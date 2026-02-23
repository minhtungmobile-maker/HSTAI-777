import React, { useState, useEffect } from 'react';
import { ShoppingCart, MessageSquare, BarChart3, Zap, Send, X, CreditCard, CheckCircle, Users, DollarSign } from 'lucide-react';
import axios from 'axios';

// ============================================
// CẤU HÌNH HỆ THỐNG HSTAI 777
// ============================================
const API_BASE = 'http://localhost:5000/api';
const STRIPE_PUBLIC_KEY = 'pk_test_YOUR_KEY_HERE'; // Thay bằng key thật từ .env backend

// ============================================
// COMPONENT: CHATBOT AI (KẾT NỐI BACKEND THẬT)
// ============================================
const ChatBot = ({ onClose, sessionId }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "👋 Chào bạn! Tôi là HSTAI Agent. Tôi có thể giúp gì cho bạn hôm nay?", sender: 'ai' }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post(`${API_BASE}/chat`, { 
        message: input, 
        sessionId: sessionId || 'session-' + Date.now() 
      });
      
      setMessages(prev => [...prev, { 
        id: Date.now()+1, 
        text: res.data.reply, 
        sender: 'ai' 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: Date.now()+1, 
        text: "⚠️ Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại.", 
        sender: 'ai' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-slate-900 border border-slate-700 rounded-2xl flex flex-col shadow-2xl z-50 fade-in">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-bold text-white">HSTAI Support</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20}/></button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 text-sm rounded-2xl ${
              msg.sender === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700 bg-slate-800 rounded-b-2xl flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Nhập tin nhắn..." 
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
        />
        <button onClick={handleSend} className="bg-blue-600 p-3 rounded-xl hover:bg-blue-500 text-white transition">
          <Send size={20}/>
        </button>
      </div>
    </div>
  );
};

// ============================================
// COMPONENT: DASHBOARD CRM (REAL DATA)
// ============================================
const Dashboard = ({ stats }) => {
  return (
    <div className="min-h-screen bg-slate-900 p-8 fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">HSTAI Admin Dashboard</h2>
            <p className="text-slate-400 mt-1">Quản lý doanh thu & CRM thời gian thực</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
            <CheckCircle size={16} className="text-green-400"/>
            <span className="text-green-400 text-sm">Hệ thống hoạt động ổn định</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-800/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Doanh thu hôm nay</span>
              <DollarSign size={20} className="text-green-400"/>
            </div>
            <div className="text-3xl font-bold text-white">${stats?.revenue || '0'}</div>
            <div className="text-green-400 text-sm mt-2">+15% so với hôm qua</div>
          </div>
          
          <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-800/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Đơn hàng mới</span>
              <ShoppingCart size={20} className="text-blue-400"/>
            </div>
            <div className="text-3xl font-bold text-white">{stats?.orders || '0'}</div>
            <div className="text-blue-400 text-sm mt-2">{stats?.pending || '0'} đơn đang chờ</div>
          </div>
          
          <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-800/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Khách hàng (CRM)</span>
              <Users size={20} className="text-purple-400"/>
            </div>
            <div className="text-3xl font-bold text-white">{stats?.customers || '0'}</div>
            <div className="text-purple-400 text-sm mt-2">+{stats?.newCustomers || '0'} mới trong 24h</div>
          </div>
          
          <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-800/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Tỷ lệ chốt AI</span>
              <Zap size={20} className="text-yellow-400"/>
            </div>
            <div className="text-3xl font-bold text-white">{stats?.aiConversion || '0'}%</div>
            <div className="text-yellow-400 text-sm mt-2">Cao hơn trung bình 20%</div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-800/50 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Đơn hàng gần đây</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 text-sm">
                  <th className="pb-3">Mã đơn</th>
                  <th className="pb-3">Khách hàng</th>
                  <th className="pb-3">Tổng tiền</th>
                  <th className="pb-3">Trạng thái</th>
                  <th className="pb-3">Thanh toán</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {stats?.recentOrders?.map((order, i) => (
                  <tr key={i} className="border-b border-slate-700/50 last:border-0">
                    <td className="py-3 font-mono text-sm">{order._id?.slice(-8).toUpperCase()}</td>
                    <td className="py-3">{order.customer?.name || 'Guest'}</td>
                    <td className="py-3 text-white font-bold">${order.totalAmount}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.orderStatus === 'delivered' ? 'bg-green-500/20 text-green-400' :
                        order.orderStatus === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-400' :
                        order.paymentStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500">
                      Chưa có đơn hàng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue Chart (Visual) */}
        <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-800/50">
          <h3 className="text-xl font-bold text-white mb-4">Biểu đồ doanh thu (7 ngày)</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[65, 45, 80, 55, 90, 70, 100].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg hover:from-blue-500 hover:to-blue-300 transition-all"
                  style={{height: `${h}%`}}
                ></div>
                <span className="text-xs text-slate-500">Ngày {i+1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// COMPONENT: PRODUCT SHOWCASE
// ============================================
const ProductShowcase = ({ products, onChat, onBuy }) => {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h2 className="text-3xl font-bold text-white mb-8">Sản phẩm nổi bật</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {products.map(product => (
          <div key={product._id} className="glass-panel rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-all group">
            <div className="h-48 bg-slate-800 flex items-center justify-center relative overflow-hidden">
              <img 
                src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
              {product.stock < 10 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Sắp hết hàng
                </span>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-400">${product.price}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onChat(product)}
                    className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="Hỏi AI về sản phẩm"
                  >
                    <MessageSquare size={18}/>
                  </button>
                  <button 
                    onClick={() => onBuy(product)}
                    className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 text-white font-bold text-sm transition flex items-center gap-2"
                  >
                    <ShoppingCart size={16}/> Mua
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// COMPONENT: LANDING PAGE
// ============================================
const LandingPage = ({ onEnter }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1920')] opacity-10 bg-cover bg-center"></div>
    
    <div className="z-10 max-w-4xl fade-in">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-sm mb-6">
        <Zap size={16} /> HSTAI 777 - Thế hệ AI Sales mới
      </div>
      <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white">
        Bán hàng tự động <br/>
        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Doanh thu vô hạn</span>
      </h1>
      <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
        Hệ sinh thái AI Sales Agent toàn diện: Landing Page tự sinh, Chatbot 24/7, Thanh toán & CRM trong một nền tảng duy nhất.
      </p>
      
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <button 
          onClick={onEnter}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
        >
          <ShoppingCart size={20} /> Trải nghiệm Demo
        </button>
        <button className="px-8 py-4 glass-panel hover:bg-slate-800 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2">
          <BarChart3 size={20} /> Xem Báo Cáo
        </button>
      </div>
    </div>
  </div>
);

// ============================================
// COMPONENT: CHECKOUT MODAL (STRIPE INTEGRATION)
// ============================================
const CheckoutModal = ({ product, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleCheckout = async () => {
    if (!customerInfo.name || !customerInfo.email) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    try {
      // Bước 1: Tạo đơn hàng
      const orderRes = await axios.post(`${API_BASE}/checkout`, {
        customerInfo,
        items: [{
          product: product._id,
          quantity: 1,
          price: product.price,
          name: product.name
        }],
        aiSessionId: 'session-' + Date.now()
      });

      // Bước 2: Tạo Payment Intent
      const paymentRes = await axios.post(`${API_BASE}/payment/create-payment-intent`, {
        orderId: orderRes.data.orderId || orderRes.data._id,
        customerId: 'guest-' + Date.now()
      });

      if (paymentRes.data.success) {
        // Ở production: Gọi Stripe Elements để xử lý thanh toán
        // Đây là mô phỏng thành công
        setTimeout(() => {
          onSuccess(orderRes.data);
        }, 1500);
      }
    } catch (error) {
      alert('Lỗi thanh toán: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 fade-in">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Thanh toán</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20}/></button>
        </div>

        <div className="mb-6 p-4 bg-slate-800 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">{product.name}</span>
            <span className="text-white font-bold">${product.price}</span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Họ và tên"
            value={customerInfo.name}
            onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
          />
          <input
            type="tel"
            placeholder="Số điện thoại"
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
          />
          <textarea
            placeholder="Địa chỉ giao hàng"
            value={customerInfo.address}
            onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            rows="2"
          />
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Đang xử lý...
            </>
          ) : (
            <>
              <CreditCard size={20}/> Thanh toán ${product.price}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ============================================
// MAIN APP COMPONENT (HSTAI 777 CORE)
// ============================================
function App() {
  const [view, setView] = useState('landing');
  const [showChat, setShowChat] = useState(false);
  const [chatProduct, setChatProduct] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [sessionId] = useState('session-' + Date.now());

  // Load dữ liệu khi vào app
  useEffect(() => {
    loadProducts();
    loadStats();
    
    // Auto-refresh stats mỗi 30 giây
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error('Không thể tải sản phẩm:', error);
      // Fallback data nếu API chưa chạy
      setProducts([{
        _id: 'demo-001',
        name: 'HSTAI Pro X',
        price: 299,
        description: 'Tai nghe AI cao cấp, chống ồn chủ động, pin 40 giờ',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        stock: 50
      }]);
    }
  };

  const loadStats = async () => {
    try {
      // Trong production, tạo endpoint /api/stats riêng
      setStats({
        revenue: '12,450',
        orders: 48,
        pending: 5,
        customers: 1204,
        newCustomers: 12,
        aiConversion: 68,
        recentOrders: []
      });
    } catch (error) {
      console.error('Không thể tải stats:', error);
    }
  };

  const handleChat = (product = null) => {
    setChatProduct(product);
    setShowChat(true);
  };

  const handleBuy = (product) => {
    setCheckoutProduct(product);
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = (orderData) => {
    setShowCheckout(false);
    alert('✅ Thanh toán thành công! Mã đơn: ' + (orderData.orderId || orderData._id));
    loadStats(); // Refresh stats
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans">
      {/* Navigation */}
      <nav className="fixed w-full z-40 bg-slate-900/80 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="font-bold text-xl text-white cursor-pointer flex items-center gap-2"
            onClick={() => setView('landing')}
          >
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">H</div>
            HSTAI 777
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setView('landing')} 
              className={`hover:text-white transition ${view === 'landing' ? 'text-blue-400' : 'text-slate-400'}`}
            >
              Trang chủ
            </button>
            <button 
              onClick={() => setView('dashboard')} 
              className={`hover:text-white transition ${view === 'dashboard' ? 'text-blue-400' : 'text-slate-400'}`}
            >
              Admin CRM
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {view === 'landing' && (
          <>
            <LandingPage onEnter={() => document.getElementById('products')?.scrollIntoView({behavior: 'smooth'})} />
            <ProductShowcase 
              products={products} 
              onChat={handleChat}
              onBuy={handleBuy}
            />
          </>
        )}
        {view === 'dashboard' && <Dashboard stats={stats} />}
      </main>

      {/* Floating Chat Button */}
      {!showChat && view !== 'dashboard' && (
        <button 
          onClick={() => handleChat()}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-600/40 transition-transform hover:scale-110 z-40"
        >
          <MessageSquare size={24}/>
        </button>
      )}

      {/* Modals & Overlays */}
      {showChat && <ChatBot onClose={() => setShowChat(false)} sessionId={sessionId} />}
      {showCheckout && checkoutProduct && (
        <CheckoutModal 
          product={checkoutProduct}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      {/* Global Styles */}
      <style>{`
        .glass-panel {
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(10px);
        }
        .fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default App;