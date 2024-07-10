// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8;

contract Twitter {
    constructor() {}

    event AddTweet(address creater, uint tweetId);
    event DeleteTweet(address remover, uint tweetId);

    struct Tweet {
        uint id;
        address userName;
        string tweetText;
        bool isDeleted;
    }

    Tweet[] private tweets;

    // mapping for tweet id  to that user address

    mapping(uint => address) private tweetToOwner;

    // create method to expose tweet

    function addTweet(string memory tweetText, bool isDeleted) external {
        uint tweetId = tweets.length;
        tweets.push(Tweet(tweetId, msg.sender, tweetText, isDeleted));
        tweetToOwner[tweetId] = msg.sender;

        emit AddTweet(msg.sender, tweetId);
    }

    function deleteTweet(uint tweetId, bool isDeleted) external {
        if (tweetId > tweets.length) {
            revert("Please enter a valid tweetId");
        }
        if (tweetToOwner[tweetId] == msg.sender) {
            tweets[tweetId].isDeleted = isDeleted;

            emit DeleteTweet(msg.sender, tweetId);
        }
    }

    // method to get All tweets

    function getAllTweets() external view returns (Tweet[] memory) {
        Tweet[] memory temporary = new Tweet[](tweets.length);

        uint counter = 0;

        for (uint i = 0; i < tweets.length; i++) {
            if (tweets[i].isDeleted == false) {
                temporary[counter] = tweets[i];
                counter++;
            }
        }

        Tweet[] memory result = new Tweet[](counter);

        for (uint i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }

        return result;
    }

    // method to return only userspecific tweets

    function getMyTweets() external view returns (Tweet[] memory) {
        Tweet[] memory temporary = new Tweet[](tweets.length);
        uint counter = 0;

        for (uint i = 0; i < tweets.length; i++) {
            if (tweets[i].userName == msg.sender && !tweets[i].isDeleted) {
                temporary[counter] = tweets[i];
                counter++;
            }
        }

        Tweet[] memory result = new Tweet[](counter);

        for (uint i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }

        return result;
    }
}
