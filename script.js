document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('contact-form');
    var nameInput = document.getElementById('name');
    var nameGreeting = document.getElementById('name-greeting');
    var emailInput = document.getElementById('email');
    var topicSelect = document.getElementById('topic');
    var topicHint = document.getElementById('topic-hint');
    var messageInput = document.getElementById('message');
    var charCount = document.getElementById('char-count');
    var consentCheckbox = document.querySelector('input[name="consent"]');
    var formMessage = document.getElementById('form-message');

    var maxMessage = 500;

    var topicHints = {
        general: 'How can I help?',
        web: 'Great choice - I enjoy building websites.',
        cyber: 'Cybersecurity is one of my favourite topics.',
        other: 'Please tell me more about it.'
    };

    function setError(input, errorId, message) {
        var errorElement = document.getElementById(errorId);
        if (message) {
            errorElement.textContent = message;
            input.classList.add('form-input--error');
        } else {
            errorElement.textContent = '';
            input.classList.remove('form-input--error');
        }
    }

    function validateName() {
        var name = nameInput.value.trim();
        if (name === '') {
            setError(nameInput, 'name-error', 'Please enter your name.');
            return false;
        }
        if (name.length < 2) {
            setError(nameInput, 'name-error', 'Your name must be at least 2 characters.');
            return false;
        }
        setError(nameInput, 'name-error', '');
        return true;
    }

    function validateEmail() {
        var email = emailInput.value.trim();
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            setError(emailInput, 'email-error', 'Please enter your email address.');
            return false;
        }
        if (!emailPattern.test(email)) {
            setError(emailInput, 'email-error', 'Please enter a valid email address.');
            return false;
        }
        setError(emailInput, 'email-error', '');
        return true;
    }

    function validateTopic() {
        if (topicSelect.value === '') {
            setError(topicSelect, 'topic-error', 'Please choose a topic.');
            return false;
        }
        setError(topicSelect, 'topic-error', '');
        return true;
    }

    function validateMessage() {
        var message = messageInput.value.trim();
        if (message === '') {
            setError(messageInput, 'message-error', 'Please enter a message.');
            return false;
        }
        if (message.length < 10) {
            setError(messageInput, 'message-error', 'Your message must be at least 10 characters.');
            return false;
        }
        setError(messageInput, 'message-error', '');
        return true;
    }

    function validateConsent() {
        var consentError = document.getElementById('consent-error');
        if (!consentCheckbox.checked) {
            consentError.textContent = 'Please tick the box before sending.';
            return false;
        }
        consentError.textContent = '';
        return true;
    }

    nameInput.addEventListener('input', function () {
        var name = nameInput.value.trim();
        if (name.length >= 2) {
            nameGreeting.textContent = 'Hello, ' + name + '! Nice to meet you.';
        } else {
            nameGreeting.textContent = '';
        }
        validateName();
    });

    topicSelect.addEventListener('change', function () {
        topicHint.textContent = topicHints[topicSelect.value] || '';
        validateTopic();
    });

    messageInput.addEventListener('input', function () {
        var length = messageInput.value.length;
        if (length >= maxMessage) {
            charCount.textContent = 'Maximum of ' + maxMessage + ' characters reached.';
        } else {
            charCount.textContent = length + ' / ' + maxMessage + ' characters';
        }
        validateMessage();
    });

    emailInput.addEventListener('input', validateEmail);
    emailInput.addEventListener('blur', validateEmail);
    nameInput.addEventListener('blur', validateName);
    messageInput.addEventListener('blur', validateMessage);
    consentCheckbox.addEventListener('change', validateConsent);

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        var nameOk = validateName();
        var emailOk = validateEmail();
        var topicOk = validateTopic();
        var messageOk = validateMessage();
        var consentOk = validateConsent();
        var isValid = nameOk && emailOk && topicOk && messageOk && consentOk;

        if (isValid) {
            formMessage.className = 'form-message form-message--success';
            formMessage.textContent = 'Thank you, ' + nameInput.value.trim() + '! Your message has been sent.';
            formMessage.hidden = false;

            form.reset();
            nameGreeting.textContent = '';
            topicHint.textContent = '';
            charCount.textContent = '0 / ' + maxMessage + ' characters';

            window.setTimeout(function () {
                formMessage.hidden = true;
                formMessage.textContent = '';
            }, 5000);
        } else {
            formMessage.className = 'form-message form-message--error';
            formMessage.textContent = 'Please fix the highlighted fields and try again.';
            formMessage.hidden = false;
        }
    });

    /* ---------- Enhancement: light/dark theme toggle ---------- */
    var themeToggle = document.getElementById('theme-toggle');

    function applyTheme(isDark) {
        document.body.classList.toggle('dark-theme', isDark);
        themeToggle.setAttribute('aria-pressed', String(isDark));
        themeToggle.textContent = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    }

    applyTheme(window.localStorage.getItem('theme') === 'dark');

    themeToggle.addEventListener('click', function () {
        var isDark = !document.body.classList.contains('dark-theme');
        applyTheme(isDark);
        window.localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    /* ---------- Enhancement: add/remove interests ---------- */
    var interestsList = document.querySelector('.interests-list');
    var newInterestInput = document.getElementById('new-interest');
    var addInterestBtn = document.getElementById('add-interest');
    var interestError = document.getElementById('interest-error');

    function createRemoveButton() {
        var removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-interest';
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', function () {
            interestsList.removeChild(removeBtn.parentNode);
        });
        return removeBtn;
    }

    // Give the interests already in the HTML a remove button too
    var existingInterests = interestsList.getElementsByTagName('li');
    for (var i = 0; i < existingInterests.length; i++) {
        existingInterests[i].appendChild(createRemoveButton());
    }

    function addInterest() {
        var text = newInterestInput.value.trim();
        if (text === '') {
            interestError.textContent = 'Please type an interest first.';
            newInterestInput.focus();
            return;
        }
        interestError.textContent = '';

        var item = document.createElement('li');
        item.appendChild(document.createTextNode(text));
        item.appendChild(createRemoveButton());
        interestsList.appendChild(item);

        newInterestInput.value = '';
        newInterestInput.focus();
    }

    addInterestBtn.addEventListener('click', addInterest);
    newInterestInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addInterest();
        }
    });

    /* ---------- Enhancement: click a skills row to highlight it ---------- */
    var skillRows = document.querySelectorAll('.skills-table tr');
    for (var j = 1; j < skillRows.length; j++) {
        skillRows[j].addEventListener('click', function () {
            this.classList.toggle('row--highlight');
        });
    }

    /* ---------- Enhancement: dynamic footer ---------- */
    document.getElementById('footer-year').textContent = new Date().getFullYear();
    if (document.lastModified) {
        document.getElementById('last-updated').textContent = 'Last updated: ' + document.lastModified;
    }

    /* ---------- Enhancement: back-to-top button built with DOM methods ---------- */
    var backToTop = document.createElement('button');
    backToTop.type = 'button';
    backToTop.className = 'back-to-top';
    backToTop.textContent = 'Back to top';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            backToTop.classList.add('back-to-top--visible');
        } else {
            backToTop.classList.remove('back-to-top--visible');
        }
    });

    backToTop.addEventListener('click', function () {
        window.scrollTo(0, 0);
    });

    /* ---------- Enhancement: random quote from the freeapi.app API ---------- */
    var quoteText = document.getElementById('quote-text');
    var quoteAuthor = document.getElementById('quote-author');
    var quoteError = document.getElementById('quote-error');
    var newQuoteBtn = document.getElementById('new-quote');

    function fetchQuote() {
        quoteText.textContent = 'Loading quote...';
        quoteAuthor.textContent = '';
        quoteError.textContent = '';
        newQuoteBtn.disabled = true;

        fetch('https://api.freeapi.app/api/v1/public/quotes/quote/random')
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('HTTP error ' + response.status);
                }
                return response.json();
            })
            .then(function (result) {
                quoteText.textContent = '\u201C' + result.data.content + '\u201D';
                quoteAuthor.textContent = '\u2014 ' + result.data.author;
                newQuoteBtn.disabled = false;
            })
            .catch(function (error) {
                quoteText.textContent = 'Sorry, the quote could not be loaded right now.';
                quoteError.textContent = 'Please check your connection and try again. (' + error.message + ')';
                newQuoteBtn.disabled = false;
            });
    }

    newQuoteBtn.addEventListener('click', fetchQuote);
    fetchQuote();
});
