// import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// export default buildModule("CounterModule", (m) => {
//   const counter = m.contract("Counter");

//   m.call(counter, "incBy", [5n]);

//   return { counter };
// });

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("BoLillyModule", (m) => {
  const bolilly = m.contract("BoLilly");

  // m.call(bolilly, "incBy", [5n]);

  return { bolilly };
});
