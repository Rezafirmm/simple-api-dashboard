const API_URL = "https://jsonplaceholder.typicode.com/users";
const userList = document.querySelector("#userList");
const userForm = document.querySelector("#userForm");
const loader = document.querySelector("#loader");
const searchInput = document.querySelector("#search");

let usersData = [];

// دریافت کاربران از API
async function getUsers() {
  loader.style.display = "flex";
  try {
    const res = await fetch(API_URL);
    usersData = await res.json();
    usersData = usersData.slice(0, 8);
    renderUsers(usersData);
  } catch (err) {
    alert("خطا در ارتباط با سرور");
  } finally {
    loader.style.display = "none";
  }
}

// نمایش کاربران
function renderUsers(list) {
  userList.innerHTML = "";
  list.forEach((user) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${user.name} - ${user.email}</span>
      <div class="action-btns">
        <button onclick="editUser(${user.id})"><i class="fa fa-edit"></i></button>
        <button onclick="deleteUser(${user.id})"><i class="fa fa-trash"></i></button>
      </div>
    `;
    userList.appendChild(li);
  });
}

//افزودن کاربر (POST)
userForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();

  if (!name || !email) return alert("لطفاً نام و ایمیل را وارد کنید.");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    const newUser = await res.json();

    // نمایش در UI (شبیه‌سازی اضافه شدن)
    newUser.id = Date.now();
    usersData.unshift(newUser);
    renderUsers(usersData);

    alert(`کاربر "${newUser.name}" با موفقیت اضافه شد!`);
    userForm.reset();
  } catch {
    alert("خطا در ارسال داده به سرور");
  }
});

//ویرایش کاربر (PUT)
async function editUser(id) {
  const user = usersData.find((u) => u.id === id);
  if (!user) return;

  const newName = prompt("نام جدید:", user.name);
  const newEmail = prompt("ایمیل جدید:", user.email);
  if (!newName || !newEmail) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, email: newEmail }),
    });
    const updated = await res.json();

    //نمایش تغییر در رابط کاربری
    user.name = updated.name;
    user.email = updated.email;
    renderUsers(usersData);
    alert("کاربر با موفقیت ویرایش شد!");
  } catch {
    alert("خطا در ویرایش کاربر");
  }
}

//حذف کاربر (DELETE)
async function deleteUser(id) {
  if (!confirm("آیا از حذف این کاربر مطمئنید؟")) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    usersData = usersData.filter((u) => u.id !== id);
    renderUsers(usersData);
    alert(`کاربر شماره ${id} حذف شد.`);
  } catch {
    alert("خطا در حذف کاربر");
  }
}

//جستجو
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  const filtered = usersData.filter(
    (u) =>
      u.name.toLowerCase().includes(keyword) ||
      u.email.toLowerCase().includes(keyword)
  );
  renderUsers(filtered);
});

// بارگذاری اولیه
getUsers();
