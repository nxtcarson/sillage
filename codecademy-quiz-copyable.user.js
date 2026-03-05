// ==UserScript==
// @name         Codecademy Quiz - Make Choices Copyable
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Removes copy protection from quiz answer choices on Codecademy (multiple-choice only)
// @author       You
// @match        https://www.codecademy.com/*
// @match        https://codecademy.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const isFillInBlank = () => {
        return document.querySelector('[draggable="true"], [class*="blank"], [class*="Blank"], [class*="drag"], [class*="Drag"]');
    };

    const enableSelection = () => {
        if (isFillInBlank()) return;
        const style = document.createElement('style');
        style.id = 'codecademy-quiz-copyable';
        style.textContent = `
            [data-testid*="choice"]:not([draggable="true"]),
            [data-testid*="answer"]:not([draggable="true"]),
            [data-testid*="option"]:not([draggable="true"]),
            [role="radio"]:not([draggable="true"]),
            [role="button"][aria-pressed]:not([draggable="true"]),
            [class*="choice"]:not([draggable="true"]),
            [class*="answer"]:not([draggable="true"]),
            [class*="option"]:not([draggable="true"]),
            [class*="Choice"]:not([draggable="true"]),
            [class*="Answer"]:not([draggable="true"]),
            [class*="Option"]:not([draggable="true"]) {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }
        `;
        if (!document.getElementById('codecademy-quiz-copyable')) {
            (document.head || document.documentElement).appendChild(style);
        }
    };

    const removeSelectRestrictions = (el) => {
        if (!el || el.nodeType !== 1) return;
        if (el.closest('[draggable="true"], [class*="blank"], [class*="Blank"], [class*="drag"]')) return;
        if (el.closest('[class*="fill-in"], [class*="fillIn"]')) return;
        el.style.webkitUserSelect = 'text';
        el.style.mozUserSelect = 'text';
        el.style.msUserSelect = 'text';
        el.style.userSelect = 'text';
        el.removeAttribute('onselectstart');
        el.removeAttribute('oncopy');
        el.onselectstart = null;
        el.oncopy = null;
    };

    const scanAndFix = () => {
        if (isFillInBlank()) {
            document.getElementById('codecademy-quiz-copyable')?.remove();
            return;
        }
        enableSelection();
        document.querySelectorAll('button, [role="button"], [role="radio"]').forEach(el => {
            if (el.closest('[draggable="true"], [class*="blank"], [class*="fill-in"], [class*="fillIn"]')) return;
            if (el.closest('form') || el.closest('[class*="quiz"]') || el.closest('[class*="assessment"]') || el.closest('[class*="choice"]')) {
                removeSelectRestrictions(el);
                el.querySelectorAll('*').forEach(removeSelectRestrictions);
            }
        });
    };

    document.addEventListener('DOMContentLoaded', () => {
        enableSelection();
        scanAndFix();
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enableSelection);
    } else {
        enableSelection();
    }

    let scanTimeout;
    const observer = new MutationObserver(() => {
        clearTimeout(scanTimeout);
        scanTimeout = setTimeout(scanAndFix, 300);
    });

    const startObserver = () => {
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            setTimeout(startObserver, 100);
        }
    };

    if (document.body) {
        startObserver();
    } else {
        document.addEventListener('DOMContentLoaded', startObserver);
    }
})();
