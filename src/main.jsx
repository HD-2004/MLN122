import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Bike,
  BookOpen,
  Bot,
  ChefHat,
  CircleDollarSign,
  Clock,
  CloudRain,
  Cpu,
  Gem,
  Home,
  MapPin,
  PackageCheck,
  ReceiptText,
  RefreshCw,
  Smartphone,
  Sparkles,
  Store,
  Ticket,
  TrendingUp,
  Trophy,
  Users,
  UsersRound,
  Utensils,
  WalletCards
} from 'lucide-react';
import './styles.css';

const assetUrl = (path) => {
  if (!path || /^https?:\/\//.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
};

const money = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);

const sections = [
  { id: 'intro', label: 'Mở đầu', icon: Home },
  { id: 'question', label: 'Vấn đề', icon: CircleDollarSign },
  { id: 'builder', label: 'Tự đặt đơn', icon: ReceiptText },
  { id: 'journey', label: 'Chuỗi giá trị', icon: Bike },
  { id: 'timeline', label: 'Dao động giá', icon: CloudRain },
  { id: 'map', label: 'Thị trường', icon: MapPin },
  { id: 'playground', label: 'Mô phỏng', icon: RefreshCw },
  { id: 'cards', label: 'Ghi nhớ', icon: BadgeCheck },
  { id: 'quiz', label: 'Quiz', icon: Trophy },
  { id: 'final', label: 'Tổng kết', icon: Sparkles },
  { id: 'ai-tools', label: 'AI hỗ trợ', icon: Bot },
  { id: 'team', label: 'Thành viên nhóm', icon: UsersRound }
];

const platformData = {
  grab: { name: 'GrabFood', fee: 8000, color: '#00a651', className: 'grab' },
  shopee: { name: 'ShopeeFood', fee: 6000, color: '#ee4d2d', className: 'shopee' },
  be: { name: 'beFood', fee: 7000, color: '#f4b400', className: 'be' }
};

const journeyData = {
  customer1: {
    icon: Users, tag: 'Khởi điểm lưu thông & Hình thái giá trị', title: 'Khách hàng đặt món',
    body: 'Khách hàng đóng vai trò là chủ thể tiêu dùng thực hiện trao đổi. Khi đặt món, họ sử dụng <b>Tiền tệ (vật ngang giá chung)</b> để mua hàng hóa. Dưới góc độ Mác-xít, đây là bước khởi đầu để chuyển hóa hình thái giá trị từ Tiền thành Hàng (T - H), bắt đầu đưa hàng hóa đi vào lưu thông.',
    stats: [['Chủ thể', 'Người tiêu dùng'], ['Hình thái', 'Tiền tệ làm vật ngang giá']],
    img: '/customer.png'
  },
  restaurant: {
    icon: Store, tag: 'Tư liệu sản xuất & Tổ chức lao động', title: 'Nhà hàng / Quán ăn Việt Nam',
    body: 'Nhà hàng là nơi diễn ra sự kết hợp giữa <b>Tư liệu sản xuất (Tư bản bất biến - c)</b> bao gồm nguyên vật liệu, bếp, nhà xưởng và <b>Sức lao động (Tư bản khả biến - v)</b>. Đây là khâu tổ chức tạo điều kiện cần thiết để lao động sống có thể tiến hành tạo ra sản phẩm.',
    stats: [['Yếu tố c', 'Nhà xưởng, nguyên liệu'], ['Yếu tố v', 'Tổ chức sức lao động']],
    img: '/restaurant.png'
  },
  kitchen: {
    icon: ChefHat, tag: 'Lao động cụ thể & Lao động sống tạo giá trị', title: 'Đầu bếp / Nhân viên pha chế',
    body: 'Đầu bếp tiến hành hao phí <b>Lao động cụ thể</b> để tạo ra tính hữu ích (giá trị sử dụng) của món ăn. Đồng thời, sự hao phí cơ bắp và trí óc nói chung của họ là <b>Lao động trừu tượng (Lao động sống)</b> trực tiếp kết tinh tạo ra <b>Giá trị mới (v + m)</b> cho hàng hóa.',
    stats: [['Lao động cụ thể', 'Tạo ra giá trị sử dụng'], ['Lao động sống', 'Nguồn gốc tạo giá trị mới']],
    img: '/kitchen.png'
  },
  platform: {
    icon: Smartphone, tag: 'Chi phí lưu thông & Phân chia thặng dư', title: 'Nền tảng (Grab / Shopee / Be)',
    body: 'Nền tảng cung cấp hạ tầng kết nối lưu thông. Phí dịch vụ (chiết khấu) thực chất là chi phí hỗ trợ lưu thông hoặc một phần <b>Giá trị thặng dư (m)</b> được trích ra từ quá trình sản xuất nhằm duy trì hệ thống và mang lại lợi nhuận cho nhà tư bản công nghệ.',
    stats: [['Tính chất', 'Dịch vụ kết nối lưu thông'], ['Phí dịch vụ', 'Trích từ giá trị thặng dư']],
    img: '/platform.png'
  },
  shipper: {
    icon: Bike, tag: 'Lao động tiếp tục sản xuất trong lưu thông', title: 'Shipper / Người giao hàng xe máy',
    body: 'Lao động của shipper là <b>quá trình lao động tiếp tục sản xuất trong khâu lưu thông</b> (vận chuyển hàng hóa đến tay người tiêu dùng). Sức lao động của shipper được hao phí trực tiếp làm tăng thêm giá trị thực tế cho món ăn khi hoàn thành giao hàng.',
    stats: [['Tính chất', 'Tiếp tục sản xuất trong lưu thông'], ['Hao phí', 'Phương tiện + Sức lao động']],
    img: '/shipper.png'
  },
  customer2: {
    icon: PackageCheck, tag: 'Hiện thực hóa giá trị & Kết thúc chu chuyển', title: 'Khách hàng nhận hàng',
    body: 'Khi khách hàng nhận món ăn và hoàn tất thanh toán, quá trình chu chuyển kết thúc. <b>Giá trị sử dụng</b> được đi vào tiêu dùng trực tiếp, và <b>Giá trị</b> kết tinh (bao gồm hao phí của quán, đầu bếp, shipper và nền tảng) chính thức được xã hội thừa nhận thông qua hành vi mua hàng.',
    stats: [['Hành vi', 'Tiêu dùng (hiện thực hóa giá trị)'], ['Tuần hoàn', 'Hoàn tất vòng chu chuyển']],
    img: '/delivery.png'
  }
};

const timelineData = [
  { label: 'Sáng', fee: 15000, height: 30, text: 'Buổi sáng tại phố cổ nhộn nhịp, đủ shipper trực sẵn → phí giao hàng ở mức nền, gần với giá trị thật của một chuyến giao hàng ngắn.', img: '/morning.jpg' },
  { label: 'Trưa', fee: 22000, height: 46, text: 'Giờ trưa là "giờ vàng" tại các đô thị Sài Gòn/Hà Nội — hàng loạt văn phòng cùng đặt cơm trong 30 phút, cầu tăng vọt trong khi shipper có hạn → giá cả bị kéo lên trên giá trị.', img: '/noon.jpg' },
  { label: 'Mưa', fee: 32000, height: 68, text: 'Trời mưa lớn tại các ngã tư đô thị làm giảm mạnh cung shipper (nhiều người không chạy xe máy trong mưa) trong khi cầu lại tăng (không ai muốn ra ngoài) → mức tăng giá rõ rệt nhất.', img: '/rainy-street.jpg' },
  { label: 'Lễ', fee: 27000, height: 58, text: 'Ngày lễ lớn, nhu cầu đặt món tăng cao đồng loạt trên khắp bản đồ đất nước Việt Nam, nhiều shipper cũng nghỉ lễ → mất cân đối cung cầu quy mô lớn.', img: '/holiday.jpg' },
  { label: 'Tối', fee: 19000, height: 38, text: 'Buổi tối phố ẩm thực lung linh, nhu cầu giảm dần, cung và cầu trở lại trạng thái cân bằng hơn — giá cả tiến gần trở lại giá trị thực.', img: '/night.png' }
];

