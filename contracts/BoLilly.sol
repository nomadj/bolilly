// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BoLilly is ERC721Enumerable, AccessControl, Ownable, ReentrancyGuard {
    using Strings for uint256;

    uint256 private _tokenIdCounter = 1; // start at 1

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    enum TokenType { None, Student, Patron, Ticket }

    struct Student {
        uint256 tokenId;
        string metadataUri;
        uint256 mintedAt;
    }

    struct Patron {
        uint256 tokenId;
        string metadataUri;
        uint256 mintedAt;
    }

    struct Ticket {
        uint256 tokenId;
        string metadataUri;
        uint256 mintedAt;
        uint256 eventId;
        string seat;
    }

    mapping(address => Student[]) private _studentsByOwner;
    mapping(address => Patron[]) private _patronsByOwner;
    mapping(address => Ticket[]) private _ticketsByOwner;

    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => TokenType) private _tokenTypes;

    string private _baseTokenURI;
    uint256 public ticketPrice;

    event StudentMinted(address indexed to, uint256 indexed tokenId, string metadataUri);
    event PatronMinted(address indexed to, uint256 indexed tokenId, string metadataUri);
    event TicketMinted(address indexed to, uint256 indexed tokenId, uint256 indexed eventId, string seat, string metadataUri);

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialTicketPriceWei
    ) ERC721(name_, symbol_) Ownable(msg.sender) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        ticketPrice = initialTicketPriceWei;
    }

    // ----------------------------
    // Minting
    // ----------------------------
    function mintStudent(string calldata metadataUri) external nonReentrant returns (uint256) {
	if (bytes(_baseTokenURI).length == 0) {
	    _baseTokenURI = metadataUri; // set base URI only on first mint
	}
        uint256 tokenId = _mintTo(msg.sender, TokenType.Student, metadataUri);
        _studentsByOwner[msg.sender].push(Student({ tokenId: tokenId, metadataUri: metadataUri, mintedAt: block.timestamp }));
        emit StudentMinted(msg.sender, tokenId, metadataUri);
        return tokenId;
    }

    function mintPatron(address to, string calldata metadataUri) external onlyRole(MINTER_ROLE) returns (uint256) {
	if (bytes(_baseTokenURI).length == 0) {
	    _baseTokenURI = metadataUri; // set base URI only on first mint
	}
        uint256 tokenId = _mintTo(to, TokenType.Patron, metadataUri);
        _patronsByOwner[to].push(Patron({ tokenId: tokenId, metadataUri: metadataUri, mintedAt: block.timestamp }));
        emit PatronMinted(to, tokenId, metadataUri);
        return tokenId;
    }

    function mintTicket(string calldata metadataUri, uint256 eventId, string calldata seat) external payable nonReentrant returns (uint256) {
        require(msg.value >= ticketPrice, "Insufficient payment for ticket");

	if (bytes(_baseTokenURI).length == 0) {
	    _baseTokenURI = metadataUri; // set base URI only on first mint
	}

        uint256 tokenId = _mintTo(msg.sender, TokenType.Ticket, metadataUri);
        _ticketsByOwner[msg.sender].push(Ticket({ tokenId: tokenId, metadataUri: metadataUri, mintedAt: block.timestamp, eventId: eventId, seat: seat }));

        if (msg.value > ticketPrice) {
            payable(msg.sender).transfer(msg.value - ticketPrice);
        }

        emit TicketMinted(msg.sender, tokenId, eventId, seat, metadataUri);
        return tokenId;
    }

    function _mintTo(address to, TokenType tType, string calldata metadataUri) internal returns (uint256) {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        _tokenTypes[tokenId] = tType;
        _tokenURIs[tokenId] = metadataUri;
        return tokenId;
    }

    // ----------------------------
    // tokenURI / baseURI
    // ----------------------------
    function setBaseURI(string calldata newBase) external onlyOwner {
        _baseTokenURI = newBase;
    }

    function setTokenURI(uint256 tokenId, string calldata newUri) external onlyRole(MINTER_ROLE) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        _tokenURIs[tokenId] = newUri;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "ERC721Metadata: URI query for nonexistent token");
        string memory uri = _tokenURIs[tokenId];
        if (bytes(uri).length > 0) {
            return uri;
        }
        return string(abi.encodePacked(_baseTokenURI, tokenId.toString()));
    }

    // ----------------------------
    // Views
    // ----------------------------
    function studentsOfOwner(address owner) external view returns (Student[] memory) {
        return _studentsByOwner[owner];
    }

    function patronsOfOwner(address owner) external view returns (Patron[] memory) {
        return _patronsByOwner[owner];
    }

    function ticketsOfOwner(address owner) external view returns (Ticket[] memory) {
        return _ticketsByOwner[owner];
    }

    // ----------------------------
    // Admin / utility
    // ----------------------------
    function setTicketPrice(uint256 newPriceWei) external onlyOwner {
        ticketPrice = newPriceWei;
    }

    function withdraw(address payable to) external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds");
        to.transfer(balance);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721Enumerable, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
