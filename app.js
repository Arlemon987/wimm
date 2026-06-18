/* ==========================================
   FIREBASE IMPORTS
========================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";



import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

import {
  getStorage
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

/* ==========================================
   FIREBASE CONFIG
========================================== */

const firebaseConfig = {
  apiKey: "AIzaSyBexUCHjPriixE0G4zu6F3r7Pve5y-LXKg",
  authDomain: "where-is-my-money-66850.firebaseapp.com",
  projectId: "where-is-my-money-66850",
  storageBucket: "where-is-my-money-66850.firebasestorage.app",
  messagingSenderId: "116651703155",
  appId: "1:116651703155:web:05d5ff305959978a4c2306",
  measurementId: "G-L1E73JDTDE"
};

/* ==========================================
   INIT
========================================== */

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();

/* ==========================================
   GLOBAL STATE
========================================== */

let currentUser = null;

window.financeTracker = {
  auth,
  db,
  storage,
  getCurrentUser: () => currentUser
};

/* ==========================================
   DOM REFERENCES
========================================== */

const loadingScreen =
document.getElementById("loadingScreen");

const authSection =
document.getElementById("authSection");

const appSection =
document.getElementById("appSection");

const userName =
document.getElementById("userName");

const loginBtn =
document.getElementById("loginBtn");

const registerBtn =
document.getElementById("registerBtn");

const logoutBtn =
document.getElementById("logoutBtn");

const loginForm =
document.getElementById("loginForm");

const registerForm =
document.getElementById("registerForm");

const googleLoginBtn =
document.getElementById("googleLogin");

/* ==========================================
   TOAST
========================================== */

function showToast(message) {

  const toast =
  document.getElementById("toast");

  if (!toast) {
    alert(message);
    return;
  }

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {

    toast.classList.remove("show");

  }, 3000);
}

window.showToast = showToast;

/* ==========================================
   LOGIN / REGISTER TOGGLE
========================================== */

if (loginBtn) {

  loginBtn.addEventListener("click", () => {

    loginForm.classList.remove("hidden");

    registerForm.classList.add("hidden");

  });
}

if (registerBtn) {

  registerBtn.addEventListener("click", () => {

    registerForm.classList.remove("hidden");

    loginForm.classList.add("hidden");

  });
}

/* ==========================================
   REGISTER USER
========================================== */

async function registerUser(
  name,
  email,
  password
) {

  const credential =
  await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = credential.user;

  await setDoc(
    doc(db, "profiles", user.uid),
    {
      uid: user.uid,
      name,
      email,
      occupation: "",
      phone: "",
      address: "",
      photoURL: "",
      createdAt: serverTimestamp()
    }
  );

  return user;
}

/* ==========================================
   LOGIN USER
========================================== */

async function loginUser(
  email,
  password
) {

  const credential =
  await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return credential.user;
}

/* ==========================================
   GOOGLE LOGIN
========================================== */

async function googleLogin() {

  const result =
  await signInWithPopup(
    auth,
    googleProvider
  );

  const user = result.user;

  const profileRef =
  doc(
    db,
    "profiles",
    user.uid
  );

  const profileSnap =
  await getDoc(profileRef);

  if (!profileSnap.exists()) {

    await setDoc(
      profileRef,
      {
        uid: user.uid,
        name: user.displayName || "",
        email: user.email || "",
        occupation: "",
        phone: "",
        address: "",
        photoURL:
        user.photoURL || "",
        createdAt:
        serverTimestamp()
      }
    );
  }

  return user;
}

/* ==========================================
   LOGOUT
========================================== */

async function logoutUser() {

  await signOut(auth);
}

/* ==========================================
   RESET PASSWORD
========================================== */

async function resetPassword(email) {

  await sendPasswordResetEmail(
    auth,
    email
  );

  showToast(
    "Password reset email sent"
  );
}

window.resetPassword =
resetPassword;

/* ==========================================
   REGISTER FORM
========================================== */

