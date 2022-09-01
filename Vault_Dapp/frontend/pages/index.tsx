import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Navbar from '../components/Navbar';
import { BigNumber, Contract, utils } from 'ethers';
import { GOLD_TOKEN_CONTRACT_ADDRESS, GOLD_TOKEN_CONTRACT_ABI,
         VAULT_CONTRACT_ADDRESS, VAULT_CONTRACT_ABI } from '../Constants';
import { useProvider, useSigner, useContract } from 'wagmi';

const Home: NextPage = () => {

  // const zero: number = BigNumber.from(0);

  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [isDeposited, setIsDeposited] = useState<boolean>(false);
  const [isWithdrawn, setIsWithdrawn] = useState<boolean>(false);
  const [tokensToApprove, setTokensToApprove] = useState<number>(0);
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [approvedTokensAmount, setApprovedTokensAmount] = useState<number>(0);
  const [depositedTokensAmount, setDepositedTokensAmount] = useState<number>(0);
  const [inputValue, setInputValue] = useState<number>(0);

  function toggleDarkMode(): void {
    setDarkMode(!darkMode);
  }

  const provider: any = useProvider();
  const {data: signer} = useSigner();
  const tokenContract: Contract = useContract({
    addressOrName: GOLD_TOKEN_CONTRACT_ADDRESS,
    contractInterface: GOLD_TOKEN_CONTRACT_ABI,
    signerOrProvider: signer || provider
  });

  const vaultContract: Contract = useContract({
    addressOrName: VAULT_CONTRACT_ADDRESS,
    contractInterface: VAULT_CONTRACT_ABI,
    signerOrProvider: signer || provider
  });

  const getTotalSupply = async ():Promise <void> => {
    try {
      const total: number = await tokenContract.totalSupply();
      setTotalSupply(total);
    } catch (err: any) {
      alert(err.reason)
      console.error(err)
    }
  }

  const approveTokensToVault = async (spender: string, amount: number): Promise<void> => {
    try {
      const tx: any = await tokenContract.approve(spender, amount);
      setLoading(true);
      await tx.wait();
      setLoading(false);
      setIsApproved(true);
      checkApproval(amount)
    }
    catch (err: any) {
      alert(err.reason)
      console.error(err)
    }
  }

  const checkApproval = async (_amount: number): Promise<void> => {
    try {
      const approved: number = await tokenContract.checkApproval(_amount);
      setApprovedTokensAmount(+approved);
      if(approvedTokensAmount > 0) {
        setIsApproved(true)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const checkIfApproved = () => {
    try {
      if(approvedTokensAmount > 0) {
        setIsApproved(true);
      }
    } catch (err) {
      console.error(err)
      console.error("Executed")
    }
  }

  const depositTokens = async (_amount: number): Promise<void> => {
    try{
      const tx = await vaultContract.deposit(_amount);
      setLoading(true);
      await tx.wait();
      setLoading(false)
      setIsDeposited(true);
    }
    catch(err: any) {
      alert(err.reason)
      console.error(err)
    }
  }

  const totalSupplyAtVault = async (): Promise<void> => {
    try {
      const total: number = await vaultContract.totalSupply();
      console.log(total.toString())
    }
     catch (err: any) {
      alert(err.reason);
      console.error(err)
    }
  }


  function fetchInputVal(event: any): void {
    setTokensToApprove(+event.target.value);
  }

  function fetchInputValue(event: any): void {
    setInputValue(+event.target.value);
  }

  useEffect(() => {
    getTotalSupply();
    // checkApproval(2)
    checkIfApproved();
  }, [])

  useEffect(() => {
    totalSupplyAtVault();
  }, [totalSupplyAtVault, isDeposited])

  setTimeout(() => {
    checkIfApproved()
  })


  const renderButton = (): JSX.Element => {
    if(isWithdrawn) {
      return (
      <div>
      <p className='text-2xl sm:text-3xl py-4'>You own {totalSupply.toString()} Gold Tokens now</p>
      <p className='transition duration-300 ease-out hover:ease-in text-3xl rounded py-2 dark:text-white mb-3'>
      Astaghfirullah!!! You haram khor you wanted to commit Riba????<br /> Your tokens have been halved now for sinning.
      </p>
      </div>
      )
    }
    else if(loading) {
      return <button className='px-4 py-2 my-1 border-2 transition duration-300 motion-safe:animate-spin ease-out text-3xl rounded hover:text-white mb-3'>
        Loading...
      </button>
    }
    else if(isApproved) {
      return (
        <div>
          <p className='text-2xl sm:text-3xl py-4'>{tokensToApprove.toString()}/{totalSupply.toString()} Tokens have been approved</p>
          <div className='flex flex-col w-40'>
          <button className='px-4 py-2 my-1 border-2 transition duration-300 motion-safe:animate-bounce ease-out hover:ease-in hover:bg-gradient-to-r from-[#5463FF] to-[#89CFFD] text-3xl rounded hover:text-white mb-3'
          onClick={() => depositTokens(inputValue)}
          >Deposit</button>
          <input
          onChange={fetchInputValue} 
          className=' text-black text-2xl text-center border-2 dark:text-white font-bold dark:bg-gradient-to-r dark:bg-clip-text dark:text-transparent 
          dark:from-red-400 dark:via-purple-500 dark:to-white
          dark:animate-text sm:w-40'
          placeholder='Enter Amount'
          type="number"
          />
          </div>
        </div>
      )
    }
    else if(isDeposited) {
      return (
        <div>
          <p className='text-2xl sm:text-3xl py-4'>{depositedTokensAmount.toString()}/{tokensToApprove.toString()} Tokens have been deposited</p>
          <button className='px-4 py-2 my-1 border-2 transition duration-300 motion-safe:animate-bounce ease-out hover:ease-in hover:bg-gradient-to-r from-[#5463FF] to-[#89CFFD] text-3xl rounded hover:text-white mb-3'>Withdraw</button>
        </div>
        )
    }
    else {
      return (
      <div className='flex flex-col'>
      <p className='text-2xl sm:text-3xl py-4'>You own {totalSupply.toString()}/{totalSupply.toString()} Gold Tokens</p>
      <button className='px-4 py-2 my-1 border-2 transition duration-300 motion-safe:animate-bounce ease-out hover:ease-in hover:bg-gradient-to-r from-[#5463FF] to-[#89CFFD] text-3xl rounded hover:text-white mb-3 sm:w-40'
      onClick={() => approveTokensToVault(VAULT_CONTRACT_ADDRESS, tokensToApprove)}
      >Approve</button>
      <input
      onChange={fetchInputVal} 
      className=' text-black text-2xl text-center border-2 dark:text-white font-bold dark:bg-gradient-to-r dark:bg-clip-text dark:text-transparent 
      dark:from-red-400 dark:via-purple-500 dark:to-white
      dark:animate-text sm:w-40'
      placeholder='Enter Amount'
      type="number"
      />
      </div>
      )
    }
  }
  return (
    <main className={`${darkMode && "dark"} bg-gradient-to-r from-[#6FB2D2] to-[#D8D2CB] min-h-screen`}> 
    <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode}/>
    <section className='dark:bg-gradient-to-r from-[#121212] to-[#002B5B] dark:text-white min-h-screen'>
      <div className='flex justify-center'>
        <h3 className='text-2xl pt-12 inline-block text-black border-b-4 border-[#7084a0] sm:text-5xl font-bold 
            dark:bg-gradient-to-r dark:bg-clip-text dark:text-transparent 
            dark:from-red-400 dark:via-purple-500 dark:to-green-400
            dark:animate-text
        
        '>Double Your Tokens with the Vault</h3>
      </div>
      <div className='sm:flex sm:items-center sm:justify-center py-16 px-20'>
      <div className=''>
          {renderButton()}
      </div>
      <div className='mt-5 sm:ml-28'>
      {darkMode ? <img src="https://img.icons8.com/external-flat-wichaiwi/184/000000/external-token-gamefi-flat-wichaiwi.png"/> : 
      <img src="https://img.icons8.com/external-glyph-wichaiwi/184/000000/external-token-gamefi-glyph-wichaiwi.png"/>
      }
      </div>
      </div>
    </section>
    </main>
  )
}

export default Home
