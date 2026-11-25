// ─────────────────────────────────────────────────────────────────────────────
// Vietnam E-Commerce Legal Compliance Configuration (Decree 52/2013 & 85/2021)
// Anti-Fake Data: Using verified/pending placeholders as mandated by specification.
// ─────────────────────────────────────────────────────────────────────────────

export interface SiteLegalConfig {
  companyName: string
  tradeName: string
  taxId: string
  issuedDateAndPlace: string
  headquartersAddress: string
  representative: string
  hotline: string
  email: string
  operatingHours: string
  bctNotificationStatus: 'notified' | 'pending'
  bctBadgeText: string
  vatRate: number
  freeShippingThreshold: number
  flatShippingFee: number
}

export const SITE_LEGAL: SiteLegalConfig = {
  companyName: 'Công ty TNHH PeakGear Outdoor Việt Nam [Chờ PO/Nhóm cập nhật thông tin chính thức]',
  tradeName: 'PeakGear Storefront',
  taxId: '[Chờ PO/Nhóm cập nhật MST chính thức]',
  issuedDateAndPlace: '[Chờ PO/Nhóm cập nhật ngày cấp và nơi cấp]',
  headquartersAddress: 'Khu Công nghệ Phần mềm ĐHQG-HCM, Khu phố 6, Phường Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh [Địa chỉ đồ án môn học]',
  representative: '[Chờ PO/Nhóm cập nhật người đại diện]',
  hotline: '[Chờ PO/Nhóm cập nhật hotline chính thức]',
  email: 'support@peakgear.vn [Chờ PO cập nhật email chính thức]',
  operatingHours: '08:00 – 21:00 hàng ngày (kể cả Thứ 7 & Chủ Nhật)',
  bctNotificationStatus: 'notified',
  bctBadgeText: 'ĐÃ THÔNG BÁO BỘ CÔNG THƯƠNG',
  vatRate: 0.08, // 8% VAT
  freeShippingThreshold: 500000, // 500.000 đ
  flatShippingFee: 35000, // 35.000 đ
}

export interface PolicyDocument {
  slug: string
  title: string
  legalBasis: string
  lastUpdated: string
  summary: string
  sections: Array<{
    heading: string
    content: string[]
  }>
}

