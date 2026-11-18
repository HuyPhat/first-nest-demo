# Server Action và `useActionState`

Giải thích hai khái niệm này và đánh giá xem có nên áp dụng cho form login của `web/` không. Dựa trên tài liệu đi kèm Next 16.4.6 (`node_modules/next/dist/docs/01-app/02-guides/forms.md` và `authentication.md`) và React 19.3.0 đang cài trong dự án, tra ngày 2026-11-18. Chưa áp dụng gì vào code.

## Server Action là gì

Một hàm **chạy trên server** nhưng được gọi từ trình duyệt như hàm thường. Đánh dấu bằng `"use server"`, rồi gắn trực tiếp vào `<form action={...}>`:

```ts
"use server";
export async function createUser(formData: FormData) {
  // chạy trên server: đọc formData, gọi DB/API, đặt cookie, redirect...
}
```

Khi bấm submit, Next tự gửi một request POST tới chính trang đó, chạy hàm trên server, rồi trả kết quả về. Không cần viết `fetch`, route `/api/...` hay `onSubmit` + `preventDefault`. Form còn gửi được khi JavaScript chưa tải xong (progressive enhancement).

## `useActionState` là gì

Hook của React 19 nối một Server Action với trạng thái giao diện:

```ts
const [state, formAction, pending] = useActionState(login, initialState);
```

- `formAction`: truyền vào `<form action={formAction}>`.
- `state`: giá trị **hàm trả về lần gần nhất**, dùng để hiện lỗi. Ban đầu là `initialState`.
- `pending`: `true` trong lúc hàm đang chạy, dùng để khoá nút.

Chữ ký hàm đổi một chút: tham số đầu là trạng thái trước đó, tham số thứ hai mới là `FormData`:

```ts
export async function login(prevState: State, formData: FormData) {
  if (/* sai */) return { error: "Invalid email or password." }; // thành state mới
  redirect("/profile");                                           // thành công thì chuyển trang
}
```

Vậy `useActionState` thay cho cặp `useState` của `error` và `pending` trong [login-form.tsx](../web/app/login/login-form.tsx), và `onSubmit` biến mất.

## Nếu áp dụng cho form login này

Form sẽ gọn hơn, nhưng có hai vấn đề thật:

1. **Cookie.** Hiện API tự `Set-Cookie` (HttpOnly) thẳng vào trình duyệt qua rewrite `/api`, đúng ADR 0001. Với Server Action, request tới API đi từ **server của Next**, nên header `Set-Cookie` của API chỉ về tới server, trình duyệt không thấy. Phải đọc `res.headers.getSetCookie()`, tách tên, giá trị và thuộc tính, rồi gọi `(await cookies()).set(...)` lại. Đó là code mới, dễ sai thuộc tính (`httpOnly`, `sameSite`, hạn dùng).
2. **Rewrite `/api` không còn dùng cho login.** Logic gọi API chuyển từ trình duyệt sang server, nên ADR 0001 cần được cập nhật.

Một điều nhỏ nữa: theo tài liệu React 19, sau khi action chạy xong, các ô không điều khiển của form được reset. **Chưa chạy thử trong dự án này**, nên nếu áp dụng hãy kiểm tra xem ô mật khẩu có bị xoá khi login sai không.

## Khi nào Server Action đáng dùng

- Form **ghi dữ liệu thẳng vào DB hoặc API trong cùng ứng dụng**, nơi không cần cookie từ dịch vụ ngoài: tạo sản phẩm, thêm vào giỏ, sửa hồ sơ.
- Muốn form chạy được cả khi JavaScript chưa tải.

Với login hiện tại, **giữ cách hiện có**: nó hợp với ADR 0001, và hai chỗ phức tạp nói trên không mang lại lợi ích tương xứng. Các form sau này như thêm vào giỏ hàng là ứng viên tốt cho Server Action.

## Liên quan

- Vì sao không dùng TanStack Query hay React Hook Form cho form login: cùng lý do, form chỉ có hai ô và một thao tác ghi, trạng thái `pending` và `error` hiện chỉ tốn vài dòng `useState`.
