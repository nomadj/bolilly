"use client";

import { Box, Heading, Text } from "@chakra-ui/react";

export default function Bio() {
  return (
    <Box>
      <Heading size="lg" mb={3}>
        About BoLilly
      </Heading>
      <Text fontSize="md" mb={3}>
      BoLilly is a career musician and web3 developer living in San Francisco. Mr. Lilly builds useful things that do not exist, while carrying on the traditional style of guitar performance passed down from Francisco Tarrega, Emilio Pujol, Andres Segovia, and Oscar Ghiglia. Bo has performed extensively throughout the United States, and in recent years has enjoyed the sanctity of his studio and teaching remotely. BoLilly has held teaching positions at Northwestern University, Columbia College Chicago, and the San Francisco Unified School District.
      </Text>
      <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.300" }}>
        For booking inquiries: <strong>booking@bolilly.live</strong>
      </Text>
    </Box>
  );
}
