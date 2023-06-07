$(function () {

    let theme = localStorage.getItem('theme');
    if (!theme) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            theme = 'dark';
            localStorage.setItem('theme', 'dark');
        } else {
            theme = 'light';
            localStorage.setItem('theme', 'light');
        }
    }
    $('html').attr('data-theme', theme);

    $('.js-change-theme').click(function () {
        if (theme == 'dark') {
            theme = 'light';
            localStorage.setItem('theme', 'light');
        } else {
            theme = 'dark';
            localStorage.setItem('theme', 'dark');
        }
        $('html').attr('data-theme', theme);
    });

    $('[data-modal]').click(function () {
        let modalName = $(this).attr('data-modal');
        $('.modal__name_' + modalName).show();
    });

    $('.modal__close').click(function () {
        $(this).parent().parent().parent().hide();
    });

    let language = localStorage.getItem('language');
    if (!language) {
        let userLanguage = (navigator.language).substr(0, 2);

        switch (userLanguage) {
            case 'ru':
                language = 'ru';
                break;

            case 'uk':
                language = 'uk';
                break;

            default:
                language = 'en';
                break;
        }

        localStorage.setItem('language', language);
    }

    function i18nextInit(language, loaderElement) {
        $(loaderElement).show();

        i18next.use(i18nextHttpBackend).init({
            debug: false,
            lng: language,
            fallbackLng: 'en',
            backend: {
                loadPath: 'locales/{{lng}}.json'
            },

        }, (err, t) => {
            if (err) return console.error(err);
            jqueryI18next.init(i18next, $, { useOptionsAttr: true });

            i18nextRerender(language, loaderElement);
        });
    }

    function i18nextChangeLanguage(language, loaderElement) {
        $(loaderElement).show();

        i18next.changeLanguage(language, () => {
            i18nextRerender(language, loaderElement);
        });
    }

    let tippyInstance;
    function i18nextRerender(language, loaderElement) {
        $('body').localize();
        $('title').text($.t('head.title'));
        $('html').attr('lang', language);
        $('input[name="language"]').removeAttr('checked');
        $('input[name="language"][value="' + language + '"]').prop('checked', true);

        if (tippyInstance) {
            Object.keys(tippyInstance).forEach(key => {
                tippyInstance[key].destroy();
            });
        }

        tippyInstance = tippy('[data-template]', {
            trigger: 'mouseenter focus',
            duration: 0,
            delay: [0, 0],
            arrow: false,
            offset: [0, 10],

            content(reference) {
                const templateName = $(reference).attr('data-template');
                const template = $('.tippy-templates__item_name_' + templateName);
                return template.html();
            },

            theme: 'custom'
        });

        setTimeout(function () {
            $(loaderElement).hide();
        }, 300);
    }

    i18nextInit(language, '.loader');

    $('.js-apply-language').click(function () {
        language = $('input[name="language"]:checked').val();
        localStorage.setItem('language', language);
        i18nextChangeLanguage(language, '.loader');
    });
});