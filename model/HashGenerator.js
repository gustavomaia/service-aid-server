exports.generate = function(valueToHash) {
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256');

  hash.update(valueToHash);
  return hash.digest('hex');
}