const cityData = {
  hanoi: {
    icon: MapPin, tag: 'Miền Bắc · Dữ liệu thực tế', title: 'Hà Nội',
    body: 'Thị trường giao đồ ăn sôi động với văn hoá ẩm thực đa dạng theo mùa, đặc biệt quanh Phố Cổ và Hồ Hoàn Kiếm.',
    stats: [['Món đặt nhiều nhất', 'Bún, phở, trà chanh'], ['Phí giao hàng TB', '18.000–25.000đ'], ['Nền tảng phổ biến', 'GrabFood, ShopeeFood'], ['Giờ cao điểm', '11h30–13h']],
    img: '/hanoi.jpg'
  },
  danang: {
    icon: MapPin, tag: 'Miền Trung · Dữ liệu thực tế', title: 'Đà Nẵng',
    body: 'Thành phố du lịch ven sông Hàn và biển Mỹ Khê với lượng đơn hàng dao động theo mùa du lịch.',
    stats: [['Món đặt nhiều nhất', 'Hải sản, mì Quảng'], ['Phí giao hàng TB', '15.000–22.000đ'], ['Nền tảng phổ biến', 'GrabFood, beFood'], ['Giờ cao điểm', '18h–20h']],
    img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&auto=format&fit=crop&q=80'
  },
  cantho: {
    icon: MapPin, tag: 'Miền Tây · Dữ liệu thực tế', title: 'Cần Thơ',
    body: 'Thủ phủ Tây Đô ven sông Cửu Long, đặc trưng giao hàng len lỏi qua các tuyến đường và sông nước miền Tây.',
    stats: [['Món đặt nhiều nhất', 'Cơm tấm, hủ tiếu'], ['Phí giao hàng TB', '13.000–20.000đ'], ['Nền tảng phổ biến', 'GrabFood, ShopeeFood'], ['Giờ cao điểm', '11h–13h']],
    img: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=600&auto=format&fit=crop&q=80'
  },
  hcmc: {
    icon: MapPin, tag: 'Miền Nam · Dữ liệu thực tế', title: 'TP. Hồ Chí Minh',
    body: 'Siêu đô thị giao đồ ăn lớn nhất và cạnh tranh nhất cả nước, nơi đội ngũ shipper hoạt động 24/7 với mật độ cao nhất.',
    stats: [['Món đặt nhiều nhất', 'Trà sữa, cơm tấm'], ['Phí giao hàng TB', '16.000–28.000đ'], ['Nền tảng phổ biến', 'GrabFood, ShopeeFood'], ['Giờ cao điểm', '11h30–13h, 18h–20h']],
    img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&auto=format&fit=crop&q=80'
  }
};

const flashCards = [
  { 
    front: 'Giá trị là gì?', 
    back: '<p>Là <b>lao động xã hội của người sản xuất hàng hóa kết tinh trong hàng hóa đó</b>. Bản chất của giá trị không phải là một thuộc tính vật lý tự nhiên của vật phẩm, mà là phạm trù phản ánh <b>quan hệ sản xuất xã hội</b> giữa những người sản xuất hàng hóa.</p><ul><li><b>Đo lường lượng giá trị:</b> Được đo bằng thời gian lao động xã hội cần thiết (hao phí trung bình để sản xuất ra một giá trị sử dụng trong điều kiện bình thường).</li><li><b>Mối quan hệ:</b> Giá trị là nội dung, là cơ sở; giá trị trao đổi chỉ là hình thức biểu hiện bên ngoài của giá trị.</li></ul>',
    img: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80'
  },
  { 
    front: 'Hàng hoá là gì?', 
    back: '<p>Là <b>sản phẩm của lao động, có thể thỏa mãn một nhu cầu nào đó của con người và đi vào tiêu dùng thông qua trao đổi, mua bán</b>. Hàng hóa có hai thuộc tính thống nhất biện chứng:</p><ul><li><b>Giá trị sử dụng:</b> Công dụng có ích của hàng hóa nhằm thỏa mãn nhu cầu tiêu dùng (phạm trù vĩnh cửu).</li><li><b>Giá trị:</b> Lao động xã hội của người sản xuất kết tinh (phạm trù lịch sử, chỉ tồn tại trong nền kinh tế hàng hóa).</li></ul>',
    img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'
  },
  { 
    front: 'Lao động là gì?', 
    back: '<p>Lao động sản xuất hàng hóa có <b>tính hai mặt</b> (phát kiến vĩ đại của Karl Marx):</p><ul><li><b>Lao động cụ thể:</b> Lao động có ích dưới một hình thức nghề nghiệp chuyên môn cụ thể (pha chế, giao hàng). Nó tạo ra <b>giá trị sử dụng</b> của hàng hóa.</li><li><b>Lao động trừu tượng:</b> Sự hao phí sức lực cơ bắp, trí óc và thần kinh nói chung của người sản xuất. Nó tạo ra <b>giá trị</b> hàng hóa (hao phí lao động trừu tượng chính là thực thể của giá trị).</li></ul>',
    img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop&q=80'
  },
  { 
    front: 'Vì sao giá thay đổi?', 
    back: '<p>Yêu cầu cơ bản của <b>Quy luật giá trị</b> là sản xuất và trao đổi phải dựa trên hao phí lao động xã hội cần thiết. Giá cả là biểu hiện bằng tiền của giá trị.</p><ul><li><b>Sự biến động:</b> Giá cả thị trường dao động tự do xoay quanh trục giá trị dưới tác động tương hỗ của <b>cung - cầu, cạnh tranh và lưu thông tiền tệ</b>.</li><li>Khi Cung &lt; Cầu (mưa lớn, ít shipper), giá bị đẩy lên trên giá trị; khi Cung &gt; Cầu, giá hạ xuống dưới giá trị. Nhưng tổng giá cả luôn cân bằng với tổng giá trị.</li></ul>',
    img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80'
  }
];

const quiz = [
  {
    q: 'Theo Karl Marx, giá trị của một hàng hoá được quyết định bởi điều gì?',
    options: [
      'Số tiền mà người bán muốn thu về',
      'Lượng lao động xã hội cần thiết để tạo ra nó',
      'Mức độ khan hiếm trên thị trường',
      'Chi phí quảng cáo của thương hiệu'
    ],
    answer: 1,
    explain: 'Giá trị hàng hoá được quyết định bởi lượng lao động xã hội cần thiết (trung bình, trong điều kiện sản xuất bình thường) để tạo ra nó — không phải mong muốn chủ quan của người bán.'
  },
  {
    q: 'Vì sao phí giao hàng GrabFood thường tăng khi trời mưa?',
    options: [
      'Vì xăng xe tăng giá đột ngột',
      'Vì cung shipper giảm trong khi cầu đặt món tăng',
      'Vì nền tảng muốn thử nghiệm giá',
      'Vì món ăn trở nên ngon hơn khi trời mưa'
    ],
    answer: 1,
    explain: 'Trời mưa khiến ít shipper muốn chạy xe (cung giảm) trong khi nhiều người muốn ở nhà đặt món (cầu tăng) — sự mất cân đối này đẩy giá cả lên trên giá trị.'
  },
  {
    q: 'Giá cả và giá trị khác nhau như thế nào?',
    options: [
      'Chúng hoàn toàn giống nhau, không có gì khác biệt',
      'Giá cả là hình thức biểu hiện bằng tiền của giá trị, có thể dao động quanh giá trị',
      'Giá trị luôn cao hơn giá cả',
      'Giá cả chỉ tồn tại trong nền kinh tế số'
    ],
    answer: 1,
    explain: 'Giá trị tương đối ổn định (dựa trên lao động hao phí), còn giá cả là biểu hiện bằng tiền của giá trị và dao động lên xuống quanh giá trị do cung – cầu, cạnh tranh...'
  },
  {
    q: 'Trong chuỗi giao đồ ăn, ai là người trực tiếp bỏ ra "lao động sống" để tạo ra món ăn?',
    options: ['Nền tảng công nghệ', 'Đầu bếp / nhân viên pha chế', 'Nhà đầu tư của ứng dụng', 'Người viết đánh giá món ăn'],
    answer: 1,
    explain: 'Đầu bếp và nhân viên pha chế là người trực tiếp dùng kỹ năng, thời gian và công sức để tạo ra giá trị sử dụng của món ăn — đó là "lao động sống".'
  },
  {
    q: 'Phụ phí giờ cao điểm mà shipper nhận được phản ánh điều gì theo quy luật giá trị?',
    options: [
      'Một khoản tiền ngẫu nhiên không có cơ sở',
      'Giá trị lao động tăng thêm do rủi ro, công sức và thời gian tăng lên',
      'Sự trừng phạt đối với khách hàng đặt món giờ trưa',
      'Chi phí bảo trì xe của nền tảng'
    ],
    answer: 1,
    explain: 'Giờ cao điểm khiến công việc của shipper vất vả và rủi ro hơn (kẹt xe, tranh đơn, thời gian giao lâu hơn) — phụ phí là phần bù cho lượng lao động tăng thêm đó.'
  }
];

