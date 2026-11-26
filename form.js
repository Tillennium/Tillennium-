/* Request-access form: validation, Formspree submission, success state. */
(function () {
'use strict';
const cfg = window.TILLENIUM_CONFIG || {};
const form = document.getElementById('access-form');
if (!form) return;

const success = document.getElementById('access-success');
const formWrap = document.getElementById('access-form-wrap');
const nameEl = document.getElementById('f-name');
const emailEl = document.getElementById('f-email');
const orgEl = document.getElementById('f-org');
const trap = document.getElementById('f-company-url');
const submitBtn = document.getElementById('f-submit');
const status = document.getElementById('f-status');
const sentTo = document.getElementById('success-email');
const again = document.getElementById('success-reset');

const ccEl = document.getElementById('f-cc');
const phoneEl = document.getElementById('f-phone');
const consentEl = document.getElementById('f-consent');
const fields = [nameEl, emailEl, orgEl, phoneEl, consentEl];
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

need(nameEl, 2, 'Enter your name.');

if (!email) { setError(emailEl, 'Enter your work email address.'); ok = false; }
else if (!EMAIL_RE.test(email)) { setError(emailEl, 'Enter a valid email address, such as name@firm.com.'); ok = false; }
else if (cfg.blockFreeEmailDomains && FREE.indexOf(domain) !== -1) { setError(emailEl, 'Use your organization email address, not a personal one.'); ok = false; }
else setError(emailEl, '');

need(orgEl, 2, 'Enter your institution or organization name.');

const digits = phoneEl.value.replace(/\D/g, '');
if (digits.length < 6 || digits.length > 14) { setError(phoneEl, 'Enter a valid phone number without the country code.'); ok = false; } else setError(phoneEl, '');

if (!consentEl.checked) { setError(consentEl, 'Please confirm that we may call you.'); ok = false; } else setError(consentEl, '');

return ok;
}

function showSuccess(email) {
sentTo.textContent = email;
formWrap.classList.add('hidden');
success.classList.remove('hidden');
success.classList.add('success-in');
success.focus();
}

/* Formspree submission. Set the URL in config.js (formspreeUrl). */
function sendToFormspree(payload) {
const url = cfg.formspreeUrl || '';
// Until a real Formspree URL is set, the submission is only simulated in the browser.
if (!url || url.indexOf('YOUR_') !== -1) return Promise.resolve({ simulated: true });
return fetch(url, {
method: 'POST',
headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
body: JSON.stringify(payload)
}).then(function (res) {
if (!res.ok) throw new Error('Formspree error ' + res.status);
return res.json();
});
}

fields.forEach(function (el) {
el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', function () { if (el.getAttribute('aria-invalid') === 'true') validate(); });
});

form.addEventListener('submit', function (e) {
e.preventDefault();
status.textContent = '';
if (trap && trap.value) { showSuccess(emailEl.value.trim() || 'your inbox'); return; }
if (!validate()) { (form.querySelector('[aria-invalid="true"]') || emailEl).focus(); return; }

const payload = {
name: nameEl.value.trim(),
email: emailEl.value.trim(),
organization: orgEl.value.trim(),
country_code: ccEl.value,
phone: phoneEl.value.replace(/[^\d]/g, ''),
phone_full: ccEl.value + phoneEl.value.replace(/[^\d]/g, ''),
call_consent: consentEl.checked ? 'Yes - agreed to intro call' : 'No',
source: 'landing-page',
submittedAt: new Date().toISOString(),
};

submitBtn.disabled = true;
submitBtn.querySelector('span').textContent = 'Sending request…';

sendToFormspree(payload)
.then(function () {
document.dispatchEvent(new CustomEvent('tillenium:access-request', { detail: payload }));
showSuccess(payload.email);
})
.catch(function (err) {
console.error(err);
status.textContent = 'Something went wrong while sending your request. Please try again.';
})
.then(function () {
submitBtn.disabled = false;
submitBtn.querySelector('span').textContent = 'Request access';
});
});

if (again) again.addEventListener('click', function () {
form.reset();
fields.forEach(function (el) { setError(el, ''); });
success.classList.add('hidden');
formWrap.classList.remove('hidden');
nameEl.focus();
});
})();