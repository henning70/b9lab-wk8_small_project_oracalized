// rpc host info
var rpc_url = "http://localhost:8546";

// rpc calls to stop/start the miner
var miner_stop = '{"jsonrpc": "2.0", "method": "miner_stop", "params":[], "id": "1"}';
var miner_start = '{"jsonrpc": "2.0", "method": "miner_start", "params":[], "id": "1"}';

var this_contract;
var contract_addr;
var from_account;
var send_amount;
var contract_balance;
var acc_a_balance;
var acc_b_balance;
var sender;
var to_acc_a;
var to_acc_b;
var checkReceiptInterval;


if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider(rpc_url));
}

// week 5: extend web3
web3.eth.getTransactionReceiptMined = function (txn, interval) {
    console.log("getTransactionReceiptMined");
    var transactionReceiptAsync;
    interval |= 500;
    transactionReceiptAsync = function(txn, resolve, reject) {
      try {
        var receipt = web3.eth.getTransactionReceipt(txn);
        if (receipt == null) {
            setTimeout(function () {
              transactionReceiptAsync(txn, resolve, reject);
            }, interval);
        } else {
          console.log("Transaction receipt confirmed, sending funds to target accounts...");
          setBalances();
          document.getElementById("status").innerHTML = "Transaction receipt confirmed, sending funds to target accounts...";
          resolve(receipt);
        }
      } catch(e) {
          reject(e);
      }
    };

    return new Promise(function (resolve, reject) {
      transactionReceiptAsync(txn, resolve, reject);
      sendSplitAmount();
    });
};

// get the deployed contract
var this_contract = SmallProject.deployed();
var contract_addr = this_contract.address;
console.log("SmallProject contract info:");
console.log(this_contract);
console.log(contract_addr);

function setValues() {
  //document.getElementById("coinbase").value = web3.eth.coinbase;
  //document.getElementById("is_mining").value = (web3.eth.mining).toString();
  //document.getElementById("contract_balance").innerHTML = web3.eth.getBalance(contract_addr);
  //document.getElementById("to_acc_a_balance").innerHTML = web3.eth.getBalance(to_acc_a);
  //document.getElementById("to_acc_b_balance").innerHTML = web3.eth.getBalance(to_acc_b);
  /*var this_contract = SmallProject.deployed();
  var contract_addr = this_contract.address;

  this_contract.GetBalance.call(contract_addr).then(function(value) {
    console.log("Contract balance: " + value.valueOf());
  });
  
  this_contract.GetBalance.call(to_acc_a, {from: from_account}).then(function(value) {
    console.log("Balance account A: " + value.valueOf());
  });
  
  this_contract.GetBalance.call(to_acc_b, {from: from_account}).then(function(value) {
    console.log("Balance account B: " + value.valueOf());
  });*/
}

function setBalances() {
  from_account = document.getElementById("sender").value;
  to_acc_a = document.getElementById("to_acc_a").value;
  to_acc_b = document.getElementById("to_acc_b").value;

  if ((from_account != "") && (to_acc_a != "") && (to_acc_b != "")) {

    this_contract.GetBalance.call(contract_addr, {from: from_account}).then(function(value) {
      console.log("Contract balance: " + value.valueOf());
      document.getElementById("contract_balance").innerHTML = value.valueOf();
    });

    this_contract.GetBalance.call(to_acc_a, {from: from_account}).then(function(value) {
      console.log("Balance account A: " + value.valueOf());
      document.getElementById("acc_a_balance").innerHTML = value.valueOf();
    });
    
    this_contract.GetBalance.call(to_acc_b, {from: from_account}).then(function(value) {
      console.log("Balance account B: " + value.valueOf());
      document.getElementById("acc_b_balance").innerHTML = value.valueOf();
    });
  
  }
}

