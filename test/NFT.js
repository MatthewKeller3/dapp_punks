const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('NFT', () => {
  const NAME = 'Dapp Punks'
  const SYMBOL = 'DP'
  const COST = ether(10)
  const MAXSUPPLY = 25
  const BASE_URI = 'ipfs://QmQ2jnDYecFhrf3asEWjyjZRX1pZSsNWG3qHzmNDvXa9qg/'
  
  let nft,
    deploer, 
    minter

 beforeEach(async () => {
    let accounts = await ethers.getSigners()
    deployer = accounts [0]
    minter = accounts [1]
  })

  describe('Deployment', () => {
    const ALLOW_MINTING_ON = (Date.now() + 120000).toString().slice(0, 10)
    
    beforeEach(async () => {
      const NFT = await ethers.getContractFactory('NFT')
      nft = await NFT.deploy(NAME, SYMBOL, COST, MAXSUPPLY, ALLOW_MINTING_ON, BASE_URI)
  })
    
    it('has correct name', async () => {
      expect(await nft.name()).to.equal(NAME)
    })

    it('has correct symbol', async () => {
      expect(await nft.symbol()).to.equal(SYMBOL)
    })

    it('returns the cost to mint', async () => {
      expect(await nft.cost()).to.equal(COST)
    })

    it('returns the maximum total supply', async () => {
      expect(await nft.maxSupply()).to.equal(MAXSUPPLY)
    })

    it('returns the allwed minting time', async () => {
      expect(await nft.allowMintingOn()).to.equal(ALLOW_MINTING_ON)
    }) 
      
    it('returns the base URI ', async () => {
      expect(await nft.baseURI()).to.equal(BASE_URI)
    }) 

    it('returns the owner', async () => {
      expect(await nft.owner()).to.equal(deployer.address)
    }) 
 
  })


  describe('Minting', () => {
    let transaction, result

    describe('Success', async () => {
      
      const ALLOW_MINTING_ON = Date.now().toString().slice(0, 10)
    
      beforeEach(async () => {
        const NFT = await ethers.getContractFactory('NFT')
        nft = await NFT.deploy(NAME, SYMBOL, COST, MAXSUPPLY, ALLOW_MINTING_ON, BASE_URI)

        transaction = await nft.connect(minter).mint(1, { value: COST })
        result = await transaction.wait()
      })

      
      it('updates the total supply', async () => {
        expect(await nft.totalSupply()).to.equal(1)

      })

      it('updates the contract ether balance', async () => {
        expect(await ethers.provider.getBalance(nft.address)).to.equal(COST)
 
      })

    })

     describe('Failure', async () => { 
    
      it('rejects insuffecient payment ', async () => {
        const ALLOW_MINTING_ON = Date.now().toString().slice(0, 10)

        const NFT = await ethers.getContractFactory('NFT')
        nft = await NFT.deploy(NAME, SYMBOL, COST, MAXSUPPLY, ALLOW_MINTING_ON, BASE_URI)

        await expect(nft.connect(minter).mint(1, { value: ether(1) })).to.be.reverted
        result = await transaction.wait()
 
    })
  })

})
})

//it('', async () => {
 
    //})