const questionExplanations = {
  a: {
    title: 'Cung – cầu lệch pha',
    body: '<p>Khi trời mưa, hàng ngàn người cùng lúc muốn đặt trà sữa, nhưng số lượng shipper sẵn sàng chạy trong mưa không tăng kịp.</p><ul><li><b>Quy luật giá trị:</b> Giá cả luôn dao động quanh giá trị thực tế do quan hệ cung – cầu.</li><li><b>Tác động:</b> Cung giảm (ít shipper chịu chạy) trong khi cầu tăng vọt &rarr; giá cả bị đẩy lên cao hơn giá trị, dù ly trà sữa vẫn giữ nguyên lượng hao phí lao động tạo ra nó.</li></ul>',
    img: '/rain.png',
    icon: CloudRain,
    tag: 'Trời mưa'
  },
  b: {
    title: 'Hao phí lao động xã hội thay đổi',
    body: '<p>Nếu quán tăng giá nguyên liệu (trà, sữa, đường, ly nhựa), tức là lượng lao động xã hội cần thiết để tạo ra ly trà sữa đã thực sự tăng lên.</p><ul><li><b>Giá trị hàng hóa:</b> Nguyên liệu đắt hơn đồng nghĩa với việc hao phí "lao động quá khứ" (vật hóa) kết tinh trong sản phẩm tăng.</li><li><b>Tác động:</b> Khi chính giá trị của ly trà sữa tăng lên, giá cả của nó tăng theo là hoàn toàn tất yếu theo quy luật giá trị.</li></ul>',
    img: '/ingredients.png',
    icon: Utensils,
    tag: 'Nguyên liệu'
  },
  c: {
    title: 'Giá trị lao động của shipper tăng',
    body: '<p>Giờ cao điểm khiến công việc của shipper vất vả hơn gấp nhiều lần (kẹt xe, kẹt đơn, thời tiết khắc nghiệt, rủi ro cao hơn).</p><ul><li><b>Hao phí sức lao động:</b> Sức lao động mà shipper phải bỏ ra tăng lên rõ rệt.</li><li><b>Tác động:</b> Phần phụ phí giờ cao điểm chính là sự bù đắp cho lượng lao động phức tạp và hao phí tăng thêm này, phản ánh đúng giá trị sức lao động thực tế.</li></ul>',
    img: '/rushhour.png',
    icon: Clock,
    tag: 'Giờ cao điểm'
  },
  d: {
    title: 'Trợ giá của nền tảng biến mất',
    body: '<p>Giá trị thật của ly trà sữa (do hao phí lao động xã hội cần thiết của quán và đầu bếp) có thể không đổi.</p><ul><li><b>Mã giảm giá:</b> Là hình thức nền tảng tự chiết khấu, "trợ giá" để thu hút khách hàng và chiếm lĩnh thị trường.</li><li><b>Tác động:</b> Khi hết mã giảm giá, bạn chỉ đơn giản là đang trả đúng với mức giá cả thị trường thực tế của sản phẩm mà thôi.</li></ul>',
    img: '/coupon.jpg',
    icon: Ticket,
    tag: 'Mã giảm giá'
  }
};

