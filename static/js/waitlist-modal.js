const WaitlistModal = (() => {
    let modal;
    let form;
    let closeBtn;
    let backdrop;
    let statusDiv;
    let openButtons;

    function init() {
        // Cache elements
        modal = document.getElementById('waitlist-modal');
        form = document.getElementById('waitlist-form');
        closeBtn = modal?.querySelector('.modal-close');
        backdrop = modal?.querySelector('.modal-backdrop');
        statusDiv = document.getElementById('form-status');
        openButtons = document.querySelectorAll('#open-waitlist-btn, .btn-waitlist');

        if (!modal || !form) return;

        // Attach event listeners
        openButtons.forEach(btn => {
            btn.addEventListener('click', open);
        });

        closeBtn?.addEventListener('click', close);
        backdrop?.addEventListener('click', close);
        form.addEventListener('submit', handleSubmit);

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('visible')) {
                close();
            }
        });
    }

    function open() {
        modal.style.display = 'flex';
        // Trigger reflow for animation
        void modal.offsetHeight;
        modal.classList.add('visible');
        document.body.style.overflow = 'hidden';

        // Focus first input for accessibility
        const firstInput = form.querySelector('input');
        firstInput?.focus();
    }

    function close() {
        modal.classList.remove('visible');
        document.body.style.overflow = '';

        setTimeout(() => {
            modal.style.display = 'none';
            resetForm();
        }, 300);
    }

    function resetForm() {
        form.reset();
        hideStatus();
    }

    function showStatus(message, isError = false) {
        statusDiv.textContent = message;
        statusDiv.className = 'form-status ' + (isError ? 'error' : 'success');
        statusDiv.style.display = 'block';
    }

    function hideStatus() {
        statusDiv.style.display = 'none';
        statusDiv.textContent = '';
    }

    async function handleSubmit(e) {
        e.preventDefault();
        hideStatus();

        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;

        // Disable button during submission
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        // Collect form data
        const formData = {
            first_name: form.elements['first_name'].value.trim(),
            last_name: form.elements['last_name'].value.trim(),
            email: form.elements['email'].value.trim(),
            reason: form.elements['reason'].value.trim(),
            consent_required: form.elements['consent_required'].checked,
            consent_marketing: form.elements['consent_marketing'].checked
        };

        try {
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                showStatus('✓ Successfully joined the waitlist! We\'ll be in touch soon.', false);
                setTimeout(() => {
                    close();
                }, 2000);
            } else {
                const errorMsg = result.error || 'Something went wrong. Please try again.';
                showStatus(errorMsg, true);
            }
        } catch (error) {
            console.error('Waitlist submission error:', error);
            showStatus('Network error. Please check your connection and try again.', true);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    return {
        init,
        open,
        close
    };
})();