if (registerForm) {

  registerForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();

      try {

        const name =
        document
        .getElementById(
          "regName"
        )
        .value
        .trim();

        const email =
        document
        .getElementById(
          "regEmail"
        )
        .value
        .trim();

        const password =
        document
        .getElementById(
          "regPassword"
        )
        .value;

        await registerUser(
          name,
          email,
          password
        );

        showToast(
          "Account created successfully"
        );

      } catch (error) {

        console.error(error);

        showToast(
          error.message
        );
      }
    }
  );
}

/* ==========================================
   LOGIN FORM
========================================== */

if (loginForm) {

  loginForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();

      try {

        const email =
        document
        .getElementById(
          "loginEmail"
        )
        .value
        .trim();

        const password =
        document
        .getElementById(
          "loginPassword"
        )
        .value;

        await loginUser(
          email,
          password
        );

        showToast(
          "Login successful"
        );

      } catch (error) {

        console.error(error);

        showToast(
          error.message
        );
      }
    }
  );
}

/* ==========================================
   GOOGLE BUTTON
========================================== */

if (googleLoginBtn) {

  googleLoginBtn.addEventListener(
    "click",
    async () => {

      try {

        await googleLogin();

        showToast(
          "Google login successful"
        );

      } catch (error) {

        console.error(error);

        showToast(
          error.message
        );
      }
    }
  );
}

/* ==========================================
   LOGOUT BUTTON
========================================== */

if (logoutBtn) {

  logoutBtn.addEventListener(
    "click",
    async () => {

      try {

        await logoutUser();

      } catch (error) {

        console.error(error);

        showToast(
          error.message
        );
      }
    }
  );
}

/* ==========================================
   AUTH STATE LISTENER
========================================== */

onAuthStateChanged(
  auth,
  async (user) => {

    if (loadingScreen) {

      loadingScreen.style.display =
      "none";
    }

    if (user) {

      currentUser = user;

      authSection
      ?.classList
      .add("hidden");

      appSection
      ?.classList
      .remove("hidden");

      loginBtn
      ?.classList
      .add("hidden");

      registerBtn
      ?.classList
      .add("hidden");

      logoutBtn
      ?.classList
      .remove("hidden");

      try {

        const profileSnap =
        await getDoc(
          doc(
            db,
            "profiles",
            user.uid
          )
        );

        if (
          profileSnap.exists()
        ) {

          const profile =
          profileSnap.data();

          userName.textContent =
          profile.name ||
          user.email;

        } else {

          userName.textContent =
          user.email;
        }

      } catch {

        userName.textContent =
        user.email;
      }

      document.dispatchEvent(
        new CustomEvent(
          "userLoggedIn",
          {
            detail: {
              uid: user.uid
            }
          }
        )
      );

    } else {

      currentUser = null;

      authSection
      ?.classList
      .remove("hidden");

      appSection
      ?.classList
      .add("hidden");

      loginBtn
      ?.classList
      .remove("hidden");

      registerBtn
      ?.classList
      .remove("hidden");

      logoutBtn
      ?.classList
      .add("hidden");

      userName.textContent =
      "Guest";
    }
  }
);

/* ==========================================
   END OF SECTION 1
========================================== */

/* ==========================================
   SECTION 2
   PROFILE MANAGEMENT
========================================== */



/* ==========================================
   DOM
========================================== */

const profileImageInput =
document.getElementById(
  "profileImage"
);

const profilePreview =
document.getElementById(
  "profilePreview"
);

const profileNameInput =
document.getElementById(
  "profileName"
);

const profileOccupationInput =
document.getElementById(
  "profileOccupation"
);

const profilePhoneInput =
document.getElementById(
  "profilePhone"
);

const profileAddressInput =
document.getElementById(
  "profileAddress"
);

const saveProfileBtn =
document.getElementById(
  "saveProfile"
);

/* ==========================================
   IMAGE PREVIEW
========================================== */

