
$ = (id) => { return document.getElementById(id); }

window.onload = async() => {
  await reload();
  swiper();
}

try {
  window.ethereum.on('accountsChanged', async(accounts) => {
    await walletChanged()
  });
  window.ethereum.on('networkChanged', async(networkId) => {
    await walletChanged()
  });
} catch (e) {
  console.log(e)
}

walletChanged = async () => {
  await reload();
};

reload = async () => {
  let connected = localStorage.getItem('connected');
  if (connected) {
    let { web3, account, networkId } = await getWeb3();
    const networkName = getEnv("network")
    if (networkName != "") {
      $('account-network').innerHTML = networkName;
      $('account-address').innerHTML = account.slice(0,6) + '...' + account.slice(-4);
    } else {
      $('account-network').innerHTML = 'Unsupported Network';
      $('account-address').innerHTML = '';
    }
    $('wallet-connect').style.display = 'none';
    $('wallet-account').style.display = 'block';
    getMinint();
  } else {
    $('wallet-connect').style.display = 'block';
    $('wallet-account').style.display = 'none';
  }
}

getWeb3 = async () => {
  try {
    let currentProvider = null;
    if (window.ethereum) {
      await window.ethereum.enable();
      currentProvider = window.ethereum;
    } else if (window.web3) {
      currentProvider = window.web3.currentProvider;
    } else {
      alert('No Metamask (or other Web3 Provider) installed');
    }
    if (currentProvider) {
      const web3 = new Web3(currentProvider);
      const networkId = await web3.eth.net.getId(); // const networkType = await web3.eth.net.getNetworkType();
      const accounts = (await web3.eth.getAccounts()) || web3.eth.accounts;
      const account = accounts[0];
      localStorage.setItem('connected', true);
      localStorage.setItem('account', account);
      localStorage.setItem('network_id', networkId);
      return {web3, account, networkId}
    }
  } catch (err) {
    console.log(err);
  }
};

connectWallet = async() => {
  try {
    let { web3, account, networkId } = await getWeb3();
    await reload();
  } catch (err) {
    console.log(err);
  }
}

mintToken = async () => {
  try {
    let { web3, account, networkId } = await getWeb3();
    const nftContractABI = getNFTContractABI()
    let nftContractAddress = getEnv('nft_address')
    const contract = new web3.eth.Contract(nftContractABI, nftContractAddress)
    const value = String(web3.utils.toWei('1', 'ether'));
    const estimateGas = await contract.methods.mint(1).estimateGas({from: account, value: value});
    contract.methods.mint(1).send(
      {
        from: account,
        value: value,
        gas: estimateGas,
      }, (err, txHash) => {
        if (err) {
          console.log(err);
          return
        }
        $('etherscan').innerHTML = '<a href="'+ getEnv("etherscan") + '/tx/' + txHash + '" target="_blank" style="font-size: large">Etherscan</a>';
      })
  } catch (err) {
    console.log(err);
  }
}

getMinint = async () => {
  try {
    let { web3, account, networkId } = await getWeb3();
    const nftContractABI = getNFTContractABI()
    let nftContractAddress = getEnv('nft_address')
    const contract = new web3.eth.Contract(nftContractABI, nftContractAddress)
    const getCurrentTokenId = await contract.methods.getCurrentTokenId().call();
    document.getElementById('current-token-id').innerHTML = getCurrentTokenId;
  } catch (err) {
    console.log(err);
  }
}

getNFTContractABI = () => {
  const nftContractABI = '[{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getMintDisabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"bool","name":"_mintDisabled","type":"bool"}],"name":"setMintDisabled","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getMintFeeReceiveAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address payable","name":"_mintFeeReceiveAddress","type":"address"}],"name":"setMintFeeReceiveAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_mintType","type":"uint256"},{"internalType":"uint256","name":"_mintFee","type":"uint256"}],"name":"setMintFees","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_mintType","type":"uint256"}],"name":"getMintFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_mintType","type":"uint256"},{"internalType":"uint256","name":"_mintMax","type":"uint256"}],"name":"setMintMaxs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_mintType","type":"uint256"}],"name":"getMintMaxs","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_mintType","type":"uint256"},{"internalType":"string","name":"_mintHash","type":"string"}],"name":"setMintHash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_mintType","type":"uint256"}],"name":"getMintHash","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCurrentTokenId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"mintType","type":"uint256"}],"name":"mint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"}]'
  return JSON.parse(nftContractABI)
}

getEnv = (key) => {
  const networkId = localStorage.getItem("network_id")
  if (!["1", "4"].includes(String(networkId))) {
    return ""
  }
  return env[key][String(networkId)]
}

const env = {
  "nft_address": {
    "1": "",
    "4": "0x0B3a5E920516b3Fe9d2021DC9E7cbd827986A584"
  },
  "etherscan": {
    "1": "https://etherscan.io",
    "4": "https://rinkeby.etherscan.io"
  },
  "network": {
    "1": "Mainnet",
    "4": "Rinkeby"
  }
}

swiper = () => {
  const swiper = new Swiper('.swiper', {
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    centeredSlides: true,
  });
}
