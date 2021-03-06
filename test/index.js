const test = require('tape');
const fpe = require('../lib');

test('missing password', t => {
  t.plan(1);
  t.throws(() => fpe());
});

test('encrypt-decrypt', t => {
  t.plan(1);
  const cipher = fpe({ password: 'secret' });
  t.equal(cipher.decrypt(cipher.encrypt('12345')), '12345');
});

test('different passwords', t => {
  t.plan(1);
  const cipher1 = fpe({ password: 'secret' });
  const cipher2 = fpe({ password: 'other secret' });
  t.notEqual(cipher1.encrypt('12345'), cipher2.encrypt('12345'));
});

test('ascii domain', t => {
  var ascii = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'.split(
    ''
  );
  t.plan(1);
  const cipher = fpe({ password: 'secret', domain: ascii });
  console.log(cipher.encrypt('ABBA'));
  t.equal(cipher.decrypt(cipher.encrypt('ABBA')), 'ABBA');
});

test('different domain', t => {
  t.plan(1);
  const cipher = fpe({ password: 'secret', domain: ['A', 'B', 'C', 'D', 'E'] });
  t.equal(cipher.decrypt(cipher.encrypt('ABBA')), 'ABBA');
});

test('characters not in domain', t => {
  t.plan(2);
  const cipher = fpe({ password: 'secret', domain: ['A', 'B', 'C', 'D', 'E'] });
  t.throws(() => cipher.encrypt('ABF'));
  t.throws(() => cipher.decrypt('ABF'));
});

test('different algorithm', t => {
  t.plan(1);
  const cipher = fpe({ password: 'secret', algorithm: 'aes192' });
  t.equal(cipher.decrypt(cipher.encrypt('12345')), '12345');
});

test('input not a string', t => {
  t.plan(2);
  const cipher = fpe({ password: 'secret' });
  t.throws(() => cipher.encrypt(123));
  t.throws(() => cipher.decrypt(123));
});
