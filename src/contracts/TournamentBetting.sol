// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TournamentBetting {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    struct Tournament {
        string name;
        string[] competitors;
        bool isOpen;
        uint winnerIndex;
        mapping(uint => uint) totalBetsPerCompetitor;
        mapping(address => Bet) bets;
    }

    struct Bet {
        bool hasBet;
        uint competitorIndex;
        uint amount;
        bool claimed;
    }

    uint public tournamentCount;
    mapping(uint => Tournament) public tournaments;

    event TournamentCreated(uint indexed tournamentId, string name);
    event BetPlaced(uint indexed tournamentId, address indexed user, uint competitorIndex, uint amount);
    event TournamentClosed(uint indexed tournamentId, uint winnerIndex);
    event RewardClaimed(uint indexed tournamentId, address indexed user, uint amount);

    function createTournament(string memory _name, string[] memory _competitors) public onlyOwner {
        Tournament storage t = tournaments[tournamentCount];
        t.name = _name;
        t.competitors = _competitors;
        t.isOpen = true;

        emit TournamentCreated(tournamentCount, _name);
        tournamentCount++;
    }

    function placeBet(uint _tournamentId, uint _competitorIndex) external payable {
        Tournament storage t = tournaments[_tournamentId];
        require(t.isOpen, "Tournament closed");
        require(msg.value > 0, "No ETH sent");
        require(!t.bets[msg.sender].hasBet, "Already bet");
        require(_competitorIndex < t.competitors.length, "Invalid competitor");

        t.totalBetsPerCompetitor[_competitorIndex] += msg.value;
        t.bets[msg.sender] = Bet(true, _competitorIndex, msg.value, false);

        emit BetPlaced(_tournamentId, msg.sender, _competitorIndex, msg.value);
    }

    function closeTournament(uint _tournamentId, uint _winnerIndex) public onlyOwner {
        Tournament storage t = tournaments[_tournamentId];
        require(t.isOpen, "Already closed");
        require(_winnerIndex < t.competitors.length, "Invalid winner");

        t.isOpen = false;
        t.winnerIndex = _winnerIndex;

        emit TournamentClosed(_tournamentId, _winnerIndex);
    }

    function claimReward(uint _tournamentId) public {
        Tournament storage t = tournaments[_tournamentId];
        Bet storage b = t.bets[msg.sender];

        require(!t.isOpen, "Tournament still open");
        require(b.hasBet, "No bet found");
        require(!b.claimed, "Already claimed");

        if (b.competitorIndex != t.winnerIndex) {
            b.claimed = true;
            return;
        }

        uint totalWinningBets = t.totalBetsPerCompetitor[t.winnerIndex];
        uint totalPool = 0;
        for (uint i = 0; i < t.competitors.length; i++) {
            totalPool += t.totalBetsPerCompetitor[i];
        }

        uint reward = (b.amount * totalPool) / totalWinningBets;
        b.claimed = true;
        payable(msg.sender).transfer(reward);

        emit RewardClaimed(_tournamentId, msg.sender, reward);
    }

    
    function getUserBet(uint _tournamentId, address _user)
        public
        view
        returns (bool hasBet, uint competitorIndex, uint amount, bool claimed)
    {
        Bet memory b = tournaments[_tournamentId].bets[_user];
        return (b.hasBet, b.competitorIndex, b.amount, b.claimed);
    }
}