if (profileImageInput) {

  profileImageInput.addEventListener(
    "change",
    (e) => {

      const file =
      e.target.files[0];

      if (!file) return;

      const reader =
      new FileReader();

      reader.onload = () => {

        profilePreview.src =
        reader.result;
      };

      reader.readAsDataURL(
        file
      );
    }
  );
}

/* ==========================================
   UPLOAD PROFILE IMAGE
========================================== */

async function uploadProfileImage(
  uid,
  file
) {

  const storageRef =
  ref(
    storage,
    `profiles/${uid}/avatar`
  );

  await uploadBytes(
    storageRef,
    file
  );

  const imageUrl =
  await getDownloadURL(
    storageRef
  );

  return imageUrl;
}

/* ==========================================
   LOAD PROFILE
========================================== */

async function loadProfile(
  uid
) {

  try {

    const profileRef =
    doc(
      db,
      "profiles",
      uid
    );

    const snap =
    await getDoc(
      profileRef
    );

    if (!snap.exists())
      return;

    const profile =
    snap.data();

    if (
      profileNameInput
    ) {
      profileNameInput.value =
      profile.name || "";
    }

    if (
      profileOccupationInput
    ) {
      profileOccupationInput.value =
      profile.occupation || "";
    }

    if (
      profilePhoneInput
    ) {
      profilePhoneInput.value =
      profile.phone || "";
    }

    if (
      profileAddressInput
    ) {
      profileAddressInput.value =
      profile.address || "";
    }

    if (
      profile.photoURL &&
      profilePreview
    ) {
      profilePreview.src =
      profile.photoURL;
    }

    if (userName) {

      userName.textContent =
      profile.name ||
      currentUser?.email ||
      "User";
    }

  } catch (error) {

    console.error(
      error
    );

    showToast(
      "Failed to load profile"
    );
  }
}

/* ==========================================
   SAVE PROFILE
========================================== */

async function saveProfile() {

  try {

    if (
      !currentUser
    ) return;

    let photoURL =
    "";

    const imageFile =
    profileImageInput
    ?.files[0];

    if (
      imageFile
    ) {

      photoURL =
      await uploadProfileImage(
        currentUser.uid,
        imageFile
      );
    }

    const profileRef =
    doc(
      db,
      "profiles",
      currentUser.uid
    );

    const updateData = {

      name:
      profileNameInput?.value
      ?.trim() || "",

      occupation:
      profileOccupationInput?.value
      ?.trim() || "",

      phone:
      profilePhoneInput?.value
      ?.trim() || "",

      address:
      profileAddressInput?.value
      ?.trim() || "",

      updatedAt:
      serverTimestamp()
    };

    if (
      photoURL
    ) {

      updateData.photoURL =
      photoURL;
    }

    await updateDoc(
      profileRef,
      updateData
    );

    if (
      updateData.name
    ) {

      userName.textContent =
      updateData.name;
    }

    showToast(
      "Profile saved successfully"
    );

  } catch (error) {

    console.error(
      error
    );

    showToast(
      error.message
    );
  }
}

/* ==========================================
   SAVE BUTTON
========================================== */

if (
  saveProfileBtn
) {

  saveProfileBtn.addEventListener(
    "click",
    saveProfile
  );
}

/* ==========================================
   LOAD PROFILE ON LOGIN
========================================== */

document.addEventListener(
  "userLoggedIn",
  async (event) => {

    const uid =
    event.detail.uid;

    await loadProfile(
      uid
    );
  }
);

/* ==========================================
   USER PROFILE API
========================================== */

window.financeTracker
.loadProfile =
loadProfile;

window.financeTracker
.saveProfile =
saveProfile;

/* ==========================================
   END OF SECTION 2
========================================== */

/* ==========================================
   SECTION 3
   INCOME + EXPENSES + DASHBOARD
========================================== */

/* ==========================================
   DOM
========================================== */

const incomeForm =
document.getElementById("incomeForm");

