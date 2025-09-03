"use client";

import { ReactNode } from "react";
import { ChakraProvider, createSystem, defaultConfig, Box } from "@chakra-ui/react";
import Navbar from "@/components/Navbar";

const systemContext = createSystem(defaultConfig);

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <title>BoLillyLive</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>❤️</text></svg>"
        />
      </head>
      <body>
        <ChakraProvider value={systemContext}>
          <Navbar />
          <Box as="main" p={6}>
            {children}
          </Box>
        </ChakraProvider>
      </body>
    </html>
  );
}
