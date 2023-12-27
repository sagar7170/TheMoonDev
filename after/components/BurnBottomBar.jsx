import React from 'react'
import useWallet from '../hooks/useWallet';
import useAppSupplies from '../hooks/useAppSupplies';

const BurnPageStyled = styled.div``;

enum BurnTxProgress {
  default = "Burn App Tokens",
  burning = "Burning...",
}

function BurnBottomBar() {
  const [burnTxHash, setBurnTxHash] = useState<string | null>(null);
  const [txProgress, setTxProgress] = useState<boolean>(false);
  const [txButton, setTxButton] = useState<BurnTxProgress>(
    BurnTxProgress.default
  );

  const {
    fetchSupplies,
  } = useAppSupplies(true);

  const {
    isWalletConnected,
    walletChain,
    openConnectModal,
  } = useWallet();


  const refetchTransactions = () => {
    Promise.all(
      ChainScanner.fetchAllTxPromises(isChainTestnet(walletChain?.id))
    )
      .then((results: any) => {
        //console.log(res);
        let res = results.flat();
        res = ChainScanner.sortOnlyBurnTransactions(res);
        res = res.sort((a: any, b: any) => b.timeStamp - a.timeStamp);
        setBurnTransactions(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  const { showToast } = useAppToast();

    const [burnAmount, setBurnAmount] = useState("");
    const onChangeBurnAmount = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value == "") setBurnAmount("");
        if (isNaN(parseFloat(e.target.value))) return;
        setBurnAmount(e.target.value);
      };

      const executeBurn = async () => {
        if (!isWalletConnected) {
          openConnectModal();
        }
        if (burnAmount === "") {
          console.log("Enter amount to migrate");
          showToast("Enter amount to migrate", ToastSeverity.warning);
          return;
        }
        const newTokenAddress = fetchAddressForChain(walletChain?.id, "newToken");
        const oftTokenContract = new Contract(
          newTokenAddress,
          oftAbi,
          ethersSigner
        );

        let amount = parseEther(burnAmount);
        setTxButton(BurnTxProgress.burning);
        setTxProgress(true);
        try {
          const burnTx = await oftTokenContract.burn(
            //tokenAddress,
            amount
          );
          setBurnTxHash(burnTx.hash);
          console.log(burnTx, burnTx.hash);
          await burnTx.wait();
          setTxButton(BurnTxProgress.default);
          setTxProgress(false);
          refetchTransactions();
          fetchSupplies();
        } catch (err) {
          console.log(err);
          setTxButton(BurnTxProgress.default);
          setTxProgress(false);
          showToast("Burn Failed!", ToastSeverity.error);
          return;
        }
      };
         
  return (
    <BurnButtonBar>
    <p className="box_subheader">Burn your App</p>
    <div className="description medium">
      &quot; The process of reducing the supply of App tokens by
      permanently removing a certain number of them from circulation,
      often through a deliberate and recorded mechanism. &quot;
    </div>

    <div className="burn_bar">
      <div className="input_value_box">
        <p className="input_muted">Enter amount to Burn</p>
        <input
          className="input_value"
          type="text"
          value={burnAmount}
          placeholder="0.00"
          onChange={onChangeBurnAmount}
        />
      </div>
      <Button
        variant="outlined"
        onClick={executeBurn}
        startIcon={
          txProgress ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <AppIcon
              url="/icons/fire.svg"
              fill={IconFilter.primary}
              size={1.5}
              margin={0}
            />
          )
        }
      >
        <span>{txButton}</span>
      </Button>
    </div>
    {burnTxHash && (
      <div className="tx_links">
        <AppTooltip
          title={`Check burn Transaction on chain ${walletChain?.blockExplorers?.default?.name}`}
        >
          <AppExtLink
            url={`${walletChain?.blockExplorers?.default?.url}/tx/${burnTxHash}`}
            className="header_link"
          >
            Burn Tx: {prettyEthAddress(burnTxHash ?? zeroAddress)}
          </AppExtLink>
        </AppTooltip>
      </div>
    )}
  </BurnButtonBar>
  )
}

export default BurnBottomBar
