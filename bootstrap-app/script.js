/* Bootstrap 5 version of the About Me app (vanilla JavaScript) */

document.addEventListener('DOMContentLoaded', function () {

    /* ---------- Theme toggle (Bootstrap data-bs-theme) ---------- */
    var themeToggle = document.getElementById('theme-toggle');
    var htmlEl = document.documentElement;

    function applyTheme(theme) {
        htmlEl.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
        var isDark = theme === 'dark';
        themeToggle.setAttribute('aria-pressed', String(isDark));
        themeToggle.textContent = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    }

    applyTheme(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');

    themeToggle.addEventListener('click', function () {
        var next = htmlEl.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    });

    /* ---------- Section collapse toggle text update ---------- */
    function updateToggleButton(targetId, isExpanded) {
        var btn = document.querySelector('button[data-bs-target="#' + targetId + '"]');
        if (btn) {
            btn.textContent = isExpanded ? 'Hide' : 'Show';
            btn.setAttribute('aria-expanded', String(isExpanded));
        }
    }

    document.querySelectorAll('.collapse').forEach(function (collapseEl) {
        collapseEl.addEventListener('shown.bs.collapse', function () {
            updateToggleButton(this.id, true);
        });
        collapseEl.addEventListener('hidden.bs.collapse', function () {
            updateToggleButton(this.id, false);
        });
    });

    /* ---------- Interests: filter, add, remove ---------- */
    var interestsList = document.getElementById('interests-list');
    var interestFilter = document.getElementById('interest-filter');
    var newInterestInput = document.getElementById('new-interest');
    var addInterestBtn = document.getElementById('add-interest');
    var interestError = document.getElementById('interest-error');

    function setInterestError(message) {
        interestError.textContent = message;
        if (message) {
            interestError.classList.add('d-block');
        } else {
            interestError.classList.remove('d-block');
        }
    }

    function createRemoveButton() {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-outline-danger btn-sm remove-interest';
        btn.textContent = 'Remove';
        btn.addEventListener('click', function () {
            btn.closest('li').remove();
        });
        return btn;
    }

    document.querySelectorAll('.remove-interest').forEach(function (btn) {
        btn.addEventListener('click', function () {
            btn.closest('li').remove();
        });
    });

    function addInterest() {
        var text = newInterestInput.value.trim();
        if (text === '') {
            setInterestError('Please type an interest first.');
            newInterestInput.focus();
            return;
        }
        setInterestError('');

        var li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';

        var span = document.createElement('span');
        span.className = 'interest-text';
        span.textContent = text;

        li.appendChild(span);
        li.appendChild(createRemoveButton());
        interestsList.appendChild(li);

        newInterestInput.value = '';
        newInterestInput.focus();
        // Re-apply the filter so the new item is shown if a filter is active
        filterInterests();
    }

    addInterestBtn.addEventListener('click', addInterest);
    newInterestInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addInterest();
        }
    });

    function filterInterests() {
        var term = interestFilter.value.toLowerCase();
        interestsList.querySelectorAll('li').forEach(function (li) {
            var text = li.querySelector('.interest-text').textContent.toLowerCase();
            li.classList.toggle('d-none', text.indexOf(term) === -1);
        });
    }

    interestFilter.addEventListener('input', filterInterests);

    /* ---------- Skills table row highlight ---------- */
    document.querySelectorAll('#skills-body tr').forEach(function (row) {
        row.addEventListener('click', function () {
            row.classList.toggle('table-warning');
        });
    });

    /* ---------- Quote of the Moment (fetch API) ---------- */
    var quoteText = document.getElementById('quote-text');
    var quoteAuthor = document.getElementById('quote-author');
    var quoteError = document.getElementById('quote-error');
    var newQuoteBtn = document.getElementById('new-quote');
    var quoteSpinner = document.getElementById('quote-spinner');
    var quoteFigure = document.getElementById('quote-figure');

    function fetchQuote() {
        quoteText.textContent = '';
        quoteAuthor.textContent = '';
        quoteError.textContent = '';
        quoteFigure.classList.add('d-none');
        quoteSpinner.classList.remove('d-none');
        newQuoteBtn.disabled = true;

        fetch('https://api.freeapi.app/api/v1/public/quotes/quote/random')
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('HTTP error ' + response.status);
                }
                return response.json();
            })
            .then(function (result) {
                if (result && result.data) {
                    quoteText.textContent = '\u201C' + result.data.content + '\u201D';
                    quoteAuthor.textContent = '\u2014 ' + result.data.author;
                } else {
                    throw new Error('Unexpected response format');
                }
            })
            .catch(function (error) {
                quoteText.textContent = 'Sorry, the quote could not be loaded right now.';
                quoteError.textContent = 'Please check your connection and try again. (' + error.message + ')';
            })
            .finally(function () {
                quoteSpinner.classList.add('d-none');
                quoteFigure.classList.remove('d-none');
                newQuoteBtn.disabled = false;
            });
    }

    newQuoteBtn.addEventListener('click', fetchQuote);
    fetchQuote();

    /* ---------- Contact form validation ---------- */
    var form = document.getElementById('contact-form');
    var nameInput = document.getElementById('name');
    var nameGreeting = document.getElementById('name-greeting');
    var emailInput = document.getElementById('email');
    var topicSelect = document.getElementById('topic');
    var topicHint = document.getElementById('topic-hint');
    var messageInput = document.getElementById('message');
    var charCount = document.getElementById('char-count');
    var consentCheckbox = document.getElementById('consent');
    var formMessage = document.getElementById('form-message');

    var maxMessage = 500;

    var topicHints = {
        general: 'How can I help?',
        web: 'Great choice - I enjoy building websites.',
        cyber: 'Cybersecurity is one of my favourite topics.',
        other: 'Please tell me more about it.'
    };

    function setError(input, errorEl, message) {
        if (message) {
            input.classList.add('is-invalid');
            errorEl.textContent = message;
            errorEl.classList.add('d-block');
        } else {
            input.classList.remove('is-invalid');
            errorEl.textContent = '';
            errorEl.classList.remove('d-block');
        }
    }

    function validateName() {
        var name = nameInput.value.trim();
        if (name === '') {
            setError(nameInput, document.getElementById('name-error'), 'Please enter your name.');
            return false;
        }
        if (name.length < 2) {
            setError(nameInput, document.getElementById('name-error'), 'Your name must be at least 2 characters.');
            return false;
        }
        setError(nameInput, document.getElementById('name-error'), '');
        return true;
    }

    function validateEmail() {
        var email = emailInput.value.trim();
        var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            setError(emailInput, document.getElementById('email-error'), 'Please enter your email address.');
            return false;
        }
        if (!pattern.test(email)) {
            setError(emailInput, document.getElementById('email-error'), 'Please enter a valid email address.');
            return false;
        }
        setError(emailInput, document.getElementById('email-error'), '');
        return true;
    }

    function validateTopic() {
        if (topicSelect.value === '') {
            setError(topicSelect, document.getElementById('topic-error'), 'Please choose a topic.');
            return false;
        }
        setError(topicSelect, document.getElementById('topic-error'), '');
        return true;
    }

    function validateMessage() {
        var message = messageInput.value.trim();
        if (message === '') {
            setError(messageInput, document.getElementById('message-error'), 'Please enter a message.');
            return false;
        }
        if (message.length < 10) {
            setError(messageInput, document.getElementById('message-error'), 'Your message must be at least 10 characters.');
            return false;
        }
        setError(messageInput, document.getElementById('message-error'), '');
        return true;
    }

    function validateConsent() {
        if (!consentCheckbox.checked) {
            setError(consentCheckbox, document.getElementById('consent-error'), 'Please tick the box before sending.');
            return false;
        }
        setError(consentCheckbox, document.getElementById('consent-error'), '');
        return true;
    }

    function showAlert(message, type) {
        formMessage.textContent = message;
        formMessage.className = 'alert alert-' + type;
        formMessage.classList.remove('d-none');
    }

    function hideAlert() {
        formMessage.classList.add('d-none');
        formMessage.textContent = '';
    }

    nameInput.addEventListener('input', function () {
        var name = nameInput.value.trim();
        nameGreeting.textContent = name.length >= 2 ? 'Hello, ' + name + '! Nice to meet you.' : '';
        validateName();
    });

    topicSelect.addEventListener('change', function () {
        topicHint.textContent = topicHints[topicSelect.value] || '';
        validateTopic();
    });

    messageInput.addEventListener('input', function () {
        var length = messageInput.value.length;
        charCount.textContent = length >= maxMessage
            ? 'Maximum of ' + maxMessage + ' characters reached.'
            : length + ' / ' + maxMessage + ' characters';
        validateMessage();
    });

    emailInput.addEventListener('input', validateEmail);
    emailInput.addEventListener('blur', validateEmail);
    nameInput.addEventListener('blur', validateName);
    messageInput.addEventListener('blur', validateMessage);
    consentCheckbox.addEventListener('change', validateConsent);

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        var valid = validateName() && validateEmail() && validateTopic() && validateMessage() && validateConsent();

        if (valid) {
            showAlert('Thank you, ' + nameInput.value.trim() + '! Your message has been sent.', 'success');
            form.reset();
            nameGreeting.textContent = '';
            topicHint.textContent = '';
            charCount.textContent = '0 / ' + maxMessage + ' characters';
            form.querySelectorAll('.is-invalid').forEach(function (el) {
                el.classList.remove('is-invalid');
            });
            form.querySelectorAll('.invalid-feedback').forEach(function (el) {
                el.textContent = '';
                el.classList.remove('d-block');
            });
            window.setTimeout(hideAlert, 5000);
        } else {
            showAlert('Please fix the highlighted fields and try again.', 'danger');
            var firstInvalid = form.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        }
    });

    /* ---------- Back to top button ---------- */
    var backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', function () {
        backToTop.classList.toggle('back-to-top--visible', window.scrollY > 300);
    });

    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ---------- Dynamic footer ---------- */
    document.getElementById('footer-year').textContent = new Date().getFullYear();
    if (document.lastModified) {
        document.getElementById('last-updated').textContent = 'Last updated: ' + document.lastModified;
    }
});
