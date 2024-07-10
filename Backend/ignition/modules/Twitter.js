const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TwitterModule", (m) => {
  const twitter = m.contract("Twitter");

  return { twitter };
});
