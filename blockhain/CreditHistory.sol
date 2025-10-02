// File: blockchain/contracts/CreditHistory.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CreditHistory {
    struct Loan { address issuingBank; uint256 loanAmount; string loanType; uint256 dateIssued; string status; }
    mapping(bytes32 => Loan[]) public userLoans;
    event LoanAdded(bytes32 indexed userId, uint256 loanAmount, string status);

    function addLoan(bytes32 _userId, uint256 _loanAmount, string memory _loanType, string memory _status) public {
        userLoans[_userId].push(Loan({ issuingBank: msg.sender, loanAmount: _loanAmount, loanType: _loanType, dateIssued: block.timestamp, status: _status }));
        emit LoanAdded(_userId, _loanAmount, _status);
    }

    function getLoans(bytes32 _userId) public view returns (Loan[] memory) { return userLoans[_userId]; }
}