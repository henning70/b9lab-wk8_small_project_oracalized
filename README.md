# B9lab Week3 Small Project

This project was built using truffle. The frontend is based on the default MetaCoin frontend created when running "truffle init".

###### Frontend:
* Balance of contract
* Balance of account one
* Balance of account two
* Input field of amount to send to contract
* Input field for account one receiver
* Input field for account two receiver
* Get balances button
* Send funds to contract button
 
###### Working:
* Enter an amount
* Enter the from account
* Enter account recipient one and two account's
* First hit the "Get balances" button
* Now hit the "Send funds to contract" button

Once the "Send funds to contract" button has been pressed, the entered amount will be sent to the contract. The DAPP will wait for the transaction receipt. Once a transaction receipt has been received, the balances will be updated automatically. You should see the contract balance increase from zero to the entered transaction amount. The contract will then be instructed to split the amount 50/50 and send it to account one and account two. Again the balances will be updated and the contract balance should be zero again.

The project could still use a lot of improvement, but does fulfill the requirements as outlined for week 3's Small Project.

**Update:**

Replaced own implementation of transaction receipt checking with solution provided in week 5's extending web3.

*My solution:*
```
// line 124
checkReceiptInterval = setInterval(function() { getTransactionReceipt(txn) }, 5000);

// lines 132-144
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
```

*Week 5:*
```
// line 121
web3.eth.getTransactionReceiptMined(txn, 500);

// lines 28-55
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
```