const expenseForm =
document.getElementById("expenseForm");

const incomeTable =
document.getElementById("incomeTable");

const expenseTable =
document.getElementById("expenseTable");

const totalIncomeEl =
document.getElementById("totalIncome");

const totalExpenseEl =
document.getElementById("totalExpense");

const totalSavingsEl =
document.getElementById("totalSavings");

const healthScoreEl =
document.getElementById("healthScore");

/* ==========================================
   CACHE
========================================== */

let incomeRecords = [];
let expenseRecords = [];

/* ==========================================
   FORMAT
========================================== */

function formatMoney(amount){

  return "৳" +
  Number(amount || 0)
  .toLocaleString();
}

/* ==========================================
   ADD INCOME
========================================== */

async function addIncome(data){

  if(!currentUser) return;

  await addDoc(
    collection(
      db,
      "profiles",
      currentUser.uid,
      "income"
    ),
    {
      ...data,
      createdAt:
      serverTimestamp()
    }
  );
}

/* ==========================================
   ADD EXPENSE
========================================== */

async function addExpense(data){

  if(!currentUser) return;

  await addDoc(
    collection(
      db,
      "profiles",
      currentUser.uid,
      "expenses"
    ),
    {
      ...data,
      createdAt:
      serverTimestamp()
    }
  );
}

/* ==========================================
   INCOME FORM
========================================== */

if(incomeForm){

incomeForm.addEventListener(
"submit",
async(e)=>{

e.preventDefault();

try{

const source =
document.getElementById(
"incomeSource"
).value;

const amount =
Number(
document.getElementById(
"incomeAmount"
).value
);

const date =
document.getElementById(
"incomeDate"
).value;

const note =
document.getElementById(
"incomeNote"
).value;

await addIncome({
source,
amount,
date,
note
});

incomeForm.reset();

showToast(
"Income Added"
);

}catch(error){

console.error(error);

showToast(
error.message
);

}

});
}

/* ==========================================
   EXPENSE FORM
========================================== */

if(expenseForm){

expenseForm.addEventListener(
"submit",
async(e)=>{

e.preventDefault();

try{

const category =
document.getElementById(
"expenseCategory"
).value;

const amount =
Number(
document.getElementById(
"expenseAmount"
).value
);

const date =
document.getElementById(
"expenseDate"
).value;

const note =
document.getElementById(
"expenseNote"
).value;

await addExpense({
category,
amount,
date,
note
});

expenseForm.reset();

showToast(
"Expense Added"
);

}catch(error){

console.error(error);

showToast(
error.message
);

}

});
}

/* ==========================================
   DELETE INCOME
========================================== */

window.deleteIncome =
async(id)=>{

if(!currentUser)
return;

await deleteDoc(
doc(
db,
"profiles",
currentUser.uid,
"income",
id
)
);

showToast(
"Income Deleted"
);
};

/* ==========================================
   DELETE EXPENSE
========================================== */

window.deleteExpense =
async(id)=>{

if(!currentUser)
return;

await deleteDoc(
doc(
db,
"profiles",
currentUser.uid,
"expenses",
id
)
);

showToast(
"Expense Deleted"
);
};

/* ==========================================
   LOAD INCOME
========================================== */

function listenIncome(uid){

const incomeQuery =
query(
collection(
db,
"profiles",
uid,
"income"
),
orderBy(
"createdAt",
"desc"
)
);

onSnapshot(
incomeQuery,
(snapshot)=>{

incomeRecords = [];

incomeTable.innerHTML =
"";

snapshot.forEach(
(docSnap)=>{

const data =
docSnap.data();

data.id =
docSnap.id;

incomeRecords.push(
data
);

incomeTable.innerHTML += `
<tr>
<td>${data.date || ""}</td>
<td>${data.source || ""}</td>
<td>${formatMoney(data.amount)}</td>
<td>
<button
class="deleteBtn"
onclick="deleteIncome('${data.id}')">
Delete
</button>
</td>
</tr>
`;

}
);

updateDashboard();

}
);

}

