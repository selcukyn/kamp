export const seedUsers = [
  { id: 'u1', name: 'Ahmet Yılmaz', email: 'ahmet@sirket.com', emoji: '👨‍💻' },
  { id: 'u2', name: 'Ayşe Demir', email: 'ayse@sirket.com', emoji: '👩‍💻' },
  { id: 'u3', name: 'Mehmet Öz', email: 'mehmet@sirket.com', emoji: '👨‍💼' }
];

export const seedDepartments = [
  { id: 'd1', name: 'Pazarlama' },
  { id: 'd2', name: 'İnsan Kaynakları' },
  { id: 'd3', name: 'Bilgi Teknolojileri' },
  { id: 'd4', name: 'Satış' },
  { id: 'd5', name: 'Finans' }
];

const today = new Date();
const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const setDate = (date, day) => new Date(date.getFullYear(), date.getMonth(), day).toISOString();

export const seedEvents = [
  { id: '1', date: setDate(startOfCurrentMonth, 6), title: 'Kamera Arkası Çekimleri', urgency: 'Medium', assigneeId: 'u1', departmentId: 'd1' },
  { id: '2', date: setDate(startOfCurrentMonth, 8), title: 'Müşteri Anketi Analizi', urgency: 'High', assigneeId: 'u2', departmentId: 'd1' },
  { id: '3', date: setDate(startOfCurrentMonth, 14), title: 'Yaz İndirimi Lansmanı', urgency: 'Very High', assigneeId: 'u3', departmentId: 'd4' },
  { id: '4', date: setDate(startOfCurrentMonth, 17), title: 'Blog Yazısı: Destinasyonlar', urgency: 'Low', assigneeId: 'u1', departmentId: 'd1' },
  { id: '5', date: setDate(startOfCurrentMonth, 19), title: 'Kullanıcı Yorumları Derlemesi', urgency: 'Medium', assigneeId: 'u2', departmentId: 'd4' },
  { id: '6', date: setDate(startOfCurrentMonth, 22), title: 'Sürdürülebilirlik Raporu', urgency: 'Low', assigneeId: 'u3', departmentId: 'd2' }
];

export const seedIpConfig = {
  designerIp: '192.168.1.10',
  departmentIps: {
    '192.168.1.20': 'd1',
    '192.168.1.21': 'd2',
    '192.168.1.22': 'd3',
    '192.168.1.23': 'd4',
    '192.168.1.24': 'd5'
  }
};
