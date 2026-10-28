/**
 * SÉNÉGAL ÉVASION - Interactive Scripts
 * Responsive navigation, Dynamic Filters, Universal Booking Modal, Toast Alerts, WhatsApp integration
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. STICKY NAVBAR WITH GLASS BLUR EFFECT
    const navbar = document.querySelector('.navbar');
    const updateNavbar = () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', updateNavbar);
    updateNavbar();

    // 2. CLOSE MOBILE MENU WHEN A NAV LINK IS CLICKED
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) bsCollapse.hide();
                }
            });
        });
    }

    // 3. DESTINATIONS & CIRCUITS INTERACTIVE FILTERING
    const filterButtons = document.querySelectorAll('[data-filter]');
    const filterItems = document.querySelectorAll('[data-category]');

    if (filterButtons.length > 0 && filterItems.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const selectedCategory = btn.getAttribute('data-filter');

                filterItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    if (selectedCategory === 'all' || itemCategory.includes(selectedCategory)) {
                        item.style.display = '';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 250);
                    }
                });
            });
        });
    }

    // 4. PRE-FILL RESERVATION MODAL FROM CARD BUTTONS
    const bookingButtons = document.querySelectorAll('[data-bs-target="#reservationModal"], .btn-book-now');
    const destinationSelect = document.getElementById('destinationSelect');
    const circuitSelect = document.getElementById('circuitSelect');

    bookingButtons.forEach(button => {
        button.addEventListener('click', () => {
            const destName = button.getAttribute('data-destination');
            const circuitName = button.getAttribute('data-circuit');

            if (destName && destinationSelect) {
                // Find matching option or set value
                let found = false;
                for (let option of destinationSelect.options) {
                    if (option.value.toLowerCase() === destName.toLowerCase() || option.text.toLowerCase().includes(destName.toLowerCase())) {
                        destinationSelect.value = option.value;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    destinationSelect.value = destName;
                }
            }

            if (circuitName && circuitSelect) {
                for (let option of circuitSelect.options) {
                    if (option.value.toLowerCase() === circuitName.toLowerCase() || option.text.toLowerCase().includes(circuitName.toLowerCase())) {
                        circuitSelect.value = option.value;
                        break;
                    }
                }
            }
        });
    });

    // 5. RESERVATION FORM HANDLING & WHATSAPP CONFIRMATION
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nom = document.getElementById('modalNom')?.value.trim() || 'Client';
            const email = document.getElementById('modalEmail')?.value.trim() || '';
            const tel = document.getElementById('modalTel')?.value.trim() || '';
            const destination = document.getElementById('destinationSelect')?.value || 'Non spécifiée';
            const date = document.getElementById('modalDate')?.value || 'Dès que possible';
            const personnes = document.getElementById('modalPersonnes')?.value || '1';
            const message = document.getElementById('modalMessage')?.value.trim() || '';

            // Send via WhatsApp directly or simulate API submission
            const sendViaWhatsApp = document.getElementById('sendWhatsAppCheckbox')?.checked;

            if (sendViaWhatsApp) {
                const textMessage = `*Nouvelle Demande de Réservation - Sénégal Évasion*\n\n` +
                    `👤 *Nom:* ${nom}\n` +
                    `📧 *Email:* ${email}\n` +
                    `📞 *Téléphone:* ${tel}\n` +
                    `📍 *Destination/Circuit:* ${destination}\n` +
                    `📅 *Date souhaitée:* ${date}\n` +
                    `👥 *Nombre de personnes:* ${personnes}\n` +
                    (message ? `📝 *Message:* ${message}\n` : '');

                const whatsappUrl = `https://wa.me/221783729251?text=${encodeURIComponent(textMessage)}`;
                window.open(whatsappUrl, '_blank');
            }

            // Show success toast
            showToast('Félicitations !', `Merci ${nom}, votre demande pour "${destination}" a bien été enregistrée. Notre conseiller va vous contacter sous 24h.`);

            // Close modal
            const modalEl = document.getElementById('reservationModal');
            if (modalEl) {
                const modal = bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
            }

            reservationForm.reset();
        });
    }

    // 6. CONTACT FORM HANDLING
    const contactForm = document.getElementById('mainContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nom = document.getElementById('contactNom')?.value.trim() || 'Cher client';
            const sujet = document.getElementById('contactSujet')?.value || 'votre demande';

            showToast('Message envoyé !', `Merci ${nom}, nous avons bien reçu votre message concernant "${sujet}". Nous vous répondrons dans les plus brefs délais.`);
            contactForm.reset();
        });
    }

    // 7. QUICK SEARCH BAR ON HERO
    const heroSearchForm = document.getElementById('heroSearchForm');
    if (heroSearchForm) {
        heroSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const dest = document.getElementById('heroDestination')?.value;
            const type = document.getElementById('heroType')?.value;

            // If we are on index.html, redirect to destinations or circuits with query parameter
            const isSubpage = window.location.pathname.includes('/pages/');
            const targetUrl = isSubpage ? 'destinations.html' : 'pages/destinations.html';
            
            // Open reservation modal with pre-selected choice or redirect
            const modalEl = document.getElementById('reservationModal');
            if (modalEl && typeof bootstrap !== 'undefined') {
                if (dest && destinationSelect) {
                    destinationSelect.value = dest;
                }
                const modal = new bootstrap.Modal(modalEl);
                modal.show();
            } else {
                window.location.href = targetUrl;
            }
        });
    }

    // 8. TOAST NOTIFICATION HELPER
    function showToast(title, message) {
        let toastContainer = document.getElementById('toastNotificationContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastNotificationContainer';
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            toastContainer.style.zIndex = '9999';
            document.body.appendChild(toastContainer);
        }

        const toastId = 'toast-' + Date.now();
        const toastHTML = `
            <div id="${toastId}" class="toast align-items-center text-white bg-dark border-0 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex p-2">
                    <div class="toast-body">
                        <div class="d-flex align-items-center mb-1">
                            <i class="bi bi-check-circle-fill text-warning fs-5 me-2"></i>
                            <strong class="me-auto text-warning">${title}</strong>
                        </div>
                        <p class="mb-0 small text-light">${message}</p>
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fermer"></button>
                </div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        const toastEl = document.getElementById(toastId);
        if (toastEl && typeof bootstrap !== 'undefined') {
            const toast = new bootstrap.Toast(toastEl, { delay: 5000 });
            toast.show();
            toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
        }
    }

    // 9. ANIMATE STAT COUNTERS ON SCROLL
    const statCounters = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    if (statCounters.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    statCounters.forEach(counter => {
                        const target = parseInt(counter.getAttribute('data-target') || '0', 10);
                        const suffix = counter.getAttribute('data-suffix') || '';
                        let current = 0;
                        const step = Math.ceil(target / 40);
                        const timer = setInterval(() => {
                            current += step;
                            if (current >= target) {
                                counter.textContent = target + suffix;
                                clearInterval(timer);
                            } else {
                                counter.textContent = current + suffix;
                            }
                        }, 30);
                    });
                }
            });
        }, { threshold: 0.3 });

        const statsSection = document.querySelector('.stats-section, .about-stats');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    // 10. TRANSPORT SECTION - Button "Réserver ce transport" handlers
    const transportSelectBtns = document.querySelectorAll('.btn-select-transport');
    const transportTypeSelect = document.getElementById('transportType');
    const transportFormSection = document.getElementById('form-transport');

    if (transportSelectBtns.length > 0) {
        transportSelectBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const transportName = btn.getAttribute('data-transport');

                // Pre-fill the transport select in the form below
                if (transportTypeSelect && transportName) {
                    for (let option of transportTypeSelect.options) {
                        if (option.value.toLowerCase().includes(transportName.toLowerCase()) ||
                            transportName.toLowerCase().includes(option.value.toLowerCase())) {
                            transportTypeSelect.value = option.value;
                            break;
                        }
                    }
                }

                // Smooth scroll to the reservation form
                if (transportFormSection) {
                    transportFormSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

                    // Add a brief highlight animation on the form
                    const bookingCard = transportFormSection.querySelector('.transport-booking-card');
                    if (bookingCard) {
                        bookingCard.style.transition = 'box-shadow 0.4s ease';
                        bookingCard.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.5), 0 16px 40px -8px rgba(15, 23, 42, 0.12)';
                        setTimeout(() => {
                            bookingCard.style.boxShadow = '';
                        }, 2000);
                    }
                }
            });
        });
    }

    // 11. TRANSPORT BOOKING FORM SUBMISSION
    const transportBookingForm = document.getElementById('transportBookingForm');
    if (transportBookingForm) {
        transportBookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nom = document.getElementById('transportNom')?.value.trim() || 'Client';
            const tel = document.getElementById('transportTel')?.value.trim() || '';
            const transport = document.getElementById('transportType')?.options[document.getElementById('transportType')?.selectedIndex]?.text || 'Non spécifié';
            const destination = document.getElementById('transportDestination')?.options[document.getElementById('transportDestination')?.selectedIndex]?.text || 'Non spécifiée';
            const date = document.getElementById('transportDate')?.value || 'Dès que possible';
            const passagers = document.getElementById('transportPassagers')?.value.trim() || '';

            // Compose WhatsApp message
            const textMessage = `*Demande de Réservation Transport - Sénégal Évasion*\n\n` +
                `👤 *Nom:* ${nom}\n` +
                `📞 *Téléphone / WhatsApp:* ${tel}\n` +
                `🚌 *Transport souhaité:* ${transport}\n` +
                `📍 *Destination:* ${destination}\n` +
                `📅 *Date souhaitée:* ${date}\n` +
                (passagers ? `👥 *Précisions / Passagers:* ${passagers}\n` : '');

            const whatsappUrl = `https://wa.me/221783729251?text=${encodeURIComponent(textMessage)}`;
            window.open(whatsappUrl, '_blank');

            // Show success alert inside the form
            const alertEl = document.getElementById('transportFormAlert');
            if (alertEl) {
                alertEl.classList.remove('d-none');
                alertEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                setTimeout(() => alertEl.classList.add('d-none'), 8000);
            }

            // Show toast
            showToast('Demande envoyée !', `Merci ${nom}, votre demande de transport "${transport}" a bien été transmise via WhatsApp. Notre équipe vous répondra très rapidement.`);

            transportBookingForm.reset();
        });
    }
});