// send funds to the contract
function sendAmountToContract() {
  send_amount = document.getElementById("send_amount").value;

  if (send_amount != "") {
    var txn = web3.eth.sendTransaction({ from: web3.eth.coinbase, to: contract_addr, value: send_amount });
    console.log("sendAmountToContract txn: " + txn);
    document.getElementById("status").innerHTML = "Waiting for transaction receipt...";

    // week 5: extend web3 - see line 28-55 for function defenition
    web3.eth.getTransactionReceiptMined(txn, 500);

    // week 3: my own implementation to check transaction receipt - disabled and replaced with solution from week 5
    //checkReceiptInterval = setInterval(function() { getTransactionReceipt(txn) }, 5000);
  }
  else {
    alert("You need to enter an amount to send in the ");
  }
}

// week 3: my own implementation to check transaction receipt
function getTransactionReceipt(txn) {
  if (web3.eth.getTransactionReceipt(txn) == null) {
    console.log("Waiting for transaction receipt...");
    document.getElementById("status").innerHTML = "Waiting for transaction receipt...";
  }
  else {
    console.log("Transaction receipt confirmed, sending funds to target accounts...");
    setBalances();
    document.getElementById("status").innerHTML = "Transaction receipt confirmed, sending funds to target accounts...";
    clearInterval(checkReceiptInterval);
    sendSplitAmount();
  }
}

// split the funds sent to the contract and send the split amount to the two accounts
function sendSplitAmount() {
  send_amount = document.getElementById("send_amount").value;

  this_contract.SplitAmount.call(to_acc_a, to_acc_b, send_amount, {from: from_account}).then(function(value) {
    console.log(value.valueOf());
    console.log("Split amount transaction complete!");
    var amount = value.valueOf();
    this_contract.SendAmount(to_acc_a, to_acc_b, amount, {from: from_account, gas: 3000000}).then(function() {
      console.log("Send amount transaction complete!");
      document.getElementById("status").innerHTML = "Split and send transaction complete!";
      setBalances();
    }).catch(function(e) {
      console.log(e);
      setStatus("Error sending amount; see log.");
    });
  }).catch(function(e) {
    console.log(e);
    setStatus("Error sending coin; see log.");
  });
}

function getBalance() {
  //var this_contract = SmallProject.deployed();

  var from_account = document.getElementById("sender").value;
  var to_acc_a = document.getElementById("to_acc_a").value;

  this_contract.GetBalance.call(to_acc_a, {from: from_account}).then(function(value) {
    console.log("Balance: " + value.valueOf());
  });
}

// function for getTran
function getTran() {
    var transid = document.getElementById('transid').value;
    var txn = web3.eth.getTransaction(document.getElementById('transid').value);
    console.log("getTran result for " + transid + ": " + JSON.stringify(txn));
    console.log("Contract balance: " + web3.eth.getBalance(faucetAddress));
    console.log("Faucet balance: " + contract.getBalance.call());
    console.log("Coinbase balance: " + web3.eth.getBalance(web3.eth.coinbase));
    console.log("Acc2 balance: " + web3.eth.getBalance(web3.eth.accounts[1]));
}

function getETHUSD() {
  this_contract.GetETHUSD.call().then(function(value) {
    console.log("ETHUSD: " + value.valueOf());
  });
}

function startMine() {
  $.ajax({
          type: 'POST',
          url: rpc_url,
          data: miner_start, 
          success: setTimeout(startMineLog, 2000),
          dataType: 'json',
          contentType: 'application/json',
          async: false
  });
  //console.log("Mining status: " + web3.eth.mining);
}

function stopMine() {
  $.ajax({
          type: 'POST',
          url: rpc_url,
          data: miner_stop, 
          success: setTimeout(stopMineLog, 2000),
          dataType: 'json',
          contentType: 'application/json',
          async: false
  });
  //console.log("Mining status: " + web3.eth.mining);
}

function stopMineLog() {
  console.log("Stop mining: " + web3.eth.mining);
  document.getElementById('is_mining').value = (web3.eth.mining).toString();
}

function startMineLog() {
  console.log("Start mining: " + web3.eth.mining);
  document.getElementById('is_mining').value = (web3.eth.mining).toString();
}

function clearTranId() {
    document.getElementById('transid').value = "";
}