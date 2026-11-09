const petProducts = [
  {
    id: 1,
    name: 'Culture',
    breed: 'Golden Retriever mix',
    category: 'Dogs',
    price: 2800,
    image: '../images/Culture.webp',
    alt: 'Culture, a friendly Golden Retriever mix waiting for adoption'
  },
  {
    id: 2,
    name: 'Milo',
    breed: 'Tabby kitten',
    category: 'Cats',
    price: 1800,
    image: '../images/Milo.jpg',
    alt: 'Milo, a playful tabby kitten'
  },
  {
    id: 3,
    name: 'Nala',
    breed: 'Siamese cat',
    category: 'Cats',
    price: 2200,
    image: '../images/Whiskers.webp',
    alt: 'Nala, a Siamese cat resting in the shelter'
  },
  {
    id: 4,
    name: 'Buddy',
    breed: 'Mixed-breed puppy',
    category: 'Dogs',
    price: 2600,
    image: '../images/Mixed breed puppy.avif',
    alt: 'Buddy, a happy mixed-breed puppy'
  },
  {
    id: 5,
    name: 'Korra',
    breed: 'Rescue bunny',
    category: 'Small Pets',
    price: 1500,
    image: '../images/Korra.webp',
    alt: 'Korra, a rescue bunny enjoying a warm environment'
  }
];

function filterProducts(products, searchText = '', category = 'all', maxPrice = Number.MAX_SAFE_INTEGER) {
  const normalizedQuery = (searchText || '').trim().toLowerCase();
  const normalizedCategory = category || 'all';

  return products.filter((product) => {
    const matchesSearch = !normalizedQuery ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.breed.toLowerCase().includes(normalizedQuery) ||
      product.category.toLowerCase().includes(normalizedQuery);

    const matchesCategory = normalizedCategory === 'all' || product.category === normalizedCategory;
    const matchesPrice = Number(product.price) <= Number(maxPrice);

    return matchesSearch && matchesCategory && matchesPrice;
  });
}

function validateEnquiryForm(formData) {
  const errors = [];
  const name = String(formData.name || '').trim();
  const email = String(formData.email || '').trim();
  const phone = String(formData.phone || '').trim();
  const product = String(formData.product || '').trim();
  const message = String(formData.message || '').trim();

  if (!name || name.length < 2) {
    errors.push('Please enter your name.');
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please enter a valid email address.');
  }

  if (!phone || !/^[0-9+()\-\s]{7,20}$/.test(phone)) {
    errors.push('Please enter a valid contact number.');
  }

  if (!product) {
    errors.push('Please select the product you are interested in.');
  }

  if (!message || message.length < 10) {
    errors.push('Please enter a message of at least 10 characters.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function validateContactForm(formData) {
  const errors = [];
  const name = String(formData.name || '').trim();
  const email = String(formData.email || '').trim();
  const subject = String(formData.subject || '').trim();
  const message = String(formData.message || '').trim();

  if (!name || name.length < 2) {
    errors.push('Please enter your name.');
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please enter a valid email address.');
  }

  if (!subject || subject.length < 3) {
    errors.push('Please enter a subject.');
  }

  if (!message || message.length < 10) {
    errors.push('Please enter a message of at least 10 characters.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function renderProducts() {
  const grid = document.querySelector('#pet-grid');
  const searchInput = document.querySelector('#pet-search');
  const categorySelect = document.querySelector('#pet-category');
  const priceInput = document.querySelector('#pet-price');
  const priceValue = document.querySelector('#pet-price-value');

  if (!grid || !searchInput || !categorySelect || !priceInput || !priceValue) {
    return;
  }

  function updateProducts() {
    const selectedCategory = categorySelect.value;
    const selectedPrice = Number(priceInput.value || 5000);
    const filteredProducts = filterProducts(petProducts, searchInput.value, selectedCategory, selectedPrice);

    priceValue.textContent = `Max R${selectedPrice}`;

    if (!filteredProducts.length) {
      grid.innerHTML = '<p class="empty-state">No matching pets found. Please adjust your search or price filter.</p>';
      return;
    }

    grid.innerHTML = filteredProducts.map((pet) => `
      <article class="animal-card" data-id="${pet.id}">
        <button class="image-button" type="button" data-image="${pet.image}" data-alt="${pet.alt}">
          <img src="${pet.image}" alt="${pet.alt}">
        </button>
        <div class="animal-details">
          <h3>${pet.name}</h3>
          <p class="pet-breed">${pet.breed}</p>
          <p class="pet-category">${pet.category}</p>
          <p class="pet-price">R${pet.price}</p>
          <button type="button" class="secondary-btn" data-pet-name="${pet.name}">Meet ${pet.name}</button>
        </div>
      </article>
    `).join('');

    const imageButtons = grid.querySelectorAll('.image-button');
    imageButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const lightbox = document.querySelector('#lightbox');
        const lightboxImage = document.querySelector('#lightbox-image');
        const lightboxCaption = document.querySelector('#lightbox-caption');

        if (!lightbox || !lightboxImage || !lightboxCaption) return;

        lightboxImage.src = button.dataset.image;
        lightboxImage.alt = button.dataset.alt;
        lightboxCaption.textContent = button.dataset.alt;
        lightbox.classList.add('visible');
      });
    });

    const meetButtons = grid.querySelectorAll('.secondary-btn');
    meetButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const petName = button.dataset.petName || 'friend';
        const runner = document.querySelector('#animal-runner');
        const label = document.querySelector('#animal-runner-label');

        if (runner && label) {
          label.textContent = `${petName} is on the move!`;
          runner.style.backgroundImage = "url('../images/download.gif')";
          runner.classList.remove('run-animation');
          void runner.offsetWidth;
          runner.classList.add('run-animation');
        }

        setTimeout(() => {
          window.location.href = 'contact.html';
        }, 3000);
      });
    });
  }

  searchInput.addEventListener('input', updateProducts);
  categorySelect.addEventListener('change', updateProducts);
  priceInput.addEventListener('input', updateProducts);
  updateProducts();
}

