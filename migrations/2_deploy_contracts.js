module.exports = function(deployer) {
  deployer.autolink();
  deployer.deploy(usingOraclize);
  deployer.deploy(SmallProject);
};
