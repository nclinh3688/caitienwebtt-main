'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Icons
import { BookOpen, GraduationCap, Brain, Users, Star, Play, Trophy, Clock, Target, Phone, MessageCircle } from 'lucide-react';

// Floating Contact Buttons Component
function FloatingContactButtons() {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isNight, setIsNight] = useState(false);

  // Kiểm tra thời gian để xác định ban đêm/ban ngày
  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      setIsNight(hour >= 18 || hour <= 6);
    };
    
    checkTime();
    const interval = setInterval(checkTime, 60000); // Kiểm tra mỗi phút
    
    return () => clearInterval(interval);
  }, []);

  const createRipple = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples(prev => [...prev, { id, x, y }]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 3000);
  };

  // Tạo hiệu ứng sóng liên tục
  const createContinuousRipple = (buttonIndex: number) => {
    const id = Date.now() + buttonIndex;
    const x = 28; // Center của nút 56px
    const y = 28;
    
    setRipples(prev => [...prev, { id, x, y }]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 3000);
  };

  // Tạo sóng liên tục cho mỗi nút
  useEffect(() => {
    const intervals = contactButtons.map((_, index) => {
      // Tạo sóng đầu tiên sau delay
      setTimeout(() => createContinuousRipple(index), index * 2000);
      
      // Tạo sóng định kỳ - chậm hơn
      return setInterval(() => {
        createContinuousRipple(index);
      }, 6000 + index * 1000);
    });

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, []);

  const contactButtons = [
    {
      icon: <Phone className="w-4 h-4 md:w-6 md:h-6" />,
      label: "Gọi điện",
      href: "tel:0814727855",
      color: "bg-green-500 hover:bg-green-600",
      delay: 0
    },
    {
      icon: (
        <div className="w-6 h-6 md:w-10 md:h-10 flex items-center justify-center">
          <img 
            src="/icons/zalo.png" 
            alt="Zalo" 
            className="w-6 h-6 md:w-10 md:h-10 rounded-full object-cover"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              background: 'transparent'
            }}
          />
        </div>
      ),
      label: "Zalo",
      href: "https://zalo.me/0814727855",
      color: "bg-transparent hover:bg-gray-100",
      delay: 0.1
    },
    {
      icon: (
        <div className="w-6 h-6 md:w-10 md:h-10 flex items-center justify-center">
          <img 
            src="/icons/messenger.png" 
            alt="Messenger" 
            className="w-6 h-6 md:w-10 md:h-10 rounded-full object-cover"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              background: 'transparent'
            }}
          />
        </div>
      ),
      label: "Messenger",
      href: "https://m.me/nguyen.chi.linh.781977?hash=AbYPYHSJsGxUoaUE&source_id=8585216",
      color: "bg-transparent hover:bg-gray-100",
      delay: 0.2
    }
  ];

  return (
    <div className="fixed left-4 bottom-4 z-50 flex flex-col gap-3">
      {contactButtons.map((button, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -100 }}
          animate={{ 
            opacity: 1, 
            x: 0,
            y: [0, -2, 2, 0]
          }}
          transition={{ 
            duration: 0.6, 
            delay: button.delay,
            y: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.5 // Mỗi nút delay khác nhau
            }
          }}
          className="relative group"
          style={{ overflow: 'visible' }}
        >
          <motion.a
            href={button.href}
            target={button.href.startsWith('http') ? '_blank' : '_self'}
            rel={button.href.startsWith('http') ? 'noopener noreferrer' : ''}
            className={`
              relative flex items-center justify-center w-8 h-8 md:w-14 md:h-14 rounded-full 
              ${button.color} text-white shadow-lg cursor-pointer
              transition-all duration-500 ease-out
              hover:shadow-2xl hover:scale-110 hover:brightness-110
            `}
            whileHover={{ 
              scale: 1.15,
              rotate: [0, -3, 3, 0],
              y: [0, -3, 3, 0],
              transition: { duration: 0.4, ease: "easeInOut" }
            }}
            whileTap={{ 
              scale: 0.9,
              transition: { duration: 0.1, ease: "easeOut" }
            }}
            onClick={createRipple}
          >
            {/* Ripple Effect */}
            {ripples.map(ripple => (
              <motion.div
                key={ripple.id}
                className={`absolute rounded-full pointer-events-none ${
                  isNight 
                    ? 'bg-gradient-to-r from-cyan-300/30 to-blue-400/30' 
                    : 'bg-gradient-to-r from-blue-500/20 to-indigo-600/20'
                }`}
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 8, opacity: 0 }}
                transition={{ 
                  duration: 4, 
                  ease: [0.25, 0.1, 0.25, 1],
                  scale: { duration: 4, ease: [0.25, 0.1, 0.25, 1] },
                  opacity: { duration: 3.5, ease: [0.25, 0.1, 0.25, 1] }
                }}
                style={{
                  left: ripple.x - 10,
                  top: ripple.y - 10,
                  width: 20,
                  height: 20,
                  zIndex: -1,
                  filter: 'blur(2px)',
                }}
              />
            ))}
            
            {/* Icon */}
            <div className="relative z-10">
              {button.icon}
            </div>
            
            {/* Tooltip */}
            <motion.div 
              className="absolute right-full mr-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap"
              initial={{ opacity: 0, x: 10, scale: 0.8 }}
              whileHover={{ 
                opacity: 1, 
                x: 0, 
                scale: 1,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {button.label}
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </motion.div>
          </motion.a>
        </motion.div>
      ))}
    </div>
  );
}

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Floating Contact Buttons */}
      <FloatingContactButtons />
      {/* Hero Section - ENHANCED & ANIMATED */}
      <section className="hero-section">
        {/* Background Elements */}
        <div className="hero-background">
          <div className="floating-shapes">
            <motion.div 
              className="shape shape-1"
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              🎓
            </motion.div>
            <motion.div 
              className="shape shape-2"
              animate={{ 
                y: [0, 15, 0],
                rotate: [0, -3, 0]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1
              }}
            >
              🌍
            </motion.div>
            <motion.div 
              className="shape shape-3"
              animate={{ 
                y: [0, -25, 0],
                rotate: [0, 8, 0]
              }}
              transition={{ 
                duration: 7, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 2
              }}
            >
              💡
            </motion.div>
            <motion.div 
              className="shape shape-4"
              animate={{ 
                y: [0, 18, 0],
                rotate: [0, -6, 0]
              }}
              transition={{ 
                duration: 9, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 3
              }}
            >
              🚀
            </motion.div>
          </div>
        </div>

        <div className="hero-container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Học ngoại ngữ thông minh
            </motion.h1>
            
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Nền tảng học ngoại ngữ hiện đại với <span className="highlight">AI tutor</span>, 
              <span className="highlight"> 5 ngôn ngữ phổ biến</span>, 
              phương pháp học khoa học và trải nghiệm học tập tuyệt vời
            </motion.p>
            
            <motion.div 
              className="hero-buttons"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button 
                className="hero-button-primary"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play size={20} />
                Bắt đầu học miễn phí
              </motion.button>
              <motion.button 
                className="hero-button-secondary"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <BookOpen size={20} />
                Xem khóa học
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="scroll-arrow">↓</div>
          <span>Cuộn xuống để khám phá</span>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="features-header"
          >
            <h2 className="features-title">
              Tại sao chọn PHÚC KHIÊM?
            </h2>
            <p className="features-subtitle">
              Chúng tôi cung cấp giải pháp học ngoại ngữ toàn diện và hiện đại nhất
            </p>
          </motion.div>

          <div className="features-grid">
            {[
              {
                icon: "🧠",
                title: "AI Tutor 24/7",
                description: "Trò chuyện với AI tutor thông minh, hỗ trợ học tập mọi lúc mọi nơi"
              },
              {
                icon: "🎓",
                title: "5 Ngôn ngữ",
                description: "Tiếng Nhật, Trung, Anh, Hàn, Việt với giáo trình chuẩn quốc tế"
              },
              {
                icon: "🎯",
                title: "Lộ trình cá nhân",
                description: "Học theo lộ trình được thiết kế riêng cho từng học viên"
              },
              {
                icon: "🏆",
                title: "Gamification",
                description: "Học tập thú vị với hệ thống điểm, huy hiệu và xếp hạng thú vị. Theo dõi tiến độ học tập và nhận phần thưởng xứng đáng"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="feature-card"
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">
                  {feature.title}
                </h3>
                <p className="feature-description">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-grid">
            {[
              { number: "50,000+", label: "Học viên" },
              { number: "100+", label: "Khóa học" },
              { number: "99%", label: "Hài lòng" },
              { number: "24/7", label: "Hỗ trợ" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="stat-item"
              >
                <div className="stat-number">
                  {stat.number}
                </div>
                <div className="stat-label">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Preview Section */}
      <section className="courses-section">
        <div className="courses-container">
          <div className="section-header">
            <h2 className="section-title">Khóa học nổi bật</h2>
            <p className="section-subtitle">
              Khám phá các khóa học chất lượng cao được thiết kế bởi chuyên gia
            </p>
          </div>
          <div className="courses-grid">
            {[
              {
                title: "Tiếng Nhật N5",
                description: "Khóa học cơ bản cho người mới bắt đầu, chuẩn bị cho kỳ thi JLPT N5",
                icon: "🇯🇵"
              },
              {
                title: "Tiếng Trung HSK 1",
                description: "Học tiếng Trung từ đầu với phương pháp hiện đại và thực tế",
                icon: "🇨🇳"
              },
              {
                title: "Tiếng Anh TOEIC",
                description: "Luyện thi TOEIC với giáo trình chuẩn và bài tập thực hành",
                icon: "🇺🇸"
              }
            ].map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="course-card"
              >
                <div className="course-content">
                  <div className="course-flag">
                    {course.icon}
                  </div>
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-description">{course.description}</p>
                  <a href="#" className="course-button">
                    Xem chi tiết →
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <h2 className="testimonials-title">Học viên nói gì</h2>
          <div className="testimonials-grid">
            {[
              {
                content: "Tôi đã học tiếng Nhật được 6 tháng và thấy tiến bộ rõ rệt. AI tutor rất thông minh và dễ hiểu!",
                author: "Nguyễn Văn A",
                role: "Học viên tiếng Nhật"
              },
              {
                content: "Khóa học tiếng Trung HSK 1 rất hay, giáo viên nhiệt tình và phương pháp học hiệu quả.",
                author: "Trần Thị B",
                role: "Học viên tiếng Trung"
              },
              {
                content: "Tôi đã đạt được 750 điểm TOEIC sau 3 tháng học. Nền tảng này thực sự tuyệt vời!",
                author: "Lê Văn C",
                role: "Học viên tiếng Anh"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="testimonial-card"
              >
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="testimonial-info">
                    <h4>{testimonial.author}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Section - ENHANCED */}
      <section className="mobile-app-section">
        <div className="mobile-app-container">
          <div className="mobile-app-content">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="mobile-app-title">Học mọi lúc, mọi nơi</h2>
              <p className="mobile-app-description">
                Tải ứng dụng di động để học tập thuận tiện hơn. Đồng bộ tiến độ học tập 
                giữa web và mobile, học offline và nhận thông báo thông minh.
              </p>
              <div className="mobile-app-buttons">
                <motion.button 
                  className="mobile-app-button app-store"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="button-icon">🍎</div>
                  <div className="button-content">
                    <span className="button-label">Tải trên</span>
                    <span className="button-name">App Store</span>
                  </div>
                </motion.button>
                <motion.button 
                  className="mobile-app-button google-play"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="button-icon">🤖</div>
                  <div className="button-content">
                    <span className="button-label">Tải trên</span>
                    <span className="button-name">Google Play</span>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </div>
          <motion.div 
            className="mobile-app-mockup"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="phone-mockup">
              <div className="phone-screen">
                <div className="app-interface">
                  <div className="app-header">
                    <div className="app-logo">🎓</div>
                    <div className="app-title">PHÚC KHIÊM</div>
                  </div>
                  <div className="app-content">
                    <div className="lesson-card">
                      <div className="lesson-icon">🇯🇵</div>
                      <div className="lesson-info">
                        <div className="lesson-name">Tiếng Nhật N5</div>
                        <div className="lesson-progress">75% hoàn thành</div>
                      </div>
                    </div>
                    <div className="ai-chat">
                      <div className="ai-avatar">🤖</div>
                      <div className="ai-message">Chào bạn! Hôm nay học gì nào?</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - ENHANCED */}
      <section className="cta-section">
        <div className="cta-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="cta-content"
          >
            <h2 className="cta-title">Sẵn sàng bắt đầu hành trình học ngoại ngữ?</h2>
            <p className="cta-description">
              Tham gia cùng <span className="highlight">50,000+</span> học viên đang học tập và phát triển mỗi ngày
            </p>
            <div className="cta-features">
              <div className="cta-feature">
                <div className="feature-icon">🚀</div>
                <span>Học miễn phí</span>
              </div>
              <div className="cta-feature">
                <div className="feature-icon">🎯</div>
                <span>Lộ trình cá nhân</span>
              </div>
              <div className="cta-feature">
                <div className="feature-icon">🤖</div>
                <span>AI Tutor 24/7</span>
              </div>
            </div>
            <motion.button 
              className="cta-button"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="button-text">Bắt đầu ngay hôm nay</span>
              <div className="button-arrow">→</div>
            </motion.button>
          </motion.div>
        </div>
        <div className="cta-background-elements">
          <div className="floating-element element-1">🎓</div>
          <div className="floating-element element-2">🌍</div>
          <div className="floating-element element-3">💡</div>
        </div>
      </section>

      {/* Footer Section - ENHANCED & MODERN */}
      <section className="footer-section">
        <div className="footer-container">
          <motion.div 
            className="footer-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="footer-company">
              <div className="company-header">
                <div className="company-logo">🎓</div>
                <h3>PHÚC KHIÊM Education</h3>
              </div>
              <p className="company-description">
                Nền tảng học ngoại ngữ thông minh với AI. Giúp bạn học 5 ngôn ngữ một cách hiệu quả và thú vị nhất.
              </p>
              <div className="contact-info">
                <motion.a 
                  href="mailto:nguyenchilinh1685@gmail.com"
                  className="contact-item"
                  whileHover={{ x: 5 }}
                >
                  <span className="contact-icon">📧</span>
                  <span>nguyenchilinh1685@gmail.com</span>
                </motion.a>
                <motion.a 
                  href="tel:+84814727855"
                  className="contact-item"
                  whileHover={{ x: 5 }}
                >
                  <span className="contact-icon">📞</span>
                  <span>+84 814 727 855</span>
                </motion.a>
                <motion.div 
                  className="contact-item"
                  whileHover={{ x: 5 }}
                >
                  <span className="contact-icon">📍</span>
                  <span>Thanh Hoá, Việt Nam</span>
                </motion.div>
              </div>
            </div>
            
            <div className="footer-column">
              <h3>Khóa học</h3>
              <ul>
                {['Tiếng Nhật', 'Tiếng Trung', 'Tiếng Anh', 'Tiếng Hàn', 'Tiếng Việt'].map((lang, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a href="#">{lang}</a>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Hỗ trợ</h3>
              <ul>
                {['Trung tâm trợ giúp', 'FAQ', 'Liên hệ', 'Phản hồi', 'Hướng dẫn'].map((item, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a href="#">{item}</a>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Theo dõi</h3>
              <ul>
                <motion.li 
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a href="https://www.facebook.com/share/1J8Pmb3Ady/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">Facebook</a>
                </motion.li>
                <motion.li 
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a href="https://m.me/nguyen.chi.linh.781977?hash=AbYPYHSJsGxUoaUE&source_id=8585216" target="_blank" rel="noopener noreferrer">Messenger</a>
                </motion.li>
                <motion.li 
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a href="https://zalo.me/0814727855" target="_blank" rel="noopener noreferrer">Zalo</a>
                </motion.li>
                <motion.li 
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a href="#" target="_blank" rel="noopener noreferrer">Youtube</a>
                </motion.li>
                <motion.li 
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
                </motion.li>
              </ul>
            </div>
          </motion.div>
          
          {/* Newsletter Subscription - ENHANCED */}
          <motion.div 
            className="newsletter-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="newsletter-content">
              <div className="newsletter-header">
                <div className="newsletter-icon">📬</div>
                <h3>Đăng ký nhận tin tức</h3>
              </div>
              <p>Nhận thông tin về khóa học mới và tips học ngoại ngữ hiệu quả</p>
              <div className="newsletter-form">
                <motion.input 
                  type="email" 
                  placeholder="Nhập email của bạn" 
                  className="newsletter-input"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button 
                  className="newsletter-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Đăng ký
                </motion.button>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="footer-bottom"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="footer-bottom-content">
              <p>&copy; 2025 PHÚC KHIÊM Education. Tất cả quyền được bảo lưu. ❤</p>
              <div className="policy-links">
                {['Chính sách bảo mật', 'Điều khoản sử dụng', 'Cookie Policy'].map((policy, index) => (
                  <motion.a 
                    key={index}
                    href="#" 
                    className="policy-link"
                    whileHover={{ y: -2 }}
                  >
                    {policy}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
