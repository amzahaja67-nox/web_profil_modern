    // Initialize Lucide Icons
    document.addEventListener('DOMContentLoaded', () => {
      if (window.lucide) {
        lucide.createIcons();
      }
      updateThemeLabel();
    });

    // =========================================================================
    // THEME TOGGLE
    // =========================================================================
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const mobileThemeToggleBtn = document.getElementById('mobileThemeToggleBtn');
    const drawerThemeToggleBtn = document.getElementById('drawerThemeToggleBtn');
    function toggleTheme() {
      directThemeToggle();
    }
    function directThemeToggle() {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
      updateThemeLabel();
      if (window.lucide) {
        lucide.createIcons();
      }
    }

    function updateThemeLabel() {
      const isDark = document.documentElement.classList.contains('dark');
      const drawerStatus = document.getElementById('drawerThemeStatus');
      if (drawerStatus) {
        drawerStatus.textContent = isDark ? 'Mode Gelap (Aktif)' : 'Mode Terang (Aktif)';
      }

      // Keep one clear icon per theme button: moon means "switch to dark",
      // sun means "switch to light".
      document.querySelectorAll('[data-theme-icon]').forEach((icon) => {
        icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
        icon.classList.toggle('text-ocean-700', !isDark);
        icon.classList.toggle('text-amber-300', isDark);
      });
    }

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
    }
    if (mobileThemeToggleBtn) {
      mobileThemeToggleBtn.addEventListener('click', toggleTheme);
    }
    if (drawerThemeToggleBtn) {
      drawerThemeToggleBtn.addEventListener('click', toggleTheme);
    }

    // =========================================================================
    // MOBILE MENU DRAWER
    // =========================================================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIconOpen = document.getElementById('menuIconOpen');
    const menuIconClose = document.getElementById('menuIconClose');

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.contains('hidden');
        if (isHidden) {
          mobileMenu.classList.remove('hidden');
          menuIconOpen.classList.add('hidden');
          menuIconClose.classList.remove('hidden');
        } else {
          mobileMenu.classList.add('hidden');
          menuIconOpen.classList.remove('hidden');
          menuIconClose.classList.add('hidden');
        }
      });

      // Close menu when clicking navigation link
      document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.add('hidden');
          menuIconOpen.classList.remove('hidden');
          menuIconClose.classList.add('hidden');
        });
      });
    }

    // =========================================================================
    // PREFILL RFQ FROM PRODUCT CARDS
    // =========================================================================
    function prefillRFQ(productName) {
      const selectElement = document.getElementById('productSelect');
      const notesElement = document.getElementById('additionalNotes');
      const rfqSection = document.getElementById('rfq');

      if (selectElement) {
        let matched = false;
        for (let i = 0; i < selectElement.options.length; i++) {
          if (selectElement.options[i].value === productName) {
            selectElement.selectedIndex = i;
            matched = true;
            break;
          }
        }
        if (!matched) {
          selectElement.value = 'Mixed Marine Catch / Other Custom Commodity';
          if (notesElement) {
            notesElement.value = 'Permintaan spesifikasi khusus untuk: ' + productName;
          }
        }
      }

      // Smooth scroll to RFQ Section
      if (rfqSection) {
        rfqSection.scrollIntoView({ behavior: 'smooth' });
        const formContainer = rfqSection.querySelector('form');
        if (formContainer) {
          formContainer.classList.add('ring-2', 'ring-ocean-500');
          setTimeout(() => {
            formContainer.classList.remove('ring-2', 'ring-ocean-500');
          }, 1800);
        }
      }
    }

    // =========================================================================
    // FAQ ACCORDION TOGGLE
    // =========================================================================
    document.querySelectorAll('.faq-toggle').forEach(button => {
      button.addEventListener('click', () => {
        const content = button.nextElementSibling;
        const icon = button.querySelector('.faq-icon');
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        // Close other FAQ items
        document.querySelectorAll('.faq-toggle').forEach(otherBtn => {
          if (otherBtn !== button) {
            otherBtn.setAttribute('aria-expanded', 'false');
            otherBtn.nextElementSibling.classList.add('hidden');
            const otherIcon = otherBtn.querySelector('.faq-icon');
            if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
          }
        });

        // Toggle current FAQ
        if (isExpanded) {
          button.setAttribute('aria-expanded', 'false');
          content.classList.add('hidden');
          if (icon) icon.style.transform = 'rotate(0deg)';
        } else {
          button.setAttribute('aria-expanded', 'true');
          content.classList.remove('hidden');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    });

    // =========================================================================
    // RFQ FORM SUBMISSION HANDLER
    // =========================================================================
    const rfqForm = document.getElementById('rfqForm');
    const rfqModal = document.getElementById('rfqModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalSummary = document.getElementById('modalSummary');
    const modalWhatsAppBtn = document.getElementById('modalWhatsAppBtn');

    if (rfqForm) {
      rfqForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Extract form values
        const buyerName = document.getElementById('buyerName').value.trim();
        const companyName = document.getElementById('companyName').value.trim();
        const destinationCountry = document.getElementById('destinationCountry').value.trim();
        const buyerEmail = document.getElementById('buyerEmail').value.trim();
        const buyerPhone = document.getElementById('buyerPhone').value.trim();
        const productSelect = document.getElementById('productSelect').value;
        const estimatedVolume = document.getElementById('estimatedVolume').value.trim();
        const incotermsSelect = document.getElementById('incotermsSelect').value;
        const additionalNotes = document.getElementById('additionalNotes').value.trim();

        // Render summary inside modal
        if (modalSummary) {
          modalSummary.innerHTML = `
            <div class="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
              <span class="text-slate-600 dark:text-slate-400 font-medium">Nama Buyer:</span>
              <span class="font-bold text-slate-950 dark:text-white">${buyerName} (${companyName})</span>
            </div>
            <div class="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
              <span class="text-slate-600 dark:text-slate-400 font-medium">Destinasi:</span>
              <span class="font-bold text-slate-950 dark:text-white">${destinationCountry}</span>
            </div>
            <div class="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
              <span class="text-slate-600 dark:text-slate-400 font-medium">Produk:</span>
              <span class="font-bold text-ocean-700 dark:text-ocean-400">${productSelect}</span>
            </div>
            <div class="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
              <span class="text-slate-600 dark:text-slate-400 font-medium">Volume:</span>
              <span class="font-bold text-slate-950 dark:text-white">${estimatedVolume}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-600 dark:text-slate-400 font-medium">Ketentuan:</span>
              <span class="font-semibold text-slate-950 dark:text-white">${incotermsSelect}</span>
            </div>
          `;
        }

        // Prepare WhatsApp message
        const waText = encodeURIComponent(
          `*PERMINTAAN PENAWARAN (RFQ) BARU*\n` +
          `----------------------------------\n` +
          `*Nama:* ${buyerName}\n` +
          `*Perusahaan:* ${companyName}\n` +
          `*Negara/Port:* ${destinationCountry}\n` +
          `*Email:* ${buyerEmail}\n` +
          `*Telepon/WA:* ${buyerPhone}\n` +
          `*Produk:* ${productSelect}\n` +
          `*Kuantitas/Volume:* ${estimatedVolume}\n` +
          `*Incoterms:* ${incotermsSelect}\n` +
          (additionalNotes ? `*Catatan Tambahan:* ${additionalNotes}\n` : '') +
          `----------------------------------\n` +
          `Mohon informasi ketersediaan kuota & penawaran harga resmi (Proforma Invoice).`
        );

        if (modalWhatsAppBtn) {
          modalWhatsAppBtn.href = `https://wa.me/6282120219236?text=${waText}`;
        }

        // Show Modal
        if (rfqModal) {
          rfqModal.classList.remove('hidden');
        }

        // Reset Form
        rfqForm.reset();

        // Refresh icons in modal
        if (window.lucide) {
          lucide.createIcons();
        }
      });
    }

    if (closeModalBtn && rfqModal) {
      closeModalBtn.addEventListener('click', () => {
        rfqModal.classList.add('hidden');
      });

      rfqModal.addEventListener('click', (e) => {
        if (e.target === rfqModal) {
          rfqModal.classList.add('hidden');
        }
      });
    }

    // =========================================================================
    // BACK TO TOP SCROLL
    // =========================================================================
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
          backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
          backToTopBtn.classList.add('opacity-100', 'pointer-events-auto');
        } else {
          backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
          backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
        }
      });

      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
