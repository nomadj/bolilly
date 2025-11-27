// src/components/Navbar.tsx
"use client";
import { FC } from "react";
import { Link, Flex, Heading, VStack, Text } from "@chakra-ui/react";
import DonateButton from "@/components/DonateButton";
import NavDropdown from "@/components/NavDropdown";

interface NavbarProps {
  onConnectWallet?: () => void;
}

const Navbar: FC<NavbarProps> = ({ onConnectWallet }) => {
  return (
    <Flex
      as="header"
      px={6}
      py={4}
      align="center"
      justify="space-between"
      bg="rgba(255, 255, 255, 0.2)"        
      backgroundImage="url('/surfing.png')"
      backgroundSize="cover"
      backgroundPosition="bottom center"
      backgroundRepeat="no-repeat"
      bgBlendMode="overlay"                 
      boxShadow="sm"
      >
      <VStack align="start" gap={0} pr={4}>
        <Link href="/">
          <Heading size="5xl" color="black">
            BoLilly Live
          </Heading>
        </Link>
        <Text fontSize="3xl" color="black" pl={2}>
          ❤️
        </Text>
      </VStack>
      <Flex flex={1} justify="center" gap={1}>
        <NavDropdown />
      </Flex>
      <DonateButton />
    </Flex>
  );
};

export default Navbar;