/* ==========================================
   LOAD EXPENSES
========================================== */

function listenExpenses(uid){

const expenseQuery =
query(
collection(
db,
"profiles",
uid,
"expenses"
),
orderBy(
"createdAt",
"desc"
)
);

onSnapshot(
expenseQuery,
(snapshot)=>{

expenseRecords = [];

expenseTable.innerHTML =
"";

snapshot.forEach(
(docSnap)=>{

const data =
docSnap.data();

data.id =
docSnap.id;

expenseRecords.push(
data
);

expenseTable.innerHTML += `
<tr>
<td>${data.date || ""}</td>
<td>${data.category || ""}</td>
<td>${formatMoney(data.amount)}</td>
<td>
<button
class="deleteBtn"
onclick="deleteExpense('${data.id}')">
Delete
</button>
</td>
</tr>
`;

}
);

updateDashboard();

}
);

}

/* ==========================================
   DASHBOARD
========================================== */

function updateDashboard(){

const totalIncome =
incomeRecords.reduce(
(sum,item)=>
sum +
Number(
item.amount || 0
),
0
);

const totalExpense =
expenseRecords.reduce(
(sum,item)=>
sum +
Number(
item.amount || 0
),
0
);

const savings =
totalIncome -
totalExpense;

if(totalIncomeEl){

totalIncomeEl.textContent =
formatMoney(
totalIncome
);

}

if(totalExpenseEl){

totalExpenseEl.textContent =
formatMoney(
totalExpense
);

}

if(totalSavingsEl){

totalSavingsEl.textContent =
formatMoney(
savings
);

}

updateHealthScore(
totalIncome,
totalExpense
);

generateExpenseSuggestions(
totalIncome
);

}

/* ==========================================
   HEALTH SCORE
========================================== */

function updateHealthScore(
income,
expense
){

if(income <= 0){

healthScoreEl.textContent =
"0";

return;
}

const ratio =
expense /
income;

let score =
100;

if(ratio > 0.90){

score = 25;

}else if(
ratio > 0.80
){

score = 50;

}else if(
ratio > 0.70
){

score = 75;

}

healthScoreEl.textContent =
score;
}

/* ==========================================
   AI SAVINGS
========================================== */

function generateExpenseSuggestions(
income
){

const suggestionBox =
document.getElementById(
"suggestions"
);

if(
!suggestionBox
) return;

suggestionBox.innerHTML =
"";

if(
expenseRecords.length === 0
){

suggestionBox.innerHTML =
"<p>No spending data available.</p>";

return;
}

const categoryTotals =
{};

expenseRecords.forEach(
(item)=>{

const cat =
item.category ||
"Other";

categoryTotals[
cat
] =
(
categoryTotals[
cat
] || 0
)
+
Number(
item.amount
);

}
);

let found =
false;

Object.keys(
categoryTotals
).forEach(
(category)=>{

const amount =
categoryTotals[
category
];

const percent =
income
?
(
amount /
income
)
*
100
:
0;

if(
percent > 15
){

found =
true;

suggestionBox.innerHTML += `
<div class="suggestion">
<strong>${category}</strong><br>
You spent
${percent.toFixed(1)}%
of income here.
Consider reducing this category.
</div>
`;

}

}
);

if(
!found
){

suggestionBox.innerHTML =
`
<div class="suggestion">
Excellent spending habits detected.
</div>
`;

}

}

/* ==========================================
   START LISTENERS
========================================== */

document.addEventListener(
"userLoggedIn",
(event)=>{

const uid =
event.detail.uid;

listenIncome(uid);

listenExpenses(uid);

}
);

/* ==========================================
   GLOBAL API
========================================== */

window.financeTracker
.incomeRecords =
incomeRecords;

window.financeTracker
.expenseRecords =
expenseRecords;

/* ==========================================
   END OF SECTION 3
========================================== */