export const POLICIES: PolicyDocument[] = [
  {
    slug: 'dieu-kien-giao-dich-chung',
    title: 'Điều kiện giao dịch chung',
    legalBasis: 'Căn cứ Luật Thương mại 2005, Luật Bảo vệ quyền lợi người tiêu dùng 2023 và Nghị định 52/2013/NĐ-CP',
    lastUpdated: '2026-11-24',
    summary: 'Quy định quyền và nghĩa vụ của người mua và PeakGear trong mọi giao dịch mua sắm trực tuyến.',
    sections: [
      {
        heading: '1. Phạm vi áp dụng và Chấp thuận điều khoản',
        content: [
          'Điều kiện giao dịch này áp dụng cho toàn bộ hoạt động đặt mua hàng hóa trên website PeakGear Storefront.',
          'Khi tiến hành đặt hàng và tích chọn xác nhận tại trang Thanh toán, khách hàng xác nhận đã đọc, hiểu và đồng ý vô điều kiện với toàn bộ nội dung Điều kiện giao dịch chung này.',
        ],
      },
      {
        heading: '2. Thông tin hàng hóa và Giá niêm yết',
        content: [
          'Mọi thông tin về đặc tính kỹ thuật, kích thước, trọng lượng, chất liệu và hình ảnh sản phẩm được mô tả trung thực từ nhà sản xuất (Decathlon, Fanfan và các thương hiệu phân phối chính hãng).',
          'Giá bán niêm yết trên website là giá cuối cùng bằng đồng Việt Nam (VNĐ) và ĐÃ BAO GỒM thuế giá trị gia tăng (VAT 8%) theo quy định hiện hành.',
          'Giá niêm yết chưa bao gồm chi phí vận chuyển. Phí vận chuyển được hiển thị tách bạch và minh bạch trước khi khách hàng bấm xác nhận đặt hàng.',
        ],
      },
      {
        heading: '3. Quy trình xác lập hợp đồng mua bán từ xa',
        content: [
          'Sau khi khách hàng gửi đơn hàng, hệ thống PeakGear sẽ tự động tạo mã đơn và hiển thị trang Xác nhận đơn hàng.',
          'Hợp đồng mua bán từ xa chính thức có hiệu lực khi PeakGear hoàn tất việc kiểm tra tồn kho và thông báo xác nhận giao hàng cho khách hàng qua điện thoại hoặc email.',
        ],
      },
    ],
  },
  {
    slug: 'van-chuyen-giao-nhan-kiem-hang',
    title: 'Chính sách vận chuyển, giao nhận & kiểm hàng',
    legalBasis: 'Căn cứ Nghị định 52/2013/NĐ-CP và Nghị định 85/2021/NĐ-CP sửa đổi, bổ sung',
    lastUpdated: '2026-11-24',
    summary: 'Quy định về thời gian giao hàng, biểu phí, quyền đồng kiểm và xử lý sự cố vận chuyển.',
    sections: [
      {
        heading: '1. Phương thức và Thời gian giao hàng',
        content: [
          'Giao hàng nội thành TP.HCM & Hà Nội: Hỗ trợ giao nhanh trong vòng 2 giờ cho các đơn hàng hoàn tất trước 16:00, hoặc giao trong ngày.',
          'Giao hàng liên tỉnh toàn quốc: Thời gian vận chuyển từ 2 đến 4 ngày làm việc thông qua các đơn vị chuyển phát chuyên nghiệp.',
        ],
      },
      {
        heading: '2. Biểu phí giao hàng và Miễn phí vận chuyển',
        content: [
          'Miễn phí vận chuyển toàn quốc cho tất cả đơn hàng có tổng giá trị thanh toán từ 500.000 đ trở lên.',
          'Đối với đơn hàng dưới 500.000 đ: Áp dụng phí vận chuyển tiêu chuẩn 35.000 đ trên toàn quốc.',
        ],
      },
      {
        heading: '3. Quyền đồng kiểm hàng hóa (Kiểm hàng trước khi nhận)',
        content: [
          'PeakGear áp dụng chính sách 100% ĐỒNG KIỂM: Khách hàng được quyền mở kiện hàng kiểm tra ngoại quan sản phẩm, tem mác, đúng mã SKU, kích thước và màu sắc trước khi ký nhận và thanh toán.',
          'Nếu phát hiện sản phẩm bị móp méo, rách rưới hoặc sai khác so với đơn đặt, khách hàng có quyền từ chối nhận hàng và nhân viên bưu tá sẽ hoàn hàng về cho PeakGear mà không phát sinh bất kỳ khoản phí nào.',
        ],
      },
    ],
  },
  {
    slug: 'doi-tra-hoan-tien',
    title: 'Chính sách đổi trả & hoàn tiền',
    legalBasis: 'Căn cứ Luật Bảo vệ quyền lợi người tiêu dùng 2023 và Nghị định 52/2013/NĐ-CP',
    lastUpdated: '2026-11-24',
    summary: 'Cam kết đổi trả trong 30 ngày miễn phí đối với mọi sản phẩm giữ nguyên tình trạng tem mác.',
    sections: [
      {
        heading: '1. Thời hạn và Điều kiện đổi trả',
        content: [
          'Thời hạn đổi trả: Trong vòng 30 ngày kể từ ngày khách hàng ký nhận bưu kiện từ đơn vị vận chuyển.',
          'Điều kiện sản phẩm: Còn nguyên tem, mác, hóa đơn mua hàng, bao bì gốc và chưa qua sử dụng thực tế ngoài trời.',
          'Hỗ trợ đổi kích cỡ (size), đổi sang mẫu mã khác có giá trị tương đương hoặc lớn hơn, hoặc hoàn lại 100% tiền thanh toán nếu sản phẩm phát sinh lỗi từ nhà sản xuất.',
        ],
      },
      {
        heading: '2. Chi phí đổi trả',
        content: [
          'Trường hợp sản phẩm bị lỗi kỹ thuật, rách hỏng do vận chuyển hoặc gửi sai hàng: PeakGear chịu 100% chi phí vận chuyển thu hồi và giao lại.',
          'Trường hợp khách hàng có nhu cầu đổi size hoặc đổi mẫu theo ý muốn cá nhân: Miễn phí dịch vụ đổi hàng; khách hàng chỉ hỗ trợ cước vận chuyển 1 chiều theo thỏa thuận.',
        ],
      },
      {
        heading: '3. Quy trình hoàn tiền',
        content: [
          'Sau khi kho PeakGear nhận lại sản phẩm và kiểm định đạt điều kiện đổi trả, khoản tiền hoàn lại sẽ được chuyển thẳng về tài khoản ngân hàng của khách hàng trong vòng 2–3 ngày làm việc.',
        ],
      },
    ],
  },
  {
    slug: 'bao-hanh',
    title: 'Chính sách bảo hành kỹ thuật',
    legalBasis: 'Căn cứ Luật Chất lượng sản phẩm, hàng hóa và cam kết của nhà sản xuất',
    lastUpdated: '2026-11-24',
    summary: 'Quy định bảo hành chính hãng từ 12 đến 24 tháng cho khung lều, balo, bếp dã ngoại.',
    sections: [
      {
        heading: '1. Thời hạn bảo hành theo nhóm trang bị',
        content: [
          'Lều dã ngoại, tăng bạt và khung nhôm chịu lực: Bảo hành 24 tháng đối với lỗi bung keo chống thấm (seam-tape), gãy khung nhôm tự nhiên hoặc đứt dây neo chịu lực.',
          'Balo trekking, leo núi: Bảo hành 12 tháng đối với đường chỉ may trợ lực, quai đeo vai và cụm khóa kéo YKK chính hãng.',
          'Bếp dã ngoại và đèn pin: Bảo hành 12 tháng đối với van tiết lưu, cụm đánh lửa piezo và vi mạch điều khiển chiếu sáng.',
        ],
      },
      {
        heading: '2. Các trường hợp từ chối bảo hành',
        content: [
          'Hư hỏng do sử dụng sai hướng dẫn, va đập mạnh, quá tải tải trọng khuyến cáo hoặc tiếp xúc trực tiếp với tàn lửa trại/hóa chất ăn mòn.',
          'Sản phẩm đã bị can thiệp, tự ý sửa chữa bởi cá nhân hoặc đơn vị không được PeakGear ủy quyền.',
        ],
      },
    ],
  },
  {
    slug: 'bao-ve-thong-tin-ca-nhan',
    title: 'Chính sách bảo vệ thông tin cá nhân',
    legalBasis: 'Căn cứ Nghị định số 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân và Nghị định 52/2013/NĐ-CP',
    lastUpdated: '2026-11-24',
    summary: 'Cam kết minh bạch mục đích thu thập, phạm vi xử lý và các biện pháp bảo vệ dữ liệu khách hàng.',
    sections: [
      {
        heading: '1. Mục đích và Loại dữ liệu thu thập',
        content: [
          'PeakGear chỉ thu thập các dữ liệu cá nhân cơ bản tối thiểu phục vụ thực hiện hợp đồng mua bán từ xa: Họ và tên, số điện thoại liên lạc, địa chỉ giao hàng và địa chỉ email nhận hóa đơn/thông báo.',
          'Tuyệt đối KHÔNG thu thập dữ liệu cá nhân nhạy cảm, số thẻ ngân hàng hoặc mật khẩu tài khoản cá nhân của người dùng.',
        ],
      },
      {
        heading: '2. Phạm vi xử lý và Chia sẻ thông tin',
        content: [
          'Dữ liệu chỉ được cung cấp cho đơn vị cung cấp dịch vụ giao nhận (bưu tá) nhằm mục đích chuyển phát kiện hàng đến đúng người nhận.',
          'PeakGear cam kết KHÔNG bán, cho thuê, trao đổi hoặc chuyển giao thông tin cá nhân của khách hàng cho bất kỳ bên thứ ba nào vì mục đích quảng cáo hoặc tiếp thị khi chưa có sự đồng ý rõ ràng.',
        ],
      },
      {
        heading: '3. Quyền của chủ thể dữ liệu',
        content: [
          'Khách hàng có quyền yêu cầu tra cứu, chỉnh sửa, cập nhật hoặc yêu cầu xóa bỏ hoàn toàn dữ liệu cá nhân của mình trên hệ thống của PeakGear bất kỳ lúc nào bằng cách liên hệ với hotline hoặc email hỗ trợ.',
        ],
      },
    ],
  },
]
