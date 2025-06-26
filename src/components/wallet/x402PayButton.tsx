type X402PayButtonProps = {
  bountyId: string;
  fee: number;
};

export const X402PayButton = ({ bountyId, fee }: X402PayButtonProps) => {
  const handlePay = async () => {
    const response = await fetch("/api/x402", {
      method: "POST",
      body: JSON.stringify({
        amount: fee,
        currency: "USDC",
        metadata: { bountyId },
      }),
    });
    const { paymentUrl } = await response.json();
    window.location.href = paymentUrl; 
  };

  return <button onClick={handlePay}>Pay Entry Fee</button>;
};
