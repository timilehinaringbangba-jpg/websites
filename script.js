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
});