function setFieldErrorState(form, fieldName, hasError) {
  const field = form.querySelector(`[name="${fieldName}"]`);
  if (!field) return;
  field.classList.toggle('input-error', hasError);
}

function displayFormMessage(form, type, message) {
  const messageBox = form.querySelector('.form-message');
  if (!messageBox) return;
  messageBox.textContent = message;
  messageBox.classList.remove('form-error', 'form-success');
  messageBox.classList.add(type === 'success' ? 'form-success' : 'form-error');
  messageBox.classList.add('visible');
}

function bindFormValidation(form, validator, successMessage) {
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(form).entries());
    const result = validator(formData);

    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach((field) => {
      field.classList.remove('input-error');
    });

    if (!result.isValid) {
      result.errors.forEach((error) => {
        const fieldName = error.toLowerCase().includes('name') ? 'name' :
          error.toLowerCase().includes('email') ? 'email' :
          error.toLowerCase().includes('number') ? 'phone' :
          error.toLowerCase().includes('product') ? 'product' :
          error.toLowerCase().includes('subject') ? 'subject' : 'message';

        setFieldErrorState(form, fieldName, true);
      });

      displayFormMessage(form, 'error', result.errors[0]);
      return;
    }

    displayFormMessage(form, 'success', successMessage);
    form.reset();
  });

  form.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('input', () => {
      field.classList.remove('input-error');
      const messageBox = form.querySelector('.form-message');
      if (messageBox && messageBox.classList.contains('visible')) {
        messageBox.classList.remove('visible');
      }
    });
  });
}

function initForms() {
  const enquiryForm = document.querySelector('#enquiry-form');
  const contactForm = document.querySelector('#contact-form');

  bindFormValidation(enquiryForm, validateEnquiryForm, 'Your enquiry has been submitted successfully. We will contact you soon.');
  bindFormValidation(contactForm, validateContactForm, 'Your message has been sent successfully. Thank you for contacting us.');
}

function initNavigation() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.main-nav');

  if (!menuToggle || !nav) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

function initLightbox() {
  const lightbox = document.querySelector('#lightbox');
  const closeButton = document.querySelector('#lightbox-close');

  if (!lightbox || !closeButton) return;

  closeButton.addEventListener('click', () => lightbox.classList.remove('visible'));
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      lightbox.classList.remove('visible');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      lightbox.classList.remove('visible');
    }
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initLightbox();
    renderProducts();
    initForms();
  });
}

if (typeof module !== 'undefined') {
  module.exports = {
    petProducts,
    filterProducts,
    validateEnquiryForm,
    validateContactForm
  };
}