function App() {
  const [active, setActive] = useState('intro');
  
  // Interactive Question State
  const [questionAnswer, setQuestionAnswer] = useState(null);

  // Builder States
  const [platform, setPlatform] = useState('grab');
  const [restaurant, setRestaurant] = useState('binhdan'); // 'binhdan' (35k) | 'tra-sua' (55k) | 'nhahang' (120k)
  const [distance, setDistance] = useState(3);
  const [weather, setWeather] = useState('sunny'); // 'sunny' | 'rain'
  const [rush, setRush] = useState('normal'); // 'normal' | 'rush'
  const [coupon, setCoupon] = useState('none'); // 'none' | 'ship' (15k) | 'percent' (20%)

  // Timeline & Simulator States
  const [timeline, setTimeline] = useState(2);
  const [market, setMarket] = useState({ rain: 6, demand: 7, popularity: 3, drivers: 4, distance: 5 });
  const [flipped, setFlipped] = useState([]);

  // Quiz States
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [answered, setAnswered] = useState(false);

  // Shared Modals State
  const [modal, setModal] = useState(null);
  const [showCert, setShowCert] = useState(false);
  const [activeCity, setActiveCity] = useState(null);
  const [hoveredSummaryNode, setHoveredSummaryNode] = useState(null);

  // Dynamic Builder Calculation
  const receipt = useMemo(() => {
    const restaurantPrices = { binhdan: 35000, 'tra-sua': 55000, nhahang: 120000 };
    const platformFees = { grab: 8000, shopee: 6000, be: 7000 };
    
    const foodPrice = restaurantPrices[restaurant];
    const weatherMult = weather === 'rain' ? 1.4 : 1;
    const rushMult = rush === 'rush' ? 1.35 : 1;
    const serviceFee = platformFees[platform];
    
    const rawDelivery = 10000 + distance * 2500;
    const deliveryFee = Math.round(rawDelivery * weatherMult * rushMult);
    
    let discount = 0;
    if (coupon === 'ship') discount = Math.min(15000, deliveryFee);
    if (coupon === 'percent') discount = Math.round(foodPrice * 0.2);
    
    const total = Math.max(0, foodPrice + deliveryFee + serviceFee - discount);
    
    const notes = [];
    notes.push(`Món ăn có giá ${money(foodPrice)} — đây phản ánh hao phí lao động của nhà hàng: nguyên liệu, chế biến, mặt bằng.`);
    if (weather === 'rain') notes.push(`Trời mưa khiến ít shipper nhận đơn hơn trong khi nhiều người đặt hơn → phí giao hàng được đẩy lên (+40%).`);
    if (rush === 'rush') notes.push(`Giờ cao điểm làm tăng rủi ro và công sức của shipper → phụ phí giờ vàng (+35%).`);
    if (distance > 7) notes.push(`Khoảng cách ${distance}km khá xa — lao động vận chuyển (thời gian, xăng xe, hao mòn) nhiều hơn nên phí tăng theo từng km.`);
    if (discount > 0) notes.push(`Mã giảm giá không làm thay đổi giá trị món ăn, mà chỉ là phần nền tảng hoặc quán trợ giá cho bạn để giữ chân khách.`);
    
    return { foodPrice, deliveryFee, serviceFee, discount, total, notes };
  }, [restaurant, distance, weather, rush, platform, coupon]);

  // Simulator Calculator
  const marketPrice = useMemo(() => {
    const BASE_VALUE = 45000;
    const demandForce = market.rain * 1.5 + market.demand * 2 + market.popularity * 1.2 + market.distance * 0.8;
    const supplyForce = Math.max(1, market.drivers * 6);
    const ratio = demandForce / supplyForce;
    
    let price = BASE_VALUE * (0.7 + ratio * 0.6);
    return Math.round(Math.max(20000, Math.min(140000, price)));
  }, [market]);

  const go = (id) => setActive(id);
  const next = () => go(sections[(sections.findIndex((s) => s.id === active) + 1) % sections.length].id);

  function pickAnswer(i) {
    if (answered) return;
    setPicked(i);
    setAnswered(true);
    if (i === quiz[quizIndex].answer) setScore((s) => s + 1);
  }

  function nextQuiz() {
    if (quizIndex === quiz.length - 1) {
      setQuizIndex(quiz.length);
    } else {
      setQuizIndex((i) => i + 1);
      setPicked(null);
      setAnswered(false);
    }
  }

  function restartQuiz() {
    setQuizIndex(0);
    setScore(0);
    setPicked(null);
    setAnswered(false);
  }

  return (
    <main className="app">
      <aside className="rail" aria-label="Điều hướng">
        {sections.map(({ id, label, icon: Icon }) => (
          <button key={id} className={active === id ? 'active' : ''} onClick={() => go(id)} title={label} aria-label={label}>
            <Icon size={20} />
          </button>
        ))}
      </aside>

      {/* MODAL SYSTEM */}
      {modal && (
        <div className="modal-root open">
          <div className="modal-backdrop" onClick={() => setModal(null)}></div>
          <div className="modal-card">
            <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            <div className="modal-content">
              {modal.img && (
                <div style={{ width: '100%', height: '200px', overflow: 'hidden', borderBottom: '1px solid var(--line)', borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
                  <img src={assetUrl(modal.img)} alt={modal.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div className="modal-head">
                <div className="modal-icon-badge">
                  {React.createElement(modal.icon, { size: 30, className: "modal-icon-svg" })}
                </div>
                <span className="modal-tag">{modal.tag}</span>
                <h3>{modal.title}</h3>
              </div>
              <div className="modal-body">
                <div className="modal-desc" dangerouslySetInnerHTML={{ __html: modal.body }} />
                {modal.stats && modal.stats.length > 0 && (
                  <div className="modal-stats">
                    {modal.stats.map(([label, val]) => (
                      <div className="modal-stat" key={label}>
                        <span className="stat-label">{label}</span>
                        <span className="stat-value">{val}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}


      {/* SECTION 1: HERO */}
      <section className={`screen ${active === 'intro' ? 'show' : ''}`}>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Một hành trình khám phá · Kinh tế Chính trị</p>
            <h1>Vì sao ly trà sữa<br/><span style={{ color: 'var(--red)' }}>hôm nay đắt hơn</span><br/>hôm qua?</h1>
            <p>
              Mỗi đơn GrabFood, ShopeeFood hay beFood bạn đặt đều đang vận hành theo một quy luật kinh tế 
              đã được Karl Marx mô tả từ hơn 150 năm trước: <strong>Quy luật giá trị</strong>.
            </p>
            <button className="primary" onClick={() => go('question')}>Bắt đầu khám phá <ArrowRight size={18} /></button>
          </div>
          <div className="phone-visual" aria-label="Mô phỏng đơn giao đồ ăn">
            <div className="phone-top"></div>
            <div className="delivery-map">
              <div className="delivery-grid" aria-hidden="true"></div>
              <svg className="delivery-routes" viewBox="0 0 640 310" aria-hidden="true">
                <path className="street-path" d="M88 210 L178 210 Q214 210 214 174 L214 96 L334 96 Q370 96 370 132 L370 226 L550 226" />
                <path className="street-path" d="M88 210 L88 72 L248 72 Q284 72 284 108 L284 154 L492 154 Q528 154 528 76" />
                <path className="street-path" d="M238 238 L238 184 Q238 148 274 148 L430 148 L430 88 L550 88" />
                <path className="route-path route-path-one" d="M88 210 L178 210 Q214 210 214 174 L214 96 L334 96 Q370 96 370 132 L370 226 L550 226" />
                <path className="route-path route-path-two" d="M88 210 L88 72 L248 72 Q284 72 284 108 L284 154 L492 154 Q528 154 528 76" />
                <path className="route-path route-path-three" d="M238 238 L238 184 Q238 148 274 148 L430 148 L430 88 L550 88" />
              </svg>
              <div className="map-place shop-place stop-main">
                <span className="shop-icon"></span>
                <span className="place-label">Quán</span>
              </div>
              <div className="map-place person-place stop-a">
                <span className="stick-person"></span>
                <span className="place-label">Khách A</span>
              </div>
              <div className="map-place person-place stop-b">
                <span className="stick-person"></span>
                <span className="place-label">Khách B</span>
              </div>
              <div className="map-place shop-place stop-c">
                <span className="shop-icon"></span>
                <span className="place-label">Quán 2</span>
              </div>
              <div className="map-place person-place stop-d">
                <span className="stick-person"></span>
                <span className="place-label">Khách C</span>
              </div>
              <div className="delivery-bike bike-on-path path-one">
                <Bike className="bike-icon" size={26} />
                <span className="delivery-box"></span>
              </div>
              <div className="delivery-bike bike-on-path path-two">
                <Bike className="bike-icon" size={24} />
                <span className="delivery-box"></span>
              </div>
              <div className="delivery-bike bike-on-path path-three">
                <Bike className="bike-icon" size={22} />
                <span className="delivery-box"></span>
              </div>
            </div>
            <div className="order-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px' }}>
              <img 
                src="https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=150&auto=format&fit=crop&q=80" 
                alt="Trà sữa trân châu" 
                style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--line)' }} 
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                <b style={{ fontSize: '15px', color: 'var(--ink)' }}>Trà sữa trân châu</b>
                <span style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: '1.2' }}>Phí giao hàng biến động liên tục</span>
                <strong style={{ fontSize: '20px', color: 'var(--red)', fontWeight: '850', marginTop: '4px' }}>{money(72000)}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: INTERACTIVE QUESTION */}
      <section className={`screen center ${active === 'question' ? 'show' : ''}`}>
        <p className="eyebrow">Tình huống thật</p>
        <h2 style={{ maxWidth: '860px', margin: '0 auto 24px' }}>
          "Tại sao cùng một ly trà sữa, hôm qua bạn chỉ trả <span style={{ textDecoration: 'line-through', opacity: 0.5 }}>55.000đ</span>, nhưng hôm nay lại là 82.000đ?"
        </h2>
        
        <div className="answer-grid">
          <button 
            className={`info-card ${questionAnswer === 'a' ? 'active' : ''}`} 
            onClick={() => {
              setQuestionAnswer('a');
              setModal({
                title: questionExplanations.a.title,
                body: questionExplanations.a.body,
                img: questionExplanations.a.img,
                icon: questionExplanations.a.icon,
                tag: questionExplanations.a.tag
              });
            }}
          >
            <span>Trời mưa, ai cũng đặt trà sữa</span>
          </button>
          <button 
            className={`info-card ${questionAnswer === 'b' ? 'active' : ''}`} 
            onClick={() => {
              setQuestionAnswer('b');
              setModal({
                title: questionExplanations.b.title,
                body: questionExplanations.b.body,
                img: questionExplanations.b.img,
                icon: questionExplanations.b.icon,
                tag: questionExplanations.b.tag
              });
            }}
          >
            <span>Quán tăng giá nguyên liệu pha chế</span>
          </button>
          <button 
            className={`info-card ${questionAnswer === 'c' ? 'active' : ''}`} 
            onClick={() => {
              setQuestionAnswer('c');
              setModal({
                title: questionExplanations.c.title,
                body: questionExplanations.c.body,
                img: questionExplanations.c.img,
                icon: questionExplanations.c.icon,
                tag: questionExplanations.c.tag
              });
            }}
          >
            <span>Ứng dụng tính phí giờ cao điểm</span>
          </button>
          <button 
            className={`info-card ${questionAnswer === 'd' ? 'active' : ''}`} 
            onClick={() => {
              setQuestionAnswer('d');
              setModal({
                title: questionExplanations.d.title,
                body: questionExplanations.d.body,
                img: questionExplanations.d.img,
                icon: questionExplanations.d.icon,
                tag: questionExplanations.d.tag
              });
            }}
          >
            <span>Mã giảm giá đã hết hạn sử dụng</span>
          </button>
        </div>

        <p className="note" style={{ marginTop: '24px', marginBottom: '32px' }}>
          Bấm vào một giả thuyết phía trên để xem giải thích chi tiết trong modal dưới góc nhìn của Quy luật giá trị.
        </p>

        <button className="secondary" onClick={next}>Tiếp tục <ArrowRight size={17} /></button>
      </section>

      {/* SECTION 3: UPGRADED BUILDER */}
      <section className={`screen ${active === 'builder' ? 'show' : ''}`}>
        <div className="builder" style={{ '--accent': platformData[platform].color }}>
          <div>
            <p className="eyebrow">Phòng thí nghiệm giá</p>
            <h2>Tự tay đặt một đơn hàng</h2>
            <div className="panel">
              <label>Nền tảng đặt món</label>
              <div className="chips">
                {Object.entries(platformData).map(([key, p]) => (
                  <button key={key} className={platform === key ? `chip active ${p.className}` : 'chip'} onClick={() => setPlatform(key)}>{p.name}</button>
                ))}
              </div>

              <label>Chọn món ăn / Nhà hàng</label>
              <div className="chips">
                <button className={restaurant === 'binhdan' ? 'chip active' : 'chip'} onClick={() => setRestaurant('binhdan')}>Cơm bình dân</button>
                <button className={restaurant === 'tra-sua' ? 'chip active' : 'chip'} onClick={() => setRestaurant('tra-sua')}>Trà sữa</button>
                <button className={restaurant === 'nhahang' ? 'chip active' : 'chip'} onClick={() => setRestaurant('nhahang')}>Nhà hàng cao cấp</button>
              </div>

              <label>Thời tiết</label>
              <div className="chips">
                <button className={weather === 'sunny' ? 'chip active' : 'chip'} onClick={() => setWeather('sunny')}>☀️ Nắng đẹp</button>
                <button className={weather === 'rain' ? 'chip active' : 'chip'} onClick={() => setWeather('rain')}>🌧️ Mưa lớn</button>
              </div>

              <label>Thời điểm đặt</label>
              <div className="chips">
                <button className={rush === 'normal' ? 'chip active' : 'chip'} onClick={() => setRush('normal')}>🕐 Giờ thường</button>
                <button className={rush === 'rush' ? 'chip active' : 'chip'} onClick={() => setRush('rush')}>🔥 Giờ vàng</button>
              </div>

              <label>Khoảng cách: <b>{distance} km</b></label>
              <input type="range" min="1" max="15" value={distance} onChange={(e) => setDistance(Number(e.target.value))} style={{ background: `linear-gradient(to right, var(--accent, var(--blue)) ${((distance - 1) / 14) * 100}%, var(--paper) ${((distance - 1) / 14) * 100}%)` }} />

              <label>Mã giảm giá</label>
              <div className="chips">
                <button className={coupon === 'none' ? 'chip active' : 'chip'} onClick={() => setCoupon('none')}>Không dùng</button>
                <button className={coupon === 'ship' ? 'chip active' : 'chip'} onClick={() => setCoupon('ship')}>Freeship 15K</button>
                <button className={coupon === 'percent' ? 'chip active' : 'chip'} onClick={() => setCoupon('percent')}>Giảm 20% món</button>
              </div>
            </div>
          </div>
          
          <div className="receipt">
            <h3>Hóa đơn {platformData[platform].name}</h3>
            <Row label="Giá món ăn" value={money(receipt.foodPrice)} />
            <Row label="Phí giao hàng" value={money(receipt.deliveryFee)} />
            <Row label="Phí dịch vụ" value={money(receipt.serviceFee)} />
            {receipt.discount > 0 && <Row label="Giảm giá" value={`-${money(receipt.discount)}`} style={{ color: 'var(--red)' }} />}
            <div className="divider"></div>
            <Row label="Tổng thanh toán" value={money(receipt.total)} strong />
            
            <div className="receipt-explain-list" style={{ marginTop: '16px', fontSize: '13px', lineHeight: '1.5', color: 'var(--muted)', textAlign: 'left' }}>
              {receipt.notes.map((n, idx) => (
                <p key={idx} style={{ marginBottom: '8px' }}>• <span dangerouslySetInnerHTML={{ __html: n }} /></p>
              ))}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '36px', paddingBottom: '32px' }}>
          <button className="secondary" style={{ marginTop: 0 }} onClick={next}>Tiếp tục <ArrowRight size={17} /></button>
        </div>
      </section>

      {/* SECTION 4: INTERACTIVE JOURNEY */}
      <section className={`screen center ${active === 'journey' ? 'show' : ''}`}>
        <p className="eyebrow">Sơ đồ tương tác</p>
        <h2>Giá trị đi qua những ai?</h2>
        <p className="note" style={{ marginBottom: '32px' }}>Nhấn vào từng nút trong chuỗi để xem lao động nào đã được bỏ ra và giá trị kết tinh ở đâu.</p>
        
        <div className="journey-interactive-flow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'nowrap', gap: '12px', maxWidth: '1280px', margin: '0 auto 36px', overflowX: 'auto', padding: '10px' }}>
          <button className="info-card" onClick={() => setModal(journeyData.customer1)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '140px', minHeight: '80px', padding: '16px 12px', flexShrink: 0 }}>
            <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--ink)' }}>Khách hàng</span>
          </button>
          <span className="flow-arrow" style={{ color: 'var(--line)', fontSize: '20px', fontWeight: 'bold', flexShrink: 0 }}>→</span>

          <button className="info-card" onClick={() => setModal(journeyData.restaurant)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '140px', minHeight: '80px', padding: '16px 12px', flexShrink: 0 }}>
            <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--ink)' }}>Nhà hàng</span>
          </button>
          <span className="flow-arrow" style={{ color: 'var(--line)', fontSize: '20px', fontWeight: 'bold', flexShrink: 0 }}>→</span>

          <button className="info-card" onClick={() => setModal(journeyData.kitchen)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '140px', minHeight: '80px', padding: '16px 12px', flexShrink: 0 }}>
            <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--ink)' }}>Đầu bếp</span>
          </button>
          <span className="flow-arrow" style={{ color: 'var(--line)', fontSize: '20px', fontWeight: 'bold', flexShrink: 0 }}>→</span>

          <button className="info-card" onClick={() => setModal(journeyData.platform)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '140px', minHeight: '80px', padding: '16px 12px', flexShrink: 0 }}>
            <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--ink)' }}>Nền tảng</span>
          </button>
          <span className="flow-arrow" style={{ color: 'var(--line)', fontSize: '20px', fontWeight: 'bold', flexShrink: 0 }}>→</span>

          <button className="info-card" onClick={() => setModal(journeyData.shipper)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '140px', minHeight: '80px', padding: '16px 12px', flexShrink: 0 }}>
            <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--ink)' }}>Shipper</span>
          </button>
          <span className="flow-arrow" style={{ color: 'var(--line)', fontSize: '20px', fontWeight: 'bold', flexShrink: 0 }}>→</span>

          <button className="info-card" onClick={() => setModal(journeyData.customer2)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '140px', minHeight: '80px', padding: '16px 12px', flexShrink: 0 }}>
            <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--ink)' }}>Khách nhận</span>
          </button>
        </div>

        <button className="secondary" onClick={next}>Xem giá dao động <ArrowRight size={17} /></button>
      </section>

      {/* SECTION 5: TIMELINE */}
      <section className={`screen center ${active === 'timeline' ? 'show' : ''}`}>
        <p className="eyebrow">Kéo để khám phá</p>
        <h2>Một ngày, năm mức giá</h2>
        
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '32px', maxWidth: '800px', margin: '28px auto 16px', flexWrap: 'wrap' }}>
          <div className="timeline-img-card" style={{ width: '280px', height: '180px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', border: '1px solid var(--line)', position: 'relative' }}>
            <img 
              src={assetUrl(timelineData[timeline].img)} 
              alt={timelineData[timeline].label} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.4s ease' }} 
            />
            <span style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.65)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}>
              Thời điểm: {timelineData[timeline].label}
            </span>
          </div>
          
          <div className="timeline" style={{ margin: '0', height: '180px', width: '220px', display: 'flex', alignItems: 'end', justifyContent: 'center', gap: '16px' }}>
            <div className="bar" style={{ height: `${timelineData[timeline].height}%`, width: '50px' }}></div>
            <strong style={{ fontSize: '26px' }}>{money(timelineData[timeline].fee)}</strong>
          </div>
        </div>

        <div className="timeline-controls">
          <input type="range" min="0" max="4" value={timeline} onChange={(e) => setTimeline(Number(e.target.value))} style={{ background: `linear-gradient(to right, var(--blue) ${(timeline / 4) * 100}%, var(--paper) ${(timeline / 4) * 100}%)` }} />
          <div className="marks">{timelineData.map((t, i) => <span className={i === timeline ? 'active' : ''} key={t.label}>{t.label}</span>)}</div>
        </div>
        <p className="note" style={{ maxWidth: '640px', margin: '0 auto 24px' }}>{timelineData[timeline].text}</p>
        <button className="secondary" onClick={next} style={{ marginTop: '24px' }}>Tiếp tục <ArrowRight size={17} /></button>
      </section>

      {/* SECTION 6: MAP */}
      <section className={`screen center ${active === 'map' ? 'show' : ''}`}>
        <p className="eyebrow">Khắp Việt Nam</p>
        <h2>Quy luật ở mỗi vùng đất</h2>
        <p className="note" style={{ marginBottom: '32px' }}>Bấm vào các điểm chấm trên bản đồ hoặc danh sách thành phố để xem chi tiết đặc thù thị trường.</p>
        
        <div className="map-section-container" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '48px', maxWidth: '1100px', margin: '32px auto', flexWrap: 'wrap' }}>
          
          {/* Vietnam SVG Map */}
          <div className="vietnam-map-box" style={{ width: '440px', height: '650px', position: 'relative', background: 'white', borderRadius: '24px', padding: '24px 20px 20px', boxShadow: '0 10px 30px rgba(15,23,42,0.08)', border: '1.5px solid var(--line)' }}>
            <div style={{ position: 'absolute', top: '16px', left: '18px', display: 'flex', flexDirection: 'column', gap: '2px', zIndex: 12 }}>
              <span style={{ fontSize: '11px', fontWeight: '850', color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Bản đồ Việt Nam</span>
              <span style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: '600' }}>Toàn vẹn lãnh thổ & Đảo chủ quyền</span>
            </div>
            
            <div className="map-relative-wrapper" style={{ position: 'relative', width: '100%', height: '100%', marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={assetUrl('/vietnam-map-custom.png')} 
                alt="Bản đồ Việt Nam và Quần đảo Hoàng Sa, Trường Sa" 
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', borderRadius: '16px' }} 
              />
              
              {/* Hotspot overlays accurately positioned on user custom map */}
              <MapHotspot name="Hà Nội" left="35.5%" top="18.5%" active={activeCity === 'hanoi'} onClick={() => setModal(cityData.hanoi)} onMouseEnter={() => setActiveCity('hanoi')} onMouseLeave={() => setActiveCity(null)} />
              <MapHotspot name="Đà Nẵng" left="48.0%" top="44.5%" active={activeCity === 'danang'} onClick={() => setModal(cityData.danang)} onMouseEnter={() => setActiveCity('danang')} onMouseLeave={() => setActiveCity(null)} />
              <MapHotspot name="TP. Hồ Chí Minh" left="40.5%" top="74.0%" active={activeCity === 'hcmc'} onClick={() => setModal(cityData.hcmc)} onMouseEnter={() => setActiveCity('hcmc')} onMouseLeave={() => setActiveCity(null)} />
              <MapHotspot name="Cần Thơ" left="33.5%" top="81.0%" active={activeCity === 'cantho'} onClick={() => setModal(cityData.cantho)} onMouseEnter={() => setActiveCity('cantho')} onMouseLeave={() => setActiveCity(null)} />
            </div>
          </div>

          {/* City list cards on the right */}
          <div className="city-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 240px))', gap: '20px', margin: '0' }}>
            {Object.entries(cityData).map(([key, data]) => (
              <button 
                key={key} 
                className={`info-card city-card ${activeCity === key ? 'highlighted' : ''}`} 
                onClick={() => setModal(data)} 
                onMouseEnter={() => setActiveCity(key)}
                onMouseLeave={() => setActiveCity(null)}
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden', borderRadius: '16px', border: activeCity === key ? '2px solid var(--blue)' : '1.5px solid var(--line)', background: 'white', minHeight: '230px', transition: 'all 0.25s ease', boxShadow: activeCity === key ? '0 12px 30px rgba(37,99,235,0.12)' : 'var(--shadow-sm)' }}
              >
                <div style={{ width: '100%', height: '110px', overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={assetUrl(data.img)} 
                    alt={data.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease', transform: activeCity === key ? 'scale(1.08)' : 'scale(1)' }} 
                    className="city-img"
                  />
                  <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--blue)', color: 'white', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '800' }}>
                    {data.tag.split(' · ')[0]}
                  </span>
                </div>
                <div style={{ padding: '16px', textAlign: 'left', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between', width: '100%' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '850', color: 'var(--ink)', margin: '0' }}>{data.title}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px', lineHeight: '1.4' }}>{data.body}</p>
                  </div>
                  <span style={{ color: 'var(--blue)', fontSize: '12px', fontWeight: '800', marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Xem dữ liệu 📊
                  </span>
                </div>
              </button>
            ))}
          </div>

        </div>
        <button className="secondary" onClick={next} style={{ marginTop: '36px' }}>Tiếp tục <ArrowRight size={17} /></button>
      </section>

      {/* SECTION 7: PLAYGROUND */}
      <section className={`screen ${active === 'playground' ? 'show' : ''}`}>
        <div className="simulator">
          <div>
            <p className="eyebrow">Sân chơi Quy luật</p>
            <h2>Bạn điều khiển thị trường</h2>
            
            <label className="sim-control">🌧️ Thời tiết xấu: <b>{market.rain}</b>
              <input type="range" min="0" max="10" value={market.rain} onChange={(e) => setMarket({ ...market, rain: Number(e.target.value) })} style={{ background: `linear-gradient(to right, var(--blue) ${(market.rain / 10) * 100}%, var(--paper) ${(market.rain / 10) * 100}%)` }} />
            </label>

            <label className="sim-control">📍 Khoảng cách (km): <b>{market.distance}</b>
              <input type="range" min="1" max="15" value={market.distance} onChange={(e) => setMarket({ ...market, distance: Number(e.target.value) })} style={{ background: `linear-gradient(to right, var(--blue) ${((market.distance - 1) / 14) * 100}%, var(--paper) ${((market.distance - 1) / 14) * 100}%)` }} />
            </label>

            <label className="sim-control">🔥 Nhu cầu thị trường: <b>{market.demand}</b>
              <input type="range" min="0" max="10" value={market.demand} onChange={(e) => setMarket({ ...market, demand: Number(e.target.value) })} style={{ background: `linear-gradient(to right, var(--blue) ${(market.demand / 10) * 100}%, var(--paper) ${(market.demand / 10) * 100}%)` }} />
            </label>

            <label className="sim-control">⭐ Độ nổi tiếng quán: <b>{market.popularity}</b>
              <input type="range" min="0" max="10" value={market.popularity} onChange={(e) => setMarket({ ...market, popularity: Number(e.target.value) })} style={{ background: `linear-gradient(to right, var(--blue) ${(market.popularity / 10) * 100}%, var(--paper) ${(market.popularity / 10) * 100}%)` }} />
            </label>

            <label className="sim-control">🛵 Số lượng shipper: <b>{market.drivers}</b>
              <input type="range" min="1" max="10" value={market.drivers} onChange={(e) => setMarket({ ...market, drivers: Number(e.target.value) })} style={{ background: `linear-gradient(to right, var(--blue) ${((market.drivers - 1) / 9) * 100}%, var(--paper) ${((market.drivers - 1) / 9) * 100}%)` }} />
            </label>
          </div>
          
          <div className="gauge">
            <span>Giá trị thực tế (Cố định): {money(45000)}</span>
            <strong className={marketPrice > 49500 ? 'hot' : marketPrice < 40500 ? 'ok' : ''} style={{ color: marketPrice > 49500 ? 'var(--red)' : marketPrice < 40500 ? '#4fd1a5' : '#ffc94a' }}>
              {money(marketPrice)}
            </strong>
            <div className="gauge-track">
              <i style={{ width: `${Math.min(100, (marketPrice / 100000) * 100)}%` }}></i>
            </div>
            <p className="sim-desc-text" dangerouslySetInnerHTML={{
              __html: marketPrice > 49500 
                ? 'Giá cả đang <b>cao hơn giá trị thực</b> khá nhiều. Cầu (mưa, nhu cầu, độ nổi tiếng) đang vượt xa cung (số shipper) — đúng như quy luật giá trị dự đoán: khi cầu &gt; cung, giá cả bị đẩy lên trên giá trị.'
                : marketPrice < 40500 
                ? 'Giá cả đang <b>thấp hơn giá trị thực</b>. Cung (nhiều shipper) đang vượt cầu — thị trường dư nguồn lực nên giá cả tạm thời rẻ hơn giá trị.'
                : 'Giá cả đang <b>dao động rất gần giá trị thực</b> — đây là trạng thái cân bằng cung cầu tương đối, đúng như bản chất "trung tâm hấp dẫn" mà giá trị đóng vai trò trong quy luật giá trị của Marx.'
            }} />
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '36px', paddingBottom: '32px' }}>
          <button className="secondary" style={{ marginTop: 0 }} onClick={next}>Tiếp tục <ArrowRight size={17} /></button>
        </div>
      </section>

      {/* SECTION 8: FLIP CARDS */}
      <section className={`screen center ${active === 'cards' ? 'show' : ''}`}>
        <p className="eyebrow">Nền tảng lý thuyết</p>
        <h2>Bốn khái niệm cốt lõi</h2>
        <div className="flash-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', maxWidth: '1050px', margin: '32px auto' }}>
          {flashCards.map(({ front, back, img }) => (
            <button 
              className="info-card" 
              key={front} 
              onClick={() => setModal({
                icon: BookOpen,
                tag: 'Nền tảng lý thuyết',
                title: front,
                body: back,
                img: img
              })}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '140px',
                padding: '24px',
                background: 'white',
                border: '1.5px solid var(--line)',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.28s ease'
              }}
            >
              <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--ink)' }}>{front}</span>
            </button>
          ))}
        </div>
        <button className="secondary" onClick={next} style={{ marginTop: '36px' }}>Tiếp tục <ArrowRight size={17} /></button>
      </section>

      {/* SECTION 9: QUIZ (5 questions + cert popup) */}
      <section className={`screen center ${active === 'quiz' ? 'show' : ''}`}>
        <p className="eyebrow">Kiểm tra cuối</p>
        {quizIndex >= quiz.length ? (
          <div className="cert-card">
            <div className="cert-border-outer">
              <div className="cert-border-inner">
                {/* Vintage Seal Stamp */}
                <div className="cert-seal-badge" style={{ position: 'absolute', right: '40px', bottom: '40px' }}>
                  <svg className="cert-seal-svg" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="#fff" strokeWidth="2" strokeDasharray="3,3" />
                    <path d="M50,2 L55,18 L71,10 L68,27 L83,23 L73,37 L88,40 L74,50 L88,60 L73,63 L83,77 L68,73 L71,90 L55,82 L50,98 L45,82 L29,90 L32,73 L17,77 L27,63 L12,60 L26,50 L12,40 L27,37 L17,23 L32,27 L29,10 L45,18 Z" opacity="0.15" />
                  </svg>
                  <div className="cert-seal-text">
                    CHỨNG NHẬN<br/>HOÀN THÀNH
                  </div>
                </div>

                {/* Header */}
                <h3 className="cert-header" style={{ margin: '0 0 4px 0' }}>Chứng nhận hoàn thành</h3>
                <div className="cert-subheader">Hành trình khám phá quy luật giá trị</div>
                
                <div className="cert-presented-to">Chứng nhận này được trân trọng trao cho</div>
                <div className="cert-recipient">Học Viên Học Tập Mác - Lênin</div>
                
                <div className="cert-body-text">
                  Vì đã xuất sắc vượt qua các thử thách thực tế và đạt số điểm <strong>{score}/{quiz.length}</strong> trong phần kiểm tra cuối khoá. Bạn đã thấu hiểu cách thức <strong>Quy luật giá trị</strong> và lý luận <strong>Kinh tế Chính trị Mác - Lênin</strong> âm thầm chi phối sự vận hành của nền kinh tế thị trường thông qua các tình huống đặt đơn hàng trực tuyến hàng ngày.
                </div>
                
                {/* Meta details (Date & Signatures) */}
                <div className="cert-meta-container">
                  <div className="cert-signature-box">
                    <div className="cert-signature-img" style={{ transform: 'rotate(-4deg)' }}>
                      Karl Marx
                    </div>
                    <div className="cert-signature-line">Karl Marx</div>
                  </div>
                  
                  <div className="cert-signature-box" style={{ marginRight: '110px' }}>
                    <div className="cert-signature-img" style={{ transform: 'rotate(2deg)' }}>
                      Friedrich Engels
                    </div>
                    <div className="cert-signature-line">F. Engels</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '36px', position: 'relative', zIndex: 10 }}>
                  <button className="secondary" style={{ marginTop: 0, background: '#fff', border: '1.5px solid var(--line)' }} onClick={restartQuiz}>
                    Làm lại <RefreshCw size={16} />
                  </button>
                  <button className="primary" style={{ marginTop: 0 }} onClick={() => go('final')}>
                    Đi đến Tổng kết <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="quiz-box" style={{ maxWidth: '640px', width: '100%' }}>
            {/* PROGRESS BAR */}
            <div className="quiz-progress" style={{ height: '6px', background: 'var(--paper)', borderRadius: '999px', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ height: '100%', background: 'var(--red)', width: `${(quizIndex / quiz.length) * 100}%`, transition: 'width 0.3s ease' }}></div>
            </div>
            
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Câu {quizIndex + 1}/{quiz.length}: {quiz[quizIndex].q}</h2>
            
            <div className="quiz-options" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {quiz[quizIndex].options.map((opt, i) => (
                <button
                  key={opt}
                  onClick={() => pickAnswer(i)}
                  className={picked === null ? '' : i === quiz[quizIndex].answer ? 'right' : picked === i ? 'wrong' : ''}
                  disabled={answered}
                >
                  {opt}
                </button>
              ))}
            </div>

            {answered && (
              <div className="theory-block" style={{ borderLeftColor: 'var(--sun)', marginTop: '24px', animation: 'show 0.3s ease both' }}>
                <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: '1.6' }}>{quiz[quizIndex].explain}</p>
                <button className="primary" style={{ marginTop: '16px' }} onClick={nextQuiz}>
                  {quizIndex === quiz.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'} <ArrowRight size={17} />
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* SECTION 10: FINAL SUMMARY */}
      <section className={`screen center ${active === 'final' ? 'show' : ''}`}>
        <p className="eyebrow">Khép lại hành trình</p>
        <h2>Tất cả đã kết nối với nhau</h2>
        
        <div className="final-map-container" style={{ margin: '32px auto', position: 'relative', height: '420px', maxWidth: '680px', width: '100%', background: '#fafaf9', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', border: '1.5px solid var(--line)', overflow: 'hidden', backgroundImage: 'radial-gradient(circle at 1px 1px, var(--line) 1.5px, transparent 0)', backgroundSize: '24px 24px' }}>
          {/* Animated SVG Connections */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
            <line 
              x1="20%" y1="22%" x2="50%" y2="50%" 
              stroke={hoveredSummaryNode === 'customer' ? 'var(--blue)' : 'rgba(37, 99, 235, 0.25)'} 
              strokeWidth={hoveredSummaryNode === 'customer' ? '4' : '2'} 
              strokeDasharray="6,6" 
              className="flowing-line" 
              style={{ transition: 'all 0.3s ease', filter: hoveredSummaryNode === 'customer' ? 'drop-shadow(0 0 8px var(--blue))' : 'none' }}
            />
            <line 
              x1="80%" y1="22%" x2="50%" y2="50%" 
              stroke={hoveredSummaryNode === 'restaurant' ? 'var(--red)' : 'rgba(230, 57, 70, 0.25)'} 
              strokeWidth={hoveredSummaryNode === 'restaurant' ? '4' : '2'} 
              strokeDasharray="6,6" 
              className="flowing-line" 
              style={{ transition: 'all 0.3s ease', filter: hoveredSummaryNode === 'restaurant' ? 'drop-shadow(0 0 8px var(--red))' : 'none' }}
            />
            <line 
              x1="80%" y1="78%" x2="50%" y2="50%" 
              stroke={hoveredSummaryNode === 'shipper' ? '#10b981' : 'rgba(16, 185, 129, 0.25)'} 
              strokeWidth={hoveredSummaryNode === 'shipper' ? '4' : '2'} 
              strokeDasharray="6,6" 
              className="flowing-line" 
              style={{ transition: 'all 0.3s ease', filter: hoveredSummaryNode === 'shipper' ? 'drop-shadow(0 0 8px #10b981)' : 'none' }}
            />
            <line 
              x1="20%" y1="78%" x2="50%" y2="50%" 
              stroke={hoveredSummaryNode === 'platform' ? '#f59e0b' : 'rgba(245, 158, 11, 0.25)'} 
              strokeWidth={hoveredSummaryNode === 'platform' ? '4' : '2'} 
              strokeDasharray="6,6" 
              className="flowing-line" 
              style={{ transition: 'all 0.3s ease', filter: hoveredSummaryNode === 'platform' ? 'drop-shadow(0 0 8px #f59e0b)' : 'none' }}
            />
          </svg>

          {/* Node 1: Customer */}
          <div 
            className="summary-node-card" 
            style={{ 
              left: '20%', 
              top: '22%',
              borderColor: hoveredSummaryNode === 'customer' ? 'var(--blue)' : 'var(--line)',
              boxShadow: hoveredSummaryNode === 'customer' ? '0 12px 28px rgba(37, 99, 235, 0.16)' : '0 8px 24px rgba(24, 24, 27, 0.04)'
            }}
            onMouseEnter={() => setHoveredSummaryNode('customer')}
            onMouseLeave={() => setHoveredSummaryNode(null)}
          >
            <Users size={20} style={{ color: 'var(--blue)', transition: 'transform 0.3s ease', transform: hoveredSummaryNode === 'customer' ? 'scale(1.2)' : 'scale(1)' }} />
            <span className="summary-node-label">Khách nhận trà sữa</span>
            <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px', fontWeight: 'bold' }}>(Tiêu dùng hàng hóa)</span>
          </div>

          {/* Node 2: Restaurant */}
          <div 
            className="summary-node-card" 
            style={{ 
              left: '80%', 
              top: '22%',
              borderColor: hoveredSummaryNode === 'restaurant' ? 'var(--red)' : 'var(--line)',
              boxShadow: hoveredSummaryNode === 'restaurant' ? '0 12px 28px rgba(230, 57, 70, 0.16)' : '0 8px 24px rgba(24, 24, 27, 0.04)'
            }}
            onMouseEnter={() => setHoveredSummaryNode('restaurant')}
            onMouseLeave={() => setHoveredSummaryNode(null)}
          >
            <Store size={20} style={{ color: 'var(--red)', transition: 'transform 0.3s ease', transform: hoveredSummaryNode === 'restaurant' ? 'scale(1.2)' : 'scale(1)' }} />
            <span className="summary-node-label">Nhà hàng bỏ vốn</span>
            <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px', fontWeight: 'bold' }}>(Tư bản bất biến - c)</span>
          </div>

          {/* Node 3: Shipper */}
          <div 
            className="summary-node-card" 
            style={{ 
              left: '80%', 
              top: '78%',
              borderColor: hoveredSummaryNode === 'shipper' ? '#10b981' : 'var(--line)',
              boxShadow: hoveredSummaryNode === 'shipper' ? '0 12px 28px rgba(16, 185, 129, 0.16)' : '0 8px 24px rgba(24, 24, 27, 0.04)'
            }}
            onMouseEnter={() => setHoveredSummaryNode('shipper')}
            onMouseLeave={() => setHoveredSummaryNode(null)}
          >
            <Bike size={20} style={{ color: '#10b981', transition: 'transform 0.3s ease', transform: hoveredSummaryNode === 'shipper' ? 'scale(1.2)' : 'scale(1)' }} />
            <span className="summary-node-label">Shipper bỏ công</span>
            <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px', fontWeight: 'bold' }}>(Tư bản khả biến - v)</span>
          </div>

          {/* Node 4: Platform */}
          <div 
            className="summary-node-card" 
            style={{ 
              left: '20%', 
              top: '78%',
              borderColor: hoveredSummaryNode === 'platform' ? '#f59e0b' : 'var(--line)',
              boxShadow: hoveredSummaryNode === 'platform' ? '0 12px 28px rgba(245, 158, 11, 0.16)' : '0 8px 24px rgba(24, 24, 27, 0.04)'
            }}
            onMouseEnter={() => setHoveredSummaryNode('platform')}
            onMouseLeave={() => setHoveredSummaryNode(null)}
          >
            <Smartphone size={20} style={{ color: '#f59e0b', transition: 'transform 0.3s ease', transform: hoveredSummaryNode === 'platform' ? 'scale(1.2)' : 'scale(1)' }} />
            <span className="summary-node-label">App thu phí dịch vụ</span>
            <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px', fontWeight: 'bold' }}>(Giá trị thặng dư - m)</span>
          </div>

          {/* Center: Value */}
          <div className="summary-center-card" style={{ zIndex: 10 }}>
            <Gem size={32} style={{ color: 'white', marginBottom: '6px' }} />
            <span className="summary-center-label">Giá trị</span>
          </div>
        </div>

        {/* INTERACTIVE FORMULA HUD */}
        <div className="formula-hud" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '24px auto', padding: '20px 24px', background: '#f8fafc', borderRadius: '16px', border: '1.5px solid var(--line)', maxWidth: '680px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ fontSize: '13.5px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)', fontWeight: '750', marginBottom: '10px' }}>
            Mô hình liên kết giá trị thặng dư của Marx
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '36px', fontFamily: 'Georgia, serif', fontWeight: 'bold' }}>
            <span style={{ color: hoveredSummaryNode === 'customer' ? 'var(--blue)' : '#0f172a', transition: 'all 0.25s ease', textShadow: hoveredSummaryNode === 'customer' ? '0 0 10px rgba(37,99,235,0.4)' : 'none', transform: hoveredSummaryNode === 'customer' ? 'scale(1.15)' : 'scale(1)' }}>W</span>
            <span>=</span>
            <span style={{ color: hoveredSummaryNode === 'restaurant' ? 'var(--red)' : '#0f172a', transition: 'all 0.25s ease', textShadow: hoveredSummaryNode === 'restaurant' ? '0 0 10px rgba(239,68,68,0.4)' : 'none', transform: hoveredSummaryNode === 'restaurant' ? 'scale(1.15)' : 'scale(1)' }}>c</span>
            <span>+</span>
            <span style={{ color: hoveredSummaryNode === 'shipper' ? '#10b981' : '#0f172a', transition: 'all 0.25s ease', textShadow: hoveredSummaryNode === 'shipper' ? '0 0 10px rgba(16,185,129,0.4)' : 'none', transform: hoveredSummaryNode === 'shipper' ? 'scale(1.15)' : 'scale(1)' }}>v</span>
            <span>+</span>
            <span style={{ color: hoveredSummaryNode === 'platform' ? '#f59e0b' : '#0f172a', transition: 'all 0.25s ease', textShadow: hoveredSummaryNode === 'platform' ? '0 0 10px rgba(245,158,11,0.4)' : 'none', transform: hoveredSummaryNode === 'platform' ? 'scale(1.15)' : 'scale(1)' }}>m</span>
          </div>
          <div style={{ fontSize: '15px', color: 'var(--muted)', marginTop: '12px', textAlign: 'center', minHeight: '44px', lineHeight: '1.5' }}>
            {hoveredSummaryNode === 'customer' && <span><b>W (Tổng giá trị hàng hóa):</b> Lao động xã hội kết tinh trong sản phẩm ẩm thực và dịch vụ giao nhận, được hiện thực hóa khi khách hàng chi trả tiền tệ.</span>}
            {hoveredSummaryNode === 'restaurant' && <span><b>c (Tư bản bất biến):</b> Giá trị của các tư liệu sản xuất hao phí (mặt bằng, nguyên vật liệu pha chế, máy móc, cốc nhựa) dịch chuyển nguyên vẹn vào ly trà sữa.</span>}
            {hoveredSummaryNode === 'shipper' && <span><b>v (Tư bản khả biến):</b> Hao phí sức lao động sống trực tiếp tạo ra giá trị mới của cả đầu bếp pha chế (khâu sản xuất) và shipper (vận chuyển trong lưu thông).</span>}
            {hoveredSummaryNode === 'platform' && <span><b>m (Giá trị thặng dư):</b> Phần thặng dư dôi ra ngoài tiền lương của lao động. Nền tảng trung gian trích một phần thặng dư này thông qua chiết khấu app để thu lợi nhuận.</span>}
            {!hoveredSummaryNode && <span>Rê chuột vào các thẻ phía trên để khám phá vai trò của từng thành tố trong công thức giá trị của Karl Marx.</span>}
          </div>
        </div>

        <div style={{ background: '#fcfcfc', border: '1px dashed var(--line)', padding: '24px 28px', borderRadius: '16px', maxWidth: '680px', margin: '0 auto 32px', boxSizing: 'border-box' }}>
          <p className="final-quote" style={{ fontFamily: 'Sora, Inter, sans-serif', fontStyle: 'italic', fontSize: '18px', fontWeight: '500', color: 'var(--blue)', margin: 0, lineHeight: '1.6' }}>
            "Giá cả chỉ là hình thức biểu hiện bằng tiền của giá trị — và trong từng đơn hàng Grab, Shopee hay Be bạn đặt hàng ngày, quy luật kinh tế ấy vẫn đang âm thầm vận hành."
          </p>
        </div>

        <button className="primary" onClick={() => go('ai-tools')}>Tiếp tục</button>
      </section>

      {/* SECTION 11: AI TOOLS */}
      <section className={`screen center ${active === 'ai-tools' ? 'show' : ''}`}>
        <div className="ai-tools-page">
          <p className="receipt-kicker">Hậu trường thực hiện đề tài</p>
          <h1 className="ai-title">Công cụ AI hỗ trợ</h1>
          <div className="ai-source-panel">
            <div className="receipt-tab">Nguyên liệu AI</div>
            <div className="ai-tools-grid">
              <div className="ai-tool-card">
                <span className="ai-tool-number">01</span>
                <div className="ai-tool-logo-container">
                  <svg className="ai-tool-logo" viewBox="0 0 70 64" role="img" aria-label="Logo NotebookLM" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" stroke="#111111" strokeWidth="9" strokeLinejoin="round">
                      <path d="M8 59V33C8 17.54 20.54 5 36 5S64 17.54 64 33V59" />
                      <path d="M8 59V40C8 27.3 18.3 17 31 17S54 27.3 54 40V59" />
                      <path d="M8 59V48C8 38.06 16.06 30 26 30S44 38.06 44 48V59" />
                    </g>
                  </svg>
                </div>
                <span className="ai-tool-name">NotebookLM</span>
              </div>
              <div className="ai-tool-card">
                <span className="ai-tool-number">02</span>
                <div className="ai-tool-logo-container">
                  <svg className="ai-tool-logo" viewBox="0 0 100 100" role="img" aria-label="Logo Claude" xmlns="http://www.w3.org/2000/svg">
                    <g stroke="#D97757" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M47 47L32 12" />
                      <path d="M50 46L54 10" />
                      <path d="M54 48L78 22" />
                      <path d="M56 51L89 43" />
                      <path d="M57 55L89 62" />
                      <path d="M54 58L79 83" />
                      <path d="M50 59L48 91" />
                      <path d="M46 58L31 84" />
                      <path d="M43 56L17 73" />
                      <path d="M42 52L9 50" />
                      <path d="M43 49L18 32" />
                      <path d="M45 47L38 24" />
                    </g>
                    <circle cx="50" cy="53" r="10" fill="#D97757" />
                  </svg>
                </div>
                <span className="ai-tool-name">Claude</span>
              </div>
              <div className="ai-tool-card">
                <span className="ai-tool-number">03</span>
                <div className="ai-tool-logo-container">
                  <svg className="ai-tool-logo" viewBox="0 0 24 24" role="img" aria-label="Logo ChatGPT" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364l2.0201-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4043-.6813zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" fill="#111111" />
                  </svg>
                </div>
                <span className="ai-tool-name">ChatGPT</span>
              </div>
              <div className="ai-tool-card">
                <span className="ai-tool-number">04</span>
                <div className="ai-tool-logo-container">
                  <svg className="ai-tool-logo" viewBox="0 0 64 64" role="img" aria-label="Logo Gemini" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="gemini-gradient" x1="8" y1="53" x2="54" y2="8" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#F9AB00" />
                        <stop offset="0.25" stopColor="#34A853" />
                        <stop offset="0.55" stopColor="#4285F4" />
                        <stop offset="0.78" stopColor="#7B61FF" />
                        <stop offset="1" stopColor="#EA4335" />
                      </linearGradient>
                    </defs>
                    <path d="M32 4C34.8 19.2 44.8 29.2 60 32C44.8 34.8 34.8 44.8 32 60C29.2 44.8 19.2 34.8 4 32C19.2 29.2 29.2 19.2 32 4Z" fill="url(#gemini-gradient)" />
                  </svg>
                </div>
                <span className="ai-tool-name">Gemini</span>
              </div>
            </div>
            <div className="ai-panel-footer">Nội dung cuối cùng do nhóm biên tập & kiểm chứng</div>
          </div>
          <button className="primary page-flow-action" onClick={() => go('team')}>Tiếp tục</button>
        </div>
      </section>

      {/* SECTION 12: TEAM MEMBERS */}
      <section className={`screen center ${active === 'team' ? 'show' : ''}`}>
        <div className="team-page">
          <p className="receipt-kicker">Đơn hàng nhóm · Kinh tế chính trị</p>
          <div className="team-receipt">
            <div className="receipt-perforation top" aria-hidden="true"></div>
            <div className="team-receipt-header">
              <h1 className="team-title">Hóa đơn nhóm</h1>
              <p>Đội hình thực hiện đề tài</p>
            </div>
            <div className="receipt-meta">
              <span>Bàn giao: Đề tài nhóm</span>
              <span>Số lượng: 05</span>
            </div>
            <p className="team-topic">"Quy luật giá trị - Hành trình giao đồ ăn"</p>
            <p className="receipt-subtitle">Slide thuyết trình</p>
            <div className="receipt-table">
              <div className="receipt-row receipt-head">
                <span>#</span>
                <span>Thành viên</span>
                <span>Mã số</span>
              </div>
              <div className="receipt-row">
                <span>01</span>
                <strong>Lê Tấn Lực</strong>
                <b>SE184288</b>
              </div>
              <div className="receipt-row">
                <span>02</span>
                <strong>Đỗ Hoàng Hiếu</strong>
                <b>SE184340</b>
              </div>
              <div className="receipt-row">
                <span>03</span>
                <strong>Nguyễn Thị Anh Thư</strong>
                <b>SE184907</b>
              </div>
              <div className="receipt-row">
                <span>04</span>
                <strong>Nguyễn Thị Thùy Dung</strong>
                <b>SS180809</b>
              </div>
              <div className="receipt-row">
                <span>05</span>
                <strong>Nguyễn Hoàng Ngọc Minh</strong>
                <b>SS196544</b>
              </div>
            </div>
            <div className="receipt-total">
              <span>Tổng thành viên</span>
              <b>05</b>
            </div>
            <div className="receipt-barcode" aria-hidden="true"></div>
            <p className="receipt-thanks">Cảm ơn quý thầy cô đã đón nhận</p>
            <div className="receipt-perforation bottom" aria-hidden="true"></div>
          </div>
          <button className="primary page-flow-action" onClick={() => go('intro')}>Khám phá lại từ đầu</button>
        </div>
      </section>
    </main>
  );
}

function Row({ label, value, strong, style }) {
  return <div className={strong ? 'row total' : 'row'} style={style}><span>{label}</span><b>{value}</b></div>;
}

function MapHotspot({ name, left, top, active, onClick, onMouseEnter, onMouseLeave }) {
  return (
    <div 
      className={`map-hotspot ${active ? 'active' : ''}`} 
      style={{ 
        position: 'absolute', 
        left, 
        top, 
        transform: 'translate(-50%, -50%)', 
        cursor: 'pointer', 
        zIndex: 10 
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className="hotspot-pulse"></span>
      <span className="hotspot-dot"></span>
      <span className="hotspot-tooltip">{name}</span>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
