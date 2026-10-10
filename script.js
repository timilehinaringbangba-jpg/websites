$(function () {
    /* ---------- Smooth scrolling for navigation links (jQuery animate) ---------- */
    $('.main-nav a').on('click', function (event) {
        event.preventDefault();
        var target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 20
            }, 500);
        }
    });

    /* ---------- Light/dark theme toggle (jQuery addClass/removeClass) ---------- */
    var $themeToggle = $('#theme-toggle');

    function applyTheme(isDark) {
        $('body').toggleClass('dark-theme', isDark);
        $themeToggle.attr('aria-pressed', String(isDark));
        $themeToggle.text(isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }

    applyTheme(window.localStorage.getItem('theme') === 'dark');

    $themeToggle.on('click', function () {
        var isDark = !$('body').hasClass('dark-theme');
        applyTheme(isDark);
        window.localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    /* ---------- Collapsible sections (jQuery wrapAll, slideToggle, text, attr) ---------- */
    $('.section').each(function () {
        var $section = $(this);
        var $title = $section.find('.section-title');
        var $content = $section.children().not($title);

        // Wrap all section content so it can be collapsed together
        var $contentWrap = $content.wrapAll('<div class="section-content"></div>').parent();

        var $toggleBtn = $('<button type="button" class="section-toggle" aria-expanded="true">Hide</button>');
        $title.append($toggleBtn);

        $toggleBtn.on('click', function () {
            $contentWrap.slideToggle(300, function () {
                var isVisible = $contentWrap.is(':visible');
                $toggleBtn.text(isVisible ? 'Hide' : 'Show');
                $toggleBtn.attr('aria-expanded', String(isVisible));
                // Demonstrates jQuery .css()
                $title.css('opacity', isVisible ? '1' : '0.7');
            });
        });
    });

    /* ---------- Interests list filter (jQuery filter, show/hide, val, each) ---------- */
    var $interestsList = $('.interests-list');
    var $filterLabel = $('<label for="interest-filter" class="form-label">Filter interests:</label>');
    var $filterInput = $('<input type="search" id="interest-filter" class="form-input interest-filter" placeholder="Type to filter interests...">');

    $('#interests .interest-add').before($filterLabel, $filterInput);

    $filterInput.on('input', function () {
        var term = $(this).val().toLowerCase();
        $interestsList.find('li').each(function () {
            var $li = $(this);
            // Get the text content without the "Remove" button text
            var itemText = $li.clone().children().remove().end().text().toLowerCase();
            $li.toggle(itemText.indexOf(term) !== -1);
        });
    });

    /* ---------- Add/remove interests (jQuery append, fadeIn, fadeOut, closest) ---------- */
    var $newInterest = $('#new-interest');
    var $addInterestBtn = $('#add-interest');
    var $interestError = $('#interest-error');

    function createRemoveButton() {
        return $('<button type="button" class="remove-interest">Remove</button>').on('click', function () {
            $(this).closest('li').fadeOut(300, function () {
                $(this).remove();
            });
        });
    }

    // Add a Remove button to each interest already in the HTML
    $interestsList.find('li').append(createRemoveButton());

    function addInterest() {
        var text = $newInterest.val().trim();
        if (text === '') {
            $interestError.text('Please type an interest first.');
            $newInterest.focus();
            return;
        }
        $interestError.text('');

        var $item = $('<li></li>').text(text + ' ').append(createRemoveButton()).hide();
        $interestsList.append($item);
        $item.fadeIn(300);

        $newInterest.val('').focus();
    }

    $addInterestBtn.on('click', addInterest);
    $newInterest.on('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addInterest();
        }
    });

    /* ---------- Highlight a skills row (jQuery toggleClass) ---------- */
    $('.skills-table tr:not(:first-child)').on('click', function () {
        $(this).toggleClass('row--highlight');
    });

    /* ---------- Back-to-top button (jQuery create element, fadeIn/fadeOut, animate) ---------- */
    var $backToTop = $('<button type="button" class="back-to-top">Back to top</button>').appendTo('body');

    $(window).on('scroll', function () {
        $backToTop.toggleClass('back-to-top--visible', $(window).scrollTop() > 300);
    });

    $backToTop.on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 500);
    });

    /* ---------- Dynamic footer (jQuery text) ---------- */
    $('#footer-year').text(new Date().getFullYear());
    if (document.lastModified) {
        $('#last-updated').text('Last updated: ' + document.lastModified);
    }

    /* ---------- Random quote using jQuery AJAX ($.getJSON, done, fail, always) ---------- */
    var $quoteText = $('#quote-text');
    var $quoteAuthor = $('#quote-author');
    var $quoteError = $('#quote-error');
    var $newQuoteBtn = $('#new-quote');

    function fetchQuote() {
        $quoteText.text('Loading quote...');
        $quoteAuthor.text('');
        $quoteError.text('');
        $newQuoteBtn.prop('disabled', true);

        $.getJSON('https://api.freeapi.app/api/v1/public/quotes/quote/random')
            .done(function (result) {
                if (result && result.data) {
                    $quoteText.hide().text('\u201C' + result.data.content + '\u201D').fadeIn(400);
                    $quoteAuthor.hide().text('\u2014 ' + result.data.author).fadeIn(400);
                } else {
                    $quoteText.text('Sorry, the quote could not be loaded right now.');
                    $quoteError.text('Unexpected response format from the quote service.');
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                $quoteText.text('Sorry, the quote could not be loaded right now.');
                $quoteError.text('Please check your connection and try again. (' + textStatus + ')');
            })
            .always(function () {
                $newQuoteBtn.prop('disabled', false);
            });
    }

    $newQuoteBtn.on('click', fetchQuote);
    fetchQuote();

    /* ---------- Contact form validation with jQuery effects (slideDown, addClass, focus) ---------- */
    var $form = $('#contact-form');
    var $nameInput = $('#name');
    var $nameGreeting = $('#name-greeting');
    var $emailInput = $('#email');
    var $topicSelect = $('#topic');
    var $topicHint = $('#topic-hint');
    var $messageInput = $('#message');
    var $charCount = $('#char-count');
    var $consentCheckbox = $('input[name="consent"]');
    var $formMessage = $('#form-message');

    var maxMessage = 500;

    var topicHints = {
        general: 'How can I help?',
        web: 'Great choice - I enjoy building websites.',
        cyber: 'Cybersecurity is one of my favourite topics.',
        other: 'Please tell me more about it.'
    };

    function setError($input, errorId, message) {
        var $error = $('#' + errorId);
        if (message) {
            $error.text(message).hide().slideDown(200);
            $input.addClass('form-input--error');
        } else {
            $error.slideUp(200, function () {
                $(this).text('');
            });
            $input.removeClass('form-input--error');
        }
    }

    function validateName() {
        var name = $nameInput.val().trim();
        if (name === '') {
            setError($nameInput, 'name-error', 'Please enter your name.');
            return false;
        }
        if (name.length < 2) {
            setError($nameInput, 'name-error', 'Your name must be at least 2 characters.');
            return false;
        }
        setError($nameInput, 'name-error', '');
        return true;
    }

    function validateEmail() {
        var email = $emailInput.val().trim();
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            setError($emailInput, 'email-error', 'Please enter your email address.');
            return false;
        }
        if (!emailPattern.test(email)) {
            setError($emailInput, 'email-error', 'Please enter a valid email address.');
            return false;
        }
        setError($emailInput, 'email-error', '');
        return true;
    }

    function validateTopic() {
        if ($topicSelect.val() === '') {
            setError($topicSelect, 'topic-error', 'Please choose a topic.');
            return false;
        }
        setError($topicSelect, 'topic-error', '');
        return true;
    }

    function validateMessage() {
        var message = $messageInput.val().trim();
        if (message === '') {
            setError($messageInput, 'message-error', 'Please enter a message.');
            return false;
        }
        if (message.length < 10) {
            setError($messageInput, 'message-error', 'Your message must be at least 10 characters.');
            return false;
        }
        setError($messageInput, 'message-error', '');
        return true;
    }

    function validateConsent() {
        var $consentError = $('#consent-error');
        if (!$consentCheckbox.is(':checked')) {
            $consentError.text('Please tick the box before sending.').hide().slideDown(200);
            return false;
        }
        $consentError.slideUp(200, function () {
            $(this).text('');
        });
        return true;
    }

    $nameInput.on('input', function () {
        var name = $nameInput.val().trim();
        $nameGreeting.text(name.length >= 2 ? 'Hello, ' + name + '! Nice to meet you.' : '');
        validateName();
    });

    $topicSelect.on('change', function () {
        $topicHint.text(topicHints[$topicSelect.val()] || '');
        validateTopic();
    });

    $messageInput.on('input', function () {
        var length = $messageInput.val().length;
        $charCount.text(length >= maxMessage
            ? 'Maximum of ' + maxMessage + ' characters reached.'
            : length + ' / ' + maxMessage + ' characters');
        validateMessage();
    });

    $emailInput.on('input blur', validateEmail);
    $nameInput.on('blur', validateName);
    $messageInput.on('blur', validateMessage);
    $consentCheckbox.on('change', validateConsent);

    $form.on('submit', function (event) {
        event.preventDefault();

        var isValid = validateName() && validateEmail() && validateTopic() && validateMessage() && validateConsent();

        if (isValid) {
            $formMessage
                .removeClass('form-message--error')
                .addClass('form-message--success')
                .text('Thank you, ' + $nameInput.val().trim() + '! Your message has been sent.')
                .removeAttr('hidden')
                .hide()
                .slideDown(300);

            $form[0].reset();
            $nameGreeting.text('');
            $topicHint.text('');
            $charCount.text('0 / ' + maxMessage + ' characters');
            $('.error-msg').text('').hide();
            $('.form-input--error').removeClass('form-input--error');

            window.setTimeout(function () {
                $formMessage.slideUp(300, function () {
                    $(this).text('').attr('hidden', true);
                });
            }, 5000);
        } else {
            $formMessage
                .removeClass('form-message--success')
                .addClass('form-message--error')
                .text('Please fix the highlighted fields and try again.')
                .removeAttr('hidden')
                .hide()
                .slideDown(300);

            var $firstError = $('.form-input--error').first();
            if ($firstError.length) {
                $firstError.focus();
            }
        }
    });
});
