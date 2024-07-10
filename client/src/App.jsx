import Logo from "./assets/logo.png";
import Logo1 from "./assets/Xlogo.png";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Twitter from "./utils/Twitter.json";
function App() {
  const TwitterContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const [connectedWallet, setConnectedWallet] = useState("");
  const [tweetMessage, setTweetMessage] = useState("");
  const [tweets, setTweets] = useState([]);
  const [myTweets, setMyTweets] = useState([]);

  const addTweet = async () => {
    let tweet = {
      tweetText: tweetMessage,
      isDeleted: false,
    };

    console.log(tweet);

    try {
      const { ethereum } = window;

      if (ethereum) {
        // const provider = new ethers.providers.Web3Provider(ethereum);
        const provider = new ethers.providers.JsonRpcProvider(
          "http://127.0.0.1:8545/"
        );

        const signer = provider.getSigner(connectedWallet);
        const TwitterContract = new ethers.Contract(
          TwitterContractAddress,
          Twitter.abi,
          signer
        );

        console.log(TwitterContract);

        let twitterTx = await TwitterContract.addTweet(
          tweet.tweetText,
          tweet.isDeleted
        );
        await twitterTx.wait();
        console.log("Transaction successful", twitterTx);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("Error submitting new Tweet", error);
    }
  };

  const getAllTweet = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        // const provider = new ethers.providers.Web3Provider(ethereum);
        const provider = new ethers.providers.JsonRpcProvider(
          "http://127.0.0.1:8545/"
        );

        const signer = provider.getSigner();
        const TwitterContract = new ethers.Contract(
          TwitterContractAddress,
          Twitter.abi,
          signer
        );

        console.log(TwitterContract);

        let twitterTx = await TwitterContract.getAllTweets();
        // await twitterTx.wait();

        console.log("Transaction successful", twitterTx);

        const fetchedTweets = twitterTx.map((tweet) => ({
          id: tweet.id.toString(),
          text: tweet.tweetText.toString(),
          userName: tweet.userName.toString(),
        }));

        setTweets(fetchedTweets);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("Error submitting new Tweet", error);
    }
  };

  const getMyTweet = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        // const provider = new ethers.providers.Web3Provider(ethereum);
        const provider = new ethers.providers.JsonRpcProvider(
          "http://127.0.0.1:8545/"
        );

        const signer = provider.getSigner(connectedWallet);
        const TwitterContract = new ethers.Contract(
          TwitterContractAddress,
          Twitter.abi,
          signer
        );

        console.log(TwitterContract);

        let twitterTx = await TwitterContract.getMyTweets();
        // await twitterTx.wait();

        console.log("Transaction successful", twitterTx);

        const fetchedTweets = twitterTx.map((tweet) => ({
          id: tweet.id.toString(),
          text: tweet.tweetText.toString(),
          userName: tweet.userName.toString(),
        }));

        setMyTweets(fetchedTweets);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("Error submitting new Tweet", error);
    }
  };

  const connectWallet = async () => {
    console.log("clicked me ");
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Metamask not detected");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setConnectedWallet(accounts[0]);

      console.log("Found account", accounts[0]);
      // setCurrentAccount(accounts[0]);
    } catch (error) {
      if (error.code === 4001) {
        // User rejected the connection request
        console.log("User rejected the connection request");
        // Optionally, provide feedback to the user
      } else {
        console.error("Error connecting to Metamask", error);
        // Handle other errors
      }
    }
  };

  const sendTweet = (e) => {
    e.preventDefault();

    addTweet();

    setTweetMessage("");
  };

  const deleteTweet = async (tweetId) => {
    setMyTweets((prevTweets) =>
      prevTweets.filter((tweet) => tweet.id !== tweetId)
    );

    try {
      const { ethereum } = window;

      if (ethereum) {
        // const provider = new ethers.providers.Web3Provider(ethereum);
        const provider = new ethers.providers.JsonRpcProvider(
          "http://127.0.0.1:8545/"
        );

        const signer = provider.getSigner();
        const TwitterContract = new ethers.Contract(
          TwitterContractAddress,
          Twitter.abi,
          signer
        );

        console.log(TwitterContract);

        let twitterTx = await TwitterContract.deleteTweet(tweetId, true);
        // await twitterTx.wait();

        console.log("Transaction successful", twitterTx);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("Error submitting new Tweet", error);
    }
  };

  useEffect(() => {
    getAllTweet();
  }, []);

  return (
    <>
      <div className="bg-black  max-h-screen w-full p-0 m-0 text-white font-sans flex flex-col ">
        <nav className="h-24 w-full bg-gray-100 flex  justify-between  items-center p-4  px-10 ">
          <img
            src={Logo1}
            className="h-4 w-4 md:h-24 md:w-24 lg:h-24 lg:w-24 object-contain rounded-xl"
          ></img>
          <div className="border-2 border-solid  border-red-300 h-full  w-1/2 flex items-center justify-between bg-gray-300">
            <input
              onChange={(e) => setTweetMessage(e.target.value)}
              value={tweetMessage}
              type="text"
              className="bg-gray-100 w-3/4 outline-none text-black p-2 m-3 rounded-md "
              placeholder="What`s happening ?"
            ></input>
            <button
              type="submit"
              className="bg-black w-1/5 mx-1 py-2 rounded-lg hover:scale-95"
              onClick={sendTweet}
            >
              Post
            </button>
          </div>
          <ul className="flex justify-between items-center  text-black ">
            <button
              className="bg-[#047aed] px-4 py-2  rounded-md hover:scale-105 text-white"
              onClick={connectWallet}
            >
              {connectedWallet == ""
                ? "ConnectWallet"
                : connectedWallet.substring(0, 5)}
            </button>
            <button
              className="bg-black px-3 py-2 rounded-md m-2 text-white hover:scale-105"
              onClick={getMyTweet}
            >
              MyPosts
            </button>

            <button
              className="bg-black px-3 py-2 rounded-md m-2 text-white hover:scale-105"
              onClick={getAllTweet}
            >
              Posts
            </button>
          </ul>
        </nav>
        <div className="h-screen w-full bg-[#EDE8F5]">
          <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Tweets</h2>
            <ul className="grid grid-cols-1 gap-4">
              {tweets.map((tweet) => (
                <li key={tweet.id} className="p-4 bg-white shadow rounded-lg">
                  <div className="text-sm text-gray-500 mb-2">
                    @{tweet.userName}
                  </div>
                  <div className="text-lg text-black font-extralight">
                    {tweet.text}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="h-screen w-full bg-[#EDE8F5]">
          <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-white">MyTweets</h2>
            <ul className="grid grid-cols-1 gap-4">
              {myTweets.map((tweet) => (
                <li key={tweet.id} className="p-4 bg-white shadow rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500 mb-2">
                      @{tweet.userName}
                    </div>
                    <button
                      className="bg-slate-200 px-2 py-2 text-red-500 hover:text-red-700 hover:scale-105 rounded-md"
                      onClick={() => deleteTweet(tweet.id)}
                    >
                      Delete
                    </button>
                  </div>
                  <div className="text-lg text-black font-extralight">
                    {tweet.text}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
