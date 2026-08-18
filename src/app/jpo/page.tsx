"use client";

import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import ReactPlayer from "react-player";

export default function JpoPage() {
  const videos = [
    {
      url: "https://violet-terrible-goose-933.mypinata.cloud/ipfs/QmVgBa7HTB4saDDGeXDG8NhW9jLZMTKu3aVoNbksWQAyN3",
      title: "JP at the FB",
      desc: "Better Man by Robbie Williams. Ferry Building SF, 08/15/2026",
    },
    {
      url: "https://violet-terrible-goose-933.mypinata.cloud/ipfs/QmNcUuXRbABRYfT54tFkxaZTCNHToevsbtV2NagsDhDSgV",
      title: "JP at the FB",
      desc: "Snow by Red Hot Chili Peppers. Ferry Building SF, 08/15/2026",
    },
    {
      url: "https://violet-terrible-goose-933.mypinata.cloud/ipfs/QmZLoRtxiNet78h8mNnQJAaMaufATHXJpD785T73HAV93W",
      title: "JP at the FB",
      desc: "By the Way by Red Hot Chili Peppers. Ferry Building SF, 08/15/2026",
    },
    {
      url: "https://violet-terrible-goose-933.mypinata.cloud/ipfs/Qmak8ZDaUXPyX2kCLP4R3AuQRtsgDgBvW4SrG2o8KxtBEf",
      title: "JP at the FB",
      desc: "Under the Bridge by Red Hot Chili Peppers. Ferry Building SF, 08/15/2026",
    },
    {
      url: "https://violet-terrible-goose-933.mypinata.cloud/ipfs/QmeyDoxfDeg465fM83x2qhvRznHdP7vHyGYjdtotgzbVJC",
      title: "JP at the FB",
      desc: "Soul to Squeeze by Red Hot Chili Peppers. Ferry Building SF, 08/15/2026",
    },    
  ];

  return (
    <Box p={8}>
      <Heading ml={20} mb={6}>JP</Heading>
      <SimpleGrid
	columns={{ base: 1, sm: 1, md: 3 }}
	gap={6}
	justifyItems="center"
      >
	{videos.map((vid) => (
	  <Box
	    key={vid.url}
	    width="100%"
	    maxW="400px"
	    p={4}
	    borderRadius="xl"
	    boxShadow="md"
	    transition="all 0.25s ease"
	    _hover={{
	      transform: "translateY(-6px)",
	      boxShadow: "lg",
	    }}
	  >
	    {/*Responsive wrapper*/}
	    <Box position="relative" width="100%" paddingTop="56.25%" mb={3} borderRadius="lg" overflow="hidden">
	      <ReactPlayer
		src={vid.url}
		controls
		width="100%"
		height="100%"
	        style={{ position: "absolute", top: 0, left: 0 }}
	      />
	    </Box>

	    <Text fontSize="xl" fontWeight="bold" mb={1}>
	      {vid.title}
	    </Text>

	    <Text color="gray.500" fontSize="sm">
	      {vid.desc}
	    </Text>
	  </Box>
	))}
      </SimpleGrid>
    </Box>
  );

}
