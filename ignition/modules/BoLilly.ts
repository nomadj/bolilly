import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("BoLilly", (m) => {
  // const bolilly = m.contract("BoLilly", [
  //   "BoLilly",          // name_
  //   "BOLY",                    // symbol_
  //   "10000000000000000",      // initialTicketPriceWei (0.01 ETH)
  // ]);
  const bolilly = m.contract("BoLilly");

  return { bolilly };
});
