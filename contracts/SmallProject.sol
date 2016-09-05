import "usingOraclize.sol";

contract SmallProject is usingOraclize {
    address owner;
    address account1;
    address account2;
    uint256 amount;
    string public ETHUSD;

    mapping(address=>Account) public accounts;

    struct Account {
        uint lastUpdate;
        uint256 accBalance;
    }

    function SmallProject() {
        owner = msg.sender;
        oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);
        update();
    }

    function update() {
        oraclize_query("URL", "json(https://api.kraken.com/0/public/Ticker?pair=ETHUSD).result.XETHZUSD.c.0");
        // the line below contains a polling interval, the call below will be executed 60 seconds in the future (now+60 seconds)
        //oraclize_query(60, "URL", "json(https://api.kraken.com/0/public/Ticker?pair=ETHUSD).result.XETHZUSD.c.0");
    }

    function __callback(bytes32 myid, string result, bytes proof) {
        if (msg.sender != oraclize_cbAddress()) throw;
        ETHUSD = result;
        // uncommenting the line below will call the update function again
        //update();
    }

    function Accounts(address _account1, address _account2) {
        account1 = _account1;
        account2 = _account2;
    }

    function SplitAmount(address _account1, address _account2, uint256 _amount) returns (uint256) {
        amount = _amount / 2;

        accounts[_account1].lastUpdate = now;
        accounts[_account1].accBalance += amount;
        accounts[_account2].lastUpdate = now;
        accounts[_account2].accBalance += amount;

        return amount;
    }

    function SendAmount(address _account1, address _account2, uint256 _amount) returns (bool) {
        if (_account1.send(_amount))
            if (_account2.send(_amount))
                return true;
            else throw;
        else throw;
    }

    function GetBalance(address _address) returns (uint256) {
        return _address.balance;
    }

    function GetETHUSD() returns (string) {
        //return accounts[_address].accBalance;
        return ETHUSD;
    }

    function KillContract() {
        if (msg.sender == owner) {
            suicide(owner);
        }
    }
}