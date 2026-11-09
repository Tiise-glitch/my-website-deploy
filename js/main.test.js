const test = require('node:test');
const assert = require('node:assert/strict');

const { petProducts, filterProducts, validateEnquiryForm, validateContactForm } = require('./main.js');

test('search finds pet by name and category', () => {
  const results = filterProducts(petProducts, 'Culture', 'all', Number.MAX_SAFE_INTEGER);
  assert.equal(results.length, 1);
  assert.equal(results[0].name, 'Culture');
});

test('filters match selected category and price cap', () => {
  const results = filterProducts(petProducts, '', 'Dogs', 3000);
  assert.ok(results.length > 0);
  results.forEach((pet) => {
    assert.equal(pet.category, 'Dogs');
    assert.ok(pet.price <= 3000);
  });
});

test('enquiry form validation requires valid fields', () => {
  const valid = validateEnquiryForm({
    name: 'Asha Smith',
    email: 'asha@example.com',
    phone: '0712345678',
    product: 'adoption',
    message: 'I would like to adopt a dog.'
  });

  assert.equal(valid.isValid, true);
  assert.equal(valid.errors.length, 0);

  const invalid = validateEnquiryForm({
    name: '',
    email: 'bad-email',
    phone: 'abc',
    product: '',
    message: ''
  });

  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.length >= 4);
});

test('contact form validation requires valid fields', () => {
  const valid = validateContactForm({
    name: 'Liam Brown',
    email: 'liam@example.com',
    subject: 'General question',
    message: 'Can you share your adoption process?'
  });

  assert.equal(valid.isValid, true);
  assert.equal(valid.errors.length, 0);

  const invalid = validateContactForm({
    name: '',
    email: 'notanemail',
    subject: '',
    message: ''
  });

  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.length >= 3);
});
