# Gợi ý font theo mức cá tính

Dữ liệu cột "variable" và "tiếng Việt" lấy từ danh sách font đi kèm Next 16.4.6 (`node_modules/next/dist/compiled/@next/font/dist/google/font-data.json`), tra ngày 2026-11-17. Phần mô tả **cá tính** là nhận xét thẩm mỹ, mang tính chủ quan: hãy xem thử bằng mắt trước khi chọn.

## Mức 1: trung tính (gần như "vô hình")

Chữ chỉ làm nhiệm vụ truyền nội dung. Hợp nhất với trang đăng nhập "plain and trustworthy".

| Font | Tên import | Tiếng Việt | Nhận xét |
|---|---|---|---|
| **Geist** (đang dùng) | `Geist` | có | Gọn, hiện đại, hơi "kỹ thuật" |
| **Inter** | `Inter` | có | Lựa chọn an toàn nhất, rất phổ biến cho giao diện web |
| **Public Sans** | `Public_Sans` | có | Giống Inter, hơi mềm, thiết kế cho giao diện của chính phủ Mỹ nên rất dễ đọc |
| **Source Sans 3** | `Source_Sans_3` | có | Ấm hơn một chút, nét mang tính "người viết" hơn |
| **IBM Plex Sans** | `IBM_Plex_Sans` | có | Hơi cứng, có chất kỹ thuật nhẹ |

## Mức 2: chút cá tính, vẫn gọn

Nhìn qua đã thấy khác Inter nhưng không gây chú ý. Vẫn hợp phong cách tiết chế.

| Font | Tên import | Tiếng Việt | Nhận xét |
|---|---|---|---|
| **Manrope** | `Manrope` | có | Hình học, hơi tròn, hiện đại |
| **Plus Jakarta Sans** | `Plus_Jakarta_Sans` | có | Thân thiện, hơi giống font của các app tài chính |
| **DM Sans** | `DM_Sans` | **không** | Hình học, sạch, dễ thương nhẹ |

## Mức 3: cá tính rõ

Hợp với tiêu đề hoặc thương hiệu. Dùng cho cả form thì dễ mệt mắt.

| Font | Tên import | Tiếng Việt | Nhận xét |
|---|---|---|---|
| **Space Grotesk** | `Space_Grotesk` | có | Có nét "lạ" (chữ a, g, y), cảm giác công nghệ, hơi nghịch |
| **Nunito** | `Nunito` | có | Đầu nét bo tròn, mềm, thân thiện, hợp app dành cho trẻ hoặc cộng đồng |
| **Sora** | `Sora` | **không** | Rộng, hình học, hơi "tương lai" |
| **Outfit** | `Outfit` | **không** | Hình học, tròn, kiểu thương hiệu |

## Mức 4: font có chân (serif) và font trang trí

Cá tính mạnh nhất. Thường chỉ dùng cho tiêu đề, kết hợp với một font trung tính cho nội dung.

| Font | Tên import | Tiếng Việt | Nhận xét |
|---|---|---|---|
| **Lora** | `Lora` | có | Serif dễ đọc, ấm, hợp văn bản dài |
| **Merriweather** | `Merriweather` | có | Serif đậm nét, rất rõ ở cỡ nhỏ |
| **Fraunces** | `Fraunces` | có | Serif mềm, vui, nhiều cá tính |
| **Playfair Display** | `Playfair_Display` | có | Sang, tương phản nét mạnh, chỉ nên dùng cho tiêu đề lớn |
| **Pacifico** | `Pacifico` | có | Chữ viết tay. Chỉ có đúng một độ đậm (400), không phải font variable. **Không nên dùng cho giao diện** |

## Cần biết khi chọn

- **Mọi font ở trên (trừ Pacifico) đều là font variable**, nên khai báo như Geist hiện tại, không cần thêm `weight`.
- **Cột tiếng Việt**: font không có subset `vietnamese` sẽ hiển thị dấu tiếng Việt bằng font dự phòng, trông lệch. Giao diện hiện là tiếng Anh nên chưa vấn đề. Nếu sau này có chữ Việt thì tránh DM Sans, Sora, Outfit.
- Tên import dùng **gạch dưới** cho từ ghép (`Source_Sans_3`, `IBM_Plex_Sans`).
- Đổi font nhớ cập nhật `web/app/layout.tsx` và dòng `--font-sans` trong `web/app/globals.css`. Hai file phải khớp tên biến CSS: nếu không khớp, trang không báo lỗi mà tự đổi sang font mặc định của trình duyệt (Times).

## Đề xuất cho dự án này

Giao diện tiết chế và dự án sẽ lớn dần thành cửa hàng, nên thử theo thứ tự:

1. **Inter**, để có điểm so sánh trung tính nhất.
2. **Source Sans 3**, nếu muốn ấm hơn mà vẫn giữ sự đơn giản.
3. **Plus Jakarta Sans**, nếu muốn có chút cá tính mà vẫn đọc tốt.
