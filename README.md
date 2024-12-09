# QAirLine-Web-Development
_Last update: 09-12-2024_

Member:
- Phạm Xuân Dương (MSV: 22025518)
- Nguyễn Thị Ngọc Mai (MSV: 22025510)
- Trần Khánh Duy (MSV: 22025520

### GIT BRANCH
- main
- develop: Làm gì trên backend thì pull nhánh này
- front-end: Làm gì trên frontend thì pull nhánh này
- frontend/....: Nhánh con của front-end

### GIT FLOW
*Lưu ý: Nếu muốn merge code lên develop phải thông báo lên nhóm*
*Nhớ chuyển về root folder để commit code*
1. Clone repo về máy: `git clone`
2. Chuyển sang nhánh develop: `git checkout develop`
3. Cập nhật các thay đổi trên nhánh develop: `git fetch` hoặc `git pull`
   - Lưu ý làm trước khi tạo branch mới
4. Tạo branch mới base trên nhánh develop: `git checkout -b [Tên nhánh temp mới]`
   - [Lưu ý về tên nhánh](#git-branch): Mặc định sẽ là _**feature/…**_. VD: `feature/api-server`
   - Nếu muốn dùng lại nhánh temp thì `git checkout [Tên nhánh temp]`
5. Code trên nhánh vừa tạo ([chọn đúng folder làm việc](#do-not-code-in-the-root-folder-))
6. Add các thay đổi: `Git add . `(add tất)
7. `Git commit -m “message”`
8. Đẩy nhánh temp lên github: `git push origin [Tên nhánh]`
9. Pull request